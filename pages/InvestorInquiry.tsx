import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AGUIChat from '../components/AGUIChat';
import { ArrowRight, Loader2 } from 'lucide-react';
import { generateInvestorProfileFromChat } from '../services/geminiService';
import { ChatMessage } from '../types';

export default function InvestorInquiry() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'register' | 'chat'>('register');
    const [regData, setRegData] = useState({ email: '', password: '' });
    const [canProceed, setCanProceed] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (step === 'chat') {
            const timer = setTimeout(() => setCanProceed(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleAnalysisComplete = async (data: any) => {
        try {
            await fetch('/api/save-investor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            localStorage.setItem('investorProfile', JSON.stringify(data));
            navigate('/app?view=investor_dashboard');
        } catch (error) {
            console.error('Failed to save investor inquiry:', error);
            localStorage.setItem('investorProfile', JSON.stringify(data));
            navigate('/app?view=investor_dashboard');
        }
    };

    const handleComplete = async () => {
        setIsAnalyzing(true);
        try {
            if (chatMessages.length > 2) {
                const extractedProfile = await generateInvestorProfileFromChat(chatMessages);
                await handleAnalysisComplete(extractedProfile);
            } else {
                const mockInvestorProfile = {
                    name: "Venture Capital Partners",
                    type: "VC Firm",
                    thesis: "Investing in early-stage AI and GreenTech startups.",
                    ticketSize: { min: "$100K", max: "$2M" },
                    industries: ["AI", "GreenTech", "SaaS"]
                };
                await handleAnalysisComplete(mockInvestorProfile);
            }
        } catch (error) {
            console.error("Analysis failed", error);
            const mockInvestorProfile = {
                name: "Venture Capital Partners",
                type: "VC Firm",
                thesis: "Investing in early-stage AI and GreenTech startups.",
                ticketSize: { min: "$100K", max: "$2M" },
                industries: ["AI", "GreenTech", "SaaS"]
            };
            await handleAnalysisComplete(mockInvestorProfile);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('chat');
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col relative overflow-y-auto pb-10">
            <div className={`flex-1 w-full ${step === 'register' ? 'max-w-5xl mx-auto p-4 md:p-8 flex flex-col justify-center' : 'max-w-5xl mx-auto p-4 md:p-6 flex flex-col min-h-[650px]'}`}>
                {step === 'register' && (
                    <div className="text-center mb-6 flex-shrink-0">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                            Join as an Investor
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Access exclusive deal flow and startup analytics.
                        </p>
                    </div>
                )}

                {step === 'register' ? (
                    <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50 overflow-y-auto">
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Work Email</label>
                                <input
                                    type="email"
                                    required
                                    value={regData.email}
                                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-all"
                                    placeholder="investor@fund.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={regData.password}
                                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                            >
                                <span>Start Discovery</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50 bg-white min-h-0 flex flex-col">
                        <AGUIChat
                            fullScreenMode={true}
                            onAnalysisComplete={handleAnalysisComplete}
                            onMessagesChange={setChatMessages}
                            headerAction={
                                <button
                                    onClick={handleComplete}
                                    disabled={isAnalyzing}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Complete Profile</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </>
                                    )}
                                </button>
                            }
                            initialMessage="Welcome Partner. To tailor the deal flow to your needs, I need to understand your investment criteria. What is your primary investment thesis?"
                            systemInstruction={`
You are AGUI, an expert investment analyst assisting a new investor onboarding.
Your goal is to build a comprehensive investment profile by asking probing questions.

Operational Rules:
1. Ask ONLY ONE question at a time.
2. Keep questions professional yet conversational.
3. Wait for the user to answer before moving to the next topic.

Topics to Cover (Ask one by one):
1. Investment Thesis (What drives your decisions?).
2. Preferred Stages (Pre-seed, Seed, Series A, Late Stage?).
3. Target Industries/Verticals (e.g., Fintech, BioTech, AI).
4. Geographic Focus (Global, US-only, Emerging Markets?).
5. Average Ticket Size (How much do you typically invest?).
6. Follow-on Policy (Do you lead rounds? Do you reserve for follow-ons?).
7. Value Add (Beyond capital, how do you help startups?).
8. Fund Size / Assets Under Management (AUM).
9. Deal Flow Volume (How many deals do you want to see per month?).
10. Co-investment preferences.

Once you have gathered sufficient data points (at least 6-8), output a JSON with:
  message: "Thank you. I have calibrated your deal flow engine. Redirecting you to your dashboard to view matches..."
  navigation: { path: "/app", params: { view: "investor_dashboard" } }
  data: {
    name: "Investor/Fund Name",
    type: "Type (Angel, VC, etc.)",
    thesis: "Investment thesis",
    preferredStages: "...",
    industries: ["Array of industries"],
    geographicFocus: "...",
    ticketSize: { min: "...", max: "..." },
    followOnPolicy: "...",
    valueAdd: "...",
    fundSize: "...",
    dealFlowVolume: "...",
    coInvestmentPreferences: "..."
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
