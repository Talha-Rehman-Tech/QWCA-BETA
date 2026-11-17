export interface SalarySlab {
  min: number;
  max: number;
  rate: number;
  baseTax: number;
  rangeText: string;
  rateText: string;
  payableText: string;
  formulaDesc: string;
}

export interface YearSalaryConfig {
  label: string;
  title: string;
  desc: string;
  slabs: SalarySlab[];
}

export const SALARY_TAX_DATA: Record<string, YearSalaryConfig> = {
  '2026-2027': {
    label: 'Tax Year 2026–2027',
    title: 'Income Tax Slabs 2026–2027',
    desc: 'Tax Year 2026–2027 retains the Rs 600,000 basic exemption while restructuring middle and upper bracket rates.',
    slabs: [
      {
        min: 0,
        max: 600000,
        rate: 0,
        baseTax: 0,
        rangeText: 'Up to Rs 600,000',
        rateText: '0%',
        payableText: 'Exempt',
        formulaDesc: 'Tax exempt (0% tax payable)'
      },
      {
        min: 600000,
        max: 1200000,
        rate: 0.01,
        baseTax: 0,
        rangeText: 'Rs 600,001 – Rs 1,200,000',
        rateText: '1%',
        payableText: '1% of amount above Rs 600,000',
        formulaDesc: '1% of the amount exceeding Rs 600,000'
      },
      {
        min: 1200000,
        max: 2200000,
        rate: 0.11,
        baseTax: 6000,
        rangeText: 'Rs 1,200,001 – Rs 2,200,000',
        rateText: '11%',
        payableText: 'Rs 6,000 + 11% of amount above Rs 1,200,000',
        formulaDesc: 'Rs 6,000 + 11% of amount exceeding Rs 1,200,000'
      },
      {
        min: 2200000,
        max: 3200000,
        rate: 0.20,
        baseTax: 116000,
        rangeText: 'Rs 2,200,001 – Rs 3,200,000',
        rateText: '20%',
        payableText: 'Rs 116,000 + 20% of amount above Rs 2,200,000',
        formulaDesc: 'Rs 116,000 + 20% of amount exceeding Rs 2,200,000'
      },
      {
        min: 3200000,
        max: 4100000,
        rate: 0.25,
        baseTax: 316000,
        rangeText: 'Rs 3,200,001 – Rs 4,100,000',
        rateText: '25%',
        payableText: 'Rs 316,000 + 25% of amount above Rs 3,200,000',
        formulaDesc: 'Rs 316,000 + 25% of amount exceeding Rs 3,200,000'
      },
      {
        min: 4100000,
        max: 5600000,
        rate: 0.29,
        baseTax: 541000,
        rangeText: 'Rs 4,100,001 – Rs 5,600,000',
        rateText: '29%',
        payableText: 'Rs 541,000 + 29% of amount above Rs 4,100,000',
        formulaDesc: 'Rs 541,000 + 29% of amount exceeding Rs 4,100,000'
      },
      {
        min: 5600000,
        max: 7000000,
        rate: 0.32,
        baseTax: 976000,
        rangeText: 'Rs 5,600,001 – Rs 7,000,000',
        rateText: '32%',
        payableText: 'Rs 976,000 + 32% of amount above Rs 5,600,000',
        formulaDesc: 'Rs 976,000 + 32% of amount exceeding Rs 5,600,000'
      },
      {
        min: 7000000,
        max: Infinity,
        rate: 0.35,
        baseTax: 1424000,
        rangeText: 'Above Rs 7,000,000',
        rateText: '35%',
        payableText: 'Rs 1,424,000 + 35% of amount above Rs 7,000,000',
        formulaDesc: 'Rs 1,424,000 + 35% of amount exceeding Rs 7,000,000'
      }
    ]
  },
  '2025-2026': {
    label: 'Tax Year 2025–2026',
    title: 'Income Tax Slabs 2025–2026',
    desc: 'Progressive salary tax slab rates applicable for Tax Year 2025–2026 under the FBR Income Tax Ordinance.',
    slabs: [
      {
        min: 0,
        max: 600000,
        rate: 0,
        baseTax: 0,
        rangeText: 'Up to Rs 600,000',
        rateText: '0%',
        payableText: '0% (Tax-Free / Exempt)',
        formulaDesc: 'Tax exempt (0% tax payable)'
      },
      {
        min: 600000,
        max: 1200000,
        rate: 0.01,
        baseTax: 0,
        rangeText: 'Rs 600,001 to Rs 1,200,000',
        rateText: '1%',
        payableText: '1% of amount exceeding Rs 600,000',
        formulaDesc: '1% of the amount exceeding Rs 600,000'
      },
      {
        min: 1200000,
        max: 2200000,
        rate: 0.11,
        baseTax: 6000,
        rangeText: 'Rs 1,200,001 to Rs 2,200,000',
        rateText: '11%',
        payableText: 'Rs 6,000 + 11% of amount exceeding Rs 1,200,000',
        formulaDesc: 'Rs 6,000 + 11% of amount exceeding Rs 1,200,000'
      },
      {
        min: 2200000,
        max: 3200000,
        rate: 0.23,
        baseTax: 116000,
        rangeText: 'Rs 2,200,001 to Rs 3,200,000',
        rateText: '23%',
        payableText: 'Rs 116,000 + 23% of amount exceeding Rs 2,200,000',
        formulaDesc: 'Rs 116,000 + 23% of amount exceeding Rs 2,200,000'
      },
      {
        min: 3200000,
        max: 4100000,
        rate: 0.30,
        baseTax: 346000,
        rangeText: 'Rs 3,200,001 to Rs 4,100,000',
        rateText: '30%',
        payableText: 'Rs 346,000 + 30% of amount exceeding Rs 3,200,000',
        formulaDesc: 'Rs 346,000 + 30% of amount exceeding Rs 3,200,000'
      },
      {
        min: 4100000,
        max: Infinity,
        rate: 0.35,
        baseTax: 616000,
        rangeText: 'Above Rs 4,100,000',
        rateText: '35%',
        payableText: 'Rs 616,000 + 35% of amount exceeding Rs 4,100,000',
        formulaDesc: 'Rs 616,000 + 35% of amount exceeding Rs 4,100,000'
      }
    ]
  },
  '2024-2025': {
    label: 'Tax Year 2024–2025',
    title: 'Income Tax Slabs 2024–2025',
    desc: 'Official FBR tax slab rates for salaried individuals for Tax Year 2024–2025.',
    slabs: [
      {
        min: 0,
        max: 600000,
        rate: 0,
        baseTax: 0,
        rangeText: 'Up to Rs 600,000',
        rateText: '0%',
        payableText: '0% (Exempt)',
        formulaDesc: 'Tax exempt (0% tax payable)'
      },
      {
        min: 600000,
        max: 1200000,
        rate: 0.05,
        baseTax: 0,
        rangeText: 'Rs 600,001 to Rs 1,200,000',
        rateText: '5%',
        payableText: '5% of amount exceeding Rs 600,000',
        formulaDesc: '5% of the amount exceeding Rs 600,000'
      },
      {
        min: 1200000,
        max: 2400000,
        rate: 0.15,
        baseTax: 30000,
        rangeText: 'Rs 1,200,001 to Rs 2,400,000',
        rateText: '15%',
        payableText: 'Rs 30,000 + 15% of amount exceeding Rs 1,200,000',
        formulaDesc: 'Rs 30,000 + 15% of amount exceeding Rs 1,200,000'
      },
      {
        min: 2400000,
        max: 3600000,
        rate: 0.25,
        baseTax: 210000,
        rangeText: 'Rs 2,400,001 to Rs 3,600,000',
        rateText: '25%',
        payableText: 'Rs 210,000 + 25% of amount exceeding Rs 2,400,000',
        formulaDesc: 'Rs 210,000 + 25% of amount exceeding Rs 2,400,000'
      },
      {
        min: 3600000,
        max: Infinity,
        rate: 0.35,
        baseTax: 510000,
        rangeText: 'Above Rs 3,600,000',
        rateText: '35%',
        payableText: 'Rs 510,000 + 35% of amount exceeding Rs 3,600,000',
        formulaDesc: 'Rs 510,000 + 35% of amount exceeding Rs 3,600,000'
      }
    ]
  },
  '2023-2024': {
    label: 'Tax Year 2023–2024',
    title: 'Income Tax Slabs 2023–2024',
    desc: 'Historical FBR salaried tax slabs for Tax Year 2023–2024.',
    slabs: [
      {
        min: 0,
        max: 600000,
        rate: 0,
        baseTax: 0,
        rangeText: 'Up to Rs 600,000',
        rateText: '0%',
        payableText: '0% (Exempt)',
        formulaDesc: 'Tax exempt (0% tax payable)'
      },
      {
        min: 600000,
        max: 1200000,
        rate: 0.025,
        baseTax: 0,
        rangeText: 'Rs 600,001 to Rs 1,200,000',
        rateText: '2.5%',
        payableText: '2.5% of amount exceeding Rs 600,000',
        formulaDesc: '2.5% of amount exceeding Rs 600,000'
      },
      {
        min: 1200000,
        max: 2400000,
        rate: 0.125,
        baseTax: 15000,
        rangeText: 'Rs 1,200,001 to Rs 2,400,000',
        rateText: '12.5%',
        payableText: 'Rs 15,000 + 12.5% of amount exceeding Rs 1,200,000',
        formulaDesc: 'Rs 15,000 + 12.5% of amount exceeding Rs 1,200,000'
      },
      {
        min: 2400000,
        max: 3600000,
        rate: 0.225,
        baseTax: 165000,
        rangeText: 'Rs 2,400,001 to Rs 3,600,000',
        rateText: '22.5%',
        payableText: 'Rs 165,000 + 22.5% of amount exceeding Rs 2,400,000',
        formulaDesc: 'Rs 165,000 + 22.5% of amount exceeding Rs 2,400,000'
      },
      {
        min: 3600000,
        max: Infinity,
        rate: 0.35,
        baseTax: 435000,
        rangeText: 'Above Rs 3,600,000',
        rateText: '35%',
        payableText: 'Rs 435,000 + 35% of amount exceeding Rs 3,600,000',
        formulaDesc: 'Rs 435,000 + 35% of amount exceeding Rs 3,600,000'
      }
    ]
  }
};

