import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Badge, Button } from '../ui';
import { MapPin, Briefcase, ExternalLink, Filter, TrendingDown, Search, AlertCircle } from 'lucide-react';
import { MOCK_STARTUP_ANALYSIS, MOCK_SUCCESSFUL_PARTNERS } from '../../data/mockData';
import { PartnerMatchingService } from '../../services/partnerMatching';
import { WeaknessFilteringService } from '../../services/weaknessFiltering';
import { StartupAnalysis, SuccessfulPartner } from '../../types';
import LossAnalysis from '../LossAnalysis';
import PartnerMatchingResults from '../PartnerMatchingResults';
import WeaknessFilters from '../WeaknessFilters';

const MOCK_PARTNERS = [
  { id: '1', name: 'EcoTextile Co', industry: 'Textile', location: 'Tamil Nadu', funding: 1500000, tags: ['Sustainable', 'B2B'] },
  { id: '2', name: 'AgriTech Solutions', industry: 'Agriculture', location: 'Karnataka', funding: 500000, tags: ['Smart Farming', 'IoT'] },
  { id: '3', name: 'Urban Crafts', industry: 'Handicrafts', location: 'Rajasthan', funding: 200000, tags: ['Artisan', 'D2C'] },
  { id: '4', name: 'Green Foods', industry: 'Food Processing', location: 'Kerala', funding: 800000, tags: ['Organic', 'Export'] },
  { id: '5', name: 'NextGen Looms', industry: 'Textile', location: 'Gujarat', funding: 3000000, tags: ['Automation', 'B2B'] },
  { id: '6', name: 'Solar Harvest', industry: 'Agriculture', location: 'Punjab', funding: 1200000, tags: ['Renewable', 'Infra'] },
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
  }, [industryFilter, q]);

  React.useEffect(() => {
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

      // Update filtered partners based on new selection
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
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Filter by Weaknesses</h1>
            <p className="text-slate-600 mt-1">
              Select your business challenges to find partners with matching strengths
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setViewMode('traditional')}>
              Back to Partners
            </Button>
            {selectedWeaknessFilters.length > 0 && (
              <Button onClick={() => setViewMode('partner-matching')}>
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
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Matching Partners ({filteredPartnersByWeakness.length})
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
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Business Loss Analysis</h1>
            <p className="text-slate-600 mt-1">
              Identify reasons for business losses and find strategic partners
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setViewMode('traditional')}>
              Back to Partners
            </Button>
            <Button onClick={() => setViewMode('partner-matching')}>
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
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">
              {isWeaknessFiltering ? 'Partners for Your Weaknesses' : 'Partner Matching Results'}
            </h1>
            <p className="text-slate-600 mt-1">
              {isWeaknessFiltering
                ? 'Strategic partners matched to address your specific business challenges'
                : 'Strategic partners matched to address your business challenges'}
            </p>
          </div>
          <div className="flex gap-2">
            {isWeaknessFiltering && (
              <Button variant="secondary" onClick={() => setViewMode('weakness-filters')}>
                Back to Filters
              </Button>
            )}
            <Button variant="secondary" onClick={() => setViewMode('loss-analysis')}>
              Back to Analysis
            </Button>
            <Button variant="secondary" onClick={() => setViewMode('traditional')}>
              All Partners
            </Button>
          </div>
        </div>

        {isWeaknessFiltering && selectedWeaknessFilters.length > 0 && (
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
            <div className="text-sm text-slate-400 mb-2">Selected Weaknesses:</div>
            <div className="flex flex-wrap gap-2">
              {selectedWeaknessFilters.map(filterId => {
                const filter = weaknessFilters.find(f => f.id === filterId);
                return filter ? (
                  <Badge key={filterId} variant="default" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Collaboration Matching</h1>
          <p className="text-slate-600 mt-1">
            {industryFilter
              ? `Showing partners in the ${industryFilter} industry`
              : "Find strategic partners for your startup"}
          </p>
        </div>
        <div className="flex gap-2">
          {industryFilter && (
            <Badge variant="success">Filtered: {industryFilter}</Badge>
          )}
          <Button variant="secondary" size="sm" className="gap-2">
            <Filter size={16} /> Filters
          </Button>
          <Button
            onClick={handleShowWeaknessFilters}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Filter size={16} className="mr-2" />
            Filter by Weaknesses
          </Button>
          <Button
            onClick={handleAnalyzeLosses}
            className="bg-red-600 hover:bg-red-700"
          >
            <TrendingDown size={16} className="mr-2" />
            Analyze Business Losses
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-orange-400 mt-0.5" size={20} />
          <div>
            <h3 className="text-orange-900 font-semibold mb-1">Find Partners for Your Weaknesses</h3>
            <p className="text-orange-800 text-sm mb-3">
              Select your specific business challenges and we'll match you with partners who have proven strengths in those areas.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleShowWeaknessFilters}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Filter size={14} className="mr-1" />
                Filter by Weaknesses
              </Button>
              <Button
                onClick={handleAnalyzeLosses}
                size="sm"
                variant="secondary"
              >
                <TrendingDown size={14} className="mr-1" />
                Analyze Losses
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.length > 0 ? (
          filteredPartners.map(partner => (
            <Card key={partner.id} className="group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="icon" size="sm">
                  <ExternalLink size={16} />
                </Button>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                  {partner.name.substring(0, 2).toUpperCase()}
                </div>
                <Badge>{partner.industry}</Badge>
              </div>

              <h3 className="text-xl font-bold text-slate-800">{partner.name}</h3>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-400" />
                  {partner.location}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-indigo-400" />
                  Funding: ${(partner.funding / 1000).toFixed(0)}k
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {partner.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>

              <Button className="w-full mt-6 bg-slate-800 hover:bg-slate-700">
                Connect
              </Button>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-500">
            <p className="text-lg">No partners found matching your criteria.</p>
            <p className="text-sm mt-2">Try asking AGUI to "Show all partners"</p>
          </div>
        )}
      </div>
    </div>
  );
}