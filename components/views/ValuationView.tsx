import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp,
    DollarSign,
    Activity,
    Target,
    PieChart,
    Download,
    RefreshCw,
    Info
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
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Startup Valuation</h1>
                    <p className="text-slate-500 mt-1">Estimate your company's value using industry-standard multiples.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download size={16} /> Export Report
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                        onClick={handleRecalculate}
                        disabled={isCalculating}
                    >
                        <RefreshCw size={16} className={isCalculating ? "animate-spin" : ""} />
                        {isCalculating ? 'Updating...' : 'Recalculate'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Panel: Inputs */}
                <Card className="p-6 space-y-8 h-full bg-white border-slate-200">
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
                        <Activity size={20} />
                        <h2>Key Metrics</h2>
                    </div>

                    {/* Industry */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">Industry Sector</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(INDUSTRY_MULTIPLIERS) as Array<keyof typeof INDUSTRY_MULTIPLIERS>).map((ind) => (
                                <button
                                    key={ind}
                                    onClick={() => setIndustry(ind)}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${industry === ind
                                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-medium'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {ind}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400">Current Multiplier: <span className="text-indigo-600 font-bold">{INDUSTRY_MULTIPLIERS[industry]}x</span></p>
                    </div>

                    {/* Revenue */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-700">Annual Revenue (ARR)</label>
                            <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded text-sm">{formatCurrency(revenue)}</span>
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
                            <label className="text-sm font-medium text-slate-700">YoY Growth Rate</label>
                            <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-sm">{growth}%</span>
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
                            <label className="text-sm font-medium text-slate-700">EBITDA Margin</label>
                            <span className={`font-mono font-bold px-2 py-1 rounded text-sm ${margin >= 0 ? 'text-blue-600 bg-blue-50' : 'text-red-500 bg-red-50'}`}>{margin}%</span>
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

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Info size={14} /> Methodology
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            This valuation model uses a composite of Revenue Multiples adjusted for growth velocity and profitability (Rule of 40). It provides a preliminary estimate for {industry} startups at Seed to Series A stages.
                        </p>
                    </div>
                </Card>

                {/* Right Panel: Results */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main Valuation Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 opacity-80 mb-2">
                                <Target size={18} />
                                <span className="text-sm font-medium tracking-wide uppercase">Estimated Post-Money Valuation</span>
                            </div>
                            <div className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">
                                {formatCompact(valuation.base)}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm opacity-90">
                                <div className="px-3 py-1 rounded-full bg-white/20 border border-white/10">
                                    Range: {formatCompact(valuation.conservative)} - {formatCompact(valuation.aggressive)}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 font-medium">
                                    {growth > 30 ? 'High Growth Status' : 'Steady Growth'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts & Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <TrendingUp size={18} className="text-indigo-600" />
                                Valuation Sensitivity
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748B', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            hide={true}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value: any) => [formatCompact(value), 'Valuation']}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[6, 6, 0, 0]}
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

                        <Card className="p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <PieChart size={18} className="text-pink-500" />
                                Value Drivers
                            </h3>
                            <div className="space-y-4 mt-8">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Base Revenue</span>
                                        <span className="font-bold text-slate-900">+45%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[45%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Industry Premium ({industry})</span>
                                        <span className="font-bold text-slate-900">+{Math.min(INDUSTRY_MULTIPLIERS[industry] * 2, 35).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500" style={{ width: `${Math.min(INDUSTRY_MULTIPLIERS[industry] * 2, 35)}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Growth Velocity</span>
                                        <span className="font-bold text-slate-900">+{Math.min(growth, 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(growth, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-4 border-t border-slate-100">
                                <p className="text-sm text-center text-slate-500">
                                    Your <span className="font-semibold text-emerald-600">growth rate</span> is the strongest driver of your current valuation.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