// Business Non-Salaried & AOP Slabs
export const NON_SALARIED_SLABS = {
  '2026-2027': [
    { min: 0, max: 600000, fixed: 0, rate: 0, rateText: '0%', desc: '0% (Tax-Free / Exempt)', rangeText: 'Up to Rs. 600,000' },
    { min: 600000, max: 1200000, fixed: 0, rate: 0.15, rateText: '15%', desc: '15% of the amount exceeding Rs. 600,000', rangeText: 'Rs. 600,001 to Rs. 1,200,000' },
    { min: 1200000, max: 1600000, fixed: 90000, rate: 0.20, rateText: '20%', desc: 'Rs. 90,000 + 20% of the amount exceeding Rs. 1,200,000', rangeText: 'Rs. 1,200,001 to Rs. 1,600,000' },
    { min: 1600000, max: 3200000, fixed: 170000, rate: 0.30, rateText: '30%', desc: 'Rs. 170,000 + 30% of the amount exceeding Rs. 1,600,000', rangeText: 'Rs. 1,600,001 to Rs. 3,200,000' },
    { min: 3200000, max: 5600000, fixed: 650000, rate: 0.40, rateText: '40%', desc: 'Rs. 650,000 + 40% of the amount exceeding Rs. 3,200,000', rangeText: 'Rs. 3,200,001 to Rs. 5,600,000' },
    { min: 5600000, max: Infinity, fixed: 1610000, rate: 0.45, rateText: '45%', desc: 'Rs. 1,610,000 + 45% of the amount exceeding Rs. 5,600,000', rangeText: 'Exceeding Rs. 5,600,000' }
  ],
  '2025-2026': [
    { min: 0, max: 600000, fixed: 0, rate: 0, rateText: '0%', desc: '0% (Tax-Free)', rangeText: 'Up to Rs. 600,000' },
    { min: 600000, max: 1200000, fixed: 0, rate: 0.15, rateText: '15%', desc: '15% of amount exceeding Rs. 600,000', rangeText: 'Rs. 600,001 to Rs. 1,200,000' },
    { min: 1200000, max: 1600000, fixed: 90000, rate: 0.20, rateText: '20%', desc: 'Rs. 90,000 + 20% of amount exceeding Rs. 1,200,000', rangeText: 'Rs. 1,200,001 to Rs. 1,600,000' },
    { min: 1600000, max: 3200000, fixed: 170000, rate: 0.30, rateText: '30%', desc: 'Rs. 170,000 + 30% of amount exceeding Rs. 1,600,000', rangeText: 'Rs. 1,600,001 to Rs. 3,200,000' },
    { min: 3200000, max: 5600000, fixed: 650000, rate: 0.40, rateText: '40%', desc: 'Rs. 650,000 + 40% of amount exceeding Rs. 3,200,000', rangeText: 'Rs. 3,200,001 to Rs. 5,600,000' },
    { min: 5600000, max: Infinity, fixed: 1610000, rate: 0.45, rateText: '45%', desc: 'Rs. 1,610,000 + 45% of amount exceeding Rs. 5,600,000', rangeText: 'Above Rs. 5,600,000' }
  ],
  '2024-2025': [
    { min: 0, max: 600000, fixed: 0, rate: 0, rateText: '0%', desc: '0% (Tax-Free)', rangeText: 'Up to Rs. 600,000' },
    { min: 600000, max: 1200000, fixed: 0, rate: 0.15, rateText: '15%', desc: '15% of amount exceeding Rs. 600,000', rangeText: 'Rs. 600,001 to Rs. 1,200,000' },
    { min: 1200000, max: 1600000, fixed: 90000, rate: 0.20, rateText: '20%', desc: 'Rs. 90,000 + 20% of amount exceeding Rs. 1,200,000', rangeText: 'Rs. 1,200,001 to Rs. 1,600,000' },
    { min: 1600000, max: 3200000, fixed: 170000, rate: 0.30, rateText: '30%', desc: 'Rs. 170,000 + 30% of amount exceeding Rs. 1,600,000', rangeText: 'Rs. 1,600,001 to Rs. 3,200,000' },
    { min: 3200000, max: 5600000, fixed: 650000, rate: 0.40, rateText: '40%', desc: 'Rs. 650,000 + 40% of amount exceeding Rs. 3,200,000', rangeText: 'Rs. 3,200,001 to Rs. 5,600,000' },
    { min: 5600000, max: Infinity, fixed: 1610000, rate: 0.45, rateText: '45%', desc: 'Rs. 1,610,000 + 45% of amount exceeding Rs. 5,600,000', rangeText: 'Above Rs. 5,600,000' }
  ],
  '2023-2024': [
    { min: 0, max: 600000, fixed: 0, rate: 0, rateText: '0%', desc: '0% (Tax-Free)', rangeText: 'Up to Rs. 600,000' },
    { min: 600000, max: 800000, fixed: 0, rate: 0.075, rateText: '7.5%', desc: '7.5% of amount exceeding Rs. 600,000', rangeText: 'Rs. 600,001 – Rs. 800,000' },
    { min: 800000, max: 1200000, fixed: 15000, rate: 0.15, rateText: '15%', desc: 'Rs. 15,000 + 15% of amount exceeding Rs. 800,000', rangeText: 'Rs. 800,001 – Rs. 1,200,000' },
    { min: 1200000, max: 2400000, fixed: 75000, rate: 0.20, rateText: '20%', desc: 'Rs. 75,000 + 20% of amount exceeding Rs. 1,200,000', rangeText: 'Rs. 1,200,001 – Rs. 2,400,000' },
    { min: 2400000, max: 3000000, fixed: 315000, rate: 0.25, rateText: '25%', desc: 'Rs. 315,000 + 25% of amount exceeding Rs. 2,400,000', rangeText: 'Rs. 2,400,001 – Rs. 3,000,000' },
    { min: 3000000, max: 4000000, fixed: 465000, rate: 0.30, rateText: '30%', desc: 'Rs. 465,000 + 30% of amount exceeding Rs. 3,000,000', rangeText: 'Rs. 3,000,001 – Rs. 4,000,000' },
    { min: 4000000, max: Infinity, fixed: 765000, rate: 0.35, rateText: '35%', desc: 'Rs. 765,000 + 35% of amount exceeding Rs. 4,000,000', rangeText: 'Above Rs. 4,000,000' }
  ]
};

