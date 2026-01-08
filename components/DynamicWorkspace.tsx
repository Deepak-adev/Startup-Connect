import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ViewType } from '../types';
import DashboardView from './views/DashboardView';
import PartnersView from './views/PartnersView';
import PitchDeckView from './views/PitchDeckView';
import AnalysisView from './views/AnalysisView';
import WebsitePreviewView from './views/WebsitePreviewView';
import InvestorDashboardView from './views/InvestorDashboardView';
import InvestorDealFlowView from './views/InvestorDealFlowView';
import InvestorPortfolioView from './views/InvestorPortfolioView';
import InvestorReportsView from './views/InvestorReportsView';
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
      case ViewType.MARKET_ANALYSIS:
        return <AnalysisView />;
      case ViewType.WEBSITE_PREVIEW:
        return <WebsitePreviewView />;
      case ViewType.INVESTOR_DASHBOARD:
        return <InvestorDashboardView />;
      case ViewType.INVESTOR_DEAL_FLOW:
        return <InvestorDealFlowView />;
      case ViewType.INVESTOR_PORTFOLIO:
        return <InvestorPortfolioView />;
      case ViewType.INVESTOR_REPORTS:
        return <InvestorReportsView />;
      case ViewType.STARTUP_SALE:
      case ViewType.ECOTRACK:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">
              {view.replace('_', ' ').toUpperCase()}
            </h2>
            <p className="text-slate-500">This module is currently under development by the AI Core.</p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 bg-slate-50">
      {renderView()}
    </div>
  );
}