export interface EntityTypeOption {
  id: string;
  name: string;
  description: string;
  baseGovFee: number;
  baseConsultingFee: number;
  badge?: string;
}

export interface CapitalSlab {
  id: string;
  label: string;
  secpCapitalFee: number;
}

export interface SetupAddon {
  id: string;
  name: string;
  category: 'SECP & Incorporation' | 'Taxation & FBR' | 'Licensing & Foreign' | 'IP & Operations';
  description: string;
  govtFee: number;
  consultingFee: number;
  required?: boolean;
  defaultChecked?: boolean;
}

export const entityTypes: EntityTypeOption[] = [
  {
    id: 'smc-private',
    name: 'Single Member Company (SMC-Private)',
    description: 'Ideal for solo entrepreneurs and single business owners desiring full limited liability protection.',
    baseGovFee: 4000,
    baseConsultingFee: 22000,
    badge: 'Solo Founders'
  },
  {
    id: 'pvt-limited',
    name: 'Private Limited Company (Pvt. Ltd.)',
    description: 'The standard choice for startups, partnerships, and small-to-medium businesses with 2 or more shareholders.',
    baseGovFee: 5500,
    baseConsultingFee: 19500,
    badge: 'Most Recommended'
  },
  {
    id: 'foreign-subsidiary',
    name: 'Foreign Owned / CPEC Enterprise',
    description: 'Full assistance for foreign nationals, Chinese enterprises, and BOI-compliant multinational subsidiaries.',
    baseGovFee: 15000,
    baseConsultingFee: 54000,
    badge: 'International Investors'
  },
  {
    id: 'public-unlisted',
    name: 'Public Limited Company (Unlisted)',
    description: 'For large commercial, infrastructure, and industrial ventures with 3 or more directors.',
    baseGovFee: 25000,
    baseConsultingFee: 60000,
    badge: 'Large Enterprise'
  }
];

export const capitalSlabs: CapitalSlab[] = [
  { id: '100k', label: 'PKR 100,000 (Base Tier)', secpCapitalFee: 4500 },
  { id: '1m', label: 'PKR 1,000,000 (1 Million)', secpCapitalFee: 9500 },
  { id: '5m', label: 'PKR 5,000,000 (5 Million)', secpCapitalFee: 24000 },
  { id: '10m', label: 'PKR 10,000,000 (10 Million)', secpCapitalFee: 42000 }
];

export const setupAddons: SetupAddon[] = [
  {
    id: 'secp-incorporation',
    name: 'SECP Name Availability & Online eZfile Incorporation',
    category: 'SECP & Incorporation',
    description: 'Formal digital name reservation and filing of incorporation documents with SECP Registrar.',
    govtFee: 3000,
    consultingFee: 5000,
    required: true,
    defaultChecked: true
  },
  {
    id: 'moa-aoa-drafting',
    name: 'Custom MOA & AOA Legal Drafting',
    category: 'SECP & Incorporation',
    description: 'Tailored Memorandum & Articles of Association vetted by Chartered Accountants for your specific industry.',
    govtFee: 0,
    consultingFee: 7000,
    defaultChecked: true
  },
  {
    id: 'corporate-ntn',
    name: 'FBR Corporate NTN & Iris System Registration',
    category: 'Taxation & FBR',
    description: 'Enrollment with Federal Board of Revenue, Principal Officer assignment, and Active Taxpayer status.',
    govtFee: 0,
    consultingFee: 3500,
    defaultChecked: true
  },
  {
    id: 'sales-tax-strn',
    name: 'Sales Tax Registration (STRN - Federal / PRA)',
    category: 'Taxation & FBR',
    description: 'Mandatory sales tax registration for manufacturers, importers, distributors, and registered service providers.',
    govtFee: 0,
    consultingFee: 7500,
    defaultChecked: false
  },
  {
    id: 'chamber-membership',
    name: 'Chamber of Commerce Membership (FCCI / LCCI)',
    category: 'Licensing & Foreign',
    description: 'Corporate membership in relevant Chamber of Commerce, necessary for commercial trade and export/import.',
    govtFee: 10000,
    consultingFee: 8000,
    defaultChecked: false
  },
  {
    id: 'weboc-import-export',
    name: 'WeBOC Import / Export User ID Registration',
    category: 'Licensing & Foreign',
    description: 'Customs computerised clearance system registration for cross-border shipping, freight, and trade.',
    govtFee: 2000,
    consultingFee: 10000,
    defaultChecked: false
  },
  {
    id: 'trademark-filing',
    name: 'Trademark & Brand Name Filing (IPO Pakistan)',
    category: 'IP & Operations',
    description: 'Official search and preliminary trademark filing under applicable class to safeguard corporate brand equity.',
    govtFee: 3000,
    consultingFee: 19000,
    defaultChecked: false
  },
  {
    id: 'bank-account-resolution',
    name: 'Corporate Bank Account Advisory & Board Resolutions',
    category: 'IP & Operations',
    description: 'Specialized board resolutions, Form 29 verification, and bank compliance assistance for corporate account opening.',
    govtFee: 0,
    consultingFee: 2500,
    defaultChecked: true
  },
  {
    id: 'foreign-director-clearance',
    name: 'Foreign Director MOI Clearance & BOI Registration',
    category: 'Licensing & Foreign',
    description: 'Ministry of Interior security clearance, Board of Investment liaison, and cross-border repatriation compliance.',
    govtFee: 15000,
    consultingFee: 25000,
    defaultChecked: false
  }
];
