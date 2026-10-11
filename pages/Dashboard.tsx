import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DynamicWorkspace from '../components/DynamicWorkspace';
import AGUIChat from '../components/AGUIChat';
import { Logo } from '../components/Logo';
import { LayoutDashboard, Users, PieChart, Wallet, Presentation, Menu, Target, Briefcase } from 'lucide-react';
import { ViewType } from '../types';
import { cn } from '../components/ui';

export default function Dashboard() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentView = searchParams.get('view') || ViewType.DASHBOARD;
    const isInvestor = currentView.startsWith('investor');
    const [isAguiOpen, setIsAguiOpen] = React.useState(true);
    const [contextData, setContextData] = React.useState<any>(null);

    React.useEffect(() => {
        // Fetch appropriate data based on role
        const endpoint = isInvestor ? '/api/get-investor' : '/api/get-inquiry';

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                const profile = Array.isArray(data) ? data[0] : data;
                if (profile && !profile.error) {
                    setContextData(profile);
                } else {
                    console.log(`No ${isInvestor ? 'investor' : 'startup'} data found, using generic context`);
                    setContextData(isInvestor
                        ? { name: "Your Fund", type: "Investor", thesis: "Investing in promising ventures." }
                        : { name: "Your Startup", industry: "General", description: "A new venture." }
                    );
                }
            })
            .catch(err => {
                console.error("Failed to load context data", err);
                setContextData(isInvestor
                    ? { name: "Your Fund", type: "Investor", thesis: "Investing in promising ventures." }
                    : { name: "Your Startup", industry: "General", description: "A new venture." }
                );
            });
    }, [isInvestor]);

    const navItems = isInvestor ? [
        { id: 'investor_dashboard' as ViewType, label: 'Overview', icon: LayoutDashboard },
        { id: 'investor_deal_flow' as ViewType, label: 'Deal Flow', icon: Target },
        { id: 'investor_portfolio' as ViewType, label: 'Portfolio', icon: Briefcase },
        { id: 'investor_reports' as ViewType, label: 'Reports', icon: PieChart },
    ] : [
        { id: ViewType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
        { id: ViewType.PARTNERS, label: 'Partners', icon: Users },
        { id: ViewType.MARKET_ANALYSIS, label: 'Analysis', icon: PieChart },
        { id: ViewType.STARTUP_SALE, label: 'Valuation', icon: Wallet },
        { id: ViewType.PITCH_DECK, label: 'Pitch Deck', icon: Presentation },
    ];

    const handleNavClick = (view: ViewType | string) => {
        setSearchParams({ view: view as string });
    };

    // Dynamic system instruction based on role
    const systemInstruction = contextData ? (isInvestor ? `
You are AGUI, the AI assistant for investors on "Startup Connect".
You are currently assisting: "${contextData.name}".

Context about this investor:
- Type: ${contextData.type}
- Investment Thesis: ${contextData.thesis}
- Preferred Stages: ${contextData.preferredStages || 'Various'}
- Target Industries: ${contextData.industries?.join(', ') || 'Various'}
- Ticket Size: ${contextData.ticketSize?.min || 'N/A'} - ${contextData.ticketSize?.max || 'N/A'}
- Geographic Focus: ${contextData.geographicFocus || 'Global'}

Your goal is to help this investor discover startups, analyze deal flow, and manage their portfolio.

**Supported Views (view parameter)**
- 'investor_dashboard': Overview and key metrics.
- 'investor_deal_flow': Browse and filter startups.
- 'investor_portfolio': View invested companies.
- 'investor_reports': Analytics and reports.

**Operational Rules**
1. When the user asks to see startups or deals, navigate to deal_flow.
2. Keep responses concise and professional.
3. Use the investor's thesis to recommend relevant startups.

**Response Format (JSON ONLY)**
{
  "thought": "Internal reasoning...",
  "navigation": {
    "path": "/app", 
    "params": { "view": "investor_deal_flow" }
  },
  "message": "User facing message..."
}
` : `
You are AGUI, the AI assistant for "Startup Connect".
You are currently assisting the startup: "${contextData.name}".

Context about this startup:
- Industry: ${contextData.industry}
- Description: ${contextData.description}
- Problem/Solution: ${contextData.problem} / ${contextData.solution}
- Target Audience: ${contextData.targetAudience}
- Stage: ${contextData.stage}
- Key Metrics: TAM=${contextData.metrics?.tam}, SAM=${contextData.metrics?.sam}

Your goal is to translate user intent into structured JSON actions to drive the React UI.

**Supported Views (view parameter)**
- 'dashboard': Main hub, metrics, loan status.
- 'partners': Collaboration matching table.
- 'market_analysis': Charts and research.
- 'startup_sale': Exit strategy and valuation.
- 'pitch_deck': Deck creation tool.

**Response Format (JSON ONLY)**
{
  "thought": "Internal reasoning...",
  "navigation": {
    "path": "/app", 
    "params": { "view": "partners", "industry": "${contextData.industry}" }
  },
  "message": "User facing message..."
}
`) : undefined;

    const initialMessage = contextData ? (isInvestor
        ? `Welcome back! I'm ready to help with ${contextData.name}. We can explore deal flow, analyze your portfolio, or find startups matching your thesis in ${contextData.industries?.join(', ') || 'your target sectors'}.`
        : `Welcome back! I'm ready to help with ${contextData.name}. We can look for partners in ${contextData.industry}, analyze your market, or create a pitch deck.`
    ) : undefined;

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-slate-200 bg-white shadow-sm z-20">
                <div className="p-6 flex items-center gap-3">
                    <Logo
                        className="h-9 w-9 flex-shrink-0 shadow-lg shadow-indigo-500/10"
                        type={isInvestor ? 'investor' : 'startup'}
                    />
                    <span className="font-display font-bold text-lg tracking-tight hidden lg:block text-slate-900">
                        {isInvestor ? 'Investor Hub' : 'Startup Connect'}
                    </span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 group",
                                currentView === item.id
                                    ? isInvestor
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm"
                                        : "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <item.icon size={20} className={cn(
                                currentView === item.id
                                    ? isInvestor ? "text-emerald-600" : "text-indigo-600"
                                    : "text-slate-400 group-hover:text-slate-600"
                            )} />
                            <span className="hidden lg:block font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 hidden lg:block">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                            {isInvestor ? 'Portfolio Value' : 'Current Balance'}
                        </p>
                        <p className="text-xl font-mono font-bold text-slate-900">
                            {isInvestor ? '$2.4M' : '$24,500.00'}
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area (Split Pane) */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* Mobile Nav Toggle (Abs) */}
                <div className="md:hidden absolute top-4 left-4 z-50">
                    <button className="p-2 rounded-md bg-white border border-slate-200 text-slate-700 shadow-lg">
                        <Menu size={20} />
                    </button>
                </div>

                {/* Main Workspace */}
                <div className="flex-1 h-full relative z-0 bg-slate-50 transition-all duration-500 ease-in-out overflow-y-auto overflow-x-hidden">
                    <DynamicWorkspace />

                    {/* Floating Toggle Button (Visible only when AGUI is closed) */}
                    {!isAguiOpen && (
                        <button
                            onClick={() => setIsAguiOpen(true)}
                            className={cn(
                                "fixed bottom-6 right-6 z-50 bg-white text-slate-900 shadow-2xl rounded-full p-4 flex items-center gap-3 border border-slate-200 hover:scale-105 transition-transform animate-in slide-in-from-bottom-5",
                                isInvestor ? "hover:border-emerald-500 hover:text-emerald-600" : "hover:border-indigo-500 hover:text-indigo-600"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg",
                                isInvestor ? "bg-gradient-to-tr from-emerald-500 to-teal-600" : "bg-gradient-to-tr from-indigo-600 to-violet-600"
                            )}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                            </div>
                            <span className="font-bold pr-2 hidden md:inline-block">Ask AGUI</span>
                        </button>
                    )}
                </div>

                {/* Floating AGUI Chat Popup */}
                <div className={cn(
                    "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden flex flex-col origin-bottom-right",
                    isAguiOpen ? "scale-100 opacity-100 w-[90vw] md:w-[400px] lg:w-[450px] h-[600px] max-h-[85vh]" : "scale-50 opacity-0 w-0 h-0 pointer-events-none"
                )}>
                    {isAguiOpen && (
                        <div className="flex-1 w-full h-full">
                            {contextData ? (
                                <AGUIChat
                                    systemInstruction={systemInstruction}
                                    initialMessage={initialMessage}
                                    onClose={() => setIsAguiOpen(false)}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-white">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={cn(
                                            "h-8 w-8 animate-spin rounded-full border-4 border-t-transparent",
                                            isInvestor ? "border-emerald-600" : "border-indigo-600"
                                        )}></div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Loading your {isInvestor ? 'investor' : 'startup'} context...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
