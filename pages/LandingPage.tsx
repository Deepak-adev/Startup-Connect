import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    ArrowRight,
    Zap,
    Globe,
    Users,
    BarChart3,
    Play,
    Hammer,
    Palette,
    Briefcase,
    BrainCircuit,
    Rocket,
    MessageSquare,
    Search,
    CheckCircle2,
    TrendingUp,
    ShieldCheck,
    ChevronDown
} from 'lucide-react';
import { cn } from '../components/ui';

export default function LandingPage() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Rotating hero text
    useEffect(() => {
        const interval = setInterval(() => {
            setHeroIndex(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const heroWords = ["Skills", "Passion", "Ideas"];
    const gradients = [
        "from-indigo-600 via-purple-500 to-indigo-600",
        "from-pink-600 via-rose-500 to-pink-600",
        "from-blue-600 via-cyan-500 to-blue-600"
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

            {/* Navigation */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-200 py-3" : "bg-transparent py-5"
            )}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <img 
                            src="/logo.png" 
                            alt="Startup Connect Logo" 
                            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-display text-slate-900 leading-none">Startup Connect</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
                        <a href="#investors" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">For Investors</a>
                        <a href="#startups" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">For Founders</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden md:block text-sm font-medium text-slate-700 hover:text-indigo-700 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/inquiry')}
                            className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 flex items-center gap-2.5 transition-all duration-300 ring-2 ring-transparent hover:ring-indigo-100"
                        >
                            <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain rounded-full" />
                            <span>Start Chatting</span>
                            <MessageSquare className="w-4 h-4 opacity-70" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-indigo-50/80 to-transparent rounded-full blur-[100px] -z-10" />
                <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-pink-200/30 rounded-full blur-[80px] -z-10 animate-float" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-200/30 rounded-full blur-[80px] -z-10 animate-float" style={{ animationDelay: '2s' }} />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center">

                        {/* User Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm mb-8 animate-fade-in-up hover:border-indigo-300 transition-colors cursor-default">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-semibold text-slate-600">The #1 AI-Powered Co-Pilot for Business</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-900 mb-8 max-w-5xl mx-auto leading-[1.1] md:leading-[1.1]">
                            Turn Your <br className="md:hidden" />
                            <div className="inline-block min-w-[200px] relative">
                                <span className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r absolute inset-0 transition-opacity duration-500",
                                    gradients[heroIndex]
                                )}>
                                    {heroWords[heroIndex]}
                                </span>
                                <span className="invisible">{heroWords[heroIndex]}</span>
                            </div>
                            <br />  Into a Thriving Business
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                            Don't know where to start? Just chat. <br />
                            <span className="font-semibold text-slate-700">Startup Connect</span> builds your pitch deck, finds partners, and connects you with investors—automatically.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/inquiry')}
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-lg shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                Launch Your Idea
                                <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:rotate-45 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Play className="w-5 h-5 fill-slate-700/20" />
                                Investor Demo
                            </button>
                        </div>

                        {/* Floating Persona Cards */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-4 xl:left-0 hidden lg:block animate-float" style={{ animationDuration: '8s' }}>
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-[240px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <Hammer size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">Rajiv</div>
                                        <div className="text-xs text-slate-500">Carpenter ➝ Founder</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    "I need a partner who knows digital marketing for my furniture."
                                </div>
                                <div className="mt-2 text-xs font-semibold text-green-600 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Match Found!
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-1/2 -translate-y-1/2 -right-4 xl:right-0 hidden lg:block animate-float" style={{ animationDuration: '9s', animationDelay: '1s' }}>
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-[240px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                        <Palette size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">Sarah</div>
                                        <div className="text-xs text-slate-500">Designer ➝ Boutique Owner</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    "Generate a pitch deck for my new eco-friendly collection."
                                </div>
                                <div className="mt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                                    <Sparkles size={12} /> Deck Ready (8s)
                                </div>
                            </div>
                        </div>

                        {/* Abstract UI Preview */}
                        <div className="relative w-full max-w-5xl mx-auto mt-8 perspective-1000 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[21/9] transform rotate-x-12 transition-transform duration-700 ease-out group-hover:rotate-x-0">
                                {/* Chat UI Mock */}
                                <div className="flex h-full">
                                    <div className="w-64 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col p-4 gap-4">
                                        <div className="h-4 w-24 bg-slate-700 rounded-full mb-4 opacity-50" />
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-10 w-full bg-slate-800/50 rounded-lg animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                                        ))}
                                    </div>
                                    <div className="flex-1 flex flex-col p-6">
                                        <div className="flex-1 space-y-6">
                                            {/* AI Message */}
                                            <div className="flex gap-4 max-w-2xl">
                                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed">
                                                        To help you scale your bespoke furniture business, I've generated a market analysis of premium wood products in Bangalore. I also found 3 potential marketing partners. Would you like to see them?
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="bg-slate-800/50 border border-slate-700 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-slate-700 transition-colors">Show Partners</div>
                                                        <div className="bg-slate-800/50 border border-slate-700 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-slate-700 transition-colors">View Market Data</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* User Message */}
                                            <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0" />
                                                <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none text-sm">
                                                    That sounds perfect. Also, can you generate a pitch deck for investors?
                                                </div>
                                            </div>

                                            {/* Analysis Mock */}
                                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mt-4 animate-slide-up">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <BarChart3 className="w-4 h-4 text-green-400" />
                                                        <span className="text-sm font-medium text-slate-300">Live Market Trends</span>
                                                    </div>
                                                    <span className="text-xs text-slate-500">Updated 2m ago</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 h-24 items-end">
                                                    <div className="bg-slate-700 h-[40%] rounded-t-lg relative group">
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Demand</div>
                                                    </div>
                                                    <div className="bg-indigo-600 h-[70%] rounded-t-lg relative group">
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Growth</div>
                                                    </div>
                                                    <div className="bg-slate-700 h-[50%] rounded-t-lg relative group">
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Supply</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <div className="bg-slate-800 rounded-xl p-2 flex items-center gap-3">
                                                <div className="p-2 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"><MessageSquare size={18} className="text-slate-400" /></div>
                                                <div className="h-6 w-full text-slate-500 text-sm flex items-center">Generate a logo for "WoodCraft"...</div>
                                                <div className="p-2 bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-500 transition-colors"><ArrowRight size={18} className="text-white" /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* How It Works - The Magic */}
            <section id="how-it-works" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">From Idea to Investment in 3 Steps</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">No complex forms. No business degree required. Just chat with us.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 border-t border-dashed border-indigo-300"></div>

                        {[
                            {
                                icon: MessageSquare,
                                color: "text-blue-500",
                                bg: "bg-blue-50",
                                title: "1. Chat Your Idea",
                                desc: "Tell our AI about your skills, passion, or rough business idea in plain language."
                            },
                            {
                                icon: Zap,
                                color: "text-amber-500",
                                bg: "bg-amber-50",
                                title: "2. Get Assets Instantly",
                                desc: "We monitor generate your logo, pitch deck, and business plan in seconds."
                            },
                            {
                                icon: Users,
                                color: "text-green-500",
                                bg: "bg-green-50",
                                title: "3. Connect & Grow",
                                desc: "Get matched with co-founders to fill your gaps and investors ready to fund."
                            }
                        ].map((step, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center group">
                                <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 relative z-10 transition-transform duration-300 group-hover:scale-110", step.bg)}>
                                    <step.icon className={cn("w-10 h-10", step.color)} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Grid - Bento Box Style */}
            <section id="features" className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">Everything included in <br /><span className="text-indigo-600">Startup Connect</span></h2>
                            <p className="text-lg text-slate-500">Built on Google Gemini 2.0, our platform replaces the expensive agency work with instant, AI-driven results.</p>
                        </div>
                        <button onClick={() => navigate('/login')} className="flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                            View all features <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                        {/* Card 1 - Pitch Decks (Large) */}
                        <div className="md:col-span-3 lg:col-span-2 row-span-2 bg-white rounded-3xl p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden">
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                    <Presentation size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Pitch Deck Generator</h3>
                                <p className="text-slate-500 mb-8 max-w-sm">Create investor-ready slides in 30 seconds. Just describe your business, and we handle the story, design, and data.</p>

                                <div className="mt-auto relative">
                                    {/* Mock Slide Miniatures */}
                                    <div className="flex gap-4 overflow-hidden mask-linear-fade">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="min-w-[160px] aspect-video bg-slate-100 rounded-lg border border-slate-200 p-3 transform group-hover:-translate-y-2 transition-transform duration-500" style={{ transitionDelay: `${i * 50}ms` }}>
                                                <div className="w-1/2 h-2 bg-slate-300 rounded mb-2" />
                                                <div className="w-full h-1 bg-slate-200 rounded mb-1" />
                                                <div className="w-2/3 h-1 bg-slate-200 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -mr-16 -mt-16 opacity-50 pointer-events-none" />
                        </div>

                        {/* Card 2 - Partner Matching */}
                        <div className="md:col-span-3 lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Collaboration Matching</h3>
                                    <p className="text-sm text-slate-500 mt-1">Turn weaknesses into strengths.</p>
                                </div>
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                    <Users size={20} />
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-700">ME</div>
                                    <div className="text-xs font-semibold text-slate-700">Need Marketing</div>
                                </div>
                                <ArrowRight size={14} className="text-slate-300" />
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-[10px] font-bold text-purple-700">AI</div>
                                    <div className="text-xs font-semibold text-slate-700">Found: Alex (Pro Marketer)</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 - Market Insights */}
                        <div className="md:col-span-2 lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Market Insights</h3>
                            <p className="text-sm text-slate-500 mt-2">Get predicted trends before they happen.</p>
                        </div>

                        {/* Card 4 - Security */}
                        <div className="md:col-span-2 lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Verified Deal Flow</h3>
                            <p className="text-sm text-slate-500 mt-2">Diligence data investors can trust.</p>
                        </div>

                        {/* Card 5 - Exit Strategy */}
                        <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center text-white mb-4 backdrop-blur-sm">
                                    <Globe size={20} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Global & Local Scale</h3>
                                <p className="text-slate-300 text-sm opacity-80">Whether you're a local artisan or a tech founder, we structure your business for scale and future exits.</p>
                            </div>
                            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                                <Globe size={180} />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Testimonial / Trust */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-12">Trusted by builders and backers alike</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-left">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 text-amber-400 fill-amber-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg></div>)}
                            </div>
                            <p className="text-slate-700 italic mb-6">"I went from a rough idea for a sustainable clothing line to having a full pitch deck and a manufacturing partner in 2 days. The AI actually understood my vision."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                                <div>
                                    <div className="font-bold text-slate-900">Priya M.</div>
                                    <div className="text-xs text-slate-500">Founder, Earthen Wear</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-left">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 text-amber-400 fill-amber-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg></div>)}
                            </div>
                            <p className="text-slate-700 italic mb-6">"The due diligence reports this platform generates are scary good. It saved us weeks of manual research and highlighted risks we missed."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                                <div>
                                    <div className="font-bold text-slate-900">David Chen</div>
                                    <div className="text-xs text-slate-500">Angel Investor</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393798-2f43f1435bea?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 tracking-tight">Ready to build something legendary?</h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Join thousands of founders and investors on the most advanced AI-powered ecosystem.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/inquiry')}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-white/10"
                        >
                            Start for Free
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 rounded-full text-slate-300 font-medium hover:text-white transition-colors border border-transparent hover:border-slate-700"
                        >
                            Sign In to Account
                        </button>
                    </div>
                </div>
            </section>

            <footer className="bg-slate-950 border-t border-slate-900 py-16 text-slate-400">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-6 h-6 text-indigo-500" />
                                <span className="font-bold text-white text-xl">Startup Connect</span>
                            </div>
                            <p className="text-sm leading-relaxed mb-6">
                                Empowering grassroots entrepreneurs with AI tools previously reserved for unicorns.
                            </p>
                            <div className="flex gap-4">
                                {/* Socials */}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">AI Co-Pilot</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Pitch Deck Gen</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Market Analysis</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Investor Matching</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6">Company</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Legal</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6">Resources</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Success Stories</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
                        <div>© 2026 Startup Connect. All rights reserved.</div>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-white">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Presentation(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 3h20" />
            <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
            <path d="m7 21 5-5 5 5" />
        </svg>
    )
}
