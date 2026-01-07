export enum ViewType {
  DASHBOARD = 'dashboard',
  PARTNERS = 'partners',
  MARKET_ANALYSIS = 'market_analysis',
  STARTUP_SALE = 'startup_sale',
  PITCH_DECK = 'pitch_deck'
}

export interface NavigationParams {
  view?: ViewType;
  industry?: string;
  funding_min?: number;
  funding_max?: number;
  profit_status?: 'profit' | 'loss' | 'break_even';
  location?: string;
  q?: string;
  action?: string;
}

export interface AGUIResponse {
  thought: string;
  navigation?: {
    path: string;
    params: NavigationParams;
    hash?: string;
  };
  message: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  industry: string;
  location: string;
  matchScore: number;
  tags: string[];
}

export interface Metric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export interface LossReason {
  id: string;
  category: 'operational' | 'financial' | 'market' | 'strategic' | 'technical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  solutions: string[];
}

export interface StartupAnalysis {
  id: string;
  name: string;
  industry: string;
  currentRevenue: number;
  targetRevenue: number;
  lossPercentage: number;
  lossReasons: LossReason[];
  operationalChallenges: string[];
  financialHealth: 'poor' | 'struggling' | 'stable' | 'strong';
  timeInBusiness: number;
  teamSize: number;
}

export interface SuccessfulPartner {
  id: string;
  name: string;
  industry: string;
  location: string;
  expertise: string[];
  successMetrics: {
    revenueGrowth: number;
    profitability: number;
    marketShare: number;
    operationalEfficiency: number;
  };
  canHelpWith: string[];
  partnershipTerms: {
    investmentRange: { min: number; max: number };
    equityRequired: { min: number; max: number };
    timeCommitment: string;
    supportAreas: string[];
  };
  matchScore: number;
  caseStudies: {
    problem: string;
    solution: string;
    outcome: string;
  }[];
}

export interface StartupIdea {
  id: string;
  title: string;
  description: string;
  industry: string;
  founderName: string;
  contactEmail: string;
  currentLoans: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  assets: number;
  intellectualProperty: string[];
  teamSize: number;
  timeInBusiness: number;
  marketSize: number;
  competitiveAdvantage: string;
  businessModel: string;
  traction: {
    customers: number;
    revenue: number;
    growth: number;
  };
  valuation: {
    estimated: number;
    methodology: string;
    confidence: number;
  };
  saleTerms: {
    askingPrice: number;
    negotiation: boolean;
    includesAssets: boolean;
    includesIP: boolean;
    transitionSupport: number; // weeks
  };
  financialBreakdown: {
    totalDebt: number;
    netProfit: number;
    loanSettlement: number;
    founderProfit: number;
  };
  status: 'active' | 'pending' | 'sold' | 'withdrawn';
  listedDate: string;
  views: number;
  inquiries: number;
}

export interface IdeaBuyer {
  id: string;
  name: string;
  type: 'individual' | 'company' | 'vc';
  budget: { min: number; max: number };
  preferredIndustries: string[];
  experience: string[];
  contactInfo: {
    email: string;
    phone?: string;
    company?: string;
  };
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

export interface SaleTransaction {
  id: string;
  ideaId: string;
  buyerId: string;
  sellerId: string;
  agreedPrice: number;
  terms: {
    paymentSchedule: string;
    transitionPeriod: number;
    nonCompete: boolean;
    consultingPeriod: number;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdDate: string;
  completedDate?: string;
}