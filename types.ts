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