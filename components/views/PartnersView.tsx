import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Badge, Button } from '../ui';
import { MapPin, Briefcase, ExternalLink, Filter } from 'lucide-react';

const MOCK_PARTNERS = [
  { id: '1', name: 'EcoTextile Co', industry: 'Textile', location: 'Tamil Nadu', funding: 1500000, tags: ['Sustainable', 'B2B'] },
  { id: '2', name: 'AgriTech Solutions', industry: 'Agriculture', location: 'Karnataka', funding: 500000, tags: ['Smart Farming', 'IoT'] },
  { id: '3', name: 'Urban Crafts', industry: 'Handicrafts', location: 'Rajasthan', funding: 200000, tags: ['Artisan', 'D2C'] },
  { id: '4', name: 'Green Foods', industry: 'Food Processing', location: 'Kerala', funding: 800000, tags: ['Organic', 'Export'] },
  { id: '5', name: 'NextGen Looms', industry: 'Textile', location: 'Gujarat', funding: 3000000, tags: ['Automation', 'B2B'] },
  { id: '6', name: 'Solar Harvest', industry: 'Agriculture', location: 'Punjab', funding: 1200000, tags: ['Renewable', 'Infra'] },
];

export default function PartnersView() {
  const [searchParams] = useSearchParams();
  const industryFilter = searchParams.get('industry')?.toLowerCase();
  const q = searchParams.get('q')?.toLowerCase();

  const filteredPartners = useMemo(() => {
    return MOCK_PARTNERS.filter(p => {
      const matchesIndustry = industryFilter ? p.industry.toLowerCase().includes(industryFilter) : true;
      const matchesQuery = q ? p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) : true;
      return matchesIndustry && matchesQuery;
    });
  }, [industryFilter, q]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Collaboration Matching</h1>
          <p className="text-slate-400 mt-1">
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
              
              <h3 className="text-xl font-bold text-slate-100">{partner.name}</h3>
              
              <div className="mt-4 space-y-2 text-sm text-slate-400">
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