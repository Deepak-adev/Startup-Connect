import React, { useState, useEffect } from 'react';
import { PieChart, ArrowUpRight, ArrowDownRight, MoreHorizontal, FileText, Globe, Mail, DollarSign, Plus, X, Download } from 'lucide-react';
import { Badge, Button } from '../ui';

// Mock Portfolio Data
const initialInvestments = [
    {
        id: "1",
        name: "EcoStream",
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
        name: "MediPulse",
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
        name: "CyberShield",
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
        name: "FinFlow",
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
        name: "AutoMate",
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
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 relative">
            {/* Toast Notification */}
            {notification && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
                    <Download size={16} className="text-emerald-400" />
                    {notification}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Portfolio</h1>
                    <p className="text-slate-500 mt-1">Track performance, valuation, and updates across your holdings.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport} className="gap-2">
                        <Download size={16} /> Export CSV
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 gap-2">
                        <Plus size={16} /> Add Investment
                    </Button>
                </div>
            </div>

            {/* Viz Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-64 lg:h-80">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Portfolio Growth</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
                        {[40, 45, 42, 55, 60, 58, 65, 75, 72, 85, 90, 95].map((h, i) => (
                            <div key={i} className="h-full w-full bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-t-sm relative group">
                                <div className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}>
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                                        ${(h * 32000).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                        <span>Jan</span><span>Dec</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4">Allocation</h3>
                    <div className="flex-1 flex items-center justify-center relative">
                        {/* CSS Donut Chart */}
                        <div className="w-40 h-40 rounded-full border-[16px] border-l-indigo-500 border-t-emerald-500 border-r-cyan-400 border-b-rose-400 rotate-45 transform transition-transform hover:scale-105 duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold font-display text-slate-800">{portfolioData.length}</span>
                            <span className="text-xs text-slate-400 font-medium uppercase">Companies</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-4">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Tech</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Green</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400" /> Health</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-400" /> Other</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Startup</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Stage/Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Invested</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Current Value</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Equity</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Last Update</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {portfolioData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.logoColor} flex items-center justify-center text-white font-bold shadow-sm`}>
                                                {item.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.industry}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={item.status === 'Underperforming' ? 'danger' : item.status === 'Star' ? 'success' : 'default'} className="bg-opacity-10 opacity-90">
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-600">
                                        ${(item.initialInvest / 1000).toFixed(0)}k
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <span className="font-mono font-medium text-slate-900">${(item.currentVal / 1000).toFixed(0)}k</span>
                                            {item.currentVal > item.initialInvest ? (
                                                <ArrowUpRight size={14} className="text-emerald-500" />
                                            ) : (
                                                item.currentVal < item.initialInvest ? (
                                                    <ArrowDownRight size={14} className="text-rose-500" />
                                                ) : (
                                                    <span className="text-slate-400"> - </span>
                                                )
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-600">
                                        {item.equity}%
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                                        {item.lastUpdate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                                                <FileText size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Investment Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Add New Investment</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleAddInvestment} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1">Startup Name</label>
                                <input
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="e.g. Acme AI"
                                    value={newInv.name}
                                    onChange={(e) => setNewInv({ ...newInv, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1">Industry</label>
                                <input
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="e.g. SaaS"
                                    value={newInv.industry}
                                    onChange={(e) => setNewInv({ ...newInv, industry: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Invested ($)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder="50000"
                                        value={newInv.amount}
                                        onChange={(e) => setNewInv({ ...newInv, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Equity (%)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder="5"
                                        value={newInv.equity}
                                        onChange={(e) => setNewInv({ ...newInv, equity: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="flex-1 bg-slate-900 text-white">Save Investment</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
