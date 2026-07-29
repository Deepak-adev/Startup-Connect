import { StartupIdea } from '../types';
import { IdeaValuationService } from '../services/ideaValuation';

export const MOCK_IDEA_SALES: StartupIdea[] = [
  {
    id: 'idea-1',
    title: 'Eco-Friendly Food Delivery Platform',
    description: 'A sustainable food delivery service that connects local restaurants with customers using electric vehicles and biodegradable packaging. Currently operating in 3 cities with 500+ active restaurant partners.',
    industry: 'Food',
    founderName: 'Sarah Chen',
    contactEmail: 'sarah@ecodelivery.com',
    currentLoans: 85000,
    monthlyRevenue: 12000,
    monthlyExpenses: 15000,
    assets: 45000,
    intellectualProperty: ['Patent: Route Optimization Algorithm', 'Trademark: EcoDelivery Logo'],
    teamSize: 8,
    timeInBusiness: 2.5,
    marketSize: 2500000,
    competitiveAdvantage: 'First-mover in sustainable delivery with exclusive restaurant partnerships',
    businessModel: 'Commission-based revenue from restaurant orders and delivery fees',
    traction: {
      customers: 2500,
      revenue: 144000,
      growth: 45
    },
    valuation: {
      estimated: 285000,
      methodology: 'Hybrid Valuation Model (Revenue + Assets + IP + Team + Market)',
      confidence: 75
    },
    saleTerms: {
      askingPrice: 180000,
      negotiation: true,
      includesAssets: true,
      includesIP: true,
      transitionSupport: 8
    },
    financialBreakdown: {
      totalDebt: 85000,
      netProfit: 95000,
      loanSettlement: 85000,
      founderProfit: 95000
    },
    status: 'active',
    listedDate: '2024-01-15',
    views: 342,
    inquiries: 18
  },
  {
    id: 'idea-2',
    title: 'AI-Powered HR Recruitment Tool',
    description: 'An intelligent recruitment platform that uses machine learning to match candidates with job opportunities. Features automated screening, skill assessment, and predictive hiring analytics.',
    industry: 'Technology',
    founderName: 'Michael Rodriguez',
    contactEmail: 'michael@hireai.tech',
    currentLoans: 120000,
    monthlyRevenue: 8000,
    monthlyExpenses: 11000,
    assets: 25000,
    intellectualProperty: ['Software: Matching Algorithm', 'Copyright: Assessment Framework'],
    teamSize: 5,
    timeInBusiness: 1.5,
    marketSize: 5000000,
    competitiveAdvantage: 'Proprietary AI matching algorithm with 85% accuracy rate',
    businessModel: 'SaaS subscription with tiered pricing plans',
    traction: {
      customers: 45,
      revenue: 96000,
      growth: 120
    },
    valuation: {
      estimated: 420000,
      methodology: 'Hybrid Valuation Model (Revenue + Assets + IP + Team + Market)',
      confidence: 65
    },
    saleTerms: {
      askingPrice: 250000,
      negotiation: false,
      includesAssets: true,
      includesIP: true,
      transitionSupport: 12
    },
    financialBreakdown: {
      totalDebt: 120000,
      netProfit: 130000,
      loanSettlement: 120000,
      founderProfit: 130000
    },
    status: 'active',
    listedDate: '2024-01-20',
    views: 567,
    inquiries: 32
  },
  {
    id: 'idea-3',
    title: 'Smart Home Energy Management System',
    description: 'IoT-based home energy monitoring and optimization system that helps homeowners reduce electricity costs by 30% through automated load balancing and renewable energy integration.',
    industry: 'Technology',
    founderName: 'Emily Watson',
    contactEmail: 'emily@smartenergy.io',
    currentLoans: 200000,
    monthlyRevenue: 15000,
    monthlyExpenses: 12000,
    assets: 80000,
    intellectualProperty: ['Patent: Load Balancing System', 'Software: Mobile App', 'Hardware Design: Smart Hub'],
    teamSize: 12,
    timeInBusiness: 3,
    marketSize: 10000000,
    competitiveAdvantage: 'Proprietary load balancing algorithm with hardware integration',
    businessModel: 'Hardware sales + subscription for premium features',
    traction: {
      customers: 1200,
      revenue: 180000,
      growth: 65
    },
    valuation: {
      estimated: 650000,
      methodology: 'Hybrid Valuation Model (Revenue + Assets + IP + Team + Market)',
      confidence: 80
    },
    saleTerms: {
      askingPrice: 450000,
      negotiation: true,
      includesAssets: true,
      includesIP: true,
      transitionSupport: 16
    },
    financialBreakdown: {
      totalDebt: 200000,
      netProfit: 250000,
      loanSettlement: 200000,
      founderProfit: 250000
    },
    status: 'pending',
    listedDate: '2024-01-25',
    views: 892,
    inquiries: 47
  },
  {
    id: 'idea-4',
    title: 'Sustainable Fashion Marketplace',
    description: 'Online marketplace connecting ethical fashion designers with conscious consumers. Features verified sustainable brands, carbon footprint tracking, and circular fashion initiatives.',
    industry: 'Fashion',
    founderName: 'Alex Kumar',
    contactEmail: 'alex@ecofashion.com',
    currentLoans: 45000,
    monthlyRevenue: 6000,
    monthlyExpenses: 8000,
    assets: 20000,
    intellectualProperty: ['Trademark: EcoFashion Logo', 'Copyright: Platform Design'],
    teamSize: 4,
    timeInBusiness: 1,
    marketSize: 1500000,
    competitiveAdvantage: 'Curated sustainable brands with verification system',
    businessModel: 'Commission on sales + premium brand partnerships',
    traction: {
      customers: 800,
      revenue: 72000,
      growth: 25
    },
    valuation: {
      estimated: 180000,
      methodology: 'Hybrid Valuation Model (Revenue + Assets + IP + Team + Market)',
      confidence: 55
    },
    saleTerms: {
      askingPrice: 95000,
      negotiation: true,
      includesAssets: true,
      includesIP: false,
      transitionSupport: 6
    },
    financialBreakdown: {
      totalDebt: 45000,
      netProfit: 50000,
      loanSettlement: 45000,
      founderProfit: 50000
    },
    status: 'active',
    listedDate: '2024-02-01',
    views: 234,
    inquiries: 15
  },
  {
    id: 'idea-5',
    title: 'Virtual Reality Therapy Platform',
    description: 'VR-based mental health platform providing immersive therapy sessions for anxiety, PTSD, and phobia treatment. Partnered with licensed therapists and healthcare providers.',
    industry: 'Healthcare',
    founderName: 'Dr. James Park',
    contactEmail: 'james@vrtherapy.health',
    currentLoans: 150000,
    monthlyRevenue: 10000,
    monthlyExpenses: 13000,
    assets: 60000,
    intellectualProperty: ['Patent: VR Therapy Protocols', 'Software: Therapy Platform', 'Copyright: Treatment Modules'],
    teamSize: 7,
    timeInBusiness: 2,
    marketSize: 8000000,
    competitiveAdvantage: 'FDA-cleared VR therapy protocols with clinical validation',
    businessModel: 'B2B subscription for healthcare providers + direct patient sessions',
    traction: {
      customers: 25,
      revenue: 120000,
      growth: 85
    },
    valuation: {
      estimated: 520000,
      methodology: 'Hybrid Valuation Model (Revenue + Assets + IP + Team + Market)',
      confidence: 70
    },
    saleTerms: {
      askingPrice: 380000,
      negotiation: true,
      includesAssets: true,
      includesIP: true,
      transitionSupport: 20
    },
    financialBreakdown: {
      totalDebt: 150000,
      netProfit: 230000,
      loanSettlement: 150000,
      founderProfit: 230000
    },
    status: 'sold',
    listedDate: '2024-01-10',
    views: 1205,
    inquiries: 68
  }
];

