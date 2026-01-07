import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DynamicWorkspace from './components/DynamicWorkspace';
import AGUIChat from './components/AGUIChat';
import { LayoutDashboard, Users, PieChart, Wallet, Presentation, Menu, BarChart3 } from 'lucide-react';
import { ViewType } from './types';
import { cn } from './components/ui';

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || ViewType.DASHBOARD;

  const navItems = [
    { id: ViewType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewType.PARTNERS, label: 'Partners', icon: Users },
    { id: ViewType.STARTUP_SALE, label: 'Idea Sale', icon: Wallet },
    { id: ViewType.ECOTRACK, label: 'EcoTrack', icon: PieChart },
    { id: ViewType.MARKET_ANALYSIS, label: 'Analysis', icon: BarChart3 },
    { id: ViewType.PITCH_DECK, label: 'Pitch Deck', icon: Presentation },
  ];

  const handleNavClick = (view: ViewType) => {
    setSearchParams({ view });
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-50 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex-shrink-0" />
          <span className="font-display font-bold text-lg tracking-tight hidden lg:block">Startup Connect</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 group",
                currentView === item.id 
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn(currentView === item.id ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="hidden lg:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 border border-white/5 hidden lg:block">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Current Balance</p>
            <p className="text-xl font-mono font-bold text-white">$24,500.00</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Split Pane) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Mobile Nav Toggle (Abs) */}
        <div className="md:hidden absolute top-4 left-4 z-50">
          <button className="p-2 rounded-md bg-slate-800 text-white shadow-lg">
            <Menu size={20} />
          </button>
        </div>

        {/* Panel A: Dynamic Workspace */}
        <div className="flex-1 h-1/2 md:h-full md:flex-[2] lg:flex-[3] relative z-0">
          <DynamicWorkspace />
        </div>

        {/* Panel B: AGUI Chat */}
        <div className="h-1/2 md:h-full md:flex-1 border-t md:border-t-0 md:border-l border-white/10 shadow-2xl z-10 relative">
          <AGUIChat />
        </div>

      </main>
    </div>
  );
}