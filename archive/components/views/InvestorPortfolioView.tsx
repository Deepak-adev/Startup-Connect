import React, { useState, useEffect } from 'react';
import { PieChart, ArrowUpRight, ArrowDownRight, MoreHorizontal, FileText, Globe, Mail, DollarSign, Plus, X, Download, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { Badge, Button } from '../ui';

// Mock Portfolio Data
const initialInvestments = [
    {
        id: "1",
        name: "EcoStream Green Technologies",
        industry: "GreenTech",
        initialInvest: 500000,
        currentVal: 650000,
        equity: 12,
        investDate: "Jan 12, 2024",
        status: "Performing",
        logoColor: "from-emerald-400 to-green-600",
        lastUpdate: "Q3 Report: Revenue up 20% YoY",
    },
    {
        id: "2",
        name: "MediPulse Systems",
        industry: "HealthTech",
        initialInvest: 1200000,
        currentVal: 1450000,
        equity: 22,
        investDate: "Nov 03, 2023",
        status: "Performing",
        logoColor: "from-blue-400 to-cyan-600",
        lastUpdate: "FDA Approval Pending for new device",
    },
    {
        id: "3",
        name: "CyberShield Security",
        industry: "Cybersecurity",
        initialInvest: 750000,
        currentVal: 730000,
        equity: 15,
        investDate: "Mar 15, 2024",
        status: "Underperforming",
        logoColor: "from-rose-400 to-red-600",
        lastUpdate: "Executive leadership change announced",
    },
    {
        id: "4",
        name: "FinFlow Analytics",
        industry: "FinTech",
        initialInvest: 300000,
        currentVal: 450000,
        equity: 5,
        investDate: "Jun 22, 2023",
        status: "Star",
        logoColor: "from-indigo-400 to-violet-600",
        lastUpdate: "Series B funding secured at $50M val",
    },
    {
        id: "5",
        name: "AutoMate AI",
        industry: "SaaS",
        initialInvest: 100000,
        currentVal: 120000,
        equity: 2.5,
        investDate: "Aug 10, 2024",
        status: "Stable",
        logoColor: "from-orange-400 to-amber-600",
        lastUpdate: "Product market fit validating",
    }
];

export default function InvestorPortfolioView() {
    const [portfolioData, setPortfolioData] = useState(initialInvestments);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newInv, setNewInv] = useState({ name: '', industry: '', amount: '', equity: '' });
    const [notification, setNotification] = useState<string | null>(null);

    // Notification timer
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleExport = () => {
        setNotification("Exporting portfolio to CSV...");
    };

    const handleAddInvestment = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem = {
            id: Date.now().toString(),
            name: newInv.name,
            industry: newInv.industry,
            initialInvest: Number(newInv.amount),
            currentVal: Number(newInv.amount), // Start at cost
            equity: Number(newInv.equity),
            investDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: "Performing",
            logoColor: "from-slate-400 to-slate-600",
            lastUpdate: "Investment Initialized"
        };
        setPortfolioData([...portfolioData, newItem]);
        setIsAddModalOpen(false);
        setNewInv({ name: '', industry: '', amount: '', equity: '' });
        setNotification(`Added ${newItem.name} to portfolio`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10 relative bg-slate-50/50 min-h-screen px-2">
            {/* Toast Notification */}
            {notification && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
                    <Download size={16} className="text-emerald-400" />
                    {notification}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Portfolio</h1>
                    <p className="text-slate-500 mt-1 text-lg">Detailed asset performance tracking.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExport} className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-xl h-10 shadow-sm">
                        <Download size={16} /> Export CSV
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 gap-2 rounded-xl h-10">
                        <Plus size={16} /> Add Investment
                    </Button>
                </div>
            </div>

            {/* Viz Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 flex flex-col shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 tracking-tight">Portfolio Growth</h3>
                            <p className="text-sm text-slate-500">Net Asset Value (NAV) over time</p>
                        </div>
                        <div className="flex bg-slate-50 p-1 rounded-lg">
                            {['1Y', 'YTD', '6M', '3M'].map((range, i) => (
                                <button key={range} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${i === 1 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{range}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-3 px-2 pb-2 h-64">
                        {[40, 45, 42, 55, 60, 58, 65, 75, 72, 85, 90, 95].map((h, i) => (
                            <div key={i} className="h-full w-full bg-indigo-50/50 hover:bg-indigo-100/80 transition-all duration-300 rounded-t-lg relative group overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}>

                                </div>
                                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-xl transition-opacity z-10">
                                    ${(h * 32000).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mt-4 border-t border-slate-50 pt-4">
                        <span>Jan 2024</span>
                        <span>Jun 2024</span>
                        <span>Dec 2024</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-rose-500"></div>
                    <h3 className="font-bold text-lg text-slate-900 mb-8 w-full text-left tracking-tight">Allocation</h3>

                    <div className="relative w-48 h-48 group cursor-default">
                        {/* CSS Donut Chart */}
                        <div className="absolute inset-0 rounded-full border-[24px] border-indigo-500 opacity-25 animate-pulse"></div>
                        <div className="w-full h-full rounded-full border-[24px] border-l-indigo-600 border-t-emerald-500 border-r-cyan-400 border-b-rose-400 rotate-45 transform transition-transform group-hover:scale-105 duration-500 shadow-xl"></div>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-4xl font-bold font-display text-slate-900 tracking-tighter">{portfolioData.length}</span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Assets</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full mt-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Tech</div>
                            <span className="text-xs font-bold text-slate-400">45%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Green</div>
                            <span className="text-xs font-bold text-slate-400">25%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Health</div>
                            <span className="text-xs font-bold text-slate-400">20%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Other</div>
                            <span className="text-xs font-bold text-slate-400">10%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight">Active Holdings</h3>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">Filter</Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">Sort</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 font-bold text-slate-400 uppercase text-[11px] tracking-wider">Startup</th>
                                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[11px] tracking-wider">Status</th>
                                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[11px] tracking-wider text-right">Invested</th>
                                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[11px] tracking-wider text-right">Current Value</th>
                                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[11px] tracking-wider text-right">Equity</th>
                                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[11px] tracking-wider">Updates</th>
                                <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[11px] tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {portfolioData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors group cursor-default">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.logoColor} flex items-center justify-center text-white font-bold shadow-sm text-sm`}>
                                                {item.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm tracking-tight">{item.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{item.industry}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant={item.status === 'Underperforming' ? 'danger' : item.status === 'Star' ? 'success' : 'default'} className="font-bold shadow-none ring-1 ring-inset px-2.5 py-0.5">
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-right font-mono font-medium text-slate-600">
                                        ${(item.initialInvest / 1000).toFixed(0)}k
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <span className="font-mono font-bold text-slate-900">${(item.currentVal / 1000).toFixed(0)}k</span>
                                            {item.currentVal > item.initialInvest ? (
                                                <div className="bg-emerald-50 text-emerald-600 rounded-full p-0.5"><ArrowUpRight size={12} strokeWidth={3} /></div>
                                            ) : (
                                                item.currentVal < item.initialInvest ? (
                                                    <div className="bg-rose-50 text-rose-600 rounded-full p-0.5"><ArrowDownRight size={12} strokeWidth={3} /></div>
                                                ) : (
                                                    <span className="text-slate-300"> - </span>
                                                )
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right font-mono font-medium text-slate-600">
                                        {item.equity}%
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 max-w-xs">
                                        <p className="truncate text-xs font-medium">{item.lastUpdate}</p>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                                                <FileText size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex justify-center">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 font-medium text-xs">View All Transactions</Button>
                </div>
            </div>

            {/* Add Investment Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add Investment</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-400 hover:text-slate-600" />
                            </button>
                        </div>

                        <form onSubmit={handleAddInvestment} className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Startup Name</label>
                                <input
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                                    placeholder="e.g. Acme AI"
                                    value={newInv.name}
                                    onChange={(e) => setNewInv({ ...newInv, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Industry</label>
                                <input
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                                    placeholder="e.g. SaaS"
                                    value={newInv.industry}
                                    onChange={(e) => setNewInv({ ...newInv, industry: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Invested ($)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                                        placeholder="50000"
                                        value={newInv.amount}
                                        onChange={(e) => setNewInv({ ...newInv, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Equity (%)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                                        placeholder="5"
                                        value={newInv.equity}
                                        onChange={(e) => setNewInv({ ...newInv, equity: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <Button type="button" variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 shadow-lg shadow-slate-900/10">Save Investment</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
