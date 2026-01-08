import React, { useState, useEffect } from 'react';
import { Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, ArrowRight, Check, Loader2 } from 'lucide-react';
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
        // In a real app, you'd filter the list here. For now, we'll just update the active state for visual feedback
        // and simulate a "loading" or "filtering" effect if needed, but for simplicity I'll keep the list static
        // or maybe shuffle slightly? Let's keep it simple.
        if (category === "All") {
            setReports(initialReports);
        } else {
            // Mock filtering logic for demo purposes
            // Since our mock data types don't exactly match the categories perfectly one-to-one in a predictable way for a robust demo without adding metadata, 
            // I'll just reset to all or show a subset for effect if 'Financial Statements' is picked.
            // Actually, let's just use the `type` field for loose matching or just show all but highlight the filter.
            // Better: filtering by the type field loosely.

            // This is a bithacky for the demo since the categories list is 'Financial Statements', 'Tax Documents', etc.
            // and types are 'Quarterly Report', 'Tax Clearance', etc.
            // Let's just keep 'All' as the way to see everything and clicking others just shows a subset or empty state for "demo" effect nicely.
            // Or simpler: Just filter by text match if possible, else show all. 
            // Let's implement real filtering based on the mock types.

            if (category === 'Financial Statements') {
                setReports(initialReports.filter(r => r.type.includes('Report') || r.type.includes('Transaction')));
            } else if (category === 'Tax Documents') {
                setReports(initialReports.filter(r => r.type.includes('Tax')));
            } else if (category === 'Market Research') {
                setReports(initialReports.filter(r => r.type.includes('Research') || r.type.includes('Analysis')));
            } else {
                // For others, show random subset or empty to imply no docs in that category yet
                setReports(initialReports.filter((_, i) => i % 2 === 0));
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10 relative">
            {/* Toast Notification */}
            {notification && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
                    <Check size={16} className="text-emerald-400" />
                    {notification}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Reports & Analytics</h1>
                    <p className="text-slate-500 mt-1">Generated 
                    , tax documents, and performance summaries.</p>
                </div>
                <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white gap-2 shadow-lg shadow-indigo-500/25 border-none"
                >
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <BarChart3 size={18} />}
                    {isGenerating ? 'Generating...' : 'Generate Custom Report'}
                </Button>
            </div>

            {/* Featured Insight */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider mb-4">
                            <TrendingUp size={12} /> New Insight
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Portfolio Alpha +22%</h2>
                        <p className="text-indigo-100 mb-6 leading-relaxed">
                            Your portfolio is outperforming the S&P 500 benchmark by a significant margin this quarter, driven largely by your GreenTech holdings.
                        </p>
                        <Button className="bg-white text-indigo-700 hover:bg-indigo-50 border-none">
                            Read Full Analysis <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                    <div className="hidden md:flex justify-end">
                        {/* Abstract Chart Graphic */}
                        <div className="w-48 h-32 flex items-end gap-2">
                            {[30, 45, 35, 60, 50, 75, 65, 90].map((h, i) => (
                                <div key={i} className="flex-1 bg-white/30 rounded-t-sm relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 w-full bg-white" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Reports List */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <FileText className="text-slate-400" size={20} />
                            Recent Documents
                        </h3>
                        {activeFilter !== 'All' && (
                            <button onClick={() => handleFilter('All')} className="text-xs text-indigo-600 hover:underline">
                                Clear Filter ({activeFilter})
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                        {reports.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No documents found for this category.
                            </div>
                        ) : (
                            reports.map((doc, idx) => (
                                <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                                    <div className={`w-12 h-12 rounded-lg bg-${doc.color}-50 text-${doc.color}-600 flex items-center justify-center shrink-0`}>
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{doc.title}</h4>
                                        <p className="text-sm text-slate-500">{doc.type} • {doc.size}</p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm text-slate-500 flex items-center gap-1 justify-end">
                                            <Calendar size={14} /> {doc.date}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="text-slate-400 hover:text-indigo-600"
                                        onClick={() => handleDownload(doc.title)}
                                    >
                                        <Download size={20} />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <PieChart className="text-slate-400" size={20} />
                        Categories
                    </h3>
                    <div className="grid gap-3">
                        {['Financial Statements', 'Tax Documents', 'Legal Agreements', 'Investment Memos', 'Market Research'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleFilter(cat)}
                                className={`flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all text-left group
                                    ${activeFilter === cat ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-300'}
                                `}
                            >
                                <span className={`font-medium group-hover:text-indigo-700 ${activeFilter === cat ? 'text-indigo-800' : 'text-slate-700'}`}>{cat}</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                     ${activeFilter === cat ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600'}
                                `}>
                                    <ArrowRight size={14} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