// Super Tax (Section 4C) progressive brackets
export const SUPER_TAX_BRACKETS = [
  { min: 0, max: 150000000, rate: 0, text: 'Up to PKR 150 Million', rateText: '0% (Nil)' },
  { min: 150000000, max: 200000000, rate: 0.01, text: 'PKR 150M – PKR 200 Million', rateText: '1%' },
  { min: 200000000, max: 250000000, rate: 0.02, text: 'PKR 200M – PKR 250 Million', rateText: '2%' },
  { min: 250000000, max: 300000000, rate: 0.03, text: 'PKR 250M – PKR 300 Million', rateText: '3%' },
  { min: 300000000, max: 350000000, rate: 0.04, text: 'PKR 300M – PKR 350 Million', rateText: '4%' },
  { min: 350000000, max: 400000000, rate: 0.06, text: 'PKR 350M – PKR 400 Million', rateText: '6%' },
  { min: 400000000, max: 500000000, rate: 0.08, text: 'PKR 400M – PKR 500 Million', rateText: '8%' },
  { min: 500000000, max: Infinity, rate: 0.10, text: 'Above PKR 500 Million', rateText: '10%' }
];

// Rental Property Slabs (Section 155)
export const RENTAL_SLABS = [
  { min: 0, max: 300000, rate: 0, fixed: 0, rangeText: 'Up to Rs. 300,000', rateText: '0% (Nil)', formula: 'Rs. 0 (Tax-Free threshold)' },
  { min: 300000, max: 600000, rate: 0.05, fixed: 0, rangeText: 'Rs. 300,001 to Rs. 600,000', rateText: '5%', formula: '5% of gross rent exceeding Rs. 300,000' },
  { min: 600000, max: 2000000, rate: 0.10, fixed: 15000, rangeText: 'Rs. 600,001 to Rs. 2,000,000', rateText: '10%', formula: 'Rs. 15,000 + 10% of gross rent exceeding Rs. 600,000' },
  { min: 2000000, max: Infinity, rate: 0.25, fixed: 155000, rangeText: 'Above Rs. 2,000,000', rateText: '25%', formula: 'Rs. 155,000 + 25% of gross rent exceeding Rs. 2,000,000' }
];

