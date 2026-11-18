export interface ServiceDetail {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  image: string;
  pill: string;
  shortDescription: string;
  fullDescription: string;
  scope: string[];
  deliverables: string[];
  regulatoryBodies: string[];
  keyBenefits: string[];
  faqs: { question: string; answer: string }[];
}

export const servicesData: ServiceDetail[] = [
  {
    slug: 'taxation-advisory',
    title: 'Taxation & Strategic Advisory',
    tagline: 'Corporate tax compliance, provincial sales tax e-filing, and representation before FBR & appellate tribunals.',
    icon: 'FileText',
    image: '/assets/Tax.webp',
    pill: 'FBR & PRA Registered',
    shortDescription:
      'Comprehensive tax planning, annual return filing, withholding tax audits, and contentious dispute resolution before FBR and provincial authorities.',
    fullDescription:
      'Our Taxation & Strategic Advisory division assists corporate enterprises, private partnerships, and high-net-worth individuals in navigating Pakistan’s complex fiscal environment. We provide end-to-end guidance spanning direct taxation under the Income Tax Ordinance 2001, federal sales tax on goods under the Sales Tax Act 1990, and provincial sales taxes on services administered by PRA, SRB, KPRA, and BRA.',
    scope: [
      'Corporate and individual annual income tax return filing on Iris portal',
      'Federal (FBR) and provincial (PRA, SRB, KPRA, BRA) sales tax registrations and monthly e-filing',
      'Withholding tax (WHT) statements, annual reconciliations, and CPR monitoring',
      'Representation before Commissioner Inland Revenue (Appeals) and Appellate Tribunal Inland Revenue (ATIR)',
      'Super Tax (Section 4C) computation, Alternate Corporate Tax (Section 113C), and minimum tax assessments',
      'International tax advisory, transfer pricing documentation, and avoidance of double taxation treaties (DTAA)'
    ],
    deliverables: [
      'Annual Income Tax Assessment Dossiers',
      'Monthly Sales Tax & Withholding Tax Certificates',
      'Tax Audit & Inquiry Response Briefs',
      'Advance Tax Computation Schedules (Section 147)',
      'Active Taxpayer List (ATL) Continuous Verification'
    ],
    regulatoryBodies: [
      'Federal Board of Revenue (FBR)',
      'Punjab Revenue Authority (PRA)',
      'Sindh Revenue Board (SRB)',
      'Khyber Pakhtunkhwa Revenue Authority (KPRA)'
    ],
    keyBenefits: [
      'Elimination of default surcharge and non-compliance penalties through automated statutory calendar tracking',
      'Strategic structuring of commercial transactions to optimize allowable tax deductions legally',
      'Direct representation by seasoned Chartered Accountants during departmental audits and show-cause notices'
    ],
    faqs: [
      {
        question: 'When is the deadline for filing corporate income tax returns in Pakistan?',
        answer: 'For companies whose tax year closes on June 30, the statutory deadline under the Income Tax Ordinance is December 31 following the end of the tax year. For companies with a special tax year closing on December 31, the deadline is September 30.'
      },
      {
        question: 'What is the rate of Super Tax under Section 4C for high-earning entities?',
        answer: 'Super Tax applies on individuals, AOPs, and corporate entities whose taxable income exceeds PKR 150 Million, with progressive graduated tax brackets scaling up to 10% for income exceeding PKR 500 Million.'
      },
      {
        question: 'How do you handle provincial sales tax on cross-provincial services?',
        answer: 'We analyze the place of provision of services rules under PRA, SRB, KPRA, and BRA to determine the exact nexus and prevent double taxation across provincial revenue authorities.'
      }
    ]
  },
  {
    slug: 'audit-assurance',
    title: 'Audit & Assurance Services',
    tagline: 'Independent statutory audits under Companies Act 2017, IFRS financial reporting, and internal control reviews.',
    icon: 'ShieldCheck',
    image: '/assets/Audit-Assurance-Services.webp',
    pill: 'ICAP QCR Approved',
    shortDescription:
      'Rigorous, independent statutory financial audits and assurance engagements that enhance reporting integrity and corporate governance.',
    fullDescription:
      'As an ICAP-approved practicing firm holding Quality Control Review (QCR) rating, QWCA conducts objective audit and assurance engagements in full conformity with International Standards on Auditing (ISA) and the Companies Act 2017. Our independent audit reports build trust among financial institutions, shareholders, regulatory authorities, and international joint venture partners.',
    scope: [
      'Independent statutory financial statement audits for private, public, and foreign subsidiary entities',
      'Preparation of general-purpose financial statements in strict compliance with IFRS and IFRS for SMEs',
      'Internal audit, governance frameworks, standard operating procedures (SOP), and risk mitigation',
      'Special purpose assurance engagements, physical inventory verification, and fixed asset tagging',
      'Compliance certification for SECP, State Bank of Pakistan (SBP), and commercial lending institutions',
      'Forensic accounting, fraud risk investigations, and financial dispute evaluations'
    ],
    deliverables: [
      'Independent Auditor’s Report with clear opinion on true and fair financial view',
      'Comprehensive Management Letter identifying internal control weaknesses with remediation steps',
      'Statutory Audit Working Paper Dossier & Trial Balance Reconciliations',
      'Regulatory compliance certificates for banking credit lines and tender qualifications'
    ],
    regulatoryBodies: [
      'Institute of Chartered Accountants of Pakistan (ICAP)',
      'Securities and Exchange Commission of Pakistan (SECP)',
      'State Bank of Pakistan (SBP)'
    ],
    keyBenefits: [
      'Elevated banking credibility and enhanced credit ratings for working capital and project financing',
      'Early detection of operational inefficiencies, fraud risks, and internal accounting discrepancies',
      'Strict adherence to SECP annual audited financial statements submission requirements'
    ],
    faqs: [
      {
        question: 'Which companies are legally required to undergo a statutory audit in Pakistan?',
        answer: 'Under Section 223 of the Companies Act 2017, all public companies, private limited companies having paid-up capital of PKR 1 Million or more, and foreign subsidiaries are mandatorily required to have their annual accounts audited by a qualified Chartered Accountant.'
      },
      {
        question: 'What is the standard turnaround time for an annual statutory audit?',
        answer: 'A standard private company audit takes between 2 to 4 weeks, depending on transaction volume, quality of accounting ledgers, and responsiveness of the client’s finance team.'
      },
      {
        question: 'What is an ICAP QCR rating and why is it important?',
        answer: 'Quality Control Review (QCR) by ICAP certifies that the firm’s audit methodology and quality management systems comply with the highest international standards, a mandatory prerequisite for auditing listed companies and large public entities.'
      }
    ]
  },
  {
    slug: 'secp-corporate',
    title: 'SECP Corporate Compliance & Secretarial',
    tagline: 'End-to-end company incorporation, statutory e-filing via eZfile, and corporate secretarial governance.',
    icon: 'Briefcase',
    image: '/assets/secp.webp',
    pill: 'SECP eZfile Certified',
    shortDescription:
      'Turnkey corporate secretarial services, digital incorporation via SECP eZfile, annual return lodgement, and foreign branch licensing.',
    fullDescription:
      'Our Corporate Secretarial Practice guides entrepreneurs, established industrial conglomerates, and multinational investors through every phase of corporate life. From initial legal structure selection and digital company incorporation on the SECP eZfile portal to statutory filings (Form A, Form 29), share capital increments, and statutory register maintenance under the Companies Act 2017.',
    scope: [
      'Incorporation of Single Member Companies (SMC-Private), Private Limited, and Public Limited entities',
      'Foreign corporate branch office and liaison office licensing via Board of Investment (BOI) & SECP',
      'Filing of annual statutory returns: Form A / Form B, Form 29, and Ultimate Beneficial Ownership (UBO)',
      'Increase in authorized and paid-up capital, issuance of right shares, and bonus allocations',
      'Drafting and tailoring of Memorandum & Articles of Association (MOA & AOA) for specialized sectors',
      'Corporate restructuring, director induction/resignation, share transfer stamping, and registered office relocation'
    ],
    deliverables: [
      'SECP Certificate of Incorporation & Digital Certified True Copies (CTC)',
      'Approved Memorandum & Articles of Association (MOA & AOA)',
      'Statutory Registers of Members, Directors, and Mortgages/Charges (Form 10/26)',
      'Annual Form A, Form 29 & UBO statutory filing receipts'
    ],
    regulatoryBodies: [
      'Securities and Exchange Commission of Pakistan (SECP)',
      'Board of Investment (BOI)',
      'State Bank of Pakistan (SBP - Foreign Exchange Operations)'
    ],
    keyBenefits: [
      'Fast-track digital incorporation within 24 to 48 hours via authorized SECP intermediary credentials',
      '100% statutory adherence preventing registrar penalties, show-cause notices, or company striking off',
      'Seamless liaison for commercial bank accounts, corporate NTN, and Chamber of Commerce registration'
    ],
    faqs: [
      {
        question: 'What is the minimum capital required to register a Private Limited Company?',
        answer: 'Pakistan does not impose a mandatory minimum paid-up capital for standard private companies; standard initial authorized capital is typically PKR 100,000 to PKR 1,000,000, keeping initial statutory filing fees low.'
      },
      {
        question: 'Can foreign nationals become directors and 100% shareholders in a Pakistani company?',
        answer: 'Yes. Foreign nationals can hold 100% equity and directorships. They require notarized/apostilled passport copies, biometric verification, and security clearance from the Ministry of Interior (MOI) coordinated through SECP.'
      },
      {
        question: 'What are the penalties for late filing of Form A or Form 29?',
        answer: 'SECP levies heavy additional filing fees and may issue adjudication show-cause notices to directors personally if statutory forms are not submitted within the prescribed 30-day window.'
      }
    ]
  },
  {
    slug: 'sez-advisory',
    title: 'Special Economic Zones (SEZ) & CPEC Advisory',
    tagline: '10-year statutory income tax holiday, customs duty exemptions, and CPEC industrial zone incentives.',
    icon: 'Globe',
    image: '/assets/SEZ.webp',
    pill: '10-Year Tax Holiday',
    shortDescription:
      'Turnkey advisory for industrial investors seeking SEZ Zone Enterprise status, 10-year income tax holidays, and zero customs duty on plant machinery.',
    fullDescription:
      'Pakistan’s Special Economic Zones Act 2012 provides unmatched fiscal incentives for greenfield industrial undertakings and foreign direct investors, particularly in M-3 Industrial City, Allama Iqbal Industrial City (AIIC), and other CPEC industrial zones. QWCA provides specialized consulting to secure zone enterprise admission, customs duty exemptions, and ensure 10-year income tax holidays are legally realized and defended.',
    scope: [
      'SEZ Zone Enterprise Admission application preparation and submission to SEZ Approval Committees',
      'Capital investment structuring to qualify for 10-year statutory income tax holiday under Section 126E',
      'Customs duty and sales tax exemption facilitation on import of capital goods, plant, and machinery',
      'Regulatory compliance reporting and liaison with Board of Investment (BOI) and SEZ Authorities',
      'Industrial land allotment advisory and infrastructure coordination with FIEDMC and PIEDMC',
      'Joint venture advisory for Chinese and international manufacturing conglomerates entering Pakistan'
    ],
    deliverables: [
      'Zone Enterprise Entry Agreement & SEZ Allotment Certificate',
      'Customs Duty & Import Sales Tax Exemption Approvals',
      'Annual SEZ Statutory Compliance & Audit Dossiers for FBR exemption retention',
      'Environmental, utility, and civil construction NOC coordination filings'
    ],
    regulatoryBodies: [
      'Board of Investment (BOI) Pakistan',
      'Federal Board of Revenue (Customs & Inland Revenue)',
      'Faisalabad Industrial Estate Development and Management Company (FIEDMC)',
      'Punjab Industrial Estates Development and Management Company (PIEDMC)'
    ],
    keyBenefits: [
      'Full 10-year tax exemption from corporate income tax under Clause 126E of the Second Schedule',
      'Zero customs duty on the import of plant, machinery, and equipment for industrial establishment',
      'Priority access to uninterrupted captive power, dry port customs clearance, and road corridors'
    ],
    faqs: [
      {
        question: 'Who qualifies for the 10-year SEZ income tax holiday?',
        answer: 'Enterprises that commence commercial production within an approved SEZ prior to statutory deadlines set in the Finance Act qualify for a full exemption from income tax for 10 consecutive years from commercial operation.'
      },
      {
        question: 'Can existing manufacturing units transfer into an SEZ to avail the holiday?',
        answer: 'The incentive is strictly reserved for new greenfield investments or substantial expansion projects meeting BOI criteria; relocation of existing machinery without new investment is disallowed.'
      },
      {
        question: 'What is the procedure for importing machinery free of customs duty into an SEZ?',
        answer: 'The enterprise must submit an import plan vetted by the SEZ developer, obtain a Weboc exemption certificate from BOI, and file goods declarations under SEZ customs regimes.'
      }
    ]
  },
  {
    slug: 'bookkeeping-bpo',
    title: 'Bookkeeping & Managed Accounting Services',
    tagline: 'Cloud accounting, outsourced bookkeeping, payroll management, and monthly financial reporting.',
    icon: 'Calculator',
    image: '/assets/meeting.jpg',
    pill: 'Cloud Accounting & Payroll',
    shortDescription:
      'Complete outsourced accounting solutions: ledger maintenance, bank reconciliation, payroll processing, and monthly management accounts.',
    fullDescription:
      'Our Managed Accounting & BPO division provides modern enterprises with reliable, audit-ready bookkeeping solutions without the overhead of maintaining an internal accounting department. Supervised by qualified Chartered Accountants, we deploy industry-standard cloud accounting platforms (QuickBooks Online, Xero, Odoo, SAP) to maintain real-time financial transparency.',
    scope: [
      'Cloud bookkeeping implementation on QuickBooks Online, Xero, Odoo, and custom ERP systems',
      'Preparation of monthly management accounts, cash flow projections, and profit & loss statements',
      'End-to-end payroll computation, pay slip generation, and statutory deductions (EOBI, PESSI, WHT)',
      'Accounts receivable, accounts payable aging analysis, and daily bank reconciliations',
      'Preparation of year-end financial schedules ready for independent statutory audit',
      'Virtual CFO advisory, budget variance analysis, and operational financial governance'
    ],
    deliverables: [
      'Monthly Profit & Loss, Balance Sheet, and Cash Flow Statements',
      'Detailed Bank Reconciliation Statements & Aged Debtor/Creditor Schedules',
      'Monthly Payroll Dossiers with EOBI & Social Security Challans',
      'Live Cloud Ledger Access and Financial KPI Dashboards'
    ],
    regulatoryBodies: [
      'Employees Old-Age Benefits Institution (EOBI)',
      'Punjab / Sindh Employees Social Security Institution (PESSI / SESSI)',
      'Federal Board of Revenue (FBR WHT Rules)'
    ],
    keyBenefits: [
      'Saves up to 60% compared to employing an in-house full-time accounts department',
      'Supervised directly by qualified Chartered Accountants ensuring pristine ledger accuracy',
      'Audit-ready books of accounts that pass external statutory audits seamlessly'
    ],
    faqs: [
      {
        question: 'How do you access and safeguard our financial data?',
        answer: 'We utilize bank-grade encrypted cloud accounting platforms (QuickBooks Online, Xero) with role-based permissions, two-factor authentication, and daily automated backups.'
      },
      {
        question: 'Can you handle employee payroll and statutory deductions like EOBI?',
        answer: 'Yes. We manage monthly payroll calculations, withholding tax deductions, EOBI portal filings, and provincial social security (PESSI) challan generation.'
      },
      {
        question: 'Is outsourced bookkeeping suitable for small businesses and startups?',
        answer: 'Absolutely. It provides early-stage companies with chartered accountant-level financial oversight at a fraction of the cost of a full-time finance manager.'
      }
    ]
  },
  {
    slug: 'financial-due-diligence',
    title: 'Financial Due Diligence & Valuation Advisory',
    tagline: 'Transaction advisory, business valuation, M&A due diligence, and feasibility studies.',
    icon: 'TrendingUp',
    image: '/assets/office.jpg',
    pill: 'M&A & Deal Advisory',
    shortDescription:
      'Strategic valuation advisory, buy-side and sell-side financial due diligence, Quality of Earnings analysis, and bankable project feasibility studies.',
    fullDescription:
      'QWCA provides corporate transactions advisory to corporate buyers, private investors, and financial institutions navigating mergers, acquisitions, and joint ventures in Pakistan. We conduct comprehensive Financial Due Diligence (FDD) to uncover hidden liabilities, assess Quality of Earnings (QoE), and establish realistic enterprise valuations using international methodology.',
    scope: [
      'Buy-side and sell-side financial due diligence investigations for mergers, acquisitions, and equity buy-ins',
      'Independent business valuation using Discounted Cash Flow (DCF), market multiples, and asset-based methods',
      'Commercial and financial feasibility studies for greenfield projects and bank project financing',
      'Quality of Earnings (QoE) analysis, normalized working capital assessments, and debt-like items identification',
      'Corporate financial modeling, sensitivity analysis, and debt restructuring proposals',
      'Assistance in drafting Share Purchase Agreements (SPA) financial covenants and escrow terms'
    ],
    deliverables: [
      'Comprehensive Financial Due Diligence (FDD) Assessment Report',
      'Formal Business Valuation Opinion Report with sensitivity models',
      'Bankable Project Feasibility Studies compliant with SBP prudential regulations',
      'Post-Merger Integration & Financial Governance Blueprint'
    ],
    regulatoryBodies: [
      'Securities and Exchange Commission of Pakistan (SECP)',
      'State Bank of Pakistan (SBP Banking Policy)',
      'Competition Commission of Pakistan (CCP)'
    ],
    keyBenefits: [
      'Identifies hidden balance sheet liabilities, off-market commitments, and historical tax exposures',
      'Strengthens deal negotiation position with empirically backed valuation multiples',
      'Satisfies commercial bank credit approval committees for multi-million financing facilities'
    ],
    faqs: [
      {
        question: 'What is the primary difference between a statutory audit and financial due diligence?',
        answer: 'A statutory audit verifies whether past historical statements are true and fair. Financial due diligence looks forward and backward to assess sustainable earnings (Quality of Earnings), working capital needs, tax exposures, and commercial risks for a prospective transaction.'
      },
      {
        question: 'Which valuation methodologies do you employ for Pakistani businesses?',
        answer: 'We employ Discounted Cash Flow (DCF), Capitalization of Earnings, Comparable Company Multiples (EV/EBITDA, P/E), and Net Asset Value (NAV), tailored to the target company’s industry and asset structure.'
      },
      {
        question: 'Do you prepare project feasibility reports for bank loans?',
        answer: 'Yes. We prepare detailed bankable feasibility studies with 5-to-10-year financial projections, sensitivity models, and debt service coverage ratios (DSCR) compliant with SBP prudential regulations.'
      }
    ]
  }
];
