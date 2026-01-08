import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Wallet,
    Briefcase,
    Activity,
    ShieldCheck,
    AlertTriangle,
    ArrowRight,
    Target,
    Search,
    Zap,
    ChevronRight,
    LayoutGrid,
    List,
    Filter
} from 'lucide-react';
import { Card, Badge, Button } from '../ui';

// Mock Data Types
interface Investment {
    id: string;
    name: string;
    industry: string;
    investedAmount: number;
    equity: number;
    roi: number;
    status: 'growing' | 'stable' | 'struggling';
    logoColor: string;
    lastUpdate: string;
}

interface StartupOpportunity {
    id: string;
    name: string;
    industry: string;
    askAmount: number;
    equityOffered: number;
    swot: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    matchScore: number;
    description: string;
    logoColor: string;
}

export default function InvestorDashboardView() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const navigate = useNavigate();

    // Mock Data
    const portfolio: Investment[] = [
        { id: '1', name: 'EcoStream', industry: 'GreenTech', investedAmount: 500000, equity: 12, roi: 15.4, status: 'growing', logoColor: 'from-emerald-400 to-green-600', lastUpdate: '2h ago' },
        { id: '2', name: 'MediPulse', industry: 'HealthTech', investedAmount: 1200000, equity: 22, roi: 8.2, status: 'stable', logoColor: 'from-blue-400 to-cyan-600', lastUpdate: '1d ago' },
        { id: '3', name: 'CyberShield', industry: 'Cybersecurity', investedAmount: 750000, equity: 15, roi: -2.1, status: 'struggling', logoColor: 'from-rose-400 to-red-600', lastUpdate: '3d ago' },
    ];

    const opportunities: StartupOpportunity[] = [
        {
            id: 's1',
            name: 'Nebula AI',
            industry: 'Artificial Intelligence',
            askAmount: 2000000,
            equityOffered: 10,
            matchScore: 98,
            description: 'Generative AI platform for enterprise workflow automation and scaling.',
            logoColor: 'from-violet-400 to-purple-600',
            swot: {
                strengths: ['Proprietary Model', 'Strong Team'],
                weaknesses: ['High Burn Rate'],
                opportunities: ['Enterprise Adoption'],
                threats: ['Regulatory Changes']
            }
        },
        {
            id: 's2',
            name: 'AgriSense',
            industry: 'AgriTech',
            askAmount: 450000,
            equityOffered: 15,
            matchScore: 85,
            description: 'IoT sensors for precision farming and yield optimization.',
            logoColor: 'from-lime-400 to-green-600',
            swot: {
                strengths: ['Low Cost Hardware', 'First Mover in Region'],
                weaknesses: ['Hardware Supply Chain'],
                opportunities: ['Climate Change Mitigation'],
                threats: ['Large Competitors']
            }
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 bg-slate-50/50 min-h-screen p-2 md:p-4">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Investor Portfolio</h1>
                    <p className="text-slate-500 mt-1 text-lg">Detailed performance metrics and deal flow analysis.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 gap-2 h-10 px-4" onClick={() => navigate('/app?view=investor_deal_flow')}>
                        <Search size={16} />
                        Find Startups
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-500/20 h-10 px-4" onClick={() => navigate('/app?view=investor_deal_flow')}>
                        <Zap size={16} />
                        Quick Invest
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Wallet}
                    label="Total Invested"
                    value="$2.45M"
                    trend="+12%"
                    trendUp={true}
                    color="indigo"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Portfolio Value"
                    value="$3.12M"
                    trend="+27.3%"
                    trendUp={true}
                    color="emerald"
                />
                <StatCard
                    icon={Briefcase}
                    label="Active Startups"
                    value="14"
                    subtext="2 Exits in 2024"
                    color="blue"
                />
                <StatCard
                    icon={ShieldCheck}
                    label="Investor Score"
                    value="94/100"
                    subtext="Top 5% of Angels"
                    color="amber"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Investment Inventory (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Portfolio Header */}
                    <div className="flex items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Investments</h2>
                            <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">{portfolio.length}</span>
                        </div>
                        <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                        </div>
                    </div>

                    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {portfolio.map((inv) => (
                            <div key={inv.id} className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
                                <div className={`flex ${viewMode === 'grid' ? 'flex-col items-start gap-4' : 'flex-col md:flex-row md:items-center gap-6'}`}>

                                    {/* Logo */}
                                    <div className={`relative ${viewMode === 'grid' ? 'w-14 h-14' : 'w-16 h-16'} rounded-xl bg-gradient-to-br ${inv.logoColor} flex items-center justify-center text-white font-bold ${viewMode === 'grid' ? 'text-xl' : 'text-2xl'} shadow-lg shadow-gray-200/50 shrink-0`}>
                                        {inv.name[0]}
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center ${inv.status === 'growing' ? 'bg-emerald-500' : inv.status === 'stable' ? 'bg-blue-500' : 'bg-rose-500'}`}>
                                            {inv.status === 'growing' ? <TrendingUp size={10} /> : inv.status === 'stable' ? <Activity size={10} /> : <AlertTriangle size={10} />}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-lg text-slate-900 truncate tracking-tight">{inv.name}</h3>
                                            {viewMode === 'grid' && (
                                                <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-medium text-[10px]">{inv.industry}</Badge>
                                            )}
                                        </div>
                                        {viewMode === 'list' && <p className="text-slate-500 text-sm font-medium mb-3">{inv.industry}</p>}

                                        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-y-3 gap-x-2 mt-2' : 'grid-cols-3 gap-8'}`}>
                                            <div>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Invested</span>
                                                <p className="font-mono font-semibold text-slate-700">${(inv.investedAmount / 1000).toFixed(0)}k</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Equity</span>
                                                <p className="font-mono font-semibold text-slate-700">{inv.equity}%</p>
                                            </div>
                                            <div className={`${viewMode === 'grid' ? 'col-span-2 border-t border-slate-50 pt-2 mt-1' : ''}`}>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ROI</span>
                                                <div className="flex items-center justify-between">
                                                    <p className={`font-mono font-bold ${inv.roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {inv.roi > 0 ? '+' : ''}{inv.roi}%
                                                    </p>
                                                    {viewMode === 'grid' && <span className="text-xs text-slate-300 font-medium">{inv.lastUpdate}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className={`${viewMode === 'grid' ? 'w-full mt-2 pt-4 border-t border-slate-50 flex gap-2' : 'md:border-l md:border-slate-100 md:pl-6 flex flex-col items-end justify-center min-w-[140px] gap-2'}`}>
                                        <Button
                                            variant="ghost"
                                            className={`${viewMode === 'grid' ? 'flex-1' : 'w-full justify-between'} text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 text-xs font-medium`}
                                            onClick={() => navigate('/app?view=investor_reports')}
                                        >
                                            View Reports
                                            {viewMode === 'list' && <ChevronRight size={14} />}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className={`${viewMode === 'grid' ? 'flex-1' : 'w-full'} text-xs bg-white border-slate-200 text-slate-700 hover:border-indigo-200 hover:text-indigo-600`}
                                            onClick={() => navigate('/app?view=investor_portfolio')}
                                        >
                                            Manage Asset
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button variant="ghost" className="text-slate-500 hover:text-indigo-600 gap-2">
                            View All Investments <ArrowRight size={16} />
                        </Button>
                    </div>

                </div>

                {/* Right Column: Opportunities & SWOT (1/3 width) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-2">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recommended</h2>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100">
                            <Filter size={14} className="text-slate-500" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {opportunities.map((opt) => (
                            <div key={opt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-indigo-100 hover:shadow-md transition-all duration-300">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.logoColor} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                                            {opt.name[0]}
                                        </div>
                                        <Badge variant="default" className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold shadow-none">
                                            {opt.matchScore}% Match
                                        </Badge>
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 mb-1 tracking-tight">{opt.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{opt.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-slate-50 rounded-xl">
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Ask</span>
                                            <div className="font-mono font-semibold text-slate-700">${(opt.askAmount / 1000).toFixed(0)}k</div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Equity</span>
                                            <div className="font-mono font-semibold text-slate-700">{opt.equityOffered}%</div>
                                        </div>
                                    </div>

                                    {/* Top SWOT Highlights */}
                                    <div className="space-y-2 mb-5">
                                        <div className="flex items-start gap-2.5">
                                            <div className="p-1 rounded-full bg-emerald-100 mt-0.5"><TrendingUp size={10} className="text-emerald-700" /></div>
                                            <p className="text-xs font-medium text-slate-600">{opt.swot.strengths[0]}</p>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <div className="p-1 rounded-full bg-amber-100 mt-0.5"><AlertTriangle size={10} className="text-amber-700" /></div>
                                            <p className="text-xs font-medium text-slate-600">{opt.swot.weaknesses[0]}</p>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium h-10 rounded-lg shadow-lg shadow-slate-900/10"
                                        onClick={() => navigate('/app?view=investor_deal_flow')}
                                    >
                                        Analyze Investment
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="p-1">
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/25">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Target size={100} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                                            <Briefcase size={16} />
                                        </div>
                                        <h3 className="font-bold text-lg">Deal Flow</h3>
                                    </div>
                                    <p className="text-indigo-100 text-sm mb-4 leading-relaxed opacity-90">
                                        AI has detected <span className="font-bold text-white">3 new startups</span> matching your 'SaaS' criteria.
                                    </p>
                                    <button
                                        onClick={() => navigate('/app?view=investor_deal_flow')}
                                        className="w-full py-2.5 px-4 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold rounded-xl text-sm transition-colors shadow-sm"
                                    >
                                        Review Deal Flow
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Utility Components for this view
function StatCard({ icon: Icon, label, value, trend, trendUp, color, subtext }: any) {
    const colorMap: Record<string, string> = {
        indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
        emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
        amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
        rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100',
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 group cursor-default">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl transition-colors duration-300 ${colorMap[color] || colorMap.indigo}`}>
                    <Icon size={22} />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend}
                        {trendUp ? <TrendingUp size={12} className="ml-1" /> : <Activity size={12} className="ml-1" />}
                    </div>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1 tracking-wide">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h4 className="text-3xl font-bold text-slate-900 font-display tracking-tight">{value}</h4>
                </div>
                {subtext && <p className="text-slate-400 text-xs mt-2 font-medium">{subtext}</p>}
            </div>
        </div>
    );
}
