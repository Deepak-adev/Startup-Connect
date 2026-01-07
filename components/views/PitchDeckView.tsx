import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Input } from '../ui';
import { Play, Video, Image as ImageIcon, Sparkles, Loader2, Download, Globe, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { WebsiteStorageService } from '../../services/websiteStorage';
import { parseSlideScript, cleanScript, ParsedSlide } from '../../services/slideParser';
import { generateSlideImage, SlideImageResponse } from '../../services/imageGeneration';
import { generatePitchDeckMedia, VideoGenerationResponse } from '../../services/veoGeneration';

export default function PitchDeckView() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const [parsedSlides, setParsedSlides] = useState<ParsedSlide[]>([]);
  const [slideImages, setSlideImages] = useState<Map<number, string>>(new Map());
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);

  const [isGeneratingWebsite, setIsGeneratingWebsite] = useState(false);
  const [generatedWebsiteId, setGeneratedWebsiteId] = useState<string | null>(null);

  const [veoMedia, setVeoMedia] = useState<{ video?: VideoGenerationResponse; audio?: VideoGenerationResponse } | null>(null);
  const [isGeneratingVeoMedia, setIsGeneratingVeoMedia] = useState(false);

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

  // Trigger Website Gen
  useEffect(() => {
    if (action === 'generate_website' && query && !isGeneratingWebsite && !generatedWebsiteId) {
      handleGenerateWebsite(query);
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

  // Generate Veo video and audio media
  const handleGenerateVeoMedia = async (script: string, companyName: string) => {
    setIsGeneratingVeoMedia(true);
    try {
      console.log('Starting Veo media generation...');
      const media = await generatePitchDeckMedia(script, companyName);
      setVeoMedia(media);

      // Also update the video URL for backward compatibility
      if (media.video?.videoUrl) {
        setVideoUrl(media.video.videoUrl);
      }
    } catch (error) {
      console.error('Error generating Veo media:', error);
    } finally {
      setIsGeneratingVeoMedia(false);
    }
  };

  // Generate video separately
  const handleGenerateVideoOnly = async () => {
    if (!deckScript) {
      alert('Please generate a deck first to create a video from the script.');
      return;
    }

    setIsGeneratingVeoMedia(true);
    try {
      console.log('Generating video separately with Veo 3.0...');
      const media = await generatePitchDeckMedia(deckScript, profile?.name || startupContext);
      setVeoMedia(media);

      if (media.video?.videoUrl) {
        setVideoUrl(media.video.videoUrl);
      }
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGeneratingVeoMedia(false);
    }
  };

  // Generate images for all slides
  const handleGenerateSlideImages = async (slides: ParsedSlide[]) => {
    setIsGeneratingImages(true);
    try {
      const newSlideImages = new Map<number, string>();

      for (const slide of slides) {
        console.log(`Generating image for slide ${slide.slideNumber}: ${slide.title}`);

        const imageResponse = await generateSlideImage({
          slideNumber: slide.slideNumber,
          slideTitle: slide.title,
          slideContent: slide.content,
          speakerNotes: slide.speakerNotes,
          logoUrl: logoUrl || undefined,
          companyName: profile?.name
        });

        if (imageResponse.status === 'success') {
          newSlideImages.set(slide.slideNumber, imageResponse.imageUrl);
          // Update state incrementally so user sees progress
          setSlideImages(new Map(newSlideImages));
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      console.log(`Generated ${newSlideImages.size} slide images`);
    } catch (error) {
      console.error('Error generating slide images:', error);
    } finally {
      setIsGeneratingImages(false);
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
        const scriptText = response.text;
        setDeckScript(scriptText);
        setHasGeneratedDeck(true);

        // Parse the script into slides
        const cleanedScript = cleanScript(scriptText);
        const slides = parseSlideScript(cleanedScript);
        setParsedSlides(slides);

        // Generate images for each slide
        handleGenerateSlideImages(slides);

        // Generate Veo video and audio
        handleGenerateVeoMedia(scriptText, prompt);
      } else {
        throw new Error("Empty response");
      }

      // 2. Trigger Assets if they don't exist
      if (!logoUrl && !isGeneratingLogo) {
        handleGenerateLogo(prompt);
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

      // Parse fallback script and generate images
      const cleanedScript = cleanScript(fallbackScript);
      const slides = parseSlideScript(cleanedScript);
      setParsedSlides(slides);
      handleGenerateSlideImages(slides);
      handleGenerateVeoMedia(fallbackScript, prompt);
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const handleGenerateWebsite = async (prompt: string) => {
    setIsGeneratingWebsite(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Generate website content
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [{
            text: `You are a professional web developer. Create a complete, modern, responsive single-page website for: "${prompt}"

Requirements:
1. Generate THREE separate sections:
   - HTML: Semantic HTML5 structure with proper tags
   - CSS: Modern, responsive design with flexbox/grid, mobile-first approach
   - JavaScript: Interactive elements, smooth animations, form validation if applicable

2. Design style:
   - Modern, clean UI with professional color scheme
   - Responsive design (mobile, tablet, desktop)
   - Smooth animations and transitions
   - Professional typography
   - Call-to-action buttons

3. Structure:
   - Hero section with compelling headline
   - Features/Services section (3-4 items)
   - About/Value proposition
   - Contact/CTA section
   - Navigation menu

4. Format your response EXACTLY like this:
===HTML===
[HTML code here]
===CSS===
[CSS code here]
===JS===
[JavaScript code here]
===END===

Make it production-ready and visually appealing!`
          }]
        }
      });

      if (!response.text) {
        throw new Error('No response from Gemini');
      }

      // Parse the structured response
      const text = response.text;
      const htmlMatch = text.match(/===HTML===\s*([\s\S]*?)\s*===CSS===/);
      const cssMatch = text.match(/===CSS===\s*([\s\S]*?)\s*===JS===/);
      const jsMatch = text.match(/===JS===\s*([\s\S]*?)\s*===END===/);

      if (!htmlMatch || !cssMatch || !jsMatch) {
        throw new Error('Failed to parse generated website structure');
      }

      const htmlContent = htmlMatch[1].trim();
      const cssContent = cssMatch[1].trim();
      const jsContent = jsMatch[1].trim();

      // Generate unique ID
      const websiteId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save to storage
      const website = {
        id: websiteId,
        title: prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt,
        prompt: prompt,
        htmlContent,
        cssContent,
        jsContent,
        createdAt: new Date().toISOString(),
        previewUrl: `#/?view=website_preview&websiteId=${websiteId}`
      };

      WebsiteStorageService.saveWebsite(website);
      setGeneratedWebsiteId(websiteId);

    } catch (error) {
      console.error('Website generation error:', error);
      alert('Failed to generate website. Please try again.');
    } finally {
      setIsGeneratingWebsite(false);
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
        {/* Left Column: Video & Slides Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Section */}
          <Card className="bg-slate-50 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">
                <Video size={18} className="text-purple-600" />
                Veo 3.0 Video Presentation
              </h3>
              <div className="flex items-center gap-2">
                {veoMedia?.video?.status === 'success' && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Generated
                  </span>
                )}
                {veoMedia?.video?.status === 'error' && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center gap-1">
                    Error
                  </span>
                )}
                <Button
                  size="sm"
                  onClick={handleGenerateVideoOnly}
                  disabled={isGeneratingVeoMedia || !deckScript}
                  className="gap-2"
                >
                  {isGeneratingVeoMedia ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate Video
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="aspect-video border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center relative overflow-hidden group bg-white">
              {videoUrl || veoMedia?.video?.videoUrl ? (
                <video
                  src={videoUrl || veoMedia?.video?.videoUrl}
                  controls
                  className="w-full h-full object-cover rounded-lg"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%234F46E5'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='system-ui'%3EPitch Deck Video%3C/text%3E%3C/svg%3E"
                />
              ) : veoMedia?.video?.status === 'error' ? (
                <div className="text-center space-y-4 p-6">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                    <Video size={28} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Video Generation Failed</p>
                    <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
                      {veoMedia.video.error || 'An error occurred during video generation'}
                    </p>
                    <Button
                      size="sm"
                      onClick={handleGenerateVideoOnly}
                      className="mt-3 gap-2"
                    >
                      <Sparkles size={14} />
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : isGeneratingVeoMedia ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Loader2 className="animate-spin text-purple-600" size={28} />
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Generating Veo 3.0 Video...</p>
                    <p className="text-slate-400 text-sm mt-1">Creating professional pitch presentation</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Video size={28} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">No Video Generated Yet</p>
                    <p className="text-slate-400 text-sm mt-1">Click "Generate Video" to create an AI-powered presentation</p>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Player Section */}
            {veoMedia?.audio?.audioUrl && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Play size={18} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-purple-900 mb-1">Audio Narration</p>
                    <audio
                      src={veoMedia.audio.audioUrl}
                      controls
                      className="w-full h-8"
                      style={{ maxHeight: '32px' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Pitch Deck Slides Section */}
          <Card className="bg-slate-50 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-600" />
                Pitch Deck Slides
              </h3>
              {slideImages.size > 0 && (
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  {slideImages.size}/{parsedSlides.length} Slides
                </span>
              )}
            </div>

            {/* Current Slide Preview */}
            <div className="aspect-video border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center relative overflow-hidden group bg-white mb-4">
              {slideImages.get(currentSlide) ? (
                <div className="w-full h-full relative">
                  <img
                    src={slideImages.get(currentSlide)}
                    alt={`Slide ${currentSlide}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  {parsedSlides[currentSlide - 1] && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-semibold text-lg">{parsedSlides[currentSlide - 1].title}</h3>
                      <p className="text-white/80 text-xs mt-1">Slide {currentSlide} of {parsedSlides.length}</p>
                    </div>
                  )}
                </div>
              ) : isGeneratingImages ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Loader2 className="animate-spin text-indigo-600" size={28} />
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Generating Slide Images...</p>
                    <p className="text-slate-400 text-sm mt-1">Using gemini-3-pro-image-preview ({slideImages.size}/{parsedSlides.length} complete)</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <ImageIcon size={28} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">No Slides Generated Yet</p>
                    <p className="text-slate-400 text-sm mt-1">Generate a deck to create AI-powered slides</p>
                  </div>
                </div>
              )}
            </div>

            {/* Slide Thumbnails Strip */}
            <div className="grid grid-cols-5 gap-3">
              {(parsedSlides.length > 0 ? parsedSlides : [1, 2, 3, 4, 5]).map((slide, index) => {
                const slideNum = typeof slide === 'number' ? slide : slide.slideNumber;
                const isActive = slideNum === currentSlide;
                const hasImage = slideImages.has(slideNum);

                return (
                  <div
                    key={slideNum}
                    onClick={() => setCurrentSlide(slideNum)}
                    className={`aspect-video bg-white rounded-md border-2 ${
                      isActive
                        ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200 scale-105'
                        : 'border-slate-200'
                    } hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all p-1 flex flex-col justify-between overflow-hidden`}
                  >
                    {hasImage ? (
                      <img
                        src={slideImages.get(slideNum)}
                        alt={`Slide ${slideNum}`}
                        className="flex-1 w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        {isGeneratingImages ? (
                          <Loader2 className="animate-spin text-indigo-400" size={14} />
                        ) : (
                          <div className="h-1.5 w-full bg-slate-100 rounded-sm" />
                        )}
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium text-center mt-1 px-1 truncate">
                      {typeof slide === 'number' ? `Slide ${slideNum}` : slide.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

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
            <div className="space-y-3">
              {/* Logo Preview */}
              <div className="flex gap-2">
                <div className="h-12 w-12 bg-slate-100 rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                  {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" /> : <ImageIcon size={16} className="text-slate-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Brand Logo</p>
                  <p className="text-xs font-medium text-slate-900">{logoUrl ? 'Generated' : 'Pending'}</p>
                </div>
              </div>

              {/* Slide Images Status */}
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon size={14} className="text-indigo-600" />
                  <span className="text-xs font-medium text-indigo-900">Slide Images</span>
                </div>
                {isGeneratingImages ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin text-indigo-600" size={12} />
                    <span className="text-xs text-indigo-700">Generating {slideImages.size}/{parsedSlides.length}</span>
                  </div>
                ) : slideImages.size > 0 ? (
                  <p className="text-xs text-indigo-700">{slideImages.size} slides generated with gemini-3-pro-image-preview</p>
                ) : (
                  <p className="text-xs text-indigo-600">Ready to generate</p>
                )}
              </div>

              {/* Veo Media Status */}
              {(isGeneratingVeoMedia || veoMedia) && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Video size={14} className="text-purple-600" />
                    <span className="text-xs font-medium text-purple-900">Veo 3.0 Media</span>
                  </div>
                  {isGeneratingVeoMedia ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin text-purple-600" size={12} />
                      <span className="text-xs text-purple-700">Generating with Veo 3.0...</span>
                    </div>
                  ) : veoMedia ? (
                    <div className="space-y-1">
                      {veoMedia.video?.status === 'success' && veoMedia.video?.videoUrl && (
                        <p className="text-xs text-green-700 flex items-center gap-1">
                          <span className="text-green-600">✓</span> Video generated (Veo 3.0)
                        </p>
                      )}
                      {veoMedia.video?.status === 'error' && (
                        <p className="text-xs text-red-700 flex items-center gap-1">
                          <span className="text-red-600">✗</span> Video generation failed
                        </p>
                      )}
                      {veoMedia.audio?.status === 'success' && veoMedia.audio?.audioUrl && (
                        <p className="text-xs text-green-700 flex items-center gap-1">
                          <span className="text-green-600">✓</span> Audio narration (Gemini Live)
                        </p>
                      )}
                      {veoMedia.audio?.status === 'error' && (
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                          <span className="text-amber-600">⏳</span> Audio coming soon (Preview API required)
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Generate Website Button */}
              <Button
                variant="secondary"
                className="w-full justify-start gap-3"
                onClick={() => handleGenerateWebsite(startupContext)}
                disabled={isGeneratingWebsite}
              >
                <Globe size={16} className="text-blue-500" />
                {isGeneratingWebsite ? 'Generating Website...' : 'Generate Website'}
              </Button>

              {/* Generated Website Display */}
              {generatedWebsiteId && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <Globe size={14} />
                    <span className="text-xs font-medium">Website Generated!</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center gap-2"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('view', 'website_preview');
                      params.set('websiteId', generatedWebsiteId);
                      setSearchParams(params);
                    }}
                  >
                    <ExternalLink size={12} />
                    View Generated Website
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}