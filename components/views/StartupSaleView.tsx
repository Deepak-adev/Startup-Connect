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
  Calendar
} from 'lucide-react';
import { StartupIdea } from '../../types';
import IdeaSaleListing from '../IdeaSaleListing';
import IdeaSubmissionForm from '../IdeaSubmissionForm';
import { IdeaStorageService } from '../../services/ideaStorage';

type SortOption = 'newest' | 'price_low' | 'price_high' | 'views' | 'profit';
type StatusFilter = 'all' | 'active' | 'pending' | 'sold';

export default function StartupSaleView() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load ideas from local storage on component mount
  useEffect(() => {
    const loadIdeas = () => {
      try {
        // Initialize storage if needed
        IdeaStorageService.initializeStorage();
        
        // Load ideas from local storage
        const loadedIdeas = IdeaStorageService.loadIdeas();
        setIdeas(loadedIdeas);
        console.log(`Loaded ${loadedIdeas.length} ideas from local storage`);
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
      // Status filter
      if (statusFilter !== 'all' && idea.status !== statusFilter) {
        return false;
      }

      // Price range filter
      if (idea.saleTerms.askingPrice < priceRange.min || idea.saleTerms.askingPrice > priceRange.max) {
        return false;
      }

      // Search filter
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

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
        case 'price_low':
          return a.saleTerms.askingPrice - b.saleTerms.askingPrice;
        case 'price_high':
          return b.saleTerms.askingPrice - a.saleTerms.askingPrice;
        case 'views':
          return b.views - a.views;
        case 'profit':
          return b.financialBreakdown.founderProfit - a.financialBreakdown.founderProfit;
        default:
          return 0;
      }
    });
  }, [searchQuery, sortBy, statusFilter, priceRange]);

  const stats = useMemo(() => {
    const total = ideas.length;
    const active = ideas.filter(i => i.status === 'active').length;
    const sold = ideas.filter(i => i.status === 'sold').length;
    const totalValue = ideas.reduce((sum, i) => sum + i.saleTerms.askingPrice, 0);
    
    return { total, active, sold, totalValue };
  }, [ideas]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleViewDetails = (ideaId: string) => {
    console.log('View details for idea:', ideaId);
    // Navigate to idea details page
  };

  const handleContact = (ideaId: string) => {
    console.log('Contact seller for idea:', ideaId);
    // Open contact modal or navigate to contact page
  };

  const handleIdeaSubmission = (newIdea: StartupIdea) => {
    try {
      // Save to local storage
      const updatedIdeas = IdeaStorageService.addIdea(newIdea);
      setIdeas(updatedIdeas);
      setShowSubmissionForm(false);
      console.log('New idea submitted and saved:', newIdea);
      
      // Show success feedback
      alert('Your startup idea has been successfully submitted and listed!');
    } catch (error) {
      console.error('Failed to submit idea:', error);
      alert('Failed to submit your idea. Please try again.');
    }
  };

  const handleCancelSubmission = () => {
    setShowSubmissionForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading startup ideas...</p>
        </div>
      </div>
    );
  }

  if (showSubmissionForm) {
    return (
      <div className="animate-in fade-in duration-500">
        <IdeaSubmissionForm
          onSubmit={handleIdeaSubmission}
          onCancel={handleCancelSubmission}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Startup Idea Sale</h1>
          <p className="text-slate-400 mt-1">
            Buy and sell startup ideas with structured exit strategies
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowSubmissionForm(true)}>
          <Plus size={16} className="mr-2" />
          List Your Idea
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <DollarSign size={20} className="text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Total Ideas</div>
              <div className="text-xl font-bold text-white">{stats.total}</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Active Listings</div>
              <div className="text-xl font-bold text-white">{stats.active}</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Calendar size={20} className="text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Sold</div>
              <div className="text-xl font-bold text-white">{stats.sold}</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Eye size={20} className="text-orange-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Total Value</div>
              <div className="text-xl font-bold text-white">{formatCurrency(stats.totalValue)}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-slate-400" />
          <h3 className="text-lg font-semibold text-white">Filters & Search</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ideas, industries, or founders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="views">Most Viewed</option>
              <option value="profit">Highest Profit</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="mt-4">
          <label className="text-sm text-slate-400 mb-2 block">Price Range</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-sm text-white min-w-[100px] text-right">
              {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
            </span>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Showing {filteredAndSortedIdeas.length} of {ideas.length} ideas
        </div>
        {searchQuery && (
          <Badge variant="default">
            Search: "{searchQuery}"
          </Badge>
        )}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedIdeas.length > 0 ? (
          filteredAndSortedIdeas.map(idea => (
            <IdeaSaleListing
              key={idea.id}
              idea={idea}
              onViewDetails={handleViewDetails}
              onContact={handleContact}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-400">
            <div className="text-lg mb-2">No ideas found matching your criteria</div>
            <div className="text-sm mb-4">Try adjusting your filters or search terms</div>
            <Button onClick={() => setShowSubmissionForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus size={16} className="mr-2" />
              List Your Idea Instead
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
