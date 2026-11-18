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

