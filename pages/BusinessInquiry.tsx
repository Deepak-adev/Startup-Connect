import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AGUIChat from '../components/AGUIChat';
import { ArrowRight } from 'lucide-react';

export default function BusinessInquiry() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'register' | 'chat'>('register');
    const [regData, setRegData] = useState({ email: '', password: '' });
    const [canProceed, setCanProceed] = useState(false);

    // In a real app, AGUIChat would communicate up when enough info is gathered
    // For demo, we'll allow skipping or proceeding after some interaction
    useEffect(() => {
        if (step === 'chat') {
            // Simulate analyzing...
            const timer = setTimeout(() => setCanProceed(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleComplete = () => {
        // In a real app, we would parse the 'messages' to extract structured data.
        // For now, we'll save a flag that the inquiry is complete and some mock extracted data
        // that matches the "FlareUp" example the user gave, or generic if empty.
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
        localStorage.setItem('startupProfile', JSON.stringify(mockProfile));
        navigate('/app');
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally register the user
        setStep('chat');
    };

    return (
        <div className="h-screen w-full bg-slate-50 flex flex-col relative overflow-hidden">
            {step === 'chat' && (
                <div className="absolute top-4 right-4 z-50">
                    <button
                        onClick={handleComplete}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-indigo-600 font-medium shadow-sm transition-all"
                    >
                        <span>Complete Analysis</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col min-h-0">
                <div className="text-center mb-6 flex-shrink-0">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                        {step === 'register' ? 'Create Your Account' : 'Tell me about your business'}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {step === 'register' ? 'Secure your startup journey first.' : "I'll help you generate pitch decks, reports, and more."}
                    </p>
                </div>

                {step === 'register' ? (
                    <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50 overflow-y-auto">
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={regData.email}
                                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                                    placeholder="founder@startup.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={regData.password}
                                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                            >
                                <span>Continue to Analysis</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Full Screen Chat Interface */
                    <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50 bg-white min-h-0 flex flex-col">
                        <AGUIChat
                            fullScreenMode={true}
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

Response Format (JSON ONLY):
{
  "thought": "Reasoning...",
  "message": "Your next single question...",
  "navigation": null
}
`}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
