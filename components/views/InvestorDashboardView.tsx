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
    ChevronRight
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
    const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'opportunities'>('overview');
    const navigate = useNavigate();

    // Mock Data
    const portfolio: Investment[] = [
        { id: '1', name: 'EcoStream', industry: 'GreenTech', investedAmount: 500000, equity: 12, roi: 15.4, status: 'growing', logoColor: 'from-emerald-400 to-green-600' },
        { id: '2', name: 'MediPulse', industry: 'HealthTech', investedAmount: 1200000, equity: 22, roi: 8.2, status: 'stable', logoColor: 'from-blue-400 to-cyan-600' },
        { id: '3', name: 'CyberShield', industry: 'Cybersecurity', investedAmount: 750000, equity: 15, roi: -2.1, status: 'struggling', logoColor: 'from-rose-400 to-red-600' },
    ];

    const opportunities: StartupOpportunity[] = [
        {
            id: 's1',
            name: 'Nebula AI',
            industry: 'Artificial Intelligence',
            askAmount: 2000000,
            equityOffered: 10,
            matchScore: 98,
            description: 'Generative AI platform for enterprise workflow automation.',
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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Investor Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back, Mr. Venture. Your portfolio is performing well.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => navigate('/app?view=investor_deal_flow')}>
                        <Search size={16} />
                        Find Startups
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-500/20" onClick={() => navigate('/app?view=investor_deal_flow')}>
                        <Zap size={16} />
                        Quick Invest
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    subtext="2 Exits"
                    color="blue"
                />
                <StatCard
                    icon={ShieldCheck}
                    label="Investor Strength"
                    value="94/100"
                    subtext="High Influence"
                    color="amber"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Investment Inventory (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Portfolio Section */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Investment Inventory</h2>
                        <button
                            onClick={() => navigate('/app?view=investor_portfolio')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                            View All <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {portfolio.map((inv) => (
                            <div key={inv.id} className="group relative bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center gap-6">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${inv.logoColor} flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-gray-200`}>
                                    {inv.name[0]}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-slate-900 truncate">{inv.name}</h3>
                                        <Badge variant={inv.status === 'growing' ? 'success' : inv.status === 'stable' ? 'default' : 'warning'}>
                                            {inv.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-slate-500 text-sm">{inv.industry}</p>

                                    <div className="flex items-center gap-6 mt-3">
                                        <div>
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Invested</span>
                                            <p className="font-mono font-medium text-slate-700">${(inv.investedAmount / 1000).toFixed(0)}k</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Equity</span>
                                            <p className="font-mono font-medium text-slate-700">{inv.equity}%</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">ROI</span>
                                            <p className={`font-mono font-medium ${inv.roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {inv.roi > 0 ? '+' : ''}{inv.roi}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:border-l md:border-slate-100 md:pl-6 flex flex-col items-end justify-center min-w-[120px]">
                                    <Button
                                        variant="ghost"
                                        className="text-slate-500 hover:text-indigo-600 w-full justify-end px-0"
                                        onClick={() => navigate('/app?view=investor_reports')}
                                    >
                                        View Reports
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full text-xs mt-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                                        onClick={() => navigate('/app?view=investor_portfolio')}
                                    >
                                        Manage
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right Column: Opportunities & SWOT (1/3 width) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
                    </div>

                    <div className="space-y-4">
                        {opportunities.map((opt) => (
                            <div key={opt.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-indigo-200 transition-colors">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${opt.logoColor} flex items-center justify-center text-white font-bold text-lg`}>
                                            {opt.name[0]}
                                        </div>
                                        <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                                            {opt.matchScore}% Match
                                        </Badge>
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 mb-1">{opt.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{opt.description}</p>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Ask</span>
                                            <span className="font-mono font-medium">${(opt.askAmount / 1000).toFixed(0)}k</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Equity</span>
                                            <span className="font-mono font-medium">{opt.equityOffered}%</span>
                                        </div>
                                    </div>

                                    {/* Top SWOT Highlights */}
                                    <div className="bg-slate-50 rounded-lg p-3 space-y-2 mb-4">
                                        <div className="flex items-start gap-2">
                                            <TrendingUp size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                            <p className="text-xs text-slate-600 leading-tight">{opt.swot.strengths[0]}</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                            <p className="text-xs text-slate-600 leading-tight">{opt.swot.weaknesses[0]}</p>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm py-2 h-auto"
                                        onClick={() => navigate('/app?view=investor_deal_flow')}
                                    >
                                        Analyze Investment
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/25">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="text-indigo-200" size={20} />
                                <h3 className="font-bold">Deal Flow</h3>
                            </div>
                            <p className="text-indigo-100 text-sm mb-3">
                                AI has detected 3 new startups matching your 'SaaS' criteria this week.
                            </p>
                            <button
                                onClick={() => navigate('/app?view=investor_deal_flow')}
                                className="text-xs font-bold bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg w-full text-center"
                            >
                                Review Deal Flow
                            </button>
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
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${colorMap[color] || colorMap.indigo}`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {trend}
                        {trendUp ? <TrendingUp size={12} className="ml-1" /> : <Activity size={12} className="ml-1" />}
                    </div>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
                <h4 className="text-2xl font-bold text-slate-900 font-display">{value}</h4>
                {subtext && <p className="text-slate-400 text-xs mt-1">{subtext}</p>}
            </div>
        </div>
    );
}
