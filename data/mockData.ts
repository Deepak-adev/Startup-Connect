import { StartupAnalysis, SuccessfulPartner, LossReason } from '../types';

export const MOCK_STARTUP_ANALYSIS: StartupAnalysis = {
  id: 'startup-1',
  name: 'TechFabric Solutions',
  industry: 'Textile',
  currentRevenue: 450000,
  targetRevenue: 800000,
  lossPercentage: 43.75,
  financialHealth: 'struggling',
  timeInBusiness: 3,
  teamSize: 12,
  operationalChallenges: [
    'Supply chain inefficiencies',
    'High production costs',
    'Limited market reach',
    'Outdated technology',
    'Cash flow management'
  ],
  lossReasons: [
    {
      id: 'loss-1',
      category: 'operational',
      severity: 'high',
      description: 'Inefficient production processes leading to 30% higher operational costs compared to industry standards',
      impact: 'Reduced profit margins by 15% and inability to compete on pricing',
      solutions: [
        'Implement lean manufacturing principles',
        'Adopt automation technologies',
        'Optimize supply chain management',
        'Train staff on modern production techniques'
      ]
    },
    {
      id: 'loss-2',
      category: 'financial',
      severity: 'critical',
      description: 'Poor cash flow management due to delayed customer payments and high inventory holding costs',
      impact: 'Monthly cash shortages affecting ability to pay suppliers and invest in growth',
      solutions: [
        'Implement better credit control systems',
        'Reduce inventory through just-in-time manufacturing',
        'Secure working capital financing',
        'Negotiate better payment terms with suppliers'
      ]
    },
    {
      id: 'loss-3',
      category: 'market',
      severity: 'medium',
      description: 'Limited market presence and weak brand recognition in target segments',
      impact: 'Missing out on 60% of potential market opportunities in the region',
      solutions: [
        'Develop targeted marketing campaigns',
        'Build strategic partnerships with retailers',
        'Enhance online presence and e-commerce capabilities',
        'Participate in industry trade shows and events'
      ]
    }
  ]
};