export const generateMockIdeaSale = (partialData: Partial<StartupIdea>): StartupIdea => {
  const defaultData: StartupIdea = {
    id: `idea-${Date.now()}`,
    title: 'New Startup Idea',
    description: 'An innovative business idea with great potential',
    industry: 'Technology',
    founderName: 'John Doe',
    contactEmail: 'john@example.com',
    currentLoans: 50000,
    monthlyRevenue: 5000,
    monthlyExpenses: 4000,
    assets: 25000,
    intellectualProperty: [],
    teamSize: 3,
    timeInBusiness: 1,
    marketSize: 1000000,
    competitiveAdvantage: 'Unique value proposition',
    businessModel: 'Subscription-based',
    traction: {
      customers: 100,
      revenue: 60000,
      growth: 20
    },
    valuation: {
      estimated: 150000,
      methodology: 'Hybrid Valuation Model',
      confidence: 60
    },
    saleTerms: {
      askingPrice: 100000,
      negotiation: true,
      includesAssets: true,
      includesIP: true,
      transitionSupport: 8
    },
    financialBreakdown: {
      totalDebt: 50000,
      netProfit: 50000,
      loanSettlement: 50000,
      founderProfit: 50000
    },
    status: 'active',
    listedDate: new Date().toISOString().split('T')[0],
    views: 0,
    inquiries: 0
  };

  const mergedData = { ...defaultData, ...partialData };
  
  // Recalculate valuation and financial breakdown
  const optimalPrice = IdeaValuationService.getOptimalAskingPrice(mergedData);
  const financialBreakdown = IdeaValuationService.calculateFinancialBreakdown(
    optimalPrice,
    mergedData.currentLoans,
    mergedData.monthlyRevenue,
    mergedData.monthlyExpenses
  );

  return {
    ...mergedData,
    saleTerms: {
      ...mergedData.saleTerms,
      askingPrice: optimalPrice
    },
    financialBreakdown
  };
};
