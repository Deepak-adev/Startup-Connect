import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';

export interface LiveCallbacks {
  onTranscription: (text: string, isModel: boolean) => void;
  onNavigate: (params: any) => void;
  onActiveChange: (active: boolean) => void;
  onError: (error: string) => void;
}

const NAVIGATE_TOOL: FunctionDeclaration = {
  name: 'navigate',
  description: 'Navigate to different views or filter data in the startup dashboard.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      view: { 
        type: Type.STRING, 
        description: 'dashboard, partners, pitch_deck, market_analysis, startup_sale' 
      },
      industry: { type: Type.STRING, description: 'Filter by industry (e.g., textile, agriculture)' },
      q: { type: Type.STRING, description: 'Search query' },
      action: { type: Type.STRING, description: 'Specific actions like trigger_veo_video or trigger_imagen_logo' }
    }
  }
};

export class LiveService {
  private ai: GoogleGenAI | null = null;
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private stream: MediaStream | null = null;
  private currentOutputTranscription = '';

  constructor() {}

  private decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }

  async connect(callbacks: LiveCallbacks, systemInstruction: string) {
    if (!process.env.API_KEY) {
      callbacks.onError("API Key is missing");
      return;
    }

    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      callbacks.onError("Microphone access denied");
      throw err;
    }

    this.sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          callbacks.onActiveChange(true);
          this.startStreaming();
        },
        onmessage: async (message: LiveServerMessage) => {
          // Handle Audio Output
          const audioPart = message.serverContent?.modelTurn?.parts?.find(p => p.inlineData);
          const base64Audio = audioPart?.inlineData?.data;
          
          if (base64Audio && this.outputAudioContext) {
            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
            const audioBuffer = await this.decodeAudioData(this.decode(base64Audio), this.outputAudioContext);
            const source = this.outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.outputAudioContext.destination);
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            this.sources.add(source);
            source.onended = () => this.sources.delete(source);
          }

          // Handle Interruption
          if (message.serverContent?.interrupted) {
            this.sources.forEach(s => { 
              try { s.stop(); } catch(e) {} 
            });
            this.sources.clear();
            this.nextStartTime = 0;
          }

          // Handle Transcriptions
          if (message.serverContent?.outputTranscription) {
            this.currentOutputTranscription += message.serverContent.outputTranscription.text;
            callbacks.onTranscription(this.currentOutputTranscription, true);
          }

          if (message.serverContent?.turnComplete) {
            this.currentOutputTranscription = '';
          }

          // Handle Tool Calls
          if (message.toolCall) {
            for (const fc of message.toolCall.functionCalls) {
              if (fc.name === 'navigate') {
                callbacks.onNavigate(fc.args);
                this.sessionPromise?.then(session => {
                  session.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { result: "ok" } }
                  });
                });
              }
            }
          }
        },
        onerror: (e) => callbacks.onError((e as any).message || "Unknown live error"),
        onclose: () => callbacks.onActiveChange(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction,
        tools: [{ functionDeclarations: [NAVIGATE_TOOL] }],
        outputAudioTranscription: {},
      }
    });
  }

  private startStreaming() {
    if (!this.inputAudioContext || !this.stream) return;
    const source = this.inputAudioContext.createMediaStreamSource(this.stream);
    const processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
      }
      
      const blob: Blob = {
        data: this.encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
      };

      this.sessionPromise?.then(session => {
        if (session) {
          session.sendRealtimeInput({ media: blob });
        }
      });
    };

    source.connect(processor);
    processor.connect(this.inputAudioContext.destination);
  }

  async disconnect() {
    if (this.sessionPromise) {
      const session = await this.sessionPromise;
      session?.close();
    }
    this.stream?.getTracks().forEach(t => t.stop());
    this.inputAudioContext?.close();
    this.outputAudioContext?.close();
    this.sessionPromise = null;
    this.ai = null;
  }
}

export const liveService = new LiveService();