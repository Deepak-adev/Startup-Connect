import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ViewType } from '../types';
import DashboardView from './views/DashboardView';
import PartnersView from './views/PartnersView';
import PitchDeckView from './views/PitchDeckView';
import { Card } from './ui';

export default function DynamicWorkspace() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') as ViewType || ViewType.DASHBOARD;

  const renderView = () => {
    switch (view) {
      case ViewType.DASHBOARD:
        return <DashboardView />;
      case ViewType.PARTNERS:
        return <PartnersView />;
      case ViewType.PITCH_DECK:
        return <PitchDeckView />;
      // Fallback or other views can be added here
      case ViewType.MARKET_ANALYSIS:
      case ViewType.STARTUP_SALE:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <h2 className="text-2xl font-display font-bold text-slate-200 mb-2">
              {view.replace('_', ' ').toUpperCase()}
            </h2>
            <p className="text-slate-400">This module is currently under development by the AI Core.</p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {renderView()}
    </div>
  );
}