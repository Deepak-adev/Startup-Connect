import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, BarChart, Bar } from 'recharts';
import { Download, Bot, TrendingUp, AlertTriangle, Shield, Zap, Target, ArrowUpRight } from 'lucide-react';
import { Card, Button, Badge } from '../ui';

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
        <div className="h-full overflow-y-auto px-2 pb-10 space-y-8 bg-slate-50/50 min-h-screen">

            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 transition-all">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Market Analysis</h1>
                        <p className="text-slate-500 mt-1 text-lg">Deep dive into <span className="text-slate-900 font-semibold">{companyName}'s</span> position in the {industry} market.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="default" className="text-sm py-1.5 px-3 bg-white border border-slate-200 text-slate-700 shadow-sm rounded-lg">
                            {industry}
                        </Badge>
                        <Button variant="outline" size="sm" className="gap-2 h-9 px-4 rounded-xl bg-white border-slate-200 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Report</span>
                        </Button>
                    </div>
                </div>

                {/* AI Insight Card */}
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-[0_2px_15px_-4px_rgba(99,102,241,0.1)] rounded-3xl p-8 hover:-translate-y-0.5 transition-transform duration-300">
                    <div className="flex gap-5">
                        <div className="bg-indigo-600 p-4 rounded-2xl h-fit shadow-lg shadow-indigo-500/30 flex-shrink-0">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2 text-lg flex items-center gap-2">
                                AGUI Executive Summary
                                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px] px-2 py-0.5">GENERATED</Badge>
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-base">
                                Based on your input, <strong>{companyName}</strong> is positioned to disrupt the {industry} sector.
                                {description}
                                Our analysis suggests a highly favorable entry point given current market volatility and the "fragmentation" problem you identified.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Probability of Profit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden group shadow-md shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
                        <Target size={120} className="text-indigo-900" />
                    </div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Success Probability</h3>
                    <div className="flex items-end gap-3 text-emerald-600">
                        <span className="text-6xl font-display font-bold tracking-tighter">87%</span>
                        <span className="mb-3 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">+12% vs avg</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-4 font-medium leading-normal relative z-10 max-w-[80%]">High probability based on market fit and competitive landscape.</p>
                    <div className="w-full bg-slate-100 h-3 mt-6 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[87%] shadow-sm" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Threat of New Entrants</h3>
                    <div className="flex items-center gap-5 mt-2">
                        <div className="h-20 w-20 rounded-2xl border-2 border-amber-100 flex items-center justify-center bg-amber-50 text-amber-600 shrink-0">
                            <span className="font-bold text-xl">Med</span>
                        </div>
                        <div>
                            <p className="text-slate-900 font-bold text-lg">Moderate Barrier</p>
                            <p className="text-slate-500 text-sm mt-1 leading-snug">Specialized tech required reduces easy entry.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Market Volatility</h3>
                    <div className="h-32 mt-4 -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketGrowthData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip cursor={false} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#1e293b', fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Market Insight Engine Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Market Insight Engine</h2>
                    <Badge variant="warning" className="animate-pulse bg-amber-100 text-amber-700 border-amber-200 shadow-sm">Beta Feature</Badge>
                </div>

                <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/30 to-white shadow-sm rounded-3xl p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <TrendingUp className="text-indigo-600" size={20} /> Competitive Landscape
                            </h3>
                            <p className="text-slate-500 text-sm mb-8 font-medium">Benchmarking your startup against industry averages and the current market leader.</p>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={competitorData} layout="vertical" barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" stroke="#94a3b8" hide />
                                        <YAxis dataKey="name" type="category" width={100} stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Legend iconType="circle" />
                                        <Bar dataKey="you" name="Your Startup" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
                                        <Bar dataKey="avg" name="Industry Avg" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={16} />
                                        <Bar dataKey="leader" name="Market Leader" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={16} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <ArrowUpRight className="text-emerald-500" size={20} /> Market Growth Trends
                            </h3>
                            <p className="text-slate-500 text-sm mb-8 font-medium">Real-time vector analysis of sector expansion.</p>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={marketGrowthData}>
                                        <defs>
                                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="year" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} tick={{ fontWeight: 600, fontSize: 12 }} />
                                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontWeight: 600, fontSize: 12 }} />
                                        <Tooltip cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#splitColor)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* SWOT & Market */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* SWOT Radar */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-full">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Internal Capabilities</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={swotData}>
                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#e2e8f0" />
                                <Radar name="My Company" dataKey="A" stroke="#ec4899" strokeWidth={3} fill="#ec4899" fillOpacity={0.5} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed SWOT Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 hover:bg-emerald-50 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <Zap size={18} fill="currentColor" />
                            </div>
                            <h4 className="text-emerald-800 font-bold uppercase tracking-wider text-sm">Strengths</h4>
                        </div>
                        <ul className="space-y-3 text-slate-700 text-sm list-none font-medium">
                            <li className="flex gap-2"><span className="text-emerald-500 font-bold">•</span> Proprietary AI algorithm (99% acc)</li>
                            <li className="flex gap-2"><span className="text-emerald-500 font-bold">•</span> Strong founding team (Ex-Google)</li>
                            <li className="flex gap-2"><span className="text-emerald-500 font-bold">•</span> Low CAC</li>
                        </ul>
                    </div>

                    <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6 hover:bg-rose-50 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                                <AlertTriangle size={18} />
                            </div>
                            <h4 className="text-rose-800 font-bold uppercase tracking-wider text-sm">Weaknesses</h4>
                        </div>
                        <ul className="space-y-3 text-slate-700 text-sm list-none font-medium">
                            <li className="flex gap-2"><span className="text-rose-500 font-bold">•</span> Limited runway (6 months)</li>
                            <li className="flex gap-2"><span className="text-rose-500 font-bold">•</span> Single API dependency</li>
                        </ul>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 hover:bg-blue-50 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <TrendingUp size={18} />
                            </div>
                            <h4 className="text-blue-800 font-bold uppercase tracking-wider text-sm">Opportunities</h4>
                        </div>
                        <ul className="space-y-3 text-slate-700 text-sm list-none font-medium">
                            <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Enterprise market expansion</li>
                            <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Cloud provider partnerships</li>
                        </ul>
                    </div>

                    <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 hover:bg-amber-50 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                <Shield size={18} />
                            </div>
                            <h4 className="text-amber-800 font-bold uppercase tracking-wider text-sm">Threats</h4>
                        </div>
                        <ul className="space-y-3 text-slate-700 text-sm list-none font-medium">
                            <li className="flex gap-2"><span className="text-amber-500 font-bold">•</span> Rapid AI regulation changes</li>
                            <li className="flex gap-2"><span className="text-amber-500 font-bold">•</span> Competitor X Q3 Launch</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}