export const MOCK_SUCCESSFUL_PARTNERS: SuccessfulPartner[] = [
  {
    id: 'partner-1',
    name: 'Global Textile Innovations',
    industry: 'Textile',
    location: 'Mumbai',
    expertise: ['Manufacturing Optimization', 'Supply Chain', 'Automation', 'Lean Production'],
    successMetrics: {
      revenueGrowth: 0.85,
      profitability: 0.92,
      marketShare: 0.78,
      operationalEfficiency: 0.95
    },
    canHelpWith: ['operational efficiency', 'manufacturing', 'supply chain', 'automation'],
    partnershipTerms: {
      investmentRange: { min: 100000, max: 500000 },
      equityRequired: { min: 5, max: 15 },
      timeCommitment: '6-12 months',
      supportAreas: ['Process optimization', 'Technology implementation', 'Team training']
    },
    matchScore: 0,
    caseStudies: [
      {
        problem: 'Traditional textile manufacturer struggling with high production costs',
        solution: 'Implemented automated cutting systems and lean manufacturing principles',
        outcome: 'Reduced production costs by 35% and increased output by 40%'
      },
      {
        problem: 'Supply chain disruptions causing frequent delays',
        solution: 'Developed integrated supply chain management system with real-time tracking',
        outcome: 'Improved delivery times by 60% and reduced inventory costs by 25%'
      }
    ]
  },
  {
    id: 'partner-2',
    name: 'Strategic Finance Partners',
    industry: 'Finance',
    location: 'Bangalore',
    expertise: ['Cash Flow Management', 'Working Capital', 'Financial Planning', 'Investment Strategy'],
    successMetrics: {
      revenueGrowth: 0.72,
      profitability: 0.88,
      marketShare: 0.65,
      operationalEfficiency: 0.82
    },
    canHelpWith: ['financial management', 'cash flow', 'working capital', 'investment'],
    partnershipTerms: {
      investmentRange: { min: 200000, max: 1000000 },
      equityRequired: { min: 8, max: 20 },
      timeCommitment: '12-18 months',
      supportAreas: ['Financial restructuring', 'Cash flow optimization', 'Fundraising assistance']
    },
    matchScore: 0,
    caseStudies: [
      {
        problem: 'SME facing severe cash flow crises',
        solution: 'Restructured financial management and secured working capital facility',
        outcome: 'Improved cash flow by 150% and enabled business expansion'
      }
    ]
  },
  {
    id: 'partner-3',
    name: 'Market Growth Solutions',
    industry: 'Marketing',
    location: 'Delhi',
    expertise: ['Brand Development', 'Digital Marketing', 'Market Expansion', 'E-commerce'],
    successMetrics: {
      revenueGrowth: 0.78,
      profitability: 0.75,
      marketShare: 0.85,
      operationalEfficiency: 0.70
    },
    canHelpWith: ['marketing', 'brand building', 'market expansion', 'digital presence'],
    partnershipTerms: {
      investmentRange: { min: 50000, max: 300000 },
      equityRequired: { min: 3, max: 10 },
      timeCommitment: '6-9 months',
      supportAreas: ['Marketing strategy', 'Brand development', 'Digital transformation']
    },
    matchScore: 0,
    caseStudies: [
      {
        problem: 'Local manufacturer with no brand recognition',
        solution: 'Developed comprehensive brand strategy and digital marketing campaign',
        outcome: 'Increased market visibility by 300% and sales by 120%'
      }
    ]
  },
  {
    id: 'partner-4',
    name: 'Tech Integration Labs',
    industry: 'Technology',
    location: 'Pune',
    expertise: ['Process Automation', 'IoT Solutions', 'Data Analytics', 'Industry 4.0'],
    successMetrics: {
      revenueGrowth: 0.90,
      profitability: 0.85,
      marketShare: 0.70,
      operationalEfficiency: 0.95
    },
    canHelpWith: ['technology implementation', 'automation', 'IoT', 'data analytics'],
    partnershipTerms: {
      investmentRange: { min: 150000, max: 750000 },
      equityRequired: { min: 6, max: 18 },
      timeCommitment: '9-15 months',
      supportAreas: ['Technology integration', 'Automation solutions', 'Data analytics implementation']
    },
    matchScore: 0,
    caseStudies: [
      {
        problem: 'Traditional manufacturing plant with outdated technology',
        solution: 'Implemented IoT sensors and automation systems',
        outcome: 'Improved efficiency by 45% and reduced defects by 60%'
      }
    ]
  }
];

export const MOCK_STARTUPS: StartupAnalysis[] = [
  MOCK_STARTUP_ANALYSIS,
  {
    id: 'startup-2',
    name: 'AgriFresh Organics',
    industry: 'Agriculture',
    currentRevenue: 280000,
    targetRevenue: 600000,
    lossPercentage: 53.33,
    financialHealth: 'poor',
    timeInBusiness: 2,
    teamSize: 8,
    operationalChallenges: [
      'Seasonal production constraints',
      'Limited distribution network',
      'High perishable waste',
      'Insufficient storage facilities'
    ],
    lossReasons: [
      {
        id: 'loss-4',
        category: 'operational',
        severity: 'critical',
        description: 'Poor storage and preservation leading to 40% product spoilage',
        impact: 'Significant revenue loss and inability to meet consistent supply demands',
        solutions: [
          'Implement cold storage facilities',
          'Develop preservation technologies',
          'Optimize logistics and distribution',
          'Create value-added products to reduce waste'
        ]
      },
      {
        id: 'loss-5',
        category: 'market',
        severity: 'high',
        description: 'Limited market access beyond local region',
        impact: 'Missing expansion opportunities and economies of scale',
        solutions: [
          'Develop partnerships with large retailers',
          'Create online sales channels',
          'Obtain organic certifications for premium markets',
          'Build brand recognition in urban markets'
        ]
      }
    ]
  }
];
