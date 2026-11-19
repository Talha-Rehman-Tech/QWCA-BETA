const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'qwca_admin_auth_token';

export interface AdminUser {
  username: string;
  email: string;
  name: string;
  role: string;
}

export interface ApiHealthResponse {
  status: string;
  server: string;
  database: string;
  timestamp: string;
}

// Token Storage Helpers
export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAdminToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Admin Authentication API Calls
export async function loginAdminApi(
  identifier: string,
  password: string
): Promise<{ success: boolean; message: string; token?: string; admin?: AdminUser }> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const json = await res.json();
    if (res.ok && json.success && json.token) {
      setStoredAdminToken(json.token);
      return { success: true, message: json.message, token: json.token, admin: json.admin };
    }
    return { success: false, message: json.message || 'Authentication failed' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Cannot reach authentication server' };
  }
}

export async function verifyAdminSessionApi(): Promise<{ success: boolean; admin?: AdminUser }> {
  const token = getStoredAdminToken();
  if (!token) return { success: false };

  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      setStoredAdminToken(null);
      return { success: false };
    }
    const json = await res.json();
    return { success: json.success, admin: json.admin };
  } catch {
    // If backend is momentarily unreachable, we don't automatically discard if offline
    return { success: false };
  }
}

export function logoutAdmin(): void {
  setStoredAdminToken(null);
}

