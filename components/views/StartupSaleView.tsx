import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Badge, Button } from '../ui';
import {
  DollarSign,
  TrendingUp,
  Filter,
  Plus,
  Search,
  ArrowUpDown,
  Eye,
  Calendar,
  Briefcase,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Lock,
  MessageCircle,
  Clock
} from 'lucide-react';
import { StartupIdea } from '../../types';
import IdeaSubmissionForm from '../IdeaSubmissionForm';
import { IdeaStorageService } from '../../services/ideaStorage';

// Mock listings for demo in case storage is empty
const DEMO_LISTINGS: StartupIdea[] = [
  {
    id: '1',
    title: 'SaaS User Onboarding Tool',
    description: 'A fully functional React-based onboarding wizard creator with 50+ templates. Includes Stripe integration and active user base of 120.',
    industry: 'SaaS',
    founderName: 'Alex River',
    status: 'active',
    listedDate: '2025-12-15T12:00:00Z',
    views: 342,
    saleTerms: {
      askingPrice: 45000,
      equity: 100,
      includesIP: true,
      includesCodebase: true,
      supportDurationMonths: 3
    },
    financialBreakdown: {
      revenue: 2500,
      costs: 400,
      founderProfit: 2100
    }
  },
  {
    id: '2',
    title: 'Eco-Friendly Packaging Marketplace',
    description: 'Two-sided marketplace connecting sustainable packaging suppliers with e-commerce brands. MVP verified with 3 suppliers.',
    industry: 'E-commerce',
    founderName: 'Green Innovations LLC',
    status: 'active',
    listedDate: '2026-01-02T09:30:00Z',
    views: 128,
    saleTerms: {
      askingPrice: 15000,
      equity: 100,
      includesIP: true,
      includesCodebase: true,
      supportDurationMonths: 1
    },
    financialBreakdown: {
      revenue: 0,
      costs: 150,
      founderProfit: -150
    }
  },
  {
    id: '3',
    title: 'AI Legal Document Summarizer',
    description: 'Python/FastAPI backend with NLP model tuned for legal contracts. Web interface included.',
    industry: 'LegalTech',
    founderName: 'Sarah Chen',
    status: 'pending',
    listedDate: '2025-11-20T14:45:00Z',
    views: 890,
    saleTerms: {
      askingPrice: 85000,
      equity: 100,
      includesIP: true,
      includesCodebase: true,
      supportDurationMonths: 6
    },
    financialBreakdown: {
      revenue: 5000,
      costs: 800,
      founderProfit: 4200
    }
  }
];

type SortOption = 'newest' | 'price_low' | 'price_high' | 'views' | 'profit';
type StatusFilter = 'all' | 'active' | 'pending' | 'sold';

