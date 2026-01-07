import React from 'react';
import { Card, Badge, Button } from './ui';
import { AlertTriangle, TrendingDown, Target, Lightbulb, CheckCircle } from 'lucide-react';
import { LossReason, StartupAnalysis } from '../types';

interface LossAnalysisProps {
  analysis: StartupAnalysis;
  onSolutionsClick?: (reasonId: string) => void;
}

const getSeverityColor = (severity: LossReason['severity']) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
};

const getCategoryIcon = (category: LossReason['category']) => {
  switch (category) {
    case 'operational': return <Target size={16} className="text-indigo-400" />;
    case 'financial': return <TrendingDown size={16} className="text-red-400" />;
    case 'market': return <AlertTriangle size={16} className="text-orange-400" />;
    case 'strategic': return <Lightbulb size={16} className="text-purple-400" />;
    case 'technical': return <CheckCircle size={16} className="text-green-400" />;
  }
};

export default function LossAnalysis({ analysis, onSolutionsClick }: LossAnalysisProps) {
  const getHealthColor = (health: StartupAnalysis['financialHealth']) => {
    switch (health) {
      case 'poor': return 'text-red-400';
      case 'struggling': return 'text-orange-400';
      case 'stable': return 'text-yellow-400';
      case 'strong': return 'text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{analysis.name}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{analysis.industry}</span>
              <span>•</span>
              <span>{analysis.timeInBusiness} years in business</span>
              <span>•</span>
              <span>{analysis.teamSize} team members</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${getHealthColor(analysis.financialHealth)}`}>
              {analysis.financialHealth.toUpperCase()}
            </div>
            <div className="text-2xl font-bold text-red-400 mt-1">
              -{analysis.lossPercentage}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Current Revenue</div>
            <div className="text-xl font-bold text-white">
              ${analysis.currentRevenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Target Revenue</div>
            <div className="text-xl font-bold text-green-400">
              ${analysis.targetRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-300">Operational Challenges</div>
          <div className="flex flex-wrap gap-2">
            {analysis.operationalChallenges.map((challenge, index) => (
              <Badge key={index} variant="default">
                {challenge}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Loss Reasons */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Identified Loss Reasons</h4>
        <div className="space-y-3">
          {analysis.lossReasons.map((reason) => (
            <Card key={reason.id} className="border-slate-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getCategoryIcon(reason.category)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="font-semibold text-white capitalize">{reason.category}</h5>
                    <Badge className={getSeverityColor(reason.severity)}>
                      {reason.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-300 mb-3">{reason.description}</p>
                  
                  <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                    <div className="text-xs text-slate-400 mb-1">Impact</div>
                    <div className="text-sm text-slate-200">{reason.impact}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-slate-400">Recommended Solutions</div>
                    <div className="space-y-1">
                      {reason.solutions.map((solution, index) => (
                        <div key={index} className="text-sm text-slate-300 flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                          {solution}
                        </div>
                      ))}
                    </div>
                  </div>

                  {onSolutionsClick && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => onSolutionsClick(reason.id)}
                    >
                      Find Partners for This Issue
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
