import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DynamicWorkspace from '../components/DynamicWorkspace';
import AGUIChat from '../components/AGUIChat';
import { LayoutDashboard, Users, PieChart, Wallet, Presentation, Menu, Target } from 'lucide-react';
import { ViewType } from '../types';
import { cn } from '../components/ui';

export default function Dashboard() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentView = searchParams.get('view') || ViewType.DASHBOARD;
    const [startupData, setStartupData] = React.useState<any>(null);

    React.useEffect(() => {
        fetch('/api/get-inquiry')
            .then(res => res.json())
            .then(data => {
                // Handle array format: extract first element
                const profile = Array.isArray(data) ? data[0] : data;
                if (profile && !profile.error) {
                    setStartupData(profile);
                } else {
                    // No data found, maybe redirect or just load generic
                    console.log("No startup data found, using generic context");
                    setStartupData({ name: "Your Startup", industry: "General", description: "A new venture." });
                }
            })
            .catch(err => {
                console.error("Failed to load startup data", err);
                setStartupData({ name: "Your Startup", industry: "General", description: "A new venture." });
            });
    }, []);

    const navItems = currentView.startsWith('investor_') ? [
        { id: ViewType.INVESTOR_DASHBOARD, label: 'Overview', icon: LayoutDashboard },
        { id: ViewType.INVESTOR_DEAL_FLOW, label: 'Deal Flow', icon: Target },
        { id: ViewType.INVESTOR_PORTFOLIO, label: 'Portfolio', icon: PieChart },
        { id: ViewType.INVESTOR_REPORTS, label: 'Reports', icon: Presentation },
    ] : [
        { id: ViewType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
        { id: ViewType.PARTNERS, label: 'Partners', icon: Users },
        { id: ViewType.MARKET_ANALYSIS, label: 'Analysis', icon: PieChart },
        { id: ViewType.STARTUP_SALE, label: 'Valuation', icon: Wallet },
        { id: ViewType.PITCH_DECK, label: 'Pitch Deck', icon: Presentation },
    ];

    const handleNavClick = (view: ViewType) => {
        setSearchParams({ view });
    };

    const systemInstruction = startupData ? `
You are AGUI, the AI assistant for "Startup Connect".
You are currently assisting the startup: "${startupData.name}".

Context about this startup:
- Industry: ${startupData.industry}
- Description: ${startupData.description}
- Problem/Solution: ${startupData.problem} / ${startupData.solution}
- Target Audience: ${startupData.targetAudience}
- Stage: ${startupData.stage}
- Key Metrics: TAM=${startupData.metrics?.tam}, SAM=${startupData.metrics?.sam}

Your goal is to translate user intent into structured JSON actions to drive the React UI, while keeping this context in mind.
When the user asks for partners, analysis, or pitch decks, use the specific details of this startup to tailor your response.

**The "Steering Wheel" (URL Schema)**
You drive the website by outputting a JSON object.

**A. Supported Views (view parameter)**
- 'dashboard': Main hub, metrics, loan status.
- 'partners': Collaboration matching table.
- 'market_analysis': Charts and research.
- 'startup_sale': Exit strategy and valuation.
- 'pitch_deck': Deck creation tool.
- 'website_preview': Website generation preview.

**B. Supported Filters (params)**
- industry: string
- funding_min: number
- profit_status: 'profit' | 'loss' | 'break_even'
- q: search query string
- action: 'trigger_veo_video' | 'trigger_imagen_logo' | 'generate_deck' | 'generate_website'
- websiteId: string (for website preview)

**Operational Rules**
1. Intent First: If user wants to see partners, navigate there immediately.
2. Silent Driving: Output JSON cleanly. 
3. Missing Info: Default to a logical view.

**Response Format (JSON ONLY)**
{
  "thought": "Internal reasoning...",
  "navigation": {
    "path": "/app", 
    "params": {
      "view": "partners",
      "industry": "${startupData.industry}"
    }
  },
  "message": "User facing message..."
}
` : undefined;

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-slate-200 bg-white shadow-sm z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex-shrink-0" />
                    <span className="font-display font-bold text-lg tracking-tight hidden lg:block text-slate-900">Startup Connect</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 group",
                                currentView === item.id
                                    ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <item.icon size={20} className={cn(currentView === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                            <span className="hidden lg:block font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 hidden lg:block">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Current Balance</p>
                        <p className="text-xl font-mono font-bold text-slate-900">$24,500.00</p>
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

                {/* Panel A: Dynamic Workspace */}
                <div className="flex-1 h-1/2 md:h-full md:flex-[2] lg:flex-[3] relative z-0 bg-slate-50">
                    <DynamicWorkspace />
                </div>

                {/* Panel B: AGUI Chat */}
                <div className="h-1/2 md:h-full md:flex-1 border-t md:border-t-0 md:border-l border-slate-200 shadow-xl z-10 relative">
                    {startupData ? (
                        <AGUIChat
                            systemInstruction={systemInstruction}
                            initialMessage={`Welcome back! I'm ready to help with ${startupData.name}. We can look for partners in ${startupData.industry}, analyze your market, or create a pitch deck.`}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-white">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                                <p className="text-sm font-medium text-slate-500">Loading your startup context...</p>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
