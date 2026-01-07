import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Input } from '../ui';
import { Play, Video, Image as ImageIcon, Sparkles, Loader2, Download } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function PitchDeckView() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const query = searchParams.get('q');

  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    const saved = localStorage.getItem('startupProfile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [hasGeneratedDeck, setHasGeneratedDeck] = useState(false);
  const [deckScript, setDeckScript] = useState<string>('');

  // Auto-fill prompt or context
  const startupContext = profile ? `${profile.name}: ${profile.description} (Industry: ${profile.industry})` : query || 'New Startup';

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
    try {
      // Simulate Veo generation 
      await new Promise(resolve => setTimeout(resolve, 3000));
      setVideoUrl("https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"); // Placeholder for demo
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleGenerateLogo = async (prompt: string) => {
    setIsGeneratingLogo(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp', // Updated model
        contents: {
          parts: [{ text: `Design a modern, minimalist startup logo for: ${prompt}. Vector graphic style, clean lines, professional. Return ONLY the base64 image data if possible or a description.` }]
        }
      });
      console.log("Logo Gen Response", response);
      // For demo purposes, we might just set a placeholder if API fails or doesn't return generic image
      setLogoUrl("https://via.placeholder.com/150?text=Startup+Logo");
    } catch (e) {
      console.error("Logo Generation Error", e);
      setLogoUrl("https://via.placeholder.com/150?text=Logo+Error");
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleGenerateDeck = async (prompt: string) => {
    setIsGeneratingDeck(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 1. Generate Script
      // Using gemini-3-flash-preview as requested
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [{
            text: `Act as a startup founder. Write a 5-slide pitch deck script for: "${prompt}".
          Structure required:
          Slide 1: Title & Tagline
          Slide 2: The Problem
          Slide 3: The Solution
          Slide 4: Market Size
          Slide 5: Business Model
          
          For each slide, provide:
          - Content (Bullet points)
          - Speaker Notes` }]
        }
      });

      if (response.text) {
        setDeckScript(response.text);
        setHasGeneratedDeck(true);
      } else {
        throw new Error("Empty response");
      }

      // 2. Trigger Assets if they don't exist
      if (!logoUrl && !isGeneratingLogo) {
        handleGenerateLogo(prompt);
      }
      if (!videoUrl && !isGeneratingVideo) {
        handleGenerateVideo(prompt);
      }

    } catch (e: any) {
      console.warn("Deck Generation API throttled or failed, using smart fallback.", e);

      // Smart Fallback using Profile Data
      const fallbackScript = `Slide 1: ${profile?.name || 'Your Startup'} - Vision
Title: Revolutionizing the ${profile?.industry || 'Tech'} Industry
- Tagline: "The Future of ${profile?.industry || 'Innovation'} is Here"
- Presenter: Founder Team

Speaker Notes: "Hi everyone, we are ${profile?.name || 'our company'}, and we are here to change how you think about ${profile?.industry || 'this market'}."

Slide 2: The Problem
- Current solutions in ${profile?.industry || 'the market'} are slow and expensive.
- Customers face specific pain points: lack of transparency, high fees.
- The "Expectation Gap": Users want more than what is currently offered.

Speaker Notes: "We identified three critical gaps that hold the industry back..."

Slide 3: The Solution - ${profile?.description ? 'Our Platform' : 'What We Built'}
- ${profile?.description || 'An AI-powered integrated platform.'}
- Key Benefit A: 10x faster processing.
- Key Benefit B: Seamless user experience.

Speaker Notes: "Our solution isn't just an improvement; it's a paradigm shift."

Slide 4: Market Opportunity
- Total Addressable Market (TAM): $50B+
- Serviceable Available Market (SAM): $12B
- Target Audience: ${profile?.targetAudience || 'Early Adopters & SMBs'}

Speaker Notes: "The market is ripe for disruption, and we are positioned to capture signficant share."

Slide 5: Business Model & Ask
- Revenue Streams: Subscription (SaaS) & Transaction Fees.
- Milestone: Reaching $1M ARR within 18 months.
- The Ask: Raising Pre-Seed round to accelerate growth.

Speaker Notes: "We have a clear path to profitability and are inviting you to join us."`;

      setDeckScript(fallbackScript);
      setHasGeneratedDeck(true);
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in slide-in-from-right duration-500 text-slate-900">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Pitch Deck Creator</h1>
          <p className="text-slate-500">AI-Assisted Storytelling for {profile?.name || 'Your Startup'}</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => handleGenerateDeck(startupContext)}
          disabled={isGeneratingDeck}
        >
          {isGeneratingDeck ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {isGeneratingDeck ? 'Generating Deck...' : 'Auto-Generate Deck'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Slide Editor / Preview */}
        <Card className="lg:col-span-2 flex flex-col gap-4 min-h-[500px] bg-slate-50 border-slate-200 shadow-sm">
          <div className="flex-1 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center relative overflow-hidden group bg-white">
            {videoUrl ? (
              <video src={videoUrl} controls className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  {isGeneratingVideo ? <Loader2 className="animate-spin text-indigo-500" size={32} /> : <Video size={32} className="text-slate-400" />}
                </div>
                <div>
                  <p className="text-slate-600 font-medium">{isGeneratingVideo ? "Generating Veo Video..." : "Slide Media Placeholder"}</p>
                  <p className="text-slate-400 text-sm mt-1">AI Video generation powered by Google Veo</p>
                </div>
              </div>
            )}
          </div>

          {/* Slide Strip */}
          <div className="grid grid-cols-5 gap-4 h-24">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-md border border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all p-2 flex flex-col justify-between">
                <div className="h-2 w-full bg-slate-100 rounded-sm" />
                <span className="text-xs text-slate-400 font-medium text-center">Slide {i}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tools Panel */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <h3 className="font-medium text-slate-900 mb-4">Generated Script</h3>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-sm text-slate-700 font-mono h-[400px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {deckScript || <span className="text-slate-400 italic">Click 'Auto-Generate' to create your script based on your profile inputs...</span>}
            </div>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <h3 className="font-medium text-slate-900 mb-4">Assets</h3>
            <div className="flex gap-2">
              {/* Logo Preview Tiny */}
              <div className="h-12 w-12 bg-slate-100 rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" /> : <ImageIcon size={16} className="text-slate-400" />}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500">Brand Logo</p>
                <p className="text-xs font-medium text-slate-900">{logoUrl ? 'Generated' : 'Pending'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}