// ==========================================================================
// PROPERTY & REAL ESTATE TAX DATA (Sections 236K, 236C, 37 & Provincial)
// ==========================================================================

export interface PropertyPurchaseSlab {
  min: number;
  max: number;
  filerRate: number;
  nonFilerRate: number;
  overseasRate: number;
  label: string;
}

// 1. Purchase Tax (Section 236K) - Withholding on Buyer
export const PROPERTY_PURCHASE_SLABS: PropertyPurchaseSlab[] = [
  {
    min: 0,
    max: 50000000,
    filerRate: 0.0125,
    nonFilerRate: 0.105,
    overseasRate: 0.0125,
    label: 'Up to Rs. 50 Million',
  },
  {
    min: 50000000,
    max: 100000000,
    filerRate: 0.0125,
    nonFilerRate: 0.145,
    overseasRate: 0.0125,
    label: 'Rs. 50 Million to Rs. 100 Million',
  },
  {
    min: 100000000,
    max: Infinity,
    filerRate: 0.0125,
    nonFilerRate: 0.185,
    overseasRate: 0.0125,
    label: 'Above Rs. 100 Million',
  },
];

// 2. Sale Tax & Advance Withholding (Section 236C) - Withholding on Seller
export const PROPERTY_SALE_RATES = {
  filer: 0.0275,
  nonFiler: 0.115,
  overseas: 0.0275,
};

// 3. Capital Gains Tax on Immovable Property (Section 37) - Pre-July 2024 Schedule
export interface CGTHoldingBracket {
  periodId: string;
  label: string;
  openPlotRate: number;
  constructedRate: number;
  flatRate: number;
}

export const CGT_HOLDING_SCHEDULE: CGTHoldingBracket[] = [
  { periodId: 'up-to-1', label: 'Up to 1 year', openPlotRate: 0.15, constructedRate: 0.15, flatRate: 0.15 },
  { periodId: '1-to-2', label: 'Over 1 to 2 years', openPlotRate: 0.125, constructedRate: 0.10, flatRate: 0.075 },
  { periodId: '2-to-3', label: 'Over 2 to 3 years', openPlotRate: 0.10, constructedRate: 0.075, flatRate: 0 },
  { periodId: '3-to-4', label: 'Over 3 to 4 years', openPlotRate: 0.075, constructedRate: 0.05, flatRate: 0 },
  { periodId: '4-to-5', label: 'Over 4 to 5 years', openPlotRate: 0.05, constructedRate: 0, flatRate: 0 },
  { periodId: '5-to-6', label: 'Over 5 to 6 years', openPlotRate: 0.025, constructedRate: 0, flatRate: 0 },
  { periodId: 'over-6', label: 'Over 6 years', openPlotRate: 0, constructedRate: 0, flatRate: 0 },
];

// 4. Provincial Stamp Duty & Capital Value Tax (CVT)
export interface ProvinceRateConfig {
  id: string;
  name: string;
  stampDutyRate: number;
  cvtRate: number;
  notes: string;
}

export const PROVINCIAL_TAXES: Record<string, ProvinceRateConfig> = {
  punjab: {
    id: 'punjab',
    name: 'Punjab',
    stampDutyRate: 0.01,
    cvtRate: 0.02,
    notes: 'Stamp Duty 1% on DC Value; CVT 2% on recorded value.',
  },
  sindh: {
    id: 'sindh',
    name: 'Sindh',
    stampDutyRate: 0.02,
    cvtRate: 0.02,
    notes: 'Stamp Duty 2% on FBR/DC value; CVT 2% applicable.',
  },
  ict: {
    id: 'ict',
    name: 'Islamabad (ICT)',
    stampDutyRate: 0.015,
    cvtRate: 0.02,
    notes: 'ICT Stamp Duty 1.5%; CVT 2% federal territory.',
  },
  kpk: {
    id: 'kpk',
    name: 'Khyber Pakhtunkhwa (KPK)',
    stampDutyRate: 0.02,
    cvtRate: 0.02,
    notes: 'KP Revenue Authority Stamp Duty 2%; CVT 2%.',
  },
};

