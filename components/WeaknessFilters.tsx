import React from 'react';
import { Badge, Button } from './ui';
import {
  TrendingDown,
  AlertTriangle,
  Target,
  Lightbulb,
  Settings,
  DollarSign,
  Users,
  ShoppingCart,
  Clock,
  Package
} from 'lucide-react';

interface WeaknessFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
  description: string;
  count?: number;
}

interface WeaknessFiltersProps {
  filters: WeaknessFilter[];
  selectedFilters: string[];
  onFilterToggle: (filterId: string) => void;
  onClearAll: () => void;
}

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'financial': return <DollarSign size={16} className="text-red-400" />;
    case 'operational': return <Settings size={16} className="text-orange-400" />;
    case 'market': return <ShoppingCart size={16} className="text-blue-400" />;
    case 'strategic': return <Target size={16} className="text-purple-400" />;
    case 'technical': return <Lightbulb size={16} className="text-green-400" />;
    case 'supply-chain': return <Package size={16} className="text-yellow-400" />;
    case 'cash-flow': return <Clock size={16} className="text-red-500" />;
    case 'team': return <Users size={16} className="text-indigo-400" />;
    default: return <AlertTriangle size={16} className="text-slate-400" />;
  }
};

export default function WeaknessFilters({
  filters,
  selectedFilters,
  onFilterToggle,
  onClearAll
}: WeaknessFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Filter by Weaknesses</h3>
          <p className="text-sm text-slate-600 mt-1">
            Select your business challenges to find partners with matching strengths
          </p>
        </div>
        {selectedFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-slate-600 hover:text-slate-900"
          >
            Clear All ({selectedFilters.length})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id);

          return (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={`
                p-4 rounded-lg border transition-all duration-200 text-left
                ${isSelected
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIconForCategory(filter.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-slate-800 truncate">{filter.label}</h4>
                    {filter.count !== undefined && (
                      <Badge variant="default" className="text-xs">
                        {filter.count}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {filter.description}
                  </p>

                  {isSelected && (
                    <div className="mt-2 text-xs text-indigo-600 font-medium">
                      ✓ Selected
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedFilters.length > 0 && (
        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
          <div className="text-sm text-slate-600 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map(filterId => {
              const filter = filters.find(f => f.id === filterId);
              return filter ? (
                <Badge
                  key={filterId}
                  variant="default"
                  className="bg-indigo-100 text-indigo-700 border-indigo-300"
                >
                  {filter.label}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
