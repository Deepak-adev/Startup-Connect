import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Mic, Sparkles, Bot, User, MicOff, Volume2 } from 'lucide-react';
import { Button, Textarea, Skeleton, cn } from './ui';
import { sendMessageToAGUI } from '../services/geminiService';
import { liveService } from '../services/liveService';
import { ChatMessage, AGUIResponse } from '../types';

export default function AGUIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm AGUI. I can navigate the startup ecosystem for you. Try 'Show me clothing partners' or 'Analyze the market'." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, liveTranscript]);

  const handleSend = async () => {
    const textToSend = input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response: AGUIResponse = await sendMessageToAGUI(messages, textToSend);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 backdrop-blur-xl border-l border-white/10">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300",
              isLive ? "bg-indigo-600/20 border-indigo-400 scale-110" : "bg-slate-800 border-indigo-500/30"
            )}>
              {isLive ? <Volume2 className="w-5 h-5 text-indigo-400 animate-pulse" /> : <Sparkles className="w-5 h-5 text-indigo-400" />}
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
            <h2 className="font-display font-bold text-lg leading-none">AGUI</h2>
            <p className="text-xs text-slate-400">{isLive ? "Voice Mode Active" : "AI Graphical Interface"}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'user' ? "bg-slate-700" : "bg-indigo-600"
            )}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-slate-800 text-slate-100 rounded-tr-sm" 
                : "bg-white/10 text-slate-50 backdrop-blur-sm rounded-tl-sm border border-white/5"
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLive && liveTranscript && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot size={14} />
            </div>
            <div className="p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed bg-indigo-500/10 text-indigo-100 backdrop-blur-sm rounded-tl-sm border border-indigo-500/20 animate-pulse">
              {liveTranscript}
            </div>
          </div>
        )}

        {isLoading && !isLive && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
               <Bot size={14} />
             </div>
             <div className="space-y-2 w-full max-w-[70%]">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-[80%]" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/5 bg-slate-900/50">
        <div className="relative">
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLive}
            placeholder={isLive ? "Listening to your voice..." : "Tell AGUI what you need..."}
            className={cn(
              "pr-24 min-h-[60px] max-h-[120px] transition-all duration-300",
              isLive ? "bg-indigo-950/20 border-indigo-500/30" : "bg-slate-800/50 border-slate-700/50 focus:bg-slate-800"
            )}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLive}
              className={cn(
                "h-8 w-8 p-0 rounded-full transition-all",
                isLive ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "text-slate-400 hover:text-indigo-400"
              )}
            >
              {isLive ? <MicOff size={16} /> : <Mic size={16} />}
            </Button>
            <Button 
              onClick={handleSend}
              disabled={isLoading || !input.trim() || isLive}
              size="sm" 
              className={cn("h-8 w-8 p-0 rounded-full transition-all", input.trim() && !isLive ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-500")}
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
                  className="w-1 bg-indigo-400 rounded-full animate-bounce" 
                  style={{ 
                    height: `${20 + Math.random() * 80}%`, 
                    animationDuration: `${0.5 + Math.random()}s`,
                    animationDelay: `${i * 0.1}s` 
                  }} 
                />
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Live Interaction</span>
          </div>
        )}
      </div>
    </div>
  );
}