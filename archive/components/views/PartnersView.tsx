import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Badge, Button } from '../ui';
import { MapPin, Briefcase, ExternalLink, Filter, TrendingDown, Search, AlertCircle, Handshake, Users, ArrowRight, Zap, Target } from 'lucide-react';
import { MOCK_STARTUP_ANALYSIS, MOCK_SUCCESSFUL_PARTNERS } from '../../data/mockData';
import { PartnerMatchingService } from '../../services/partnerMatching';
import { WeaknessFilteringService } from '../../services/weaknessFiltering';
import { StartupAnalysis, SuccessfulPartner } from '../../types';
import LossAnalysis from '../LossAnalysis';
import PartnerMatchingResults from '../PartnerMatchingResults';
import WeaknessFilters from '../WeaknessFilters';

const MOCK_PARTNERS = [
  { id: '1', name: 'EcoTextile Co', industry: 'Textile', location: 'Tamil Nadu', funding: 1500000, tags: ['Sustainable', 'B2B'], color: 'from-emerald-400 to-green-600' },
  { id: '2', name: 'AgriTech Solutions', industry: 'Agriculture', location: 'Karnataka', funding: 500000, tags: ['Smart Farming', 'IoT'], color: 'from-amber-400 to-orange-600' },
  { id: '3', name: 'Urban Crafts', industry: 'Handicrafts', location: 'Rajasthan', funding: 200000, tags: ['Artisan', 'D2C'], color: 'from-purple-400 to-indigo-600' },
  { id: '4', name: 'Green Foods', industry: 'Food Processing', location: 'Kerala', funding: 800000, tags: ['Organic', 'Export'], color: 'from-lime-400 to-green-500' },
  { id: '5', name: 'NextGen Looms', industry: 'Textile', location: 'Gujarat', funding: 3000000, tags: ['Automation', 'B2B'], color: 'from-blue-400 to-cyan-600' },
  { id: '6', name: 'Solar Harvest', industry: 'Agriculture', location: 'Punjab', funding: 1200000, tags: ['Renewable', 'Infra'], color: 'from-yellow-400 to-amber-500' },
];

type ViewMode = 'traditional' | 'loss-analysis' | 'partner-matching' | 'weakness-filters';

