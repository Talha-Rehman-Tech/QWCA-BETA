const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiHealthResponse {
  status: string;
  server: string;
  database: string;
  timestamp: string;
}

// Check Backend Server Health
export async function checkServerHealth(): Promise<{ online: boolean; data?: ApiHealthResponse }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    if (!res.ok) return { online: false };
    const data: ApiHealthResponse = await res.json();
    return { online: true, data };
  } catch {
    return { online: false };
  }
}

// Fetch All Tax Years
export async function getTaxYearsApi(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/tax-slabs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

// Fetch Specific Tax Year
export async function getTaxYearApi(year: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/tax-slabs/${year}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

// Save or Update Tax Year
export async function saveTaxYearApi(year: string, payload: any): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/tax-slabs/${year}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return { success: json.success, message: json.message || 'Saved successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to connect to backend server' };
  }
}

// Reset Tax Slabs to FBR Baseline
export async function resetTaxSlabsApi(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/tax-slabs/reset`, { method: 'POST' });
    const json = await res.json();
    return { success: json.success, message: json.message };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// Fetch Company Cost Estimation Config
export async function getCompanyCostConfigApi(): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/cost-estimation`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

// Save Company Cost Estimation Config
export async function saveCompanyCostConfigApi(payload: any): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/cost-estimation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return { success: json.success, message: json.message || 'Saved successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to connect to backend server' };
  }
}

// Reset Company Cost Estimation to Baseline
export async function resetCompanyCostConfigApi(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/cost-estimation/reset`, { method: 'POST' });
    const json = await res.json();
    return { success: json.success, message: json.message };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export const INITIAL_COMPANY_COST_CONFIG = {
  configId: 'default',
  secpBaseFilingFee: 4500,
  entityTiers: [
    {
      id: 'smc',
      name: 'Single Member Company (SMC-Private)',
      badge: 'Solo Founders',
      desc: 'Ideal for solo entrepreneurs and single business owners desiring full limited liability protection.',
      baseFee: 22000,
      highlight: false,
    },
    {
      id: 'pvt_ltd',
      name: 'Private Limited Company (Pvt. Ltd.)',
      badge: 'Most Recommended',
      desc: 'The standard choice for startups, partnerships, and small-to-medium businesses with 2 or more shareholders.',
      baseFee: 28000,
      highlight: true,
    },
    {
      id: 'llp',
      name: 'Limited Liability Partnership (LLP)',
      badge: 'Professional Practices',
      desc: 'Tailored for professional advisory practices, doctors, lawyers, and consulting partnerships under SECP LLP Act 2017.',
      baseFee: 24000,
      highlight: false,
    },
    {
      id: 'cpec_foreign',
      name: 'Foreign Owned / CPEC Enterprise',
      badge: 'International Investors',
      desc: 'Full assistance for foreign nationals, Chinese enterprises, and BOI-compliant multinational subsidiaries.',
      baseFee: 65000,
      highlight: false,
    },
  ],
  capitalTiers: [
    { id: 'cap_100k', label: 'PKR 100,000 (Base Tier)', fee: 4500, rangeText: 'Up to PKR 100,000', secpNote: 'Lowest SECP statutory challan.' },
    { id: 'cap_500k', label: 'PKR 500,000', fee: 6500, rangeText: 'PKR 100,001 to 500,000', secpNote: 'Standard starter capitalization.' },
    { id: 'cap_1m', label: 'PKR 1,000,000 (1 Million)', fee: 9500, rangeText: 'PKR 500,001 to 1,000,000', secpNote: 'Required for tenders and trade visas.' },
    { id: 'cap_5m', label: 'PKR 5,000,000 (5 Million)', fee: 24000, rangeText: 'PKR 1,000,001 to 5,000,000', secpNote: 'Commercial corporate operations.' },
    { id: 'cap_10m', label: 'PKR 10,000,000 (10 Million)', fee: 42000, rangeText: 'PKR 5,000,001 to 10,000,000', secpNote: 'Large-scale industrial & import/export.' },
  ],
  serviceAddons: [
    { id: 'fbr_ntn', name: 'Company NTN & Digital IRIS Registration', fee: 3500, desc: 'Corporate National Tax Number issuance and principal officer linkage on FBR portal.', category: 'tax', optional: true },
    { id: 'sales_tax', name: 'Federal Sales Tax (STRN) Registration', fee: 7500, desc: 'FBR Sales Tax Number with biometric verification, premises verification, and active status.', category: 'tax', optional: true },
    { id: 'chamber', name: 'Chamber of Commerce & Industry (FCCI/KCCI/LCCI)', fee: 18000, desc: 'Corporate membership certification required for export/import and government tenders.', category: 'license', optional: true },
    { id: 'weboc', name: 'WeBOC User ID (Customs Web Portal)', fee: 12000, desc: 'Mandatory customs clearing user ID for import/export clearances across Pakistani ports.', category: 'customs', optional: true },
    { id: 'trademark', name: 'IPO Trademark & Brand Protection Filing', fee: 22000, desc: 'Official Intellectual Property Organization (IPO) Pakistan brand trademark application filing.', category: 'legal', optional: true },
    { id: 'bank_resolution', name: 'Bank Account Resolution Drafting & Filing', fee: 2500, desc: 'Corporate certified resolution and Form 29 extract for corporate commercial bank account opening.', category: 'corporate', optional: true },
  ],
};

