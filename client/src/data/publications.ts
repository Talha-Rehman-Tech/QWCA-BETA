export interface Publication {
  id: string;
  title: string;
  category: 'Taxation' | 'Corporate Law' | 'Auditing' | 'Foreign Investment';
  publishDate: string;
  readTime: string;
  summary: string;
  downloadUrl?: string;
  featured?: boolean;
  tableOfContents?: string[];
}

export const publicationsData: Publication[] = [
  {
    id: 'finance-act-guide-2026-27',
    title: 'Comprehensive Guide to Finance Act 2026–2027: Changes in Income Tax & Sales Tax',
    category: 'Taxation',
    publishDate: 'July 2026',
    readTime: '12 min read',
    summary:
      'In-depth analysis of statutory amendments in the Income Tax Ordinance 2001, revised salaried slabs, Super Tax (Sec 4C) escalations, Alternate Corporate Tax, and new documentation mandates for corporate taxpayers.',
    downloadUrl: '/assets/sample-guide.pdf',
    featured: true,
    tableOfContents: [
      'Overview of Macro-Fiscal Objectives',
      'Individual & Salaried Slabs Restructuring',
      'Corporate Tax & Alternate Corporate Tax (Sec 113C)',
      'Super Tax (Section 4C) Thresholds & Slabs',
      'Provincial Sales Tax Harmonization'
    ]
  },
  {
    id: 'foreign-direct-investment-pakistan-cpec',
    title: 'Foreign Direct Investment in Pakistan: Legal & SECP Compliance Manual for Chinese Enterprises',
    category: 'Foreign Investment',
    publishDate: 'August 2026',
    readTime: '15 min read',
    summary:
      'A practical corporate roadmap for foreign investors setting up operations in Pakistan under CPEC and Bilateral Investment Treaties. Covers SECP eZfile foreign director clearance, State Bank foreign exchange rules, and SEZ tax holiday applications.',
    downloadUrl: '/assets/sample-guide.pdf',
    featured: true,
    tableOfContents: [
      'Legal Framework for Wholly Owned Subsidiaries vs Branches',
      'SECP Form 43/44 Filing & Ministry of Interior Security Clearance',
      'State Bank of Pakistan Capital Inflow & Repatriation Rules',
      '10-Year Income Tax Holiday in Special Economic Zones',
      'Double Taxation Avoidance Agreement (Pakistan - China)'
    ]
  },
  {
    id: 'secp-compliance-handbook-companies-act-2017',
    title: 'The Director’s Handbook: Annual Statutory Compliance under Companies Act 2017',
    category: 'Corporate Law',
    publishDate: 'September 2026',
    readTime: '10 min read',
    summary:
      'A definitive walkthrough of mandatory corporate filings: Form A annual returns, Form 29 director updates, ultimate beneficial ownership (UBO) reporting, and board resolution best practices for private limited companies.',
    downloadUrl: '/assets/sample-guide.pdf',
    featured: true,
    tableOfContents: [
      'Statutory Books & Registers Mandated by Law',
      'Annual General Meeting (AGM) Timelines & Notice Requirements',
      'Ultimate Beneficial Ownership (UBO) Compliance',
      'Penalties for Belated Filing & SECP Adjudication Procedures'
    ]
  },
  {
    id: 'internal-controls-audit-readiness-sme',
    title: 'Audit Readiness & Internal Financial Controls for Growing Enterprises',
    category: 'Auditing',
    publishDate: 'October 2026',
    readTime: '8 min read',
    summary:
      'Practical guidance for CFOs and managing partners to establish internal control frameworks compliant with IFRS for SMEs, minimize audit adjustments, and ensure banking and credit credibility.',
    downloadUrl: '/assets/sample-guide.pdf',
    featured: false,
    tableOfContents: [
      'Common Financial Statement Deficiencies Found by Auditors',
      'Segregation of Duties in Accounts & Procurement',
      'Fixed Asset Register Reconciliation & Physical Verification',
      'Preparing Working Papers for External Chartered Accountants'
    ]
  }
];

