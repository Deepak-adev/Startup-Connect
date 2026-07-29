import { SuccessfulPartner, LossReason } from '../types';

export interface WeaknessFilter {
  id: string;
  label: string;
  category: string;
  description: string;
  keywords: string[];
}

export class WeaknessFilteringService {
  private static readonly WEAKNESS_FILTERS: WeaknessFilter[] = [
    {
      id: 'high-production-costs',
      label: 'High Production Costs',
      category: 'operational',
      description: 'Struggling with expensive manufacturing processes and operational inefficiencies',
      keywords: ['production', 'manufacturing', 'costs', 'efficiency', 'operational', 'lean']
    },
    {
      id: 'supply-chain-issues',
      label: 'Supply Chain Problems',
      category: 'supply-chain',
      description: 'Inefficient supply chain causing delays and increased costs',
      keywords: ['supply chain', 'logistics', 'procurement', 'inventory', 'distribution']
    },
    {
      id: 'cash-flow-management',
      label: 'Cash Flow Issues',
      category: 'cash-flow',
      description: 'Poor cash flow management affecting business operations',
      keywords: ['cash flow', 'working capital', 'financial management', 'liquidity', 'funding']
    },
    {
      id: 'limited-market-reach',
      label: 'Limited Market Reach',
      category: 'market',
      description: 'Struggling to expand market presence and customer base',
      keywords: ['market', 'sales', 'marketing', 'distribution', 'expansion', 'brand']
    },
    {
      id: 'outdated-technology',
      label: 'Outdated Technology',
      category: 'technical',
      description: 'Using legacy systems that hinder productivity and growth',
      keywords: ['technology', 'automation', 'digital', 'systems', 'modernization', 'iot']
    },
    {
      id: 'team-skills-gap',
      label: 'Team Skills Gap',
      category: 'team',
      description: 'Lack of specialized skills and expertise in the team',
      keywords: ['team', 'skills', 'training', 'expertise', 'human resources', 'talent']
    },
    {
      id: 'poor-financial-planning',
      label: 'Poor Financial Planning',
      category: 'financial',
      description: 'Inadequate financial planning and budget management',
      keywords: ['financial', 'planning', 'budget', 'investment', 'strategy', 'analysis']
    },
    {
      id: 'inefficient-processes',
      label: 'Inefficient Processes',
      category: 'operational',
      description: 'Business processes that are slow and wasteful',
      keywords: ['process', 'efficiency', 'optimization', 'workflow', 'productivity']
    },
    {
      id: 'weak-brand-presence',
      label: 'Weak Brand Presence',
      category: 'market',
      description: 'Limited brand recognition and market visibility',
      keywords: ['brand', 'marketing', 'presence', 'visibility', 'reputation', 'positioning']
    },
    {
      id: 'quality-control-issues',
      label: 'Quality Control Issues',
      category: 'operational',
      description: 'Product quality problems affecting customer satisfaction',
      keywords: ['quality', 'control', 'standards', 'assurance', 'compliance']
    }
  ];

  static getAllFilters(): WeaknessFilter[] {
    return this.WEAKNESS_FILTERS;
  }

  static getPartnersByWeaknesses(
    selectedWeaknessIds: string[], 
    partners: SuccessfulPartner[]
  ): SuccessfulPartner[] {
    if (selectedWeaknessIds.length === 0) {
      return partners;
    }

    const selectedWeaknesses = this.WEAKNESS_FILTERS.filter(filter => 
      selectedWeaknessIds.includes(filter.id)
    );

    return partners
      .map(partner => {
        let matchScore = 0;
        let maxPossibleScore = 0;

        selectedWeaknesses.forEach(weakness => {
          maxPossibleScore += 1;

          // Check if partner can help with this weakness
          const canHelp = this.canPartnerHelpWithWeakness(partner, weakness);
          if (canHelp) {
            matchScore += 1;
          }
        });

        // Add bonus for expertise relevance
        const expertiseBonus = this.calculateExpertiseBonus(partner, selectedWeaknesses);
        matchScore += expertiseBonus * 0.3;

        // Add bonus for success metrics
        const successBonus = this.calculateSuccessBonus(partner);
        matchScore += successBonus * 0.2;

        const finalScore = maxPossibleScore > 0 ? (matchScore / (maxPossibleScore + 0.5)) : 0;

        return {
          ...partner,
          matchScore: Math.round(finalScore * 100)
        };
      })
      .filter(partner => partner.matchScore >= 20)
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  private static canPartnerHelpWithWeakness(
    partner: SuccessfulPartner, 
    weakness: WeaknessFilter
  ): boolean {
    // Check if partner's canHelpWith matches weakness keywords
    const canHelpMatch = partner.canHelpWith.some(help => 
      weakness.keywords.some(keyword => 
        help.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(help.toLowerCase())
      )
    );

    // Check if partner's expertise matches weakness keywords
    const expertiseMatch = partner.expertise.some(exp => 
      weakness.keywords.some(keyword => 
        exp.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(exp.toLowerCase())
      )
    );

    // Check if partner's support areas match weakness keywords
    const supportMatch = partner.partnershipTerms.supportAreas.some(support => 
      weakness.keywords.some(keyword => 
        support.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(support.toLowerCase())
      )
    );

    return canHelpMatch || expertiseMatch || supportMatch;
  }

  private static calculateExpertiseBonus(
    partner: SuccessfulPartner, 
    selectedWeaknesses: WeaknessFilter[]
  ): number {
    let bonus = 0;
    const allKeywords = selectedWeaknesses.flatMap(w => w.keywords);

    partner.expertise.forEach(exp => {
      const matches = allKeywords.filter(keyword => 
        exp.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(exp.toLowerCase())
      ).length;
      
      bonus += matches * 0.2;
    });

    return Math.min(bonus, 1); // Cap at 1
  }

  private static calculateSuccessBonus(partner: SuccessfulPartner): number {
    const { successMetrics } = partner;
    return (
      successMetrics.revenueGrowth * 0.3 +
      successMetrics.profitability * 0.3 +
      successMetrics.marketShare * 0.2 +
      successMetrics.operationalEfficiency * 0.2
    );
  }

  static getFilterCounts(filters: WeaknessFilter[], partners: SuccessfulPartner[]): WeaknessFilter[] {
    return filters.map(filter => ({
      ...filter,
      count: partners.filter(partner => 
        this.canPartnerHelpWithWeakness(partner, filter)
      ).length
    }));
  }

  static getPartnersForSpecificWeakness(
    weaknessId: string, 
    partners: SuccessfulPartner[]
  ): SuccessfulPartner[] {
    const weakness = this.WEAKNESS_FILTERS.find(f => f.id === weaknessId);
    if (!weakness) return [];

    return this.getPartnersByWeaknesses([weaknessId], partners);
  }
}
