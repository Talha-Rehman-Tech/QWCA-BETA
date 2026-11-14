export interface ServiceDetail {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
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
    title: 'Taxation & Advisory',
    tagline: 'Strategic tax compliance, e-filing, and representation before FBR & provincial authorities.',
    icon: 'FileText',
    shortDescription:
      'Comprehensive tax preparation, strategic planning, and representation before FBR, PRA, and provincial revenue authorities.',
    fullDescription:
      'Our Taxation & Advisory division assists corporate entities, partnerships, and high-net-worth individuals in navigating Pakistan’s evolving fiscal framework. We provide end-to-end guidance covering direct taxation under the Income Tax Ordinance 2001, sales tax on services under provincial statutes (PRA, SRB, BRA, KPRA), and federal sales tax on goods.',
    scope: [
      'Corporate and individual annual income tax return filing on Iris portal',
      'Federal and provincial sales tax registrations (STRN) and monthly e-filing',
      'Withholding tax (WHT) statements, reconciliation, and audit defense',
      'Representation before Commissioners (Appeals) and Appellate Tribunal Inland Revenue (ATIR)',
      'Alternate Corporate Tax (ACT Section 113C) and Super Tax (Section 4C) assessments',
      'Cross-border transfer pricing, double taxation avoidance treaties, and withholding exemptions'
    ],
    deliverables: [
      'Annual Income Tax Assessment Dossiers',
      'Monthly Sales Tax & Withholding Tax Certificates',
      'Tax Audit & Inquiry Response Briefs',
      'Advance Tax Computation Schedules',
      'FBR Active Taxpayer List (ATL) Status Verification'
    ],
    regulatoryBodies: [
      'Federal Board of Revenue (FBR)',
      'Punjab Revenue Authority (PRA)',
      'Sindh Revenue Board (SRB)',
      'Khyber Pakhtunkhwa Revenue Authority (KPRA)'
    ],
    keyBenefits: [
      'Zero penalty risk through strict statutory calendar tracking',
      'Optimal tax structuring reducing admissible tax liability legally',
      'Representation by seasoned Chartered Accountants during audits and show-cause notices'
    ],
    faqs: [
      {
        question: 'When is the deadline for filing corporate income tax returns in Pakistan?',
        answer: 'For companies whose tax year ends on June 30, the statutory deadline under the Income Tax Ordinance is December 31 following the end of the tax year. For special tax year companies, it is within six months of the closing date.'
      },
      {
        question: 'What is the rate of Super Tax under Section 4C?',
        answer: 'Super Tax applies on high-earning individuals, AOPs, and companies whose income exceeds PKR 150 Million, with progressive brackets scaling up to 10% depending on the applicable tax year and income tier.'
      }
    ]
  },
  {
    slug: 'audit-assurance',
    title: 'Audit & Assurance',
    tagline: 'Independent statutory audits, internal controls evaluation, and IFRS financial reporting.',
    icon: 'ShieldCheck',
    shortDescription:
      'Rigorous, independent audits and assurance engagements that enhance reporting integrity and internal governance.',
    fullDescription:
      'As an ICAP-approved practicing firm, QWCA delivers robust audit and assurance engagements conducted in full conformity with International Standards on Auditing (ISA) and the Companies Act 2017. Our audits build trust among financial institutions, shareholders, regulatory bodies, and business partners.',
    scope: [
      'Statutory financial statement audits for private, public, and non-profit entities',
      'Preparation of financial statements in compliance with IFRS and IFRS for SMEs',
      'Comprehensive internal audit, risk assessment, and standard operating procedures (SOP) design',
      'Special purpose assurance engagements, inventory physical verification, and asset valuations',
      'Due diligence investigations for mergers, acquisitions, and joint ventures',
      'Compliance certification for SECP, State Bank of Pakistan (SBP), and commercial lenders'
    ],
    deliverables: [
      'Independent Auditor’s Report with opinion on financial truth and fairness',
      'Management Letter highlighting internal control deficiencies and recommendations',
      'Detailed Trial Balance & Audit Working Papers',
      'Regulatory compliance certifications'
    ],
    regulatoryBodies: [
      'Institute of Chartered Accountants of Pakistan (ICAP)',
      'Securities and Exchange Commission of Pakistan (SECP)',
      'State Bank of Pakistan (SBP)'
    ],
    keyBenefits: [
      'Enhanced credit rating and banking credibility for credit lines and project loans',
      'Early detection of operational inefficiencies, fraud risks, and accounting irregularities',
      'Full compliance with SECP annual filing requirements'
    ],
    faqs: [
      {
        question: 'Which companies are legally required to undergo a statutory audit in Pakistan?',
        answer: 'Under Section 223 of the Companies Act 2017, all public companies, private limited companies having paid-up capital of PKR 1 Million or more (or as specified by SECP), and foreign subsidiaries are mandatorily required to have their annual accounts audited by a qualified Chartered Accountant.'
      },
      {
        question: 'How long does an annual financial audit typically take?',
        answer: 'A standard private company audit takes between 2 to 4 weeks, depending on the volume of transactions, quality of accounting records, and responsiveness of the client’s finance department.'
      }
    ]
  },
  {
    slug: 'secp-corporate',
    title: 'SECP & Corporate Services',
    tagline: 'End-to-end secretarial, incorporation, and corporate governance solutions under Companies Act 2017.',
    icon: 'Briefcase',
    shortDescription:
      'End-to-end secretarial and advisory solutions for company formation, statutory corporate filings, and compliance.',
    fullDescription:
      'Our Corporate Secretarial Practice guides entrepreneurs, established conglomerates, and multinational investors through every stage of corporate life. From initial entity structuring and digital incorporation on the SECP eZfile portal to ongoing statutory filings (Form A, Form 29), capital increases, and statutory register maintenance.',
    scope: [
      'Incorporation of Single Member Companies (SMC-Private), Private Limited, and Public Limited entities',
      'Foreign company branch office / liaison office registration with Board of Investment (BOI) and SECP',
      'Preparation and filing of statutory annual returns (Form A / Form B) and management updates (Form 29)',
      'Increase in authorized and paid-up share capital, issuance of shares, and rights issues',
      'Drafting of Memorandum and Articles of Association (MOA & AOA) tailored to industry requirements',
      'Corporate restructuring, share transfers, director changes, and registered office relocation'
    ],
    deliverables: [
      'SECP Certificate of Incorporation and Digital Certified True Copies (CTC)',
      'Formal MOA & AOA endorsed by SECP',
      'Updated statutory registers of members, directors, and mortgages',
      'Annual Form A / Form 29 filing acknowledgments'
    ],
    regulatoryBodies: [
      'Securities and Exchange Commission of Pakistan (SECP)',
      'Board of Investment (BOI)',
      'State Bank of Pakistan (SBP) Foreign Exchange Operations'
    ],
    keyBenefits: [
      'Fast-track digital incorporation via SECP eZfile system',
      'Peace of mind knowing all company statutory records match federal registrar filings',
      'Seamless onboarding for banking accounts, corporate NTN, and chamber memberships'
    ],
    faqs: [
      {
        question: 'What is the minimum capital required to register a Private Limited Company?',
        answer: 'Pakistan does not impose a mandatory minimum paid-up capital for standard private companies; common starting authorized capital is PKR 100,000 to PKR 1,000,000, which keeps statutory registration fees minimal.'
      },
      {
        question: 'Can foreign nationals become directors in a Pakistani company?',
        answer: 'Yes. Foreign nationals can be 100% shareholders and directors. They must submit notarized passport copies, biometric verification / undertaking, and undergo Ministry of Interior (MOI) security clearance facilitated through SECP.'
      }
    ]
  },
  {
    slug: 'sez-advisory',
    title: 'Special Economic Zones (SEZ) Advisory',
    tagline: 'Unlock 10-year income tax holidays, customs duty exemptions, and CPEC industrial zone incentives.',
    icon: 'Globe',
    shortDescription:
      'Specialized advisory for industrial enterprises and developers operating within Special Economic Zones (SEZs).',
    fullDescription:
      'Pakistan’s Special Economic Zones Act 2012 provides unmatched fiscal incentives for greenfield industrial undertakings and foreign direct investors, particularly in M-3 Industrial City, Allama Iqbal Industrial City (AIIC), and other CPEC zones. QWCA provides specialized consulting to secure zone enterprise status and ensure tax holidays are fully realized.',
    scope: [
      'Zone Enterprise Admission application preparation and submission to SEZ Committees',
      'Structuring industrial capital investments to qualify for the 10-year statutory income tax holiday',
      'Assistance with one-time customs duty and sales tax exemptions on capital goods and machinery imports',
      'Ongoing compliance reporting to the Board of Investment (BOI) and SEZ Authorities',
      'Coordination with FIEDMC, PIEDMC, and relevant development management companies'
    ],
    deliverables: [
      'Zone Enterprise Entry Agreement & Approval Certificate',
      'Customs Duty Exemption Import Certificates',
      'Annual SEZ Incentive Compliance Dossiers for FBR audits',
      'Utility allotment & industrial clearance paperwork'
    ],
    regulatoryBodies: [
      'Board of Investment (BOI) Pakistan',
      'SEZ Approval Committee (Federal / Provincial)',
      'Faisalabad Industrial Estate Development and Management Company (FIEDMC)',
      'Federal Board of Revenue (Customs & Inland Revenue)'
    ],
    keyBenefits: [
      'Exemption from all income taxes under the Income Tax Ordinance for a period of 10 years',
      'Zero customs duty on the import of plant, machinery, and equipment for setting up the industrial unit',
      'Prime industrial infrastructure with dedicated power, gas, and dry port connectivity'
    ],
    faqs: [
      {
        question: 'Who qualifies for the 10-year SEZ income tax holiday?',
        answer: 'Enterprises that commence commercial production within an approved SEZ prior to statutory deadlines set in the Finance Act qualify for a full exemption from income tax for 10 consecutive years from the commencement of commercial production.'
      },
      {
        question: 'Can existing manufacturing units transfer into an SEZ to avail the holiday?',
        answer: 'The incentive is strictly reserved for new investments, greenfield setups, or substantial expansion projects meeting BOI criteria; relocation of existing machinery without new investment is generally disallowed.'
      }
    ]
  }
];

