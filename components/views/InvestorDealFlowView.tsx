import React, { useState, useEffect } from 'react';
import { Search, Filter, ThumbsUp, ThumbsDown, ArrowRight, Zap, Target, X, FileText, Users, DollarSign, Lock, Eye, Check, Download, Send } from 'lucide-react';
import { Badge, Button } from '../ui';

// Mock Data
const initialOpportunities = [
    {
        id: 's1',
        name: 'Nebula AI',
        industry: 'Artificial Intelligence',
        stage: 'Seed',
        askAmount: 2000000,
        equityOffered: 10,
        matchScore: 98,
        description: 'Generative AI platform specialized for enterprise workflow automation and legal document synthesis.',
        logoColor: 'from-violet-400 to-purple-600',
        tags: ['B2B', 'SaaS', 'High Growth'],
        traction: '$50k MRR',
        location: 'San Francisco, CA',
        documents: [
            { name: 'Pitch Deck', type: 'pptx', url: '/documents/Nebula_Pitch_Deck.pptx' },
            { name: 'Financial Model', type: 'xlsx', url: '#' },
            { name: 'IP Filings', type: 'pdf', url: '#' }
        ],
        team: [
            { name: "Dr. Sarah Yen", role: "CEO", ex: "Google DeepMind" },
            { name: "James Ford", role: "CTO", ex: "OpenAI" }
        ]
    },
    {
        id: 's2',
        name: 'AgriSense',
        industry: 'AgriTech',
        stage: 'Pre-Seed',
        askAmount: 450000,
        equityOffered: 15,
        matchScore: 85,
        description: 'IoT sensor network for precision farming, capable of reducing water usage by 40% in arid climates.',
        logoColor: 'from-lime-400 to-green-600',
        tags: ['Hardware', 'Climatetech', 'Impact'],
        traction: '3 Active Pilots',
        location: 'Austin, TX',
        documents: [
            { name: 'Technical Whitepaper', type: 'pdf', url: '#' },
            { name: 'Pilot Results Q3', type: 'pdf', url: '#' },
            { name: 'Pitch Deck', type: 'pptx', url: '/documents/AgriSense_Pitch_Deck.pptx' }
        ],
        team: [
            { name: "Marcus Chen", role: "CEO", ex: "John Deere" }
        ]
    },
    {
        id: 's3',
        name: 'MediFlow',
        industry: 'HealthTech',
        stage: 'Series A',
        askAmount: 5000000,
        equityOffered: 12,
        matchScore: 72,
        description: 'Streamlined patient intake and insurance verification API for mid-sized clinics.',
        logoColor: 'from-blue-400 to-cyan-600',
        tags: ['Healthcare', 'B2B', 'Regulated'],
        traction: '$1.2M ARR',
        location: 'Boston, MA',
        documents: [
            { name: 'Series A Deck', type: 'pdf', url: '#' },
            { name: 'Audit Report 2024', type: 'pdf', url: '#' }
        ],
        team: [
            { name: "Elena Rodriguez", role: "CEO", ex: "Epic Systems" }
        ]
    },
    {
        id: 's4',
        name: 'QuantumLeap',
        industry: 'DeepTech',
        stage: 'Seed',
        askAmount: 3000000,
        equityOffered: 20,
        matchScore: 65,
        description: 'Next-gen battery technology using solid-state electrolytes for EV market.',
        logoColor: 'from-orange-400 to-red-600',
        tags: ['Hardware', 'Energy', 'R&D Heavy'],
        traction: 'Prototype Validated',
        location: 'Denver, CO',
        documents: [
            { name: 'Battery Test Data', type: 'xlsx', url: '#' },
            { name: 'Patent Portfolio', type: 'pdf', url: '#' }
        ],
        team: [
            { name: "Dr. Alan Grant", role: "CSO", ex: "Tesla" }
        ]
    },
];

export default function InvestorDealFlowView() {
    const [deals, setDeals] = useState(initialOpportunities);
    const [watchedDeals, setWatchedDeals] = useState<Set<string>>(new Set());
    const [selectedDeal, setSelectedDeal] = useState<any>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [termSheetSent, setTermSheetSent] = useState(false);

    // Notification timer
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handlePass = (id: string, name: string) => {
        setDeals(deals.filter(d => d.id !== id));
        setNotification(`Passed on ${name}`);
    };

    const handleWatch = (id: string, name: string) => {
        const newWatched = new Set(watchedDeals);
        if (newWatched.has(id)) {
            newWatched.delete(id);
            setNotification(`Removed ${name} from Watchlist`);
        } else {
            newWatched.add(id);
            setNotification(`Added ${name} to Watchlist`);
        }
        setWatchedDeals(newWatched);
    };

    const handleViewDataRoom = (deal: any) => {
        setSelectedDeal(deal);
        setTermSheetSent(false); // Reset state when opening new deal
    };

    const handleDocumentAction = (doc: any) => {
        if (doc.url && doc.url !== '#') {
            setNotification(`Downloading ${doc.name}...`);
            // Trigger download
            const link = document.createElement('a');
            link.href = doc.url;
            link.download = `${doc.name}.${doc.type}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            setNotification(`Preview not available for ${doc.name}`);
        }
    };

    const handlePrepareTermSheet = () => {
        setTermSheetSent(true);
        setNotification("Term Sheet Generated & Sent to Partners");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">

            {/* Toast Notification */}
            {notification && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
                    <Zap size={16} className="text-yellow-400" />
                    {notification}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Deal Flow</h1>
                    <p className="text-slate-500 mt-1">Curated startup opportunities matching your thesis.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search deals..."
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter size={16} /> Filters
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-indigo-600">{deals.length}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase mt-1">Active Deals</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-emerald-600">{watchedDeals.size}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase mt-1">Watching</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-amber-600">8</span>
                    <span className="text-xs text-slate-500 font-medium uppercase mt-1">In Due Diligence</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-slate-700">92%</span>
                    <span className="text-xs text-slate-500 font-medium uppercase mt-1">Thesis Fit</span>
                </div>
            </div>

            {/* Main Feed */}
            {deals.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No new deals found</h3>
                    <p className="text-slate-500">You've reviewed all available opportunities.</p>
                    <Button onClick={() => setDeals(initialOpportunities)} className="mt-4" variant="outline">
                        Reset Demo
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {deals.map((deal) => (
                        <div key={deal.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                            {/* Card Header */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${deal.logoColor} flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-gray-200`}>
                                            {deal.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-900">{deal.name}</h3>
                                            <p className="text-sm text-slate-500 flex items-center gap-2">
                                                {deal.location} • {deal.industry}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="default" className={`
                                        ${deal.matchScore >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'} 
                                        text-sm px-3 py-1`}>
                                        {deal.matchScore}% Match
                                    </Badge>
                                </div>

                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {deal.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {deal.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium border border-indigo-100">
                                        {deal.stage}
                                    </span>
                                </div>

                                {/* Key Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 mb-6">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Ask Amount</p>
                                        <p className="font-mono font-bold text-slate-900">${(deal.askAmount / 1000000).toFixed(1)}M</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Traction</p>
                                        <p className="font-mono font-bold text-slate-900">{deal.traction}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Equity</p>
                                        <p className="font-mono font-bold text-slate-900">{deal.equityOffered}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Valuation</p>
                                        <p className="font-mono font-bold text-slate-900 font-mono text-slate-400">
                                            ${(deal.askAmount / (deal.equityOffered / 100) / 1000000).toFixed(1)}M
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={() => handlePass(deal.id, deal.name)}
                                        variant="outline"
                                        className="flex-1 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                                    >
                                        <ThumbsDown size={18} className="mr-2" />
                                        Pass
                                    </Button>
                                    <Button
                                        onClick={() => handleWatch(deal.id, deal.name)}
                                        variant="outline"
                                        className={`flex-1 border-slate-200 transition-colors ${watchedDeals.has(deal.id) ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200'}`}
                                    >
                                        <Eye size={18} className="mr-2" />
                                        {watchedDeals.has(deal.id) ? 'Watching' : 'Watch'}
                                    </Button>
                                    <Button
                                        onClick={() => handleViewDataRoom(deal)}
                                        className="flex-[2] bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white shadow-lg shadow-indigo-500/20"
                                    >
                                        View Data Room <ArrowRight size={16} className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Simulated Data Room Modal */}
            {selectedDeal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedDeal(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedDeal.logoColor} flex items-center justify-center text-white font-bold text-xl`}>
                                    {selectedDeal.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        {selectedDeal.name} <Badge variant="default">Data Room</Badge>
                                    </h2>
                                    <p className="text-sm text-slate-500">Confidential Information • NDA Active</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedDeal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Column: Overview */}
                                <div className="md:col-span-2 space-y-8">
                                    <section>
                                        <h3 className="font-display font-bold text-lg text-slate-900 mb-3">Investment Highlights</h3>
                                        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-indigo-900 text-sm leading-relaxed">
                                            {selectedDeal.description}
                                            <br /><br />
                                            Key differentiator: Proprietary technology with {selectedDeal.documents.length} verified IP filings.
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="font-display font-bold text-lg text-slate-900 mb-3">Team Structure</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedDeal.team.map((member: any, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                                        {member.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-900">{member.name}</p>
                                                        <p className="text-xs text-slate-500">{member.role} • Ex-{member.ex}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="font-display font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                                            <Lock size={16} className="text-amber-500" /> Key Documents
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedDeal.documents.map((doc: any, i: number) => (
                                                <div
                                                    key={i}
                                                    onClick={() => handleDocumentAction(doc)}
                                                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileText size={18} className="text-slate-400 group-hover:text-indigo-500" />
                                                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{doc.name}.{doc.type}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-indigo-600 opacity-0 group-hover:opacity-100 gap-1">
                                                        <Download size={14} /> Download
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Ask */}
                                <div className="space-y-6">
                                    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl">
                                        <h3 className="font-bold text-lg mb-1">Make an Offer</h3>
                                        <p className="text-slate-400 text-sm mb-6">Terms valid until Jan 30</p>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm text-slate-400">Valuation Cap</span>
                                                <span className="font-mono font-bold">${(selectedDeal.askAmount / (selectedDeal.equityOffered / 100) / 1000000).toFixed(1)}M</span>
                                            </div>
                                            <div className="w-full bg-white/10 h-px" />
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm text-slate-400">Minimum Check</span>
                                                <span className="font-mono font-bold">$50k</span>
                                            </div>
                                        </div>

                                        {termSheetSent ? (
                                            <div className="w-full bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3 text-center text-emerald-300 text-sm font-bold flex items-center justify-center gap-2">
                                                <Check size={16} /> Term Sheet Sent
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={handlePrepareTermSheet}
                                                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 border-none transition-all shadow-lg shadow-indigo-500/30"
                                            >
                                                Prepare Term Sheet
                                            </Button>
                                        )}
                                    </div>

                                    <div className="border border-slate-200 rounded-xl p-4">
                                        <h4 className="font-bold text-slate-900 text-sm mb-3">Verification</h4>
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> IP Verified</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Legal Due Diligence</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> KYC Complete</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
