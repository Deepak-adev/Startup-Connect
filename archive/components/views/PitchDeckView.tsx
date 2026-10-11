import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Badge } from '../ui';
import {
  Play, Video, Image as ImageIcon, Sparkles, Loader2, Download, Globe, ExternalLink,
  FileText, Check, AlertCircle, Layout, Share2, Eye, Edit3
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { WebsiteStorageService } from '../../services/websiteStorage';
import { parseSlideScript, cleanScript, ParsedSlide } from '../../services/slideParser';
import { generateSlideImage, generateSlideImages, SlideImageResponse } from '../../services/imageGeneration';
import { generatePitchDeckMedia, VideoGenerationResponse } from '../../services/veoGeneration';
import { generatePitchDeckScript } from '../../services/geminiService';

export default function PitchDeckView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get('action');
  const query = searchParams.get('q');

  // State
  const [profile, setProfile] = useState<any>(null);
  const [deckScript, setDeckScript] = useState<string>('');
  const [parsedSlides, setParsedSlides] = useState<ParsedSlide[]>([]);
  const [slideImages, setSlideImages] = useState<Map<number, string>>(new Map());
  const [currentSlide, setCurrentSlide] = useState(1);

  // Loading States
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingVeo, setIsGeneratingVeo] = useState(false);
  const [veoMedia, setVeoMedia] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [notification, setNotification] = useState<string | null>(null);

  // Notification timer
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initial Load
  useEffect(() => {
    const saved = localStorage.getItem('startupProfile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  // Effect to handle auto-trigger
  useEffect(() => {
    if (query && action === 'generate_deck' && !deckScript && profile) {
      handleGenerateDeck();
    }
  }, [action, query, profile]);

  const handleGenerateDeck = async () => {
    if (isGeneratingDeck) return;
    setIsGeneratingDeck(true);
    setNotification("Generating pitch deck script...");
    try {
      // Use real Gemini 2.0 Flash generation
      // Fallback profile if loading failed or empty
      const currentProfile = profile || {
        name: 'New Startup',
        industry: 'Technology',
        description: 'A revolutionary tech startup.',
        problem: 'Inefficiency in the market.',
        solution: 'AI-driven automation.',
        targetAudience: 'Enterprises',
        metrics: { tam: '10B', sam: '1B' }
      };

      const script = await generatePitchDeckScript(currentProfile);
      setDeckScript(script);

      const slides = parseSlideScript(script);
      setParsedSlides(slides);

      setNotification("Script generated! Creating visuals...");
      handleGenerateSlideImages(slides); // Auto trigger images
    } catch (error) {
      console.error("Deck generation failed", error);
      setNotification("Failed to generate deck script.");
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const handleGenerateSlideImages = async (slides: ParsedSlide[]) => {
    setIsGeneratingImages(true);
    try {
      // Prepare requests for batch generation
      const requests = slides.map(s => ({
        slideNumber: s.slideNumber,
        slideTitle: s.title,
        slideContent: s.content, // content is string
        speakerNotes: s.speakerNotes,
        companyName: profile?.name
      }));

      // Use real Gemini 3 Pro Vision generation
      const generatedImages = await generateSlideImages(requests);

      const newImages = new Map(slideImages);
      generatedImages.forEach(img => {
        if (img.status === 'success') {
          newImages.set(img.slideNumber, img.imageUrl);
        }
      });

      setSlideImages(newImages);
      setNotification("Deck generation complete!");
    } catch (error) {
      console.error("Image generation failed", error);
      setNotification("Some images failed to generate.");
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 relative bg-slate-50/50 min-h-screen px-2 h-screen flex flex-col">

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
          <Sparkles size={16} className="text-indigo-400" />
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Pitch Deck Studio
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            AI-powered storytelling for {profile?.name || 'Your Startup'}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Script Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Presentation Mode
            </button>
          </div>
          <Button
            onClick={handleGenerateDeck}
            disabled={isGeneratingDeck}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl shadow-lg shadow-indigo-500/20 gap-2 font-semibold"
          >
            {isGeneratingDeck ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            Generate Deck
          </Button>
          <Button variant="outline" className="h-11 w-11 p-0 rounded-xl bg-white border-slate-200 text-slate-700 hover:text-indigo-600">
            <Share2 size={20} />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
          {/* Slide Preview / Canvas */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slide {currentSlide} of {parsedSlides.length || 5}</span>
                {isGeneratingImages && <span className="text-xs text-indigo-600 flex items-center gap-1 animate-pulse"><Loader2 size={12} className="animate-spin" /> Rendering Assets</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))} disabled={currentSlide === 1}><Layout size={16} /></Button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 flex items-center justify-center p-8 relative overflow-hidden group">
              {/* Checkerboard pattern background */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]"></div>

              <div className="aspect-video w-full max-h-full bg-white shadow-2xl rounded-xl overflow-hidden relative transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                {slideImages.get(currentSlide) ? (
                  <img src={slideImages.get(currentSlide)} alt="Slide" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    {isGeneratingImages ? <Loader2 size={48} className="animate-spin mb-4 text-indigo-200" /> : <ImageIcon size={64} className="mb-4 opacity-50" />}
                    <p className="font-medium text-slate-400">{isGeneratingImages ? 'Generating AI Visuals...' : 'Preview Unavailable'}</p>
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button className="bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-md h-10 w-10 p-0 rounded-full"><Edit3 size={16} /></Button>
                  <Button className="bg-indigo-600/90 hover:bg-indigo-600 text-white border-0 backdrop-blur-md h-10 w-10 p-0 rounded-full shadow-lg"><Download size={16} /></Button>
                </div>
              </div>
            </div>

            {/* Thumbnails Strip */}
            <div className="h-28 bg-white border-t border-slate-100 p-4 flex gap-4 overflow-x-auto">
              {(parsedSlides.length > 0 ? parsedSlides : [1, 2, 3, 4, 5]).map((s, i) => {
                const num = typeof s === 'number' ? s : s.slideNumber;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(num)}
                    className={`aspect-video h-full rounded-lg border-2 transition-all overflow-hidden relative flex-shrink-0 ${currentSlide === num ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    {slideImages.get(num) ? (
                      <img src={slideImages.get(num)} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300 text-xs font-bold">
                        {num}
                      </div>
                    )}
                  </button>
                )
              })}
              <button className="aspect-video h-full rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 gap-1">
                <PlusIcon size={20} />
                <span className="text-[10px] font-bold uppercase">Add Slide</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0 overflow-y-auto pb-4">

          {/* Script Editor Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col min-h-[400px]">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-slate-400" />
              Script & Content
            </h3>
            <textarea
              value={deckScript}
              onChange={(e) => setDeckScript(e.target.value)}
              placeholder="Generative AI will write your pitch here..."
              className="flex-1 w-full p-4 bg-slate-50 border-0 rounded-xl text-sm font-mono text-slate-600 leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
            <div className="mt-4 flex justify-between items-center text-xs text-slate-400 font-medium">
              <span>{deckScript.split(' ').length} words</span>
              <span className="flex items-center gap-1 text-emerald-600"><Check size={12} /> Saved</span>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Video size={20} className="text-indigo-600" />
              Veo AI Video
            </h3>

            <div className="bg-slate-900 rounded-xl aspect-video relative overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white pl-4 shadow-xl border-0">
                  <Play fill="currentColor" size={24} />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm font-bold">Pitch Rehearsal 1</p>
                <p className="text-slate-300 text-xs">02:14 • AI Narration</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 rounded-xl font-semibold">
              <Sparkles size={16} className="mr-2" /> Generate New Video
            </Button>
          </div>

        </div>
      </div>

    </div>
  );
}

// Icon helper
const PlusIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)