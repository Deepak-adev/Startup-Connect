import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp,
    DollarSign,
    Activity,
    Target,
    PieChart,
    Download,
    RefreshCw,
    Info,
    ArrowUpRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Card, Button, Badge } from '../ui';

// Mock industry multipliers (Revenue Multiples)
const INDUSTRY_MULTIPLIERS = {
    'SaaS': 12.5,
    'Fintech': 9.2,
    'E-commerce': 4.5,
    'HealthTech': 8.8,
    'Marketplace': 6.5,
    'AI/ML': 15.0,
    'Hardware': 3.2,
    'EdTech': 5.5
};

export default function ValuationView() {
    const [revenue, setRevenue] = useState(500000);
    const [growth, setGrowth] = useState(25);
    const [margin, setMargin] = useState(15);
    const [industry, setIndustry] = useState<keyof typeof INDUSTRY_MULTIPLIERS>('SaaS');
    const [isCalculating, setIsCalculating] = useState(false);

    // Fancy number formatting
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const formatCompact = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);

    // Valuation Calculation Logic
    const valuation = useMemo(() => {
        // Base multiplier
        let baseMultiplier = INDUSTRY_MULTIPLIERS[industry];

        // Adjust for High Growth (> 50% gets premium)
        let growthFactor = 1 + (growth / 100);
        if (growth > 50) growthFactor *= 1.2;

        // Adjust for Profitability (Rule of 40ish)
        // If growth + margin > 40, add premium
        const ruleOf40 = growth + margin;
        let profitFactor = 1;
        if (ruleOf40 > 40) profitFactor = 1.15;
        else if (ruleOf40 < 0) profitFactor = 0.8;

        const rawValuation = revenue * baseMultiplier * growthFactor * profitFactor;

        // Ranges
        return {
            base: rawValuation,
            conservative: rawValuation * 0.8,
            aggressive: rawValuation * 1.3
        };
    }, [revenue, growth, margin, industry]);

    // Chart Data
    const chartData = [
        { name: 'Conservative', value: valuation.conservative, color: '#94a3b8' },
        { name: 'Base Case', value: valuation.base, color: '#6366f1' },
        { name: 'Aggressive', value: valuation.aggressive, color: '#10b981' },
    ];

    const handleRecalculate = () => {
        setIsCalculating(true);
        setTimeout(() => setIsCalculating(false), 800);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 bg-slate-50/50 min-h-screen px-2">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Startup Valuation</h1>
                    <p className="text-slate-500 mt-1 text-lg">Estimate your company's value using real-time industry multiples.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 bg-white border-slate-200 text-slate-700 h-11 px-5 rounded-xl hover:text-indigo-600 hover:border-indigo-200 hover:bg-white shadow-sm transition-all">
                        <Download size={16} /> Export Report
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-11 px-6 rounded-xl shadow-lg shadow-indigo-500/20 font-bold transition-all hover:-translate-y-0.5"
                        onClick={handleRecalculate}
                        disabled={isCalculating}
                    >
                        <RefreshCw size={16} className={isCalculating ? "animate-spin" : ""} />
                        {isCalculating ? 'Calculating...' : 'Recalculate Model'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Panel: Inputs */}
                <Card className="p-8 space-y-8 h-full bg-white border-slate-200 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] rounded-3xl">
                    <div className="flex items-center gap-3 text-indigo-600 font-bold text-lg mb-2">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <Activity size={20} />
                        </div>
                        <h2>Key Metrics</h2>
                    </div>

                    {/* Industry */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Industry Sector</label>
                        <div className="grid grid-cols-2 gap-3">
                            {(Object.keys(INDUSTRY_MULTIPLIERS) as Array<keyof typeof INDUSTRY_MULTIPLIERS>).map((ind) => (
                                <button
                                    key={ind}
                                    onClick={() => setIndustry(ind)}
                                    className={`px-4 py-3 text-sm rounded-xl border transition-all font-medium ${industry === ind
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10 scale-[1.02]'
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {ind}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 mt-2">
                            <span className="text-xs font-medium text-slate-500">Industry Multiplier</span>
                            <span className="text-indigo-600 font-bold bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">{INDUSTRY_MULTIPLIERS[industry]}x</span>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700">Annual Revenue (ARR)</label>
                            <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg text-sm border border-indigo-100">{formatCurrency(revenue)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5000000"
                            step="50000"
                            value={revenue}
                            onChange={(e) => setRevenue(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>

                    {/* Growth Rate */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700">YoY Growth Rate</label>
                            <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg text-sm border border-emerald-100">+{growth}%</span>
                        </div>
                        <input
                            type="range"
                            min="-20"
                            max="200"
                            step="1"
                            value={growth}
                            onChange={(e) => setGrowth(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    {/* Margin */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700">EBITDA Margin</label>
                            <span className={`font-mono font-bold px-3 py-1.5 rounded-lg text-sm border ${margin >= 0 ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>{margin}%</span>
                        </div>
                        <input
                            type="range"
                            min="-50"
                            max="50"
                            step="1"
                            value={margin}
                            onChange={(e) => setMargin(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                            <Info size={16} className="text-slate-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                This valuation model uses a composite of Revenue Multiples adjusted for growth velocity and profitability (Rule of 40).
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Right Panel: Results */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Main Valuation Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 text-white shadow-2xl shadow-indigo-500/25 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-colors duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 opacity-80 mb-4 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                                <Target size={14} />
                                <span className="text-xs font-bold tracking-wide uppercase">Estimated Post-Money Valuation</span>
                            </div>
                            <div className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight">
                                {formatCompact(valuation.base)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <div className="text-xs text-indigo-200 font-bold uppercase tracking-wider mb-1">Conservative Estimate</div>
                                    <div className="text-xl font-bold">{formatCompact(valuation.conservative)}</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                    <div className="text-xs text-white/80 font-bold uppercase tracking-wider mb-1">Aggressive Estimate</div>
                                    <div className="text-xl font-bold flex items-center gap-2">
                                        {formatCompact(valuation.aggressive)}
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts & Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-6 border-slate-200 shadow-sm rounded-3xl bg-white">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                                <TrendingUp size={20} className="text-indigo-600" />
                                Valuation Sensitivity
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            hide={true}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px', fontWeight: 'bold' }}
                                            formatter={(value: any) => [formatCompact(value), 'Valuation']}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[8, 8, 0, 0]}
                                            animationDuration={1500}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-6 border-slate-200 shadow-sm rounded-3xl bg-white">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                                <PieChart size={20} className="text-sky-500" />
                                Value Drivers
                            </h3>
                            <div className="space-y-6 mt-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2 font-bold">
                                        <span className="text-slate-500">Base Revenue</span>
                                        <span className="text-slate-900">+45% Impact</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[45%] shadow-sm rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2 font-bold">
                                        <span className="text-slate-500">Industry Premium</span>
                                        <span className="text-slate-900">+{Math.min(INDUSTRY_MULTIPLIERS[industry] * 2, 35).toFixed(0)}% Impact</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${Math.min(INDUSTRY_MULTIPLIERS[industry] * 2, 35)}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2 font-bold">
                                        <span className="text-slate-500">Growth Velocity</span>
                                        <span className="text-slate-900">+{Math.min(growth, 100)}% Impact</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(growth, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-sm text-center text-slate-500 font-medium">
                                    Your <span className="font-bold text-emerald-600">growth rate</span> is the strongest driver relative to your peers.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
