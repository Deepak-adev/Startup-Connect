import React, { useState, useEffect } from 'react';
import { Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, ArrowRight, Check, Loader2, Search, Filter } from 'lucide-react';
import { Button } from '../ui';

const initialReports = [
    {
        title: "Q4 2025 Portfolio Performance",
        type: "Quarterly Report",
        date: "Jan 05, 2026",
        size: "2.4 MB",
        color: "indigo"
    },
    {
        title: "Annual Tax Documents (K-1s)",
        type: "Tax Clearance",
        date: "Dec 31, 2025",
        size: "15.8 MB",
        color: "emerald"
    },
    {
        title: "Market Analysis: AI Sector 2025",
        type: "Research Note",
        date: "Nov 15, 2025",
        size: "4.1 MB",
        color: "blue"
    },
    {
        title: "Liquidity Event: FinFlow Series B",
        type: "Transaction Record",
        date: "Oct 22, 2025",
        size: "1.2 MB",
        color: "amber"
    }
];

export default function InvestorReportsView() {
    const [reports, setReports] = useState(initialReports);
    const [isGenerating, setIsGenerating] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('All');

    // Notification timer
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const newReport = {
                title: "Custom Analytical Report " + new Date().toLocaleDateString(),
                type: "Custom Analysis",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                size: "1.8 MB",
                color: "indigo"
            };
            setReports([newReport, ...reports]);
            setIsGenerating(false);
            setNotification("Report generated successfully");
        }, 2000);
    };

    const handleDownload = (title: string) => {
        setNotification(`Downloaded ${title}`);
    };

    const handleFilter = (category: string) => {
        setActiveFilter(category);
        if (category === "All") {
            setReports(initialReports);
        } else {
            if (category === 'Financial Statements') {
                setReports(initialReports.filter(r => r.type.includes('Report') || r.type.includes('Transaction')));
            } else if (category === 'Tax Documents') {
                setReports(initialReports.filter(r => r.type.includes('Tax')));
            } else if (category === 'Market Research') {
                setReports(initialReports.filter(r => r.type.includes('Research') || r.type.includes('Analysis')));
            } else {
                setReports(initialReports.filter((_, i) => i % 2 === 0));
            }
        }
    };

    const getColorClass = (color: string) => {
        const map: { [key: string]: string } = {
            indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
            emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
            blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
            amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
        };
        return map[color] || map['indigo'];
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto pb-10 relative px-2">
            {/* Toast Notification */}
            {notification && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
                    <Check size={16} className="text-emerald-400" />
                    {notification}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
                    <p className="text-slate-500 mt-1 text-lg">Financial statements, tax documents, and intelligence briefs.</p>
                </div>
                <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-lg shadow-slate-900/10 rounded-xl h-11 px-6 min-w-[200px]"
                >
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <BarChart3 size={18} />}
                    {isGenerating ? 'Generating...' : 'Generate New Report'}
                </Button>
            </div>

            {/* Featured Insight */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-indigo-500/25 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 group-hover:scale-110 transition-transform duration-700"></div>

                <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-6 ring-1 ring-white/30 text-indigo-50">
                            <TrendingUp size={14} /> KPI Insight
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">Portfolio Alpha +22%</h2>
                        <p className="text-indigo-100 mb-8 leading-relaxed text-lg max-w-md">
                            Your portfolio is outperforming the S&P 500 benchmark by a significant margin this quarter, driven largely by your GreenTech holdings.
                        </p>
                        <Button className="bg-white text-indigo-700 hover:bg-indigo-50 border-none rounded-xl h-11 px-6 font-semibold shadow-xl shadow-black/5">
                            Read Full Analysis <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                    <div className="hidden md:block relative h-full min-h-[200px]">
                        {/* Abstract Chart Graphic */}
                        <div className="absolute bottom-0 right-0 w-full max-w-sm h-48 flex items-end gap-3 opacity-90">
                            {[30, 45, 35, 60, 50, 75, 65, 90].map((h, i) => (
                                <div key={i} className="flex-1 bg-white/20 rounded-t-lg relative overflow-hidden backdrop-blur-sm group/bar hover:-translate-y-2 transition-transform duration-300">
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white/90 to-white/40" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reports List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 border-b-2 border-transparent hover:border-indigo-500 transition-colors pb-1 cursor-default">
                            <FileText className="text-slate-400" size={20} />
                            Recent Documents
                        </h3>
                        {activeFilter !== 'All' && (
                            <button onClick={() => handleFilter('All')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full animate-in fade-in">
                                Clear Filter: {activeFilter} <span className="ml-1 opacity-60">×</span>
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] divide-y divide-slate-50 overflow-hidden">
                        {/* Search Bar inside List */}
                        <div className="p-4 bg-slate-50/50 border-b border-slate-50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    className="w-full bg-white border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 shadow-sm placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {reports.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300"><FileText size={32} /></div>
                                <p className="font-medium">No documents found for this category.</p>
                            </div>
                        ) : (
                            reports.map((doc, idx) => (
                                <div key={idx} className="p-5 flex items-center gap-5 hover:bg-slate-50/80 transition-all group cursor-default">
                                    <div className={`w-12 h-12 rounded-2xl ${getColorClass(doc.color)} flex items-center justify-center shrink-0 shadow-sm transition-colors`}>
                                        <FileText size={22} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate tracking-tight text-[15px]">{doc.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{doc.type}</span>
                                            <span>•</span>
                                            <span>{doc.size}</span>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date Added</p>
                                        <p className="text-sm font-medium text-slate-700 flex items-center gap-1 justify-end">
                                            <Calendar size={14} className="text-slate-400" /> {doc.date}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 rounded-xl h-10 w-10 p-0"
                                        onClick={() => handleDownload(doc.title)}
                                    >
                                        <Download size={20} />
                                    </Button>
                                </div>
                            ))
                        )}
                        <div className="p-3 bg-slate-50/30 text-center">
                            <button className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors">View Archived Reports</button>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            <Filter className="text-slate-400" size={20} />
                            Filter by Type
                        </h3>
                    </div>

                    <div className="grid gap-3">
                        {['Financial Statements', 'Tax Documents', 'Legal Agreements', 'Investment Memos', 'Market Research'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleFilter(cat)}
                                className={`flex items-center justify-between p-4 border rounded-2xl transition-all text-left group relative overflow-hidden
                                    ${activeFilter === cat ? 'bg-slate-900 border-slate-900 shadow-md transform scale-[1.02]' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}
                                `}
                            >
                                <span className={`font-semibold z-10 transition-colors ${activeFilter === cat ? 'text-white' : 'text-slate-700'}`}>{cat}</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10
                                     ${activeFilter === cat ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}
                                `}>
                                    {activeFilter === cat ? <Check size={14} strokeWidth={3} /> : <ArrowRight size={14} />}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 text-center">
                        <h4 className="font-bold text-indigo-900 mb-2">Need a custom analysis?</h4>
                        <p className="text-sm text-indigo-700/80 mb-4 leading-snug">Our AI analyst can generate deep-dive reports on any sector or company in your portfolio.</p>
                        <Button variant="ghost" className="bg-white text-indigo-600 hover:text-indigo-700 w-full rounded-xl border border-indigo-200 shadow-sm" onClick={handleGenerateReport}>Ask Analyst AI</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
