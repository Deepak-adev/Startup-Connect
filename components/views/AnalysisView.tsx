import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, BarChart, Bar } from 'recharts';
import { Download, Bot, TrendingUp, AlertTriangle, Shield, Zap, Target } from 'lucide-react';
import { Card, Button, Badge, cn } from '../ui';

// Mock Data
const marketGrowthData = [
    { year: '2024', value: 20 },
    { year: '2025', value: 35 },
    { year: '2026', value: 55 },
    { year: '2027', value: 85 },
    { year: '2028', value: 120 },
];

const swotData = [
    { subject: 'Cost Efficiency', A: 120, fullMark: 150 },
    { subject: 'Innovation', A: 98, fullMark: 150 },
    { subject: 'Brand', A: 86, fullMark: 150 },
    { subject: 'Market Share', A: 99, fullMark: 150 },
    { subject: 'Team', A: 85, fullMark: 150 },
    { subject: 'Tech', A: 65, fullMark: 150 },
];

const competitorData = [
    { name: 'Market Share', you: 15, avg: 10, leader: 45 },
    { name: 'Growth Rate', you: 120, avg: 15, leader: 8 },
    { name: 'NPS Score', you: 72, avg: 40, leader: 65 },
    { name: 'Tech Debt', you: 10, avg: 50, leader: 80 },
];

export default function AnalysisView() {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('startupProfile');
        if (saved) {
            try {
                setProfile(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        }
    }, []);

    const companyName = profile?.name || "Your Startup";
    const industry = profile?.industry || "Tech";
    const description = profile?.description || "Market analysis for your improved business model.";

    return (
        <div className="h-full overflow-y-auto p-6 space-y-8">

            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900">Market Analysis</h1>
                        <p className="text-slate-500">Deep dive into {companyName}'s position in the {industry} market.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-sm py-1 px-3 bg-white border-slate-200">
                            {industry}
                        </Badge>
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Report</span>
                        </Button>
                    </div>
                </div>

                {/* AI Insight Card */}
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                    <div className="flex gap-4">
                        <div className="bg-indigo-100 p-3 rounded-lg h-fit">
                            <Bot className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">AGUI Executive Summary</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Based on your input, <strong>{companyName}</strong> is positioned to disrupt the {industry} sector.
                                {description}
                                Our analysis suggests a highly favorable entry point given current market volatility and the "fragmentation" problem you identified.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Probability of Profit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target size={100} className="text-indigo-900" />
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Success Probability</h3>
                    <div className="flex items-end gap-2 text-emerald-600">
                        <span className="text-5xl font-mono font-bold">87%</span>
                        <span className="mb-2 text-sm font-medium">+12% vs avg</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-4">Based on market fit and competitive landscape.</p>
                    <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[87%]" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Threat of New Entrants</h3>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="h-20 w-20 rounded-full border-4 border-amber-500/30 flex items-center justify-center bg-amber-50">
                            <span className="text-amber-600 font-bold text-xl">Med</span>
                        </div>
                        <div>
                            <p className="text-slate-900 font-medium">Moderate Barrier</p>
                            <p className="text-slate-500 text-xs mt-1">Specialized tech required reduces easy entry.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Market Volatility</h3>
                    <div className="h-32 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketGrowthData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{ background: '#fff', borderColor: '#e2e8f0', color: '#1e293b' }} itemStyle={{ color: '#1e293b' }} />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>



            {/* Market Insight Engine Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-display font-bold text-slate-900">Market Insight Engine</h2>
                    <Badge variant="warning" className="animate-pulse">Beta Feature</Badge>
                </div>

                <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Competitive Landscape</h3>
                            <p className="text-slate-500 text-sm mb-6">Benchmarking your startup against industry averages and the current market leader.</p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={competitorData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                        <XAxis type="number" stroke="#64748b" hide />
                                        <YAxis dataKey="name" type="category" width={100} stroke="#64748b" tick={{ fontSize: 12 }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Legend />
                                        <Bar dataKey="you" name="Your Startup" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                                        <Bar dataKey="avg" name="Industry Avg" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={20} />
                                        <Bar dataKey="leader" name="Market Leader" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Market Growth Trends</h3>
                            <p className="text-slate-500 text-sm mb-6">Real-time vector analysis of sector expansion.</p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={marketGrowthData}>
                                        <defs>
                                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis dataKey="year" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#splitColor)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* SWOT & Market */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* SWOT Radar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Internal Capabilities</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={swotData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#e2e8f0" />
                                <Radar name="My Company" dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ background: '#fff', borderColor: '#e2e8f0', color: '#1e293b' }} itemStyle={{ color: '#1e293b' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed SWOT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="text-emerald-600" size={20} />
                        <h4 className="text-emerald-700 font-bold uppercase tracking-wider">Strengths</h4>
                    </div>
                    <ul className="space-y-2 text-slate-700 text-sm list-disc pl-4 marker:text-emerald-500">
                        <li>Proprietary AI algorithm with 99% accuracy</li>
                        <li>Strong founding team with Ex-Google lead</li>
                        <li>Low customer acquisition cost</li>
                    </ul>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="text-rose-600" size={20} />
                        <h4 className="text-rose-700 font-bold uppercase tracking-wider">Weaknesses</h4>
                    </div>
                    <ul className="space-y-2 text-slate-700 text-sm list-disc pl-4 marker:text-rose-500">
                        <li>Limited runway (6 months)</li>
                        <li>Dependent on single API provider</li>
                    </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-blue-600" size={20} />
                        <h4 className="text-blue-700 font-bold uppercase tracking-wider">Opportunities</h4>
                    </div>
                    <ul className="space-y-2 text-slate-700 text-sm list-disc pl-4 marker:text-blue-500">
                        <li>Expansion into Enterprise market</li>
                        <li>Partnership potential with major cloud providers</li>
                    </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="text-orange-600" size={20} />
                        <h4 className="text-orange-700 font-bold uppercase tracking-wider">Threats</h4>
                    </div>
                    <ul className="space-y-2 text-slate-700 text-sm list-disc pl-4 marker:text-orange-500">
                        <li>Rapid AI regulation changes</li>
                        <li>Competitor X launching similar feature in Q3</li>
                    </ul>
                </div>
            </div>

        </div>
    );
}