export default function StartupSaleView() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [ideas, setIdeas] = useState<StartupIdea[]>(DEMO_LISTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load ideas
  useEffect(() => {
    const loadIdeas = () => {
      try {
        IdeaStorageService.initializeStorage();
        const loaded = IdeaStorageService.loadIdeas();
        if (loaded.length > 0) {
          setIdeas([...DEMO_LISTINGS, ...loaded]);
        }
      } catch (error) {
        console.error('Failed to load ideas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadIdeas();
  }, []);

  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = ideas.filter(idea => {
      if (statusFilter !== 'all' && idea.status !== statusFilter) return false;
      if (idea.saleTerms.askingPrice < priceRange.min || idea.saleTerms.askingPrice > priceRange.max) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          idea.title.toLowerCase().includes(query) ||
          idea.description.toLowerCase().includes(query) ||
          idea.industry.toLowerCase().includes(query) ||
          idea.founderName.toLowerCase().includes(query)
        );
      }
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
        case 'price_low': return a.saleTerms.askingPrice - b.saleTerms.askingPrice;
        case 'price_high': return b.saleTerms.askingPrice - a.saleTerms.askingPrice;
        case 'views': return (b.views || 0) - (a.views || 0);
        case 'profit': return (b.financialBreakdown.founderProfit || 0) - (a.financialBreakdown.founderProfit || 0);
        default: return 0;
      }
    });
  }, [ideas, searchQuery, sortBy, statusFilter, priceRange]);

  const stats = useMemo(() => {
    const total = ideas.length;
    const active = ideas.filter(i => i.status === 'active').length;
    const sold = ideas.filter(i => i.status === 'sold').length;
    const totalValue = ideas.reduce((sum, i) => sum + i.saleTerms.askingPrice, 0);
    return { total, active, sold, totalValue };
  }, [ideas]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${amount}`;
  };

  if (showSubmissionForm) {
    return (
      <div className="animate-in fade-in duration-500 bg-white min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600" onClick={() => setShowSubmissionForm(false)}>
            ← Back to Marketplace
          </Button>
          <IdeaSubmissionForm
            onSubmit={(newIdea) => {
              const updatedIdeas = IdeaStorageService.addIdea(newIdea);
              setIdeas([...DEMO_LISTINGS, ...updatedIdeas]);
              setShowSubmissionForm(false);
            }}
            onCancel={() => setShowSubmissionForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 relative bg-slate-50/50 min-h-screen px-2">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Acquisition Marketplace</h1>
          <p className="text-slate-500 mt-1 text-lg">Buy and sell validated startup assets securely.</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-6 rounded-xl shadow-lg shadow-slate-900/20 gap-2 font-bold" onClick={() => setShowSubmissionForm(true)}>
          <Plus size={18} /> List Your Asset
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Listings', value: stats.total, icon: Briefcase, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Active Deals', value: stats.active, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Sold YTD', value: stats.sold, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Market Value', value: formatCurrency(stats.totalValue), icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-slate-900">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold">
              <Filter size={18} /> Filters
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Search</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700"
                >
                  <option value="all">All Listings</option>
                  <option value="active">Active</option>
                  <option value="pending">Under Offer</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Price Range</label>
                <input
                  type="range"
                  min="0" max="100000" step="5000"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 mb-2"
                />
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{formatCurrency(priceRange.min)}</span>
                  <span>{formatCurrency(priceRange.max)}+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-500 font-medium">Found {filteredAndSortedIdeas.length} listing{filteredAndSortedIdeas.length !== 1 && 's'}</p>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer hover:text-indigo-600"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredAndSortedIdeas.map(idea => (
              <div key={idea.id} className="bg-white rounded-3xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.1)] hover:border-indigo-200 transition-all p-6 group">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge variant={idea.status === 'active' ? 'success' : idea.status === 'pending' ? 'warning' : 'secondary'} className="mb-2">
                          {idea.status === 'active' ? 'Active Listing' : idea.status}
                        </Badge>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{idea.title}</h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <Briefcase size={14} /> {idea.industry}
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <MapPin size={14} /> Global
                        </p>
                      </div>
                      <div className="text-right md:hidden">
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(idea.saleTerms.askingPrice)}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-sm line-clamp-2">{idea.description}</p>

                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                        <Clock size={14} /> Listed {new Date(idea.listedDate).toLocaleDateString()}
                      </span>
                      {idea.saleTerms.includesCodebase && (
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                          <CheckCircle2 size={14} className="text-emerald-500" /> Source Code
                        </span>
                      )}
                      {idea.saleTerms.includesIP && (
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                          <Lock size={14} className="text-emerald-500" /> IP Transfer
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 px-2.5 py-1.5">
                        <Eye size={14} /> {idea.views} views
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end min-w-[180px] border-l border-slate-50 pl-6 border-dashed">
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Asking Price</p>
                      <p className="text-3xl font-display font-bold text-slate-900 tracking-tight">{formatCurrency(idea.saleTerms.askingPrice)}</p>
                    </div>

                    <div className="w-full space-y-3 mt-6">
                      <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-11 shadow-md">
                        View Details
                      </Button>
                      <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-xl h-11">
                        <MessageCircle size={16} className="mr-2" /> Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
