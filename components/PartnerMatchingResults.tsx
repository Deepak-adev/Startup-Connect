import React, { useState } from 'react';
import { Card, Badge, Button } from './ui';
import { MapPin, TrendingUp, Users, Clock, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { SuccessfulPartner } from '../types';

interface PartnerMatchingResultsProps {
  partners: SuccessfulPartner[];
  onConnectClick?: (partnerId: string) => void;
  showCaseStudies?: boolean;
}

export default function PartnerMatchingResults({ 
  partners, 
  onConnectClick, 
  showCaseStudies = false 
}: PartnerMatchingResultsProps) {
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const formatMetricValue = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Recommended Partners ({partners.length})
        </h3>
        <div className="text-sm text-slate-400">
          Sorted by match score
        </div>
      </div>

      <div className="space-y-4">
        {partners.map((partner) => (
          <Card key={partner.id} className="border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">{partner.name}</h4>
                  <Badge className={getMatchScoreBg(partner.matchScore)}>
                    <div className="flex items-center gap-1">
                      <Star size={12} />
                      {partner.matchScore}% Match
                    </div>
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-indigo-400" />
                    {partner.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-indigo-400" />
                    {partner.industry}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {partner.expertise.slice(0, 4).map((exp, index) => (
                    <Badge key={index} variant="default">
                      {exp}
                    </Badge>
                  ))}
                  {partner.expertise.length > 4 && (
                    <Badge variant="default">
                      +{partner.expertise.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-right ml-4">
                <div className={`text-2xl font-bold ${getMatchScoreColor(partner.matchScore)}`}>
                  {partner.matchScore}%
                </div>
                <div className="text-xs text-slate-400">Match Score</div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">Revenue Growth</div>
                <div className="text-sm font-bold text-green-400">
                  {formatMetricValue(partner.successMetrics.revenueGrowth)}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">Profitability</div>
                <div className="text-sm font-bold text-blue-400">
                  {formatMetricValue(partner.successMetrics.profitability)}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">Market Share</div>
                <div className="text-sm font-bold text-purple-400">
                  {formatMetricValue(partner.successMetrics.marketShare)}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">Efficiency</div>
                <div className="text-sm font-bold text-orange-400">
                  {formatMetricValue(partner.successMetrics.operationalEfficiency)}
                </div>
              </div>
            </div>

            {/* Partnership Terms */}
            <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
              <div className="text-sm font-medium text-slate-300 mb-3">Partnership Terms</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Investment Range</div>
                  <div className="text-sm text-white">
                    ${(partner.partnershipTerms.investmentRange.min / 1000).toFixed(0)}k - ${(partner.partnershipTerms.investmentRange.max / 1000).toFixed(0)}k
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Equity Required</div>
                  <div className="text-sm text-white">
                    {partner.partnershipTerms.equityRequired.min}% - {partner.partnershipTerms.equityRequired.max}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Time Commitment</div>
                  <div className="text-sm text-white flex items-center gap-1">
                    <Clock size={12} />
                    {partner.partnershipTerms.timeCommitment}
                  </div>
                </div>
              </div>
            </div>

            {/* Support Areas */}
            <div className="mb-4">
              <div className="text-sm font-medium text-slate-300 mb-2">Support Areas</div>
              <div className="flex flex-wrap gap-2">
                {partner.partnershipTerms.supportAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs text-green-400">
                    <CheckCircle size={10} />
                    {area}
                  </div>
                ))}
              </div>
            </div>

            {/* Case Studies */}
            {showCaseStudies && partner.caseStudies.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedPartner(expandedPartner === partner.id ? null : partner.id)}
                  className="mb-3"
                >
                  {expandedPartner === partner.id ? 'Hide' : 'Show'} Case Studies ({partner.caseStudies.length})
                </Button>

                {expandedPartner === partner.id && (
                  <div className="space-y-3">
                    {partner.caseStudies.map((caseStudy, index) => (
                      <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm font-medium text-white mb-2">
                          Case Study {index + 1}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-400">Problem:</span>
                            <span className="text-slate-300 ml-2">{caseStudy.problem}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Solution:</span>
                            <span className="text-slate-300 ml-2">{caseStudy.solution}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Outcome:</span>
                            <span className="text-green-400 ml-2">{caseStudy.outcome}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => onConnectClick?.(partner.id)}
              >
                Connect with Partner
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <div className="text-lg mb-2">No matching partners found</div>
          <div className="text-sm">Try adjusting your criteria or check back later</div>
        </div>
      )}
    </div>
  );
}
