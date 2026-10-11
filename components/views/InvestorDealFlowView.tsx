import React, { useState, useEffect } from 'react';
import { Search, Filter, ThumbsUp, ThumbsDown, ArrowRight, Zap, Target, X, FileText, Users, DollarSign, Lock, Eye, Check, Download, Send, Briefcase, MapPin } from 'lucide-react';
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
    {
        id: 's5',
        name: 'VaultPay',
        industry: 'FinTech',
        stage: 'Series A',
        askAmount: 4000000,
        equityOffered: 15,
        matchScore: 88,
        description: 'Decentralized cross-border payment infrastructure for emerging markets.',
        logoColor: 'from-blue-600 to-indigo-600',
        tags: ['B2B', 'Payments', 'Blockchain'],
        traction: '$150B Processed',
        location: 'New York, NY',
        documents: [
            { name: 'Financials 2024', type: 'xlsx', url: '#' },
            { name: 'Regulatory Approvals', type: 'pdf', url: '#' }
        ],
        team: [
            { name: "Michael Chang", role: "CEO", ex: "Visa" },
            { name: "Sarah Miller", role: "COO", ex: "Stripe" }
        ]
    },
    {
        id: 's6',
        name: 'CellCure',
        industry: 'Biotech',
        stage: 'Seed',
        askAmount: 2500000,
        equityOffered: 18,
        matchScore: 78,
        description: 'CRISPR-based gene editing therapy for rare genetic disorders.',
        logoColor: 'from-emerald-400 to-teal-600',
        tags: ['Healthcare', 'Therapeutics', 'High IP'],
        traction: 'Pre-clinical',
        location: 'Cambridge, MA',
        documents: [
            { name: 'Clinical Data', type: 'pdf', url: '#' },
            { name: 'IP Portfolio', type: 'pdf', url: '#' }
        ],
        team: [
            { name: "Dr. Emily Chen", role: "CSO", ex: "Broad Institute" }
        ]
    },
    {
        id: 's7',
        name: 'AutoBotics',
        industry: 'Robotics',
        stage: 'Series A',
        askAmount: 6000000,
        equityOffered: 12,
        matchScore: 70,
        description: 'AI-powered autonomous mobile robots for warehouse logistics and fulfillment.',
        logoColor: 'from-slate-600 to-slate-900',
        tags: ['Hardware', 'Logistics', 'Automation'],
        traction: '10 Warehouses Live',
        location: 'Pittsburgh, PA',
        documents: [
            { name: 'Pilot Case Study', type: 'pdf', url: '#' },
            { name: 'Technical Specs', type: 'pdf', url: '#' }
        ],
        team: [
            { name: "David Ross", role: "CTO", ex: "Boston Dynamics" }
        ]
    },
    {
        id: 's8',
        name: 'SocialSphere',
        industry: 'Consumer',
        stage: 'Seed',
        askAmount: 1500000,
        equityOffered: 10,
        matchScore: 62,
        description: 'Next-gen social commerce platform connecting creators directly with brands.',
        logoColor: 'from-pink-500 to-rose-500',
        tags: ['Social', 'Marketplace', 'Mobile'],
        traction: '50k DAU',
        location: 'Los Angeles, CA',
        documents: [
            { name: 'Growth Metrics', type: 'xlsx', url: '#' },
            { name: 'Pitch Deck', type: 'pptx', url: '#' }
        ],
        team: [
            { name: "Jessica Lee", role: "CEO", ex: "TikTok" }
        ]
    }
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
        setNotification(`Downloading ${doc.name}...`);

        // 0. CHECK FOR REAL FILE URL (e.g. from public directory)
        if (doc.url && doc.url !== '#') {
            const link = document.createElement('a');
            link.href = doc.url;
            link.download = `${doc.name}.${doc.type}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        let content = '';
        const timestamp = new Date().toISOString().split('T')[0];

        // 1. RICH EXCEL/CSV DATA
        if (doc.type === 'xlsx' || doc.type === 'csv') {
            content = `Metric,2023 (Actual),2024 (Projected),2025 (Projected),2026 (Projected),YoY Growth
Revenue,"$1,200,000","$3,500,000","$8,200,000","$15,000,000",145%
Cost of Goods Sold,"$240,000","$650,000","$1,400,000","$2,500,000",
Gross Profit,"$960,000","$2,850,000","$6,800,000","$12,500,000",
Gross Margin,80%,81%,83%,83%,
,,,,,
Operating Expenses,,,,,
R&D,"$400,000","$900,000","$1,500,000","$2,200,000",
Sales & Marketing,"$300,000","$800,000","$2,000,000","$4,000,000",
G&A,"$150,000","$300,000","$600,000","$900,000",
Total OpEx,"$850,000","$2,000,000","$4,100,000","$7,100,000",
,,,,,
EBITDA,"$110,000","$850,000","$2,700,000","$5,400,000",
Net Income,"$85,000","$680,000","$2,100,000","$4,200,000",
,,,,,
Key Metrics,,,,,
CAC,$450,$420,$380,$350,-10%
LTV,$5,000,$5,500,$6,200,$7,000,
Burn Rate,$80k/mo,$120k/mo (Invest),N/A,N/A,
Customers,240,700,1640,3000,190%`;

            // 2. RICH PRESENATION/DECK
        } else if (doc.type === 'pptx' || doc.name.toLowerCase().includes('deck')) {
            content = `CONFIDENTIAL PITCH DECK - ${selectedDeal?.name.toUpperCase()}
Generated on: ${timestamp}

[SLIDE 1: Title Slide]
- Company: ${selectedDeal?.name}
- Tagline: ${selectedDeal?.description}
- Presenter: ${selectedDeal?.team[0]?.name}

[SLIDE 2: The Problem]
- Current workflow is manual, slow, and error-prone.
- Industry loses $40B annually due to these inefficiencies.
- Existing legacy solutions are clunky and expensive (on-premise).

[SLIDE 3: The Solution]
- AI-first approach to automation.
- Reduces processing time by 90%.
- Seamless API integration with existing ERPs.

[SLIDE 4: Market Opportunity]
- TAM: $120B Global Market (Growing 12% CAGR)
- SAM: $54B Serviceable Market
- SOM: $2.5B (Targeting Mid-Market first)

[SLIDE 5: Product Deep Dive]
- Proprietary Engine: "Nexus-7" (Patent Pending)
- Features: Auto-reconciliation, Natural Language Querying, Real-time dashboards.
- Technical Moat: Data feedback loop improves accuracy with every user.

[SLIDE 6: Business Model]
- B2B SaaS Subscription (Tiered: Pro, Enterprise, Custom).
- Average Contract Value (ACV): $45k/year.
- 95% Gross Revenue Retention.

[SLIDE 7: Traction & Milestones]
- ${selectedDeal?.traction} achieved.
- 5 Fortune 500 Pilots active.
- Featured in TechCrunch, Forbes AI 50.

[SLIDE 8: Go-To-Market]
- Direct Sales force for Enterprise.
- Content Marketing & PLG for Mid-market.
- Channel Partnerships with Consultants (Deloitte, Accenture).

[SLIDE 9: Competition]
- Legacy: SAP, Oracle (Slow, expensive).
- Startups: Competitor X, Competitor Y (Lack our data depth).
- Our Edge: User Experience + Speed of deployment (Days vs Months).

[SLIDE 10: The Ask]
- Raising: $${(selectedDeal?.askAmount / 1000000).toFixed(1)}M at $${(selectedDeal?.askAmount / (selectedDeal?.equityOffered / 100) / 1000000).toFixed(1)}M Valuation.
- Use of Funds: 40% Engineering, 40% Sales/Growt, 20% Ops.
- Runway: 18-24 Months to Series B.
`;

            // 3. RICH TEXT/PDF DOCUMENT
        } else {
            content = `CONFIDENTIAL MEMORANDUM
SUBJECT: ${doc.name.toUpperCase()}
DATE: ${timestamp}
COMPANY: ${selectedDeal?.name}
STATUS: PRIVILEGED & CONFIDENTIAL

1. EXECUTIVE SUMMARY
This document outlines the core aspects of ${doc.name} for ${selectedDeal?.name}. The company has demonstrated significant progress in ${selectedDeal?.industry} with a verified traction of ${selectedDeal?.traction}.

2. TECHNICAL SPECIFICATIONS & IP
The core technology relies on a distributed architecture designed for scalability.
- Patent Ref #US-2024-8892: "Method for distributed consensus in low-latency environments."
- Tech Stack: Rust, Python, React, AWS Lambda.
- Security: SOC2 Type II Compliant, AES-256 Encryption at rest.

3. LEGAL & REGULATORY
- Incorporation: Delaware C-Corp.
- IP Assignment: All founders have signed full IP assignment agreements.
- Trademarks: Brand name and Logo filed in USPTO (Class 42).
- Litigation: No pending or threatened litigation.

4. OPERATIONAL VIEW
The team consists of ${selectedDeal?.team.length} key executives led by ${selectedDeal?.team[0]?.name}.
- Headcount: 15 Full-time employees.
- Locations: ${selectedDeal?.location} (HQ), Remote distributed engineering.

5. RISK FACTORS
- Market adoption speed in conservative sectors.
- Regulatory changes in AI compliance (EU AI Act).
- Competition from Big Tech incumbents.

[End of Document - Internal Use Only]`;
        }

        const blob = new Blob([content], { type: doc.type === 'xlsx' ? 'text/csv' : 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Force .csv extension for excel files so they open natively in Excel/Numbers
        // Force .txt for others so they open in browser/notepad easily for demo
        const extension = doc.type === 'xlsx' ? 'csv' : 'txt';
        link.download = `${doc.name.replace(/\.[^/.]+$/, "")}_Mock.${extension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handlePrepareTermSheet = () => {
        // Generate Term Sheet Mock
        const termSheetContent = `
TERM SHEET - ${selectedDeal?.name.toUpperCase()}

INVESTOR: Your Fund (Lead Investor)
COMPANY: ${selectedDeal?.name}
DATE: ${new Date().toLocaleDateString()}

1. INVESTMENT AMOUNT: $${selectedDeal?.askAmount.toLocaleString()}
2. VALUATION CAP: $${(selectedDeal?.askAmount / (selectedDeal?.equityOffered / 100)).toLocaleString()}
3. INSTRUMENT: SAFE (Simple Agreement for Future Equity)
4. BOARD SEATS: 1 Observer Seat

[This is a non-binding generated mock term sheet for demo purposes]
        `;

        const blob = new Blob([termSheetContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Term_Sheet_${selectedDeal?.name.replace(/ /g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTermSheetSent(true);
        setNotification("Term Sheet Generated & Sent to Partners");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10 relative bg-slate-50/50 min-h-screen px-2">

            {/* Toast Notification */}
            {notification && (
                <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
                    <Zap size={16} className="text-yellow-400" />
                    {notification}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Deal Flow</h1>
                    <p className="text-slate-500 mt-1 text-lg">Curated AI-screened startup opportunities.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search deals..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 w-64 shadow-sm"
                        />
                    </div>
                    <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 h-auto rounded-xl shadow-sm">
                        <Filter size={16} /> Filters
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Deals', value: deals.length, color: 'text-indigo-600', ring: 'ring-indigo-50' },
                    { label: 'Watching', value: watchedDeals.size, color: 'text-emerald-600', ring: 'ring-emerald-50' },
                    { label: 'In Due Diligence', value: '8', color: 'text-amber-600', ring: 'ring-amber-50' },
                    { label: 'Thesis Fit', value: '92%', color: 'text-slate-700', ring: 'ring-slate-50' }
                ].map((stat, i) => (
                    <div key={i} className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center text-center hover:shadow-md transition-all duration-300 ring-1 ${stat.ring}`}>
                        <span className={`text-3xl font-bold font-display tracking-tight ${stat.color}`}>{stat.value}</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Main Feed */}
            {deals.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No new deals found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">You've reviewed all currently available opportunities matching your criteria. Check back later.</p>
                    <Button onClick={() => setDeals(initialOpportunities)} className="bg-slate-900 text-white rounded-xl px-6">
                        Reset Demo Data
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {deals.map((deal) => (
                        <div key={deal.id} className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-indigo-100 transition-all duration-300 group flex flex-col justify-between">
                            {/* Card Header */}
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${deal.logoColor} flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-gray-200/50`}>
                                            {deal.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-900 tracking-tight">{deal.name}</h3>
                                            <div className="flex items-center gap-3 mt-1.5 text-sm font-medium text-slate-500">
                                                <span className="flex items-center gap-1.5"><MapPin size={14} />{deal.location}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                <span className="flex items-center gap-1.5"><Briefcase size={14} />{deal.industry}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="default" className={`
                                        ${deal.matchScore >= 90 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100'} 
                                        font-bold shadow-none px-3 py-1.5 rounded-lg`}>
                                        {deal.matchScore}% Match
                                    </Badge>
                                </div>

                                <p className="text-slate-600 mb-8 leading-relaxed font-normal">
                                    {deal.description}
                                </p>

                                <div className="flex flex-wrap gap-2.5 mb-8">
                                    {deal.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold ring-1 ring-slate-100">
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100 shadow-sm">
                                        {deal.stage}
                                    </span>
                                </div>

                                {/* Key Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4 bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Ask</p>
                                        <p className="font-mono font-bold text-slate-900 text-lg">${(deal.askAmount / 1000000).toFixed(1)}M</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Traction</p>
                                        <p className="font-mono font-bold text-slate-900 text-lg">{deal.traction}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Equity</p>
                                        <p className="font-mono font-bold text-slate-900 text-lg">{deal.equityOffered}%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Valuation</p>
                                        <p className="font-mono font-bold text-slate-900 text-lg font-mono text-slate-400">
                                            ${(deal.askAmount / (deal.equityOffered / 100) / 1000000).toFixed(1)}M
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex gap-3">
                                <Button
                                    onClick={() => handlePass(deal.id, deal.name)}
                                    variant="outline"
                                    className="flex-1 border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all rounded-xl h-11"
                                >
                                    <ThumbsDown size={18} className="mr-2" />
                                    Pass
                                </Button>
                                <Button
                                    onClick={() => handleWatch(deal.id, deal.name)}
                                    variant="outline"
                                    className={`flex-1 border-slate-200 bg-white transition-all rounded-xl h-11 ${watchedDeals.has(deal.id) ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-inner' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200'}`}
                                >
                                    <Eye size={18} className="mr-2" />
                                    {watchedDeals.has(deal.id) ? 'Watching' : 'Watch'}
                                </Button>
                                <Button
                                    onClick={() => handleViewDataRoom(deal)}
                                    className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all"
                                >
                                    View Data Room <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Simulated Data Room Modal */}
            {selectedDeal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedDeal(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ring-1 ring-slate-200">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedDeal.logoColor} flex items-center justify-center text-white font-bold text-2xl shadow-md`}>
                                    {selectedDeal.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                                        {selectedDeal.name}
                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200">Data Room</span>
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium mt-1">Confidential Information • NDA Active</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedDeal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Column: Overview */}
                                <div className="md:col-span-2 space-y-10">
                                    <section>
                                        <h3 className="font-display font-bold text-lg text-slate-900 mb-4 tracking-tight">Investment Highlights</h3>
                                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-slate-600 leading-relaxed text-[15px]">
                                            <p>{selectedDeal.description}</p>
                                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-start gap-3">
                                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                                    <Zap size={18} />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 block mb-1">Key Differentiator</span>
                                                    Proprietary technology with {selectedDeal.documents.length} verified IP filings and defensible moat.
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="font-display font-bold text-lg text-slate-900 mb-4 tracking-tight">Team Structure</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedDeal.team.map((member: any, i: number) => (
                                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                        {member.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{member.name}</p>
                                                        <p className="text-xs font-semibold text-indigo-600 mt-0.5">{member.role}</p>
                                                        <p className="text-xs text-slate-500">Ex-{member.ex}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="font-display font-bold text-lg text-slate-900 mb-4 flex items-center gap-2 tracking-tight">
                                            <Lock size={18} className="text-amber-500" /> Due Diligence Documents
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedDeal.documents.map((doc: any, i: number) => (
                                                <div
                                                    key={i}
                                                    onClick={() => handleDocumentAction(doc)}
                                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                                            <FileText size={20} />
                                                        </div>
                                                        <span className="font-semibold text-slate-700 group-hover:text-slate-900">{doc.name}.{doc.type}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-emerald-600 opacity-0 group-hover:opacity-100 gap-1 bg-emerald-50 font-medium hover:bg-emerald-100">
                                                        <Download size={14} /> Download
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Ask */}
                                <div className="space-y-6">
                                    <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h3 className="font-bold text-xl mb-1">Make an Offer</h3>
                                            <p className="text-slate-400 text-sm mb-8">Terms valid until Jan 30</p>

                                            <div className="space-y-5 mb-8">
                                                <div className="flex justify-between items-end pb-3 border-b border-white/10">
                                                    <span className="text-sm text-slate-400 font-medium">Valuation Cap</span>
                                                    <span className="font-mono font-bold text-lg">${(selectedDeal.askAmount / (selectedDeal.equityOffered / 100) / 1000000).toFixed(1)}M</span>
                                                </div>
                                                <div className="flex justify-between items-end pb-3 border-b border-white/10">
                                                    <span className="text-sm text-slate-400 font-medium">Minimum Check</span>
                                                    <span className="font-mono font-bold text-lg">$50k</span>
                                                </div>
                                            </div>

                                            {termSheetSent ? (
                                                <div className="w-full bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 text-center text-emerald-300 font-bold flex items-center justify-center gap-2 animate-in fade-in">
                                                    <Check size={18} /> Term Sheet Sent
                                                </div>
                                            ) : (
                                                <Button
                                                    onClick={handlePrepareTermSheet}
                                                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 border-0"
                                                >
                                                    Prepare Term Sheet
                                                </Button>
                                            )}
                                        </div>
                                        {/* Decorative blobs */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 blur-[80px] opacity-20 rounded-full pointer-events-none"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500 blur-[80px] opacity-20 rounded-full pointer-events-none"></div>
                                    </div>

                                    <div className="border border-slate-200 bg-white rounded-2xl p-6 shadow-sm">
                                        <h4 className="font-bold text-slate-900 text-sm mb-4 uppercase tracking-wider">Verification Status</h4>
                                        <ul className="space-y-4">
                                            <li className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">IP Ownership Verified</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">Legal Due Diligence</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">KYC Complete</span>
                                            </li>
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