export default function PartnersView() {
  const [searchParams] = useSearchParams();
  const industryFilter = searchParams.get('industry')?.toLowerCase();
  const q = searchParams.get('q')?.toLowerCase();
  const action = searchParams.get('action')?.toLowerCase();

  const [viewMode, setViewMode] = useState<ViewMode>('traditional');
  const [selectedStartup, setSelectedStartup] = useState<StartupAnalysis>(MOCK_STARTUP_ANALYSIS);
  const [matchedPartners, setMatchedPartners] = useState<SuccessfulPartner[]>([]);
  const [selectedWeaknessFilters, setSelectedWeaknessFilters] = useState<string[]>([]);
  const [filteredPartnersByWeakness, setFilteredPartnersByWeakness] = useState<SuccessfulPartner[]>([]);

  const weaknessFilters = useMemo(() => {
    return WeaknessFilteringService.getFilterCounts(
      WeaknessFilteringService.getAllFilters(),
      MOCK_SUCCESSFUL_PARTNERS
    );
  }, []);

  const filteredPartners = useMemo(() => {
    return MOCK_PARTNERS.filter(p => {
      const matchesIndustry = industryFilter ? p.industry.toLowerCase().includes(industryFilter) : true;
      const matchesQuery = q ? p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) : true;
      return matchesIndustry && matchesQuery;
    });
  }, [industryFilter, q, MOCK_PARTNERS]);

  useEffect(() => {
    if (action === 'analyze-losses' || action === 'find-partners') {
      setViewMode('loss-analysis');
      const matches = PartnerMatchingService.findMatchingPartners(selectedStartup, MOCK_SUCCESSFUL_PARTNERS);
      setMatchedPartners(matches);
    }
  }, [action, selectedStartup]);

  const handleSolutionsClick = (reasonId: string) => {
    const specificPartners = PartnerMatchingService.getPartnersForSpecificLoss(reasonId, selectedStartup, MOCK_SUCCESSFUL_PARTNERS);
    setMatchedPartners(specificPartners);
    setViewMode('partner-matching');
  };

  const handleConnectClick = (partnerId: string) => {
    console.log('Connecting to partner:', partnerId);
  };

  const handleAnalyzeLosses = () => {
    setViewMode('loss-analysis');
    const matches = PartnerMatchingService.findMatchingPartners(selectedStartup, MOCK_SUCCESSFUL_PARTNERS);
    setMatchedPartners(matches);
  };

  const handleWeaknessFilterToggle = (filterId: string) => {
    setSelectedWeaknessFilters(prev => {
      const newFilters = prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId];

      const filtered = WeaknessFilteringService.getPartnersByWeaknesses(newFilters, MOCK_SUCCESSFUL_PARTNERS);
      setFilteredPartnersByWeakness(filtered);
      return newFilters;
    });
  };

  const handleClearWeaknessFilters = () => {
    setSelectedWeaknessFilters([]);
    setFilteredPartnersByWeakness([]);
  };

  const handleShowWeaknessFilters = () => {
    setViewMode('weakness-filters');
  };

  if (viewMode === 'weakness-filters') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 bg-slate-50/50 min-h-screen px-4 pb-10">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Filter by Weaknesses</h1>
            <p className="text-slate-600 mt-1">
              Select your business challenges to find partners with matching strengths.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-11 px-5 rounded-xl" onClick={() => setViewMode('traditional')}>
              Back to Partners
            </Button>
            {selectedWeaknessFilters.length > 0 && (
              <Button onClick={() => setViewMode('partner-matching')} className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-5 rounded-xl shadow-lg shadow-indigo-500/20">
                View Results ({filteredPartnersByWeakness.length})
              </Button>
            )}
          </div>
        </div>

        <WeaknessFilters
          filters={weaknessFilters}
          selectedFilters={selectedWeaknessFilters}
          onFilterToggle={handleWeaknessFilterToggle}
          onClearAll={handleClearWeaknessFilters}
        />

        {selectedWeaknessFilters.length > 0 && filteredPartnersByWeakness.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Zap size={20} className="text-amber-500" fill="currentColor" /> Matching Partners ({filteredPartnersByWeakness.length})
            </h3>
            <PartnerMatchingResults
              partners={filteredPartnersByWeakness}
              onConnectClick={handleConnectClick}
              showCaseStudies={false}
            />
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'loss-analysis') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 bg-slate-50/50 min-h-screen px-4 pb-10">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Business Loss Analysis</h1>
            <p className="text-slate-600 mt-1">
              Identify reasons for business losses and find strategic partners.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-11 px-5 rounded-xl" onClick={() => setViewMode('traditional')}>
              Back to Partners
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-5 rounded-xl shadow-lg shadow-indigo-500/20" onClick={() => setViewMode('partner-matching')}>
              View Matched Partners ({matchedPartners.length})
            </Button>
          </div>
        </div>

        <LossAnalysis
          analysis={selectedStartup}
          onSolutionsClick={handleSolutionsClick}
        />
      </div>
    );
  }

  if (viewMode === 'partner-matching') {
    const displayPartners = selectedWeaknessFilters.length > 0 ? filteredPartnersByWeakness : matchedPartners;
    const isWeaknessFiltering = selectedWeaknessFilters.length > 0;

    return (
      <div className="space-y-8 animate-in fade-in duration-500 bg-slate-50/50 min-h-screen px-4 pb-10">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">
              {isWeaknessFiltering ? 'Partners for Your Weaknesses' : 'Partner Matching Results'}
            </h1>
            <p className="text-slate-500 mt-1 text-lg">
              {isWeaknessFiltering
                ? 'Strategic partners matched to address your specific business challenges.'
                : 'Strategic partners matched to address your business challenges.'}
            </p>
          </div>
          <div className="flex gap-3">
            {isWeaknessFiltering && (
              <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-11 px-5 rounded-xl" onClick={() => setViewMode('weakness-filters')}>
                Back to Filters
              </Button>
            )}
            <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-11 px-5 rounded-xl" onClick={() => setViewMode('loss-analysis')}>
              Back to Analysis
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-5 rounded-xl shadow-lg" onClick={() => setViewMode('traditional')}>
              All Partners
            </Button>
          </div>
        </div>

        {isWeaknessFiltering && selectedWeaknessFilters.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Selected Weaknesses</div>
            <div className="flex flex-wrap gap-2">
              {selectedWeaknessFilters.map(filterId => {
                const filter = weaknessFilters.find(f => f.id === filterId);
                return filter ? (
                  <Badge key={filterId} variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1">
                    {filter.label}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        <PartnerMatchingResults
          partners={displayPartners}
          onConnectClick={handleConnectClick}
          showCaseStudies={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 bg-slate-50/50 min-h-screen pb-10 px-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Partner Ecosystem</h1>
          <p className="text-slate-600 mt-1 text-lg">
            {industryFilter
              ? `Showing partners in the ${industryFilter} industry`
              : "Find strategic partners to accelerate your growth."}
          </p>
        </div>
        <div className="flex gap-3">
          {industryFilter && (
            <Badge variant="success">Filtered: {industryFilter}</Badge>
          )}
          <Button variant="outline" className="gap-2 bg-white border-slate-200 text-slate-700 h-11 hover:text-indigo-600 hover:border-indigo-200 rounded-xl">
            <Filter size={16} /> Filters
          </Button>
          <Button
            onClick={handleShowWeaknessFilters}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-xl shadow-lg shadow-indigo-500/20"
          >
          
          
            <Filter size={16} className="mr-2" />
            Filter by Weaknesses
          </Button>
          <Button
            onClick={handleAnalyzeLosses}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-xl shadow-lg shadow-indigo-500/20"
          >
            <TrendingDown size={16} className="mr-2" />
            Analyze Business Losses
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-all duration-700"></div>

          <div className="flex items-start gap-5 relative z-10">
            <div className="w-14 h-14 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
              <Target size={28} />
            </div>
            <div>
              <h3 className="text-white font-display font-bold text-xl mb-2">Smart Partner Matching</h3>
              <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                Identify your business weaknesses and let our AI match you with partners who have proven strengths in those exact areas.
              </p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0 relative z-10">
            <Button onClick={handleShowWeaknessFilters} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 rounded-xl h-11 px-6 font-semibold shadow-lg shadow-indigo-500/30">
              Find Matches
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.length > 0 ? (
          filteredPartners.map(partner => (
            <Card key={partner.id} className="group relative overflow-hidden bg-white border-slate-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.1)] hover:border-indigo-200 transition-all rounded-3xl p-6">
              <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="icon" size="sm" className="bg-slate-50 hover:bg-slate-100 rounded-full h-8 w-8 text-slate-500 hover:text-indigo-600">
                  <ExternalLink size={14} />
                </Button>
              </div>

              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${partner.color || 'from-slate-400 to-slate-600'} flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-black/5`}>
                  {partner.name.substring(0, 2).toUpperCase()}
                </div>
                {partner.industry && <Badge variant="secondary" className="bg-slate-50 text-slate-600 border-slate-100">{partner.industry}</Badge>}
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors mb-4">{partner.name}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
                  <MapPin size={16} className="text-slate-400" />
                  {partner.location}
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
                  <Briefcase size={16} className="text-slate-400" />
                  Funding: <span className="text-slate-900 font-bold">${(partner.funding / 1000).toFixed(0)}k</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {partner.tags.map(tag => (
                  <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>

              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-semibold shadow-lg shadow-slate-900/10 group-hover:shadow-indigo-500/20 group-hover:bg-indigo-600 transition-all border-0">
                Connect Request <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="opacity-50" />
            </div>
            <p className="text-lg font-medium text-slate-900">No partners found</p>
            <p className="text-sm mt-1">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}