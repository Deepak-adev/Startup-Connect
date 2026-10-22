import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Mic, Sparkles, Bot, User, MicOff, Volume2 } from 'lucide-react';
import { Button, Textarea, Skeleton, cn } from './ui';
import { sendMessageToAGUI } from '../services/geminiService';
import { liveService } from '../services/liveService';
import { ChatMessage, AGUIResponse } from '../types';

interface AGUIChatProps {
  fullScreenMode?: boolean;
  initialMessage?: string;
  systemInstruction?: string;
  onAnalysisComplete?: (data: any) => void;
  onMessagesChange?: (messages: ChatMessage[]) => void;
  onClose?: () => void;
  headerAction?: React.ReactNode;
}

export default function AGUIChat({ fullScreenMode = false, initialMessage, systemInstruction, onAnalysisComplete, onMessagesChange, onClose, headerAction }: AGUIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: initialMessage || "Hello! I'm AGUI. I can navigate the startup ecosystem for you. Try 'Show me clothing partners' or 'Analyze the market'." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  // New state for one‑shot voice input
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, liveTranscript, onMessagesChange]);

  const handleSend = async () => {
    const textToSend = input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response: AGUIResponse = await sendMessageToAGUI(messages, textToSend, systemInstruction);

      if (response.data && onAnalysisComplete) {
        onAnalysisComplete(response.data);
      }

      if (response.navigation && response.navigation.params) {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(response.navigation.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            newParams.set(key, String(value));
          }
        });
        setSearchParams(newParams);
      }
      setMessages(prev => [...prev, { role: 'model', text: response.message }]);
    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLive = async () => {
    if (isLive) {
      await liveService.disconnect();
      setIsLive(false);
      if (liveTranscript) {
        setMessages(prev => [...prev, { role: 'model', text: liveTranscript }]);
        setLiveTranscript('');
      }
    } else {
      try {
        await liveService.connect({
          onActiveChange: (active) => setIsLive(active),
          onTranscription: (text) => setLiveTranscript(text),
          onNavigate: (params) => {
            const newParams = new URLSearchParams(searchParams);
            Object.entries(params).forEach(([k, v]) => {
              if (v) newParams.set(k, String(v));
            });
            setSearchParams(newParams);
          },
          onError: (err) => {
            console.error("Live Error:", err);
            setIsLive(false);
          }
        }, "You are AGUI. Help the user navigate the startup dashboard. Use the 'navigate' tool when the user asks to see a specific view or filter data. Keep spoken responses concise.");
      } catch (err) {
        console.error("Failed to start voice session", err);
      }
    }
  };

  // One‑shot voice input using Web Speech API
  const handleMicClick = () => {
    if (isListening) {
      // Stop current recognition
      (window as any).recognition?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    (window as any).recognition = recognition; // store globally to stop later
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    let finalTranscript = '';
    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      setSpeechTranscript(finalTranscript + interim);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      const trimmed = finalTranscript.trim();
      if (trimmed) {
        setInput(trimmed);
        handleSend();
      }
      setSpeechTranscript('');
    };
    setIsListening(true);
    recognition.start();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300",
              isLive ? "bg-indigo-50 border-indigo-400 scale-110" : "bg-slate-50 border-slate-200"
            )}>
              {isLive ? <Volume2 className="w-5 h-5 text-indigo-600 animate-pulse" /> : <Sparkles className="w-5 h-5 text-indigo-600" />}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                isLive ? "animate-ping bg-red-400" : "animate-ping bg-sky-400"
              )}></span>
              <span className={cn(
                "relative inline-flex rounded-full h-3 w-3",
                isLive ? "bg-red-500" : "bg-sky-500"
              )}></span>
            </span>
          </div>
          <div>
            <h2 className="font-display font-bold text-lg leading-none text-slate-900">AGUI</h2>
            <p className="text-xs text-slate-500">{isLive ? "Voice Mode Active" : "AI Graphical Interface"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {headerAction}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
              msg.role === 'user' ? "bg-slate-700 text-white" : "bg-indigo-600 text-white"
            )}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm",
              msg.role === 'user'
                ? "bg-slate-800 text-white rounded-tr-sm"
                : "bg-indigo-50 text-slate-800 rounded-tl-sm border border-indigo-100"
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLive && liveTranscript && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed bg-indigo-50 text-indigo-900 rounded-tl-sm border border-indigo-200 animate-pulse">
              {liveTranscript}
            </div>
          </div>
        )}

        {isLoading && !isLive && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="space-y-2 w-full max-w-[70%]">
              <Skeleton className="h-4 w-full bg-slate-200" />
              <Skeleton className="h-4 w-[80%] bg-slate-200" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="relative">
          <Textarea
            value={isListening ? speechTranscript : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLive || isListening}
            placeholder={isLive ? "Listening to your voice..." : isListening ? "Capturing speech..." : "Tell AGUI what you need..."}
            className={cn(
              "pr-24 min-h-[80px] max-h-[160px] text-lg p-4 transition-all duration-300 shadow-sm",
              isLive || isListening ? "bg-indigo-50 border-indigo-200 text-indigo-900" : "bg-white border-slate-300 focus:bg-white text-slate-900"
            )}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMicClick}
              disabled={isLive}
              className={cn(
                "h-8 w-8 p-0 rounded-full transition-all",
                isListening ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:text-indigo-600"
              )}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || isLive}
              size="sm"
              className={cn("h-8 w-8 p-0 rounded-full transition-all shadow-sm", input.trim() && !isLive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400")}
            >
              <Send size={14} />
            </Button>
          </div>
        </div>

        {isLive && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex gap-1 h-3 items-end">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="w-1 bg-indigo-500 rounded-full animate-bounce"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    animationDuration: `${0.5 + Math.random()}s`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">Live Interaction</span>
          </div>
        )}
      </div>
    </div>
  );
}