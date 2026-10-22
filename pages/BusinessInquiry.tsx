import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AGUIChat from '../components/AGUIChat';
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { generateProfileFromChat } from '../services/geminiService';
import { ChatMessage } from '../types';

export default function BusinessInquiry() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'register' | 'chat'>('register');
    const [regData, setRegData] = useState({ email: '', password: '' });
    const [canProceed, setCanProceed] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // In a real app, AGUIChat would communicate up when enough info is gathered
    // For demo, we'll allow skipping or proceeding after some interaction
    useEffect(() => {
        if (step === 'chat') {
            // Simulate analyzing...
            const timer = setTimeout(() => setCanProceed(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleComplete = async () => {
        setIsAnalyzing(true);
        try {
            // If we have a meaningful conversation, extract real data
            if (chatMessages.length > 2) {
                const extractedProfile = await generateProfileFromChat(chatMessages);
                await handleAnalysisComplete(extractedProfile);
            } else {
                // Fallback to mock data if no conversation happened
                const mockProfile = {
                    name: "FlareUp",
                    industry: "SaaS / AI",
                    stage: "Idea/Pre-Seed",
                    description: "AI-driven platform for unmatched startup profile building and market analysis.",
                    targetAudience: "Early-stage founders",
                    metrics: {
                        tam: "$50B",
                        sam: "$10B",
                        som: "$100M"
                    }
                };
                await handleAnalysisComplete(mockProfile);
            }
        } catch (error) {
            console.error("Analysis failed", error);
            // Fallback on error
            const mockProfile = {
                name: "FlareUp",
                industry: "SaaS / AI",
                stage: "Idea/Pre-Seed",
                description: "AI-driven platform for unmatched startup profile building and market analysis.",
                targetAudience: "Early-stage founders",
                metrics: {
                    tam: "$50B",
                    sam: "$10B",
                    som: "$100M"
                }
            };
            await handleAnalysisComplete(mockProfile);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAnalysisComplete = async (data: any) => {
        try {
            await fetch('/api/save-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            localStorage.setItem('startupProfile', JSON.stringify(data));
            navigate('/app');
        } catch (error) {
            console.error('Failed to save inquiry:', error);
            // Fallback
            localStorage.setItem('startupProfile', JSON.stringify(data));
            navigate('/app');
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally register the user
        setStep('chat');
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col relative overflow-y-auto font-sans selection:bg-indigo-500 selection:text-white pb-10">
            {/* Soft Ambient Pastel Background Blurs */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-indigo-100/60 via-purple-100/50 to-pink-100/50 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-sky-100/60 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

            {/* Subtle Grid Pattern Overlay */}
            <div 
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className={`flex-1 w-full ${step === 'register' ? 'max-w-md mx-auto p-4 flex flex-col justify-center' : 'max-w-5xl mx-auto p-4 md:p-6 flex flex-col min-h-[650px]'} relative z-10`}>
                {step === 'register' ? (
                    <div className="w-full max-w-md mx-auto my-auto animate-fade-in-up">
                        {/* Header Branding */}
                        <div className="text-center mb-5">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-100 p-2.5 mb-3 shadow-md shadow-slate-200/60">
                                <img
                                    src="/logo.png"
                                    alt="Startup Connect"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900">
                                Create Your Account
                            </h1>
                            <p className="text-slate-500 text-xs mt-1 font-normal">
                                Secure your startup journey first.
                            </p>
                        </div>

                        {/* Crisp White Card */}
                        <div className="relative rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-200/60 p-6 md:p-7">
                            <form onSubmit={handleRegister} className="space-y-4">
                                {/* Email Input */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 ml-0.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={regData.email}
                                            onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
                                            placeholder="founder@startup.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between ml-0.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Password
                                        </label>
                                        <span className="text-[11px] text-slate-400">Min. 6 characters</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={regData.password}
                                            onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Security / Trust Perk */}
                                <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                    <span>256-bit encrypted • Confidential deal flow</span>
                                </div>

                                {/* Action Button */}
                                <button
                                    type="submit"
                                    className="group relative w-full py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Continue to Analysis</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            {/* Terms & Footer Note */}
                            <p className="mt-4 text-center text-[11px] text-slate-400">
                                By continuing, you agree to our{' '}
                                <span className="text-slate-600 hover:underline cursor-pointer">Terms</span> and{' '}
                                <span className="text-slate-600 hover:underline cursor-pointer">Privacy Policy</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Full Screen Chat Interface */
                    <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 bg-white min-h-0 flex flex-col">
                        <AGUIChat
                            fullScreenMode={true}
                            onAnalysisComplete={handleAnalysisComplete}
                            onMessagesChange={setChatMessages}
                            headerAction={
                                <button
                                    onClick={handleComplete}
                                    disabled={isAnalyzing}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                            <span>Analyzing Profile...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Complete Analysis</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </>
                                    )}
                                </button>
                            }
                            initialMessage="Hello! Now that you're signed up, let's build your profile. Tell me about your business idea. What problem are you solving and who is your target market?"
                            systemInstruction={`
You are AGUI, a patient and helpful startup profile builder.
Your goal is to build a comprehensive profile for the user's business by asking a series of 10-15 simple, short questions.

Operational Rules:
1. Ask ONLY ONE question at a time. Never ask multiple questions in one turn.
2. Keep questions simple, short, and conversational.
3. Wait for the user to answer before moving to the next topic.
4. Do not offer long analysis yet, just gather information.

Topics to Cover (Ask one by one):
1. Specific Problem you are solving.
2. Your innovative Solution.
3. Precise Target Audience (Who interacts with the product?).
4. Geography/Location focus.
5. Revenue Model (How do you make money?).
6. Pricing Strategy (Premium, Low-cost, Freemium?).
7. Current Stage (Idea, MVP, Revenue?).
8. Team Size & Key Roles.
9. Funding History (Bootstrapped or Raised?).
10. Fundraising Goals (How much are you raising?).
11. Key Competitors.
12. Go-to-Market Strategy (Marketing channels?).
13. Biggest Challenge currently faced.
14. Timeline for launch/scale.

Once you have gathered at least 10-12 distinct data points, output a JSON with:
  message: "Perfect! I have captured all the necessary details. I am now generating your full startup profile, pitch deck strategy, and market analysis. Taking you to your dashboard now..."
  navigation: { path: "/app" }
  data: {
    name: "Business Name (inferred)",
    industry: "Industry (inferred)",
    description: "Full description",
    targetAudience: "...",
    problem: "...",
    solution: "...",
    revenueModel: "...",
    pricingStrategy: "...",
    stage: "...",
    teamSize: "...",
    fundingHistory: "...",
    fundraisingGoals: "...",
    competitors: "...",
    marketingChannels: "...",
    challenges: "...",
    timeline: "...",
    metrics: {
      tam: "Total Addressable Market (estimate)",
      sam: "Serviceable Addressable Market (estimate)",
      som: "Serviceable Obtainable Market (estimate)"
    }
  }

Response Format (JSON ONLY):
{
  "thought": "Reasoning...",
  "message": "Your next single question...",
  "navigation": null,
  "data": null
}
`}
                        />

                    </div>
                )}
            </div>
        </div>
    );
}