export async function changeAdminPasswordApi(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const token = getStoredAdminToken();
  if (!token) return { success: false, message: 'You must be logged in to change password.' };

  try {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const json = await res.json();
    return { success: json.success, message: json.message };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update password' };
  }
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
    const data = json.data || [];
    data.sort((a: any, b: any) => b.year.localeCompare(a.year, undefined, { numeric: true }));
    return data;
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

// Save or Update Tax Year (Protected)
export async function saveTaxYearApi(year: string, payload: any): Promise<{ success: boolean; message: string }> {
  try {
    const token = getStoredAdminToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/tax-slabs/${year}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return { success: json.success, message: json.message || 'Saved successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to connect to backend server' };
  }
}

// Delete Tax Year (Protected)
export async function deleteTaxYearApi(year: string): Promise<{ success: boolean; message: string }> {
  try {
    const token = getStoredAdminToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/tax-slabs/${year}`, {
      method: 'DELETE',
      headers,
    });
    const json = await res.json();
    return { success: json.success, message: json.message || 'Deleted successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to connect to backend server' };
  }
}

// Reset Tax Slabs to FBR Baseline (Protected)
export async function resetTaxSlabsApi(): Promise<{ success: boolean; message: string }> {
  try {
    const token = getStoredAdminToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/tax-slabs/reset`, { method: 'POST', headers });
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

// Save Company Cost Estimation Config (Protected)
export async function saveCompanyCostConfigApi(payload: any): Promise<{ success: boolean; message: string }> {
  try {
    const token = getStoredAdminToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/cost-estimation`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return { success: json.success, message: json.message || 'Saved successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to connect to backend server' };
  }
}

// Reset Company Cost Estimation to Baseline (Protected)
export async function resetCompanyCostConfigApi(): Promise<{ success: boolean; message: string }> {
  try {
    const token = getStoredAdminToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/cost-estimation/reset`, { method: 'POST', headers });
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
      baseFee: 26000,
      baseGovFee: 4000,
      baseConsultingFee: 22000,
      highlight: false,
    },
    {
      id: 'pvt_ltd',
      name: 'Private Limited Company (Pvt. Ltd.)',
      badge: 'Most Recommended',
      desc: 'The standard choice for startups, partnerships, and small-to-medium businesses with 2 or more shareholders.',
      baseFee: 25000,
      baseGovFee: 5500,
      baseConsultingFee: 19500,
      highlight: true,
    },
    {
      id: 'cpec_foreign',
      name: 'Foreign Owned / CPEC Enterprise',
      badge: 'International Investors',
      desc: 'Full assistance for foreign nationals, Chinese enterprises, and BOI-compliant multinational subsidiaries.',
      baseFee: 69000,
      baseGovFee: 15000,
      baseConsultingFee: 54000,
      highlight: false,
    },
    {
      id: 'public_unlisted',
      name: 'Public Limited Company (Unlisted)',
      badge: 'Large Enterprise',
      desc: 'For large commercial, infrastructure, and industrial ventures with 3 or more directors.',
      baseFee: 85000,
      baseGovFee: 25000,
      baseConsultingFee: 60000,
      highlight: false,
    },
  ],
  capitalTiers: [
    { id: 'cap_100k', label: 'PKR 100,000 (Base Tier)', fee: 4500, rangeText: 'Up to PKR 100,000', secpNote: 'Lowest SECP statutory challan.' },
    { id: 'cap_1m', label: 'PKR 1,000,000 (1 Million)', fee: 9500, rangeText: 'PKR 500,001 to 1,000,000', secpNote: 'Required for tenders and trade visas.' },
    { id: 'cap_5m', label: 'PKR 5,000,000 (5 Million)', fee: 24000, rangeText: 'PKR 1,000,001 to 5,000,000', secpNote: 'Commercial corporate operations.' },
    { id: 'cap_10m', label: 'PKR 10,000,000 (10 Million)', fee: 42000, rangeText: 'PKR 5,000,001 to 10,000,000', secpNote: 'Large-scale industrial & import/export.' },
  ],
  serviceAddons: [
    {
      id: 'secp_incorp',
      name: 'SECP Name Availability & Online eZfile Incorporation',
      fee: 8000,
      govtFee: 3000,
      consultingFee: 5000,
      desc: 'Formal digital name reservation and filing of incorporation documents with SECP Registrar.',
      category: 'SECP & Incorporation',
      required: true,
      defaultChecked: true,
      optional: false,
    },
    {
      id: 'moa_aoa',
      name: 'Custom MOA & AOA Legal Drafting',
      fee: 7000,
      govtFee: 0,
      consultingFee: 7000,
      desc: 'Tailored Memorandum & Articles of Association vetted by Chartered Accountants for your specific industry.',
      category: 'SECP & Incorporation',
      required: false,
      defaultChecked: true,
      optional: true,
    },
    {
      id: 'fbr_ntn',
      name: 'FBR Corporate NTN & Iris System Registration',
      fee: 3500,
      govtFee: 0,
      consultingFee: 3500,
      desc: 'Enrollment with Federal Board of Revenue, Principal Officer assignment, and Active Taxpayer status.',
      category: 'Taxation & FBR',
      required: false,
      defaultChecked: true,
      optional: true,
    },
    {
      id: 'sales_tax',
      name: 'Sales Tax Registration (STRN - Federal / PRA)',
      fee: 7500,
      govtFee: 0,
      consultingFee: 7500,
      desc: 'Mandatory sales tax registration for manufacturers, importers, distributors, and registered service providers.',
      category: 'Taxation & FBR',
      required: false,
      defaultChecked: false,
      optional: true,
    },
    {
      id: 'chamber',
      name: 'Chamber of Commerce Membership (FCCI / LCCI)',
      fee: 18000,
      govtFee: 10000,
      consultingFee: 8000,
      desc: 'Corporate membership in relevant Chamber of Commerce, necessary for commercial trade and export/import.',
      category: 'Licensing & Foreign',
      required: false,
      defaultChecked: false,
      optional: true,
    },
    {
      id: 'weboc',
      name: 'WeBOC Import / Export User ID Registration',
      fee: 12000,
      govtFee: 2000,
      consultingFee: 10000,
      desc: 'Customs computerised clearance system registration for cross-border shipping, freight, and trade.',
      category: 'Licensing & Foreign',
      required: false,
      defaultChecked: false,
      optional: true,
    },
    {
      id: 'trademark',
      name: 'Trademark & Brand Name Filing (IPO Pakistan)',
      fee: 22000,
      govtFee: 3000,
      consultingFee: 19000,
      desc: 'Official search and preliminary trademark filing under applicable class to safeguard corporate brand equity.',
      category: 'IP & Operations',
      required: false,
      defaultChecked: false,
      optional: true,
    },
    {
      id: 'bank_resolution',
      name: 'Corporate Bank Account Advisory & Board Resolutions',
      fee: 2500,
      govtFee: 0,
      consultingFee: 2500,
      desc: 'Specialized board resolutions, Form 29 verification, and bank compliance assistance for corporate account opening.',
      category: 'IP & Operations',
      required: false,
      defaultChecked: true,
      optional: true,
    },
    {
      id: 'foreign_clearance',
      name: 'Foreign Director MOI Clearance & BOI Registration',
      fee: 40000,
      govtFee: 15000,
      consultingFee: 25000,
      desc: 'Ministry of Interior security clearance, Board of Investment liaison, and cross-border repatriation compliance.',
      category: 'Licensing & Foreign',
      required: false,
      defaultChecked: false,
      optional: true,
    },
  ],
};

