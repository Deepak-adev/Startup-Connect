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

  // Load pitch deck PPT slides on Generate Deck
  const handleGenerateDeck = async () => {
    if (isGeneratingDeck) return;
    setIsGeneratingDeck(true);
    setNotification("Loading slides from Pitch Deck...");
    try {
      const res = await fetch('/decks/decks.json');
      const data = await res.json();
      
      // Use the presentation from the pitch deck folder
      const deck = data?.[0];
      if (deck && deck.slides) {
        const slides: ParsedSlide[] = deck.slides.map((s: any) => ({
          slideNumber: s.slideNumber,
          title: s.title,
          content: s.content,
          bullets: s.bullets || [],
          speakerNotes: s.bullets?.[0] || s.content || ''
        }));

        setParsedSlides(slides);
        setCurrentSlide(1);

        const imgMap = new Map<number, string>();
        deck.slides.forEach((s: any) => {
          if (s.imageUrl) imgMap.set(s.slideNumber, s.imageUrl);
        });
        setSlideImages(imgMap);

        const scriptText = slides.map(s => 
          `Slide ${s.slideNumber}: ${s.title}\n${s.content}`
        ).join('\n\n---\n\n');
        setDeckScript(scriptText);

        setNotification(`Generated! Loaded ${slides.length} slides.`);
      }
    } catch (error) {
      console.error("Deck load failed", error);
      setNotification("Failed to load slides.");
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const currentSlideObj = parsedSlides.find(s => s.slideNumber === currentSlide) || parsedSlides[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative bg-slate-50 min-h-screen px-4 md:px-8 py-6 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-4 border border-slate-700/60 text-sm">
          <Sparkles size={16} className="text-indigo-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Pitch Deck Studio
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            AI-powered presentation for {profile?.name || 'Your Startup'}.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-200/70 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Workspace
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Present
            </button>
          </div>

          <Button
            onClick={handleGenerateDeck}
            disabled={isGeneratingDeck}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-5 rounded-xl shadow-md shadow-indigo-500/20 gap-2 text-xs font-semibold cursor-pointer"
          >
            {isGeneratingDeck ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Generate Deck
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Canvas / Slide Viewer */}
        <div className={`${activeTab === 'preview' ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col gap-4 h-full min-h-0`}>
          <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/50 relative overflow-hidden flex flex-col min-h-[500px]">
            {/* Top Toolbar */}
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Slide {currentSlide} of {parsedSlides.length}
                </span>
                <span className="text-xs text-slate-400 font-medium truncate max-w-xs">
                  {currentSlideObj?.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                  disabled={currentSlide === 1}
                  className="h-8 px-3 rounded-lg text-xs"
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlide(Math.min(parsedSlides.length, currentSlide + 1))}
                  disabled={currentSlide === parsedSlides.length}
                  className="h-8 px-3 rounded-lg text-xs"
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Slide Presentation Area */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
              <div className="aspect-video w-full max-w-5xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative border border-slate-800 flex items-center justify-center">
                {slideImages.get(currentSlide) ? (
                  <img
                    src={slideImages.get(currentSlide)}
                    alt={`Slide ${currentSlide}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                    <ImageIcon size={48} className="mb-3 opacity-40" />
                    <p className="text-sm">Click "Generate Deck" to load slides</p>
                  </div>
                )}
              </div>
            </div>

            {/* Slide Filmstrip / Thumbnails */}
            <div className="h-28 bg-white border-t border-slate-100 p-3 flex gap-3 overflow-x-auto">
              {parsedSlides.map((s) => (
                <button
                  key={s.slideNumber}
                  onClick={() => setCurrentSlide(s.slideNumber)}
                  className={`aspect-video h-full rounded-lg border-2 transition-all overflow-hidden relative flex-shrink-0 cursor-pointer ${
                    currentSlide === s.slideNumber
                      ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                  }`}
                >
                  {slideImages.get(s.slideNumber) ? (
                    <img src={slideImages.get(s.slideNumber)} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-900 p-2 flex flex-col justify-between text-left">
                      <span className="text-[10px] text-indigo-400 font-bold">Slide {s.slideNumber}</span>
                      <p className="text-[9px] text-white font-medium line-clamp-2 leading-tight">
                        {s.title}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Presenter Notes & Pitch Video */}
        {activeTab === 'editor' && (
          <div className="lg:col-span-4 flex flex-col gap-5 h-full min-h-0">
            {/* Pitch Video Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Video size={17} className="text-indigo-600" />
                  Pitch Video
                </h3>
                <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
                  HD 1080p
                </span>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md border border-slate-800 relative group">
                <video
                  src="/videos/pitch_video.mp4"
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                  poster={slideImages.get(1) || undefined}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5">
                AI Generated Pitch Video from the Pitch Video folder.
              </p>
            </div>

            {/* Presenter Notes for Active Slide */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex-1 flex flex-col">
              <h3 className="font-bold text-slate-900 text-sm mb-2.5 flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />
                Presenter Notes (Slide {currentSlide})
              </h3>
              <div className="flex-1 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-sans overflow-y-auto">
                <p className="font-semibold text-slate-800 mb-1.5">{currentSlideObj?.title}</p>
                <p className="text-slate-600 leading-normal">{currentSlideObj?.speakerNotes || "Present key metrics and value proposition for this slide."}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Icon helper
const PlusIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)