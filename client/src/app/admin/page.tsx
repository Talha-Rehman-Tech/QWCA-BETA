'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Building2,
  Server,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Coins
} from 'lucide-react';
import {
  checkServerHealth,
  getTaxYearsApi,
  saveTaxYearApi,
  resetTaxSlabsApi,
  getCompanyCostConfigApi,
  saveCompanyCostConfigApi,
  resetCompanyCostConfigApi,
  INITIAL_COMPANY_COST_CONFIG,
  ApiHealthResponse
} from '@/lib/api';
import {
  SALARY_TAX_DATA,
  NON_SALARIED_SLABS,
  SUPER_TAX_BRACKETS,
  RENTAL_SLABS,
  PROPERTY_PURCHASE_SLABS,
  PROPERTY_SALE_RATES,
  CGT_HOLDING_SCHEDULE
} from '@/data/tax-calculator-data';

export default function AdminCustomizationDashboard() {
  const [activeMainTab, setActiveMainTab] = useState<'tax' | 'cost' | 'guide'>('tax');
  const [activeTaxSubTab, setActiveTaxSubTab] = useState<'salary' | 'business' | 'rental' | 'property'>('salary');

  // Server & DB Status
  const [serverOnline, setServerOnline] = useState<boolean>(false);
  const [serverInfo, setServerInfo] = useState<ApiHealthResponse | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveNotification, setSaveNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // ==================== 1. TAX SLABS STATE ====================
  const [taxYearsList, setTaxYearsList] = useState<string[]>(['2026-2027', '2025-2026', '2024-2025']);
  const [selectedYear, setSelectedYear] = useState<string>('2026-2027');

  // Active Tax Year Data
  const [currentTaxYearData, setCurrentTaxYearData] = useState<any>({
    year: '2026-2027',
    label: 'Tax Year 2026–2027',
    title: 'Income Tax Slabs 2026–2027',
    desc: 'Tax Year 2026–2027 statutory FBR slabs.',
    salarySlabs: SALARY_TAX_DATA['2026-2027']?.slabs || [],
    nonSalariedSlabs: NON_SALARIED_SLABS['2026-2027'] || [],
    corporateRates: {
      general: 0.29,
      small: 0.20,
      banking: 0.39,
      modaraba: 0.25,
      sme_cat1: 0.075,
      sme_cat2: 0.15,
    },
    superTaxBrackets: SUPER_TAX_BRACKETS,
    rentalSlabs: RENTAL_SLABS,
    propertyPurchaseSlabs: PROPERTY_PURCHASE_SLABS,
    propertySaleRates: PROPERTY_SALE_RATES,
    cgtHoldingSchedule: CGT_HOLDING_SCHEDULE,
  });

  // New Year modal input
  const [showNewYearModal, setShowNewYearModal] = useState<boolean>(false);
  const [newYearInput, setNewYearInput] = useState<string>('2027-2028');

  // ==================== 2. COMPANY COST STATE ====================
  const [companyCostData, setCompanyCostData] = useState<any>(INITIAL_COMPANY_COST_CONFIG);

  // Check Backend Health on Mount & Fetch Data
  useEffect(() => {
    async function initDashboard() {
      const health = await checkServerHealth();
      setServerOnline(health.online);
      if (health.data) setServerInfo(health.data);

      if (health.online) {
        // Fetch from Express API
        const taxYears = await getTaxYearsApi();
        if (taxYears && taxYears.length > 0) {
          setTaxYearsList(taxYears.map((y: any) => y.year));
          const current = taxYears.find((y: any) => y.year === selectedYear) || taxYears[0];
          setCurrentTaxYearData(current);
          setSelectedYear(current.year);
        }

        const costConfig = await getCompanyCostConfigApi();
        if (costConfig) {
          setCompanyCostData(costConfig);
        }
      }
    }
    initDashboard();
  }, []);

  // When tax year selection changes
  const handleYearChange = async (year: string) => {
    setSelectedYear(year);
    if (serverOnline) {
      const taxYears = await getTaxYearsApi();
      const found = taxYears.find((y: any) => y.year === year);
      if (found) {
        setCurrentTaxYearData(found);
        return;
      }
    }

    // Local baseline fallback
    if (SALARY_TAX_DATA[year]) {
      setCurrentTaxYearData((prev: any) => ({
        ...prev,
        year,
        label: SALARY_TAX_DATA[year].label,
        title: SALARY_TAX_DATA[year].title,
        desc: SALARY_TAX_DATA[year].desc,
        salarySlabs: SALARY_TAX_DATA[year].slabs,
      }));
    }
  };

  // Add New Tax Year
  const handleCreateNewYear = () => {
    if (!newYearInput || taxYearsList.includes(newYearInput)) {
      alert('Please enter a valid, unique Tax Year (e.g. 2027-2028).');
      return;
    }

    const cloned = JSON.parse(JSON.stringify(currentTaxYearData));
    cloned.year = newYearInput;
    cloned.label = `Tax Year ${newYearInput}`;
    cloned.title = `Income Tax Slabs ${newYearInput}`;
    cloned.desc = `Statutory tax schedules customized for Tax Year ${newYearInput}.`;

    setTaxYearsList((prev) => [newYearInput, ...prev]);
    setSelectedYear(newYearInput);
    setCurrentTaxYearData(cloned);
    setShowNewYearModal(false);
  };

  // Save Tax Year Changes
  const handleSaveTaxYear = async () => {
    setIsSaving(true);
    setSaveNotification(null);

    const result = await saveTaxYearApi(selectedYear, currentTaxYearData);
    setIsSaving(false);

    if (result.success) {
      setSaveNotification({
        type: 'success',
        message: `Tax Year ${selectedYear} successfully saved to ${serverOnline ? 'Express & MongoDB' : 'Local State'}!`,
      });
    } else {
      setSaveNotification({
        type: 'error',
        message: result.message || 'Error saving tax configuration.',
      });
    }

    setTimeout(() => setSaveNotification(null), 5000);
  };

  // Save Company Cost Changes
  const handleSaveCompanyCost = async () => {
    setIsSaving(true);
    setSaveNotification(null);

    const result = await saveCompanyCostConfigApi(companyCostData);
    setIsSaving(false);

    if (result.success) {
      setSaveNotification({
        type: 'success',
        message: `Company registration fees successfully saved to ${serverOnline ? 'Express & MongoDB' : 'Local State'}!`,
      });
    } else {
      setSaveNotification({
        type: 'error',
        message: result.message || 'Error saving company cost configuration.',
      });
    }

    setTimeout(() => setSaveNotification(null), 5000);
  };

  // Reset to Baseline
  const handleResetTax = async () => {
    if (!confirm('Are you sure you want to reset all tax slabs to official FBR baseline defaults?')) return;
    setIsSaving(true);
    await resetTaxSlabsApi();
    setIsSaving(false);
    window.location.reload();
  };

  const handleResetCost = async () => {
    if (!confirm('Are you sure you want to reset company setup fees to official SECP baseline defaults?')) return;
    setIsSaving(true);
    await resetCompanyCostConfigApi();
    setIsSaving(false);
    window.location.reload();
  };

  // Salary Slab table row editor helpers
  const handleSalarySlabChange = (index: number, field: string, value: any) => {
    const updatedSlabs = [...currentTaxYearData.salarySlabs];
    updatedSlabs[index] = { ...updatedSlabs[index], [field]: value };
    setCurrentTaxYearData({ ...currentTaxYearData, salarySlabs: updatedSlabs });
  };

  const handleAddSalarySlab = () => {
    const last = currentTaxYearData.salarySlabs[currentTaxYearData.salarySlabs.length - 1];
    const newMin = last ? last.max : 0;
    const newMax = newMin + 1000000;
    const newSlab = {
      min: newMin,
      max: newMax,
      rate: 0.35,
      baseTax: last ? last.baseTax + 200000 : 0,
      rangeText: `Rs. ${newMin.toLocaleString()} to Rs. ${newMax.toLocaleString()}`,
      rateText: '35%',
      payableText: `Tax formula for new slab`,
      formulaDesc: `Rate applicable on excess above ${newMin.toLocaleString()}`,
    };
    setCurrentTaxYearData({
      ...currentTaxYearData,
      salarySlabs: [...currentTaxYearData.salarySlabs, newSlab],
    });
  };

  const handleRemoveSalarySlab = (index: number) => {
    if (currentTaxYearData.salarySlabs.length <= 1) {
      alert('You must have at least one salary slab.');
      return;
    }
    const updatedSlabs = currentTaxYearData.salarySlabs.filter((_: any, i: number) => i !== index);
    setCurrentTaxYearData({ ...currentTaxYearData, salarySlabs: updatedSlabs });
  };

  return (
    <main className="section page-content-section admin-portal-page" style={{ paddingTop: '110px', minHeight: '100vh', background: '#f8fafc' }}>
      <div className="container">
        {/* Top Header & Server Status */}
        <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="eyebrow" style={{ color: 'var(--primary, #A31D24)', fontWeight: 800 }}>Executive Management</span>
              <span style={{ fontSize: '11.5px', background: '#1A1D20', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                QWCA Administration
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Customization &amp; Rate Governance Dashboard
            </h1>
            <p style={{ fontSize: '14.5px', color: '#64748b', margin: '6px 0 0' }}>
              Directly edit and calibrate FBR Annual Tax Slabs, Corporate Tax Rates, and SECP Incorporation Fee Schedules.
            </p>
          </div>

          {/* Connection Status Pill */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: serverOnline ? '#ecfdf5' : '#fffbeb',
                border: `1.5px solid ${serverOnline ? '#10b981' : '#f59e0b'}`,
                color: serverOnline ? '#065f46' : '#92400e',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: serverOnline ? '#10b981' : '#f59e0b',
                  boxShadow: serverOnline ? '0 0 8px #10b981' : 'none',
                }}
              />
              <span>
                {serverOnline
                  ? `Express API: Port 5000 (${serverInfo?.database?.includes('MongoDB') ? 'MongoDB Online' : 'In-Memory'})`
                  : 'Express Backend Offline (Local Mode)'}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {serverOnline ? 'Live Two-Way Sync Active' : 'Start server: cd server && npm run dev'}
            </span>
          </div>
        </div>

        {/* Notification Alert Banner */}
        {saveNotification && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: saveNotification.type === 'success' ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${saveNotification.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: saveNotification.type === 'success' ? '#065f46' : '#991b1b',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            {saveNotification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{saveNotification.message}</span>
          </div>
        )}

        {/* Primary Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e2e8f0', marginBottom: '26px' }}>
          <button
            type="button"
            onClick={() => setActiveMainTab('tax')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeMainTab === 'tax' ? '3px solid var(--primary, #A31D24)' : '3px solid transparent',
              color: activeMainTab === 'tax' ? 'var(--primary, #A31D24)' : '#64748b',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            <Calculator size={18} />
            <span>1. Annual Tax Slabs Manager</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('cost')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeMainTab === 'cost' ? '3px solid var(--primary, #A31D24)' : '3px solid transparent',
              color: activeMainTab === 'cost' ? 'var(--primary, #A31D24)' : '#64748b',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            <Building2 size={18} />
            <span>2. Company Cost Estimator Manager</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('guide')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeMainTab === 'guide' ? '3px solid var(--primary, #A31D24)' : '3px solid transparent',
              color: activeMainTab === 'guide' ? 'var(--primary, #A31D24)' : '#64748b',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            <Server size={18} />
            <span>3. Backend &amp; Architecture Status</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: ANNUAL TAX SLABS MANAGER
            ========================================================================= */}
        {activeMainTab === 'tax' && (
          <div>
            {/* Top Bar: Year Switcher & Global Actions */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: '#1e293b' }}>
                  Configured Tax Years:
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {taxYearsList.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => handleYearChange(y)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '6px',
                        border: '1.5px solid',
                        borderColor: selectedYear === y ? 'var(--primary, #A31D24)' : '#cbd5e1',
                        background: selectedYear === y ? 'var(--primary, #A31D24)' : '#ffffff',
                        color: selectedYear === y ? '#ffffff' : '#334155',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {y}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowNewYearModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 12px',
                      borderRadius: '6px',
                      border: '1.5px dashed #94a3b8',
                      background: '#f8fafc',
                      color: '#475569',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    <span>Add New Year</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href="/tax-calculator/salaried"
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    color: '#334155',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span>Preview Calculator</span>
                  <ExternalLink size={14} />
                </Link>

                <button
                  type="button"
                  onClick={handleResetTax}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveTaxYear}
                  disabled={isSaving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--primary, #A31D24)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(163, 29, 36, 0.25)',
                  }}
                >
                  <Save size={15} />
                  <span>{isSaving ? 'Saving...' : `Save Tax Year ${selectedYear}`}</span>
                </button>
              </div>
            </div>

            {/* Tax Category Sub-Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[
                { id: 'salary', label: 'Salaried Slabs (Sec 149)', icon: Calculator },
                { id: 'business', label: 'Corporate & AOP (Sec 4C)', icon: Building2 },
                { id: 'rental', label: 'Rental Income (Sec 155)', icon: Coins },
                { id: 'property', label: 'Property Tax (236K / 236C / CGT)', icon: Layers },
              ].map((sub) => {
                const Icon = sub.icon;
                const active = activeTaxSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveTaxSubTab(sub.id as any)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: active ? '#1A1D20' : '#e2e8f0',
                      background: active ? '#1A1D20' : '#ffffff',
                      color: active ? '#ffffff' : '#475569',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={15} />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab 1: Salaried Slabs */}
            {activeTaxSubTab === 'salary' && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      Salaried Income Tax Slabs for {selectedYear}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                      Define progressive brackets, base tax amount, and excess percentage rate pursuant to Section 149.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSalarySlab}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: '1.5px solid #10b981',
                      background: '#ecfdf5',
                      color: '#065f46',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    <span>Add New Slab</span>
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 800, color: '#334155' }}>Slab Range Label</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 800, color: '#334155' }}>Min (PKR)</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 800, color: '#334155' }}>Max (PKR)</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 800, color: '#334155' }}>Rate (%)</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 800, color: '#334155' }}>Fixed Base Tax (PKR)</th>
                        <th style={{ padding: '10px', textAlign: 'center', fontWeight: 800, color: '#334155' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTaxYearData.salarySlabs?.map((slab: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="text"
                              value={slab.rangeText}
                              onChange={(e) => handleSalarySlabChange(idx, 'rangeText', e.target.value)}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="number"
                              value={slab.min}
                              onChange={(e) => handleSalarySlabChange(idx, 'min', parseFloat(e.target.value) || 0)}
                              style={{ width: '110px', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="number"
                              value={slab.max > 1000000000 ? 999999999999 : slab.max}
                              onChange={(e) => handleSalarySlabChange(idx, 'max', parseFloat(e.target.value) || 0)}
                              style={{ width: '110px', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <input
                                type="number"
                                step="0.005"
                                value={(slab.rate * 100).toFixed(1)}
                                onChange={(e) => {
                                  const rate = (parseFloat(e.target.value) || 0) / 100;
                                  handleSalarySlabChange(idx, 'rate', rate);
                                  handleSalarySlabChange(idx, 'rateText', `${(rate * 100).toFixed(1)}%`);
                                }}
                                style={{ width: '70px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                              />
                              <span>%</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="number"
                              value={slab.baseTax}
                              onChange={(e) => handleSalarySlabChange(idx, 'baseTax', parseFloat(e.target.value) || 0)}
                              style={{ width: '120px', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveSalarySlab(idx)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete slab"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Corporate & Business Rates */}
            {activeTaxSubTab === 'business' && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>
                  Corporate Tax Rates &amp; Small Company Incentives ({selectedYear})
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '28px' }}>
                  <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, marginBottom: '6px' }}>
                      General Corporate Rate
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        step="0.01"
                        value={((currentTaxYearData.corporateRates?.general || 0.29) * 100).toFixed(1)}
                        onChange={(e) => {
                          const val = (parseFloat(e.target.value) || 0) / 100;
                          setCurrentTaxYearData({
                            ...currentTaxYearData,
                            corporateRates: { ...currentTaxYearData.corporateRates, general: val },
                          });
                        }}
                        style={{ width: '90px', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '15px', fontWeight: 800 }}
                      />
                      <span style={{ fontWeight: 700 }}>% (Default: 29.0%)</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, marginBottom: '6px' }}>
                      Small Company Concession
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        step="0.01"
                        value={((currentTaxYearData.corporateRates?.small || 0.20) * 100).toFixed(1)}
                        onChange={(e) => {
                          const val = (parseFloat(e.target.value) || 0) / 100;
                          setCurrentTaxYearData({
                            ...currentTaxYearData,
                            corporateRates: { ...currentTaxYearData.corporateRates, small: val },
                          });
                        }}
                        style={{ width: '90px', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '15px', fontWeight: 800 }}
                      />
                      <span style={{ fontWeight: 700 }}>% (Default: 20.0%)</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, marginBottom: '6px' }}>
                      Banking Company Statutory Rate
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        step="0.01"
                        value={((currentTaxYearData.corporateRates?.banking || 0.39) * 100).toFixed(1)}
                        onChange={(e) => {
                          const val = (parseFloat(e.target.value) || 0) / 100;
                          setCurrentTaxYearData({
                            ...currentTaxYearData,
                            corporateRates: { ...currentTaxYearData.corporateRates, banking: val },
                          });
                        }}
                        style={{ width: '90px', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '15px', fontWeight: 800 }}
                      />
                      <span style={{ fontWeight: 700 }}>% (Default: 39.0%)</span>
                    </div>
                  </div>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '20px 0 10px', color: '#0f172a' }}>
                  Super Tax (Section 4C) Progressive Slab Schedule
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {currentTaxYearData.superTaxBrackets?.map((st: any, i: number) => (
                    <div key={i} style={{ padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{st.text}</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary, #A31D24)' }}>{st.rateText}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Rental Income */}
            {activeTaxSubTab === 'rental' && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 14px', color: '#0f172a' }}>
                  Section 155 Rental Withholding Slabs ({selectedYear})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentTaxYearData.rentalSlabs?.map((r: any, idx: number) => (
                    <div key={idx} style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{r.rangeText}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{r.formula}</div>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary, #A31D24)' }}>{r.rateText}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Property Tax */}
            {activeTaxSubTab === 'property' && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>
                  Section 236K (Purchase) &amp; Section 236C (Sale) Rates
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Section 236K (Buyer Advance Tax)</strong>
                    <div style={{ fontSize: '13px', color: '#334155' }}>• Active Filer Rate: <strong>1.25%</strong></div>
                    <div style={{ fontSize: '13px', color: '#334155' }}>• Non-Filer: <strong>10.5% – 18.5%</strong></div>
                    <div style={{ fontSize: '13px', color: '#334155' }}>• Overseas (NICOP/POC): <strong>1.25%</strong></div>
                  </div>

                  <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Section 236C (Seller Advance Tax)</strong>
                    <div style={{ fontSize: '13px', color: '#334155' }}>• Active Filer Rate: <strong>2.75%</strong></div>
                    <div style={{ fontSize: '13px', color: '#334155' }}>• Non-Filer: <strong>11.5%</strong></div>
                    <div style={{ fontSize: '13px', color: '#334155' }}>• Overseas (NICOP/POC): <strong>2.75%</strong></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: COMPANY COST ESTIMATOR MANAGER
            ========================================================================= */}
        {activeMainTab === 'cost' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Company Incorporation &amp; Compliance Fee Scheduler
                </h2>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '4px 0 0' }}>
                  Configure base legal packages, SECP authorized capital tiers, and FBR/Chamber add-on service pricing.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href="/cost-estimator"
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    color: '#334155',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span>Preview Cost Estimator</span>
                  <ExternalLink size={14} />
                </Link>

                <button
                  type="button"
                  onClick={handleResetCost}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveCompanyCost}
                  disabled={isSaving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--primary, #A31D24)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(163, 29, 36, 0.25)',
                  }}
                >
                  <Save size={15} />
                  <span>{isSaving ? 'Saving...' : 'Save All Fees'}</span>
                </button>
              </div>
            </div>

            {/* Base Legal Packages */}
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              1. Business Structure Base Legal Packages (PKR)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '30px' }}>
              {companyCostData.entityTiers?.map((entity: any, idx: number) => (
                <div key={entity.id} style={{ padding: '16px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{entity.name}</strong>
                    <span style={{ fontSize: '11px', background: '#e2e8f0', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                      {entity.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{entity.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>PKR</span>
                    <input
                      type="number"
                      value={entity.baseFee}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const updated = [...companyCostData.entityTiers];
                        updated[idx].baseFee = val;
                        setCompanyCostData({ ...companyCostData, entityTiers: updated });
                      }}
                      style={{ width: '120px', padding: '6px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '15px', fontWeight: 800 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Capital Tiers */}
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              2. SECP Authorized Capital Statutory Challan Fees (PKR)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '30px' }}>
              {companyCostData.capitalTiers?.map((cap: any, idx: number) => (
                <div key={cap.id} style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', fontSize: '13.5px', marginBottom: '4px' }}>{cap.label}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Fee: PKR</span>
                    <input
                      type="number"
                      value={cap.fee}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const updated = [...companyCostData.capitalTiers];
                        updated[idx].fee = val;
                        setCompanyCostData({ ...companyCostData, capitalTiers: updated });
                      }}
                      style={{ width: '110px', padding: '6px 8px', borderRadius: '4px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: 800 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Service Addons */}
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              3. Regulatory Registrations &amp; Licensing Add-ons (PKR)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {companyCostData.serviceAddons?.map((addon: any, idx: number) => (
                <div key={addon.id} style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  <strong style={{ display: 'block', fontSize: '13.5px', marginBottom: '4px' }}>{addon.name}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Add-on: PKR</span>
                    <input
                      type="number"
                      value={addon.fee}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const updated = [...companyCostData.serviceAddons];
                        updated[idx].fee = val;
                        setCompanyCostData({ ...companyCostData, serviceAddons: updated });
                      }}
                      style={{ width: '110px', padding: '6px 8px', borderRadius: '4px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: 800 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: BACKEND ARCHITECTURE & CONNECTION GUIDE
            ========================================================================= */}
        {activeMainTab === 'guide' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>
              Full-Stack Monorepo Architecture Overview
            </h2>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
              The application is now decoupled into a clean <strong>Client + Server</strong> architecture. The client runs Next.js on port 3000, and the backend runs Express.js on port 5000 connected to MongoDB.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ padding: '20px', borderRadius: '10px', background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Server size={22} className="text-primary" />
                  <strong style={{ fontSize: '16px' }}>Express.js REST API</strong>
                </div>
                <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
                  Located in <code>/server</code>. Serves dynamic configuration via:
                  <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                    <li><code>GET /api/tax-slabs</code> &amp; <code>PUT /api/tax-slabs/:year</code></li>
                    <li><code>GET /api/cost-estimation</code> &amp; <code>PUT /api/cost-estimation</code></li>
                    <li><code>GET /api/health</code> (Database status)</li>
                  </ul>
                </div>
              </div>

              <div style={{ padding: '20px', borderRadius: '10px', background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <ShieldCheck size={22} style={{ color: '#10b981' }} />
                  <strong style={{ fontSize: '16px' }}>Zero-Downtime Resilience</strong>
                </div>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  If the Express backend or MongoDB is starting up, stopped, or offline, the Next.js client seamlessly falls back to the official built-in statutory baseline. The public website never goes down.
                </p>
              </div>
            </div>

            <div style={{ background: '#1A1D20', borderRadius: '10px', padding: '20px', color: '#f8fafc' }}>
              <strong style={{ display: 'block', fontSize: '14px', color: '#ff8a8f', marginBottom: '8px' }}>
                How to run both Client &amp; Server locally:
              </strong>
              <pre style={{ margin: 0, fontSize: '13px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', overflowX: 'auto' }}>
                {`# 1. Start Client (Next.js) on http://localhost:3000
npm run dev:client

# 2. Start Server (Express + MongoDB) on http://localhost:5000
npm run dev:server`}
              </pre>
            </div>
          </div>
        )}

        {/* Modal: Add New Tax Year */}
        {showNewYearModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
            }}
          >
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '28px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 10px', color: '#0f172a' }}>
                Add New Tax Year
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
                Enter the fiscal year identifier (e.g. 2027-2028). Baseline slabs will be cloned for you to customize.
              </p>
              <input
                type="text"
                value={newYearInput}
                onChange={(e) => setNewYearInput(e.target.value)}
                placeholder="e.g. 2027-2028"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewYearModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewYear}
                  style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: 'var(--primary, #A31D24)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Create Tax Year
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

