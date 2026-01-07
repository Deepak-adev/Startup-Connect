import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Mic, Sparkles, Bot, User } from 'lucide-react';
import { Button, Textarea, Skeleton, cn } from './ui';
import { sendMessageToAGUI } from '../services/geminiService';
import { ChatMessage, AGUIResponse } from '../types';

export default function AGUIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm AGUI. I can navigate the startup ecosystem for you. Try 'Show me clothing partners' or 'Analyze the market'." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [_, setSearchParams] = useSearchParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response: AGUIResponse = await sendMessageToAGUI(messages, input);

    setIsLoading(false);

    if (response.navigation && response.navigation.params) {
      // Execute Navigation (Drive the UI)
      // We convert the params object to URLSearchParams compatible format
      const newParams: Record<string, string> = {};
      Object.entries(response.navigation.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          newParams[key] = String(value);
        }
      });
      setSearchParams(newParams);
    }

    setMessages(prev => [...prev, { role: 'model', text: response.message }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 backdrop-blur-xl border-l border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        </div>
        <div>
          <h2 className="font-display font-bold text-lg leading-none">AGUI</h2>
          <p className="text-xs text-slate-400">AI Graphical Interface</p>
        </div>
      </div>

      {/* Messages */}
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
        {isLoading && (
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

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-slate-900/50">
        <div className="relative">
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell AGUI what you need..."
            className="pr-24 min-h-[60px] max-h-[120px] bg-slate-800/50 border-slate-700/50 focus:bg-slate-800"
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-indigo-400">
              <Mic size={16} />
            </Button>
            <Button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="sm" 
              className={cn("h-8 w-8 p-0 rounded-full transition-all", input.trim() ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-500")}
            >
              <Send size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}