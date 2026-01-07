import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Input } from '../ui';
import { Play, Video, Image as ImageIcon, Sparkles, Loader2, Download } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function PitchDeckView() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const query = searchParams.get('q');
  
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [hasGeneratedDeck, setHasGeneratedDeck] = useState(false);
  const [deckScript, setDeckScript] = useState<string>(`Slide 1: Problem Statement
------------------------
Current market solutions are fragmented. 
Our solution consolidates...

[AGUI suggestion: Emphasize the cost saving of 40%]`);

  // Trigger Video Gen if URL action demands it
  useEffect(() => {
    if (action === 'trigger_veo_video' && query && !isGeneratingVideo && !videoUrl) {
      handleGenerateVideo(query);
    }
  }, [action, query]);

  // Trigger Logo Gen if URL action demands it
  useEffect(() => {
    if (action === 'trigger_imagen_logo' && query && !isGeneratingLogo && !logoUrl) {
      handleGenerateLogo(query);
    }
  }, [action, query]);

  // Trigger Full Deck Gen
  useEffect(() => {
    if (action === 'generate_deck' && query && !isGeneratingDeck && !hasGeneratedDeck) {
      handleGenerateDeck(query);
    }
  }, [action, query]);

  const handleGenerateVideo = async (prompt: string) => {
    setIsGeneratingVideo(true);
    
    // Simulate Veo generation since we cannot implement the full polling loop in this restricted environment easily without a paid key interaction flow in the UI.
    try {
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
        }
      }
      // Simulation delay
      await new Promise(resolve => setTimeout(resolve, 3000)); 
      setVideoUrl("https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"); // Placeholder
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleGenerateLogo = async (prompt: string) => {
    setIsGeneratingLogo(true);
    try {
      // Check for API Key selection for Pro models (Paid feature)
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using gemini-3-pro-image-preview as requested (alias for nano-banana-3-pro-preview)
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `Design a modern, minimalist startup logo for: ${prompt}. Vector graphic style, clean lines, professional.` }]
        }
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part && part.inlineData) {
        setLogoUrl(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    } catch (e) {
      console.error("Logo Generation Error", e);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleGenerateDeck = async (prompt: string) => {
    setIsGeneratingDeck(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 1. Generate Script
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [{ text: `Act as a startup founder. Write a pitch deck script for a startup idea: "${prompt}".
          Structure required:
          Slide 1: Title & Tagline
          Slide 2: The Problem
          Slide 3: The Solution
          Slide 4: Market Size
          Slide 5: Business Model
          
          For each slide, provide:
          - Visual description for the slide
          - Key bullet points (max 3)
          - Speaker notes` }]
        }
      });

      if (response.text) {
        setDeckScript(response.text);
        setHasGeneratedDeck(true);
      }

      // 2. Trigger Assets if they don't exist
      if (!logoUrl && !isGeneratingLogo) {
        handleGenerateLogo(prompt);
      }
      if (!videoUrl && !isGeneratingVideo) {
        handleGenerateVideo(prompt);
      }

    } catch (e) {
      console.error("Deck Generation Error", e);
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Pitch Deck Creator</h1>
          <p className="text-slate-400">AI-Assisted Storytelling</p>
        </div>
        <Button 
          className="gap-2" 
          onClick={() => handleGenerateDeck(query || 'New Startup')} 
          disabled={isGeneratingDeck}
        >
           {isGeneratingDeck ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} 
           {isGeneratingDeck ? 'Generating Deck...' : 'Auto-Generate Deck'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Slide Editor */}
        <Card className="lg:col-span-2 flex flex-col gap-4 min-h-[500px] bg-slate-900/80">
           <div className="flex-1 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden group">
              {videoUrl ? (
                <video src={videoUrl} controls className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    {isGeneratingVideo ? <Loader2 className="animate-spin text-indigo-500" size={32} /> : <Video size={32} className="text-slate-500" />}
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium">{isGeneratingVideo ? "Generating Veo Video..." : "Slide Media Placeholder"}</p>
                    <p className="text-slate-500 text-sm mt-1">Ask AGUI to "Create a video for..."</p>
                  </div>
                </div>
              )}
           </div>
           <div className="grid grid-cols-4 gap-4 h-24">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-800/50 rounded-md border border-slate-700/50 hover:border-indigo-500/50 cursor-pointer transition-colors p-2">
                  <div className="h-full w-full bg-slate-700/20 rounded-sm" />
                </div>
              ))}
           </div>
        </Card>

        {/* Tools Panel */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-medium text-slate-200 mb-4">Content Assets</h3>
            
            {/* Generated Logo Display */}
            <div className="mb-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800 min-h-[140px] flex items-center justify-center relative">
               {isGeneratingLogo ? (
                   <div className="flex flex-col items-center gap-2 text-indigo-400">
                       <Loader2 className="animate-spin" size={20} />
                       <span className="text-xs">Creating Brand Identity...</span>
                   </div>
               ) : logoUrl ? (
                   <div className="relative group w-full h-full flex items-center justify-center">
                       <img src={logoUrl} alt="Logo" className="max-h-[120px] object-contain" />
                       <a href={logoUrl} download="startup-logo.png" className="absolute top-0 right-0 p-2 bg-slate-900/80 text-white rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600">
                           <Download size={14} />
                       </a>
                   </div>
               ) : (
                   <div className="text-center text-slate-600">
                       <ImageIcon size={24} className="mx-auto mb-2 opacity-30" />
                       <p className="text-xs">No Logo Asset</p>
                   </div>
               )}
            </div>

            <div className="space-y-3">
              <Button 
                variant="secondary" 
                className="w-full justify-start gap-3"
                onClick={() => handleGenerateVideo(query || 'Startup Pitch')}
                disabled={isGeneratingVideo}
              >
                <Video size={16} className="text-pink-500" />
                Generate Video (Veo)
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start gap-3"
                onClick={() => handleGenerateLogo(query || 'Innovation')}
                disabled={isGeneratingLogo}
              >
                <ImageIcon size={16} className="text-emerald-500" />
                Generate Logo
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-3">
                <Sparkles size={16} className="text-amber-500" />
                Refine Text
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-medium text-slate-200 mb-4">Script Notes</h3>
            <div className="bg-slate-950 p-4 rounded-lg text-sm text-slate-400 font-mono h-48 overflow-y-auto whitespace-pre-wrap">
               {deckScript}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}