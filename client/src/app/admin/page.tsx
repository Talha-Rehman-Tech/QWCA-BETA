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
  Coins,
  Lock,
  User,
  Key,
  LogOut,
  Eye,
  EyeOff,
  ShieldAlert,
  Check,
  LogIn
} from 'lucide-react';
import {
  loginAdminApi,
  verifyAdminSessionApi,
  logoutAdmin,
  changeAdminPasswordApi,
  AdminUser,
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
  // ==================== 0. SINGLE ADMIN AUTHENTICATION STATE ====================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Login Form Inputs
  const [loginIdentifier, setLoginIdentifier] = useState<string>('admin@qwca.com.pk');
  const [loginPassword, setLoginPassword] = useState<string>('qwcaAdmin@2026!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Change Password Modal
  const [showChangePassModal, setShowChangePassModal] = useState<boolean>(false);
  const [currentPassInput, setCurrentPassInput] = useState<string>('');
  const [newPassInput, setNewPassInput] = useState<string>('');
  const [confirmPassInput, setConfirmPassInput] = useState<string>('');
  const [changePassStatus, setChangePassStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState<boolean>(false);

  // ==================== NAVIGATION TABS ====================
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

  // Check Session & Backend Health on Mount
  useEffect(() => {
    async function initDashboard() {
      try {
        // 1. Verify existing session
        const authRes = await verifyAdminSessionApi();
        if (authRes.success && authRes.admin) {
          setIsAuthenticated(true);
          setAdminUser(authRes.admin);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecking(false);
      }

      // 2. Health & data fetch
      const health = await checkServerHealth();
      setServerOnline(health.online);
      if (health.data) setServerInfo(health.data);

      if (health.online) {
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

  // Handle Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await loginAdminApi(loginIdentifier, loginPassword);
      if (res.success && res.admin) {
        setIsAuthenticated(true);
        setAdminUser(res.admin);
        setSaveNotification({
          type: 'success',
          message: `Authenticated successfully. Welcome, ${res.admin.name}!`,
        });
        setTimeout(() => setSaveNotification(null), 5000);
      } else {
        setLoginError(res.message || 'Invalid credentials. Access restricted to authorized firm administrator.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify server connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setAdminUser(null);
    setSaveNotification({
      type: 'success',
      message: 'Logged out successfully. Administrator session terminated.',
    });
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassStatus(null);

    if (newPassInput !== confirmPassInput) {
      setChangePassStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassInput.length < 8) {
      setChangePassStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }

    setIsChangingPass(true);
    const res = await changeAdminPasswordApi(currentPassInput, newPassInput);
    setIsChangingPass(false);

    if (res.success) {
      setChangePassStatus({ type: 'success', message: res.message });
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setTimeout(() => setShowChangePassModal(false), 2000);
    } else {
      setChangePassStatus({ type: 'error', message: res.message || 'Failed to update password.' });
    }
  };

  // Helper to fill credentials for development
  const handleFillDemoCreds = () => {
    setLoginIdentifier('admin@qwca.com.pk');
    setLoginPassword('qwcaAdmin@2026!');
    setLoginError(null);
  };

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

    setTaxYearsList([newYearInput, ...taxYearsList]);
    setSelectedYear(newYearInput);
    setCurrentTaxYearData(cloned);
    setShowNewYearModal(false);
    setSaveNotification({
      type: 'success',
      message: `Tax Year ${newYearInput} created! Remember to click "Save Tax Year Slabs" to persist to database.`,
    });
  };

  // Save Current Tax Year Slabs
  const handleSaveTaxYear = async () => {
    setIsSaving(true);
    setSaveNotification(null);

    const result = await saveTaxYearApi(selectedYear, currentTaxYearData);
    setIsSaving(false);

    if (result.success) {
      setSaveNotification({
        type: 'success',
        message: `Tax Slabs for ${selectedYear} successfully saved to ${serverOnline ? 'Express & MongoDB' : 'Local State'}!`,
      });
    } else {
      if (result.message?.includes('Unauthorized') || result.message?.includes('token')) {
        setIsAuthenticated(false);
      }
      setSaveNotification({
        type: 'error',
        message: result.message || 'Error saving tax slabs. Please ensure you are logged in.',
      });
    }

    setTimeout(() => setSaveNotification(null), 5000);
  };

  // Save Company Cost Estimation Config
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
      if (result.message?.includes('Unauthorized') || result.message?.includes('token')) {
        setIsAuthenticated(false);
      }
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
    const res = await resetTaxSlabsApi();
    setIsSaving(false);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.message || 'Reset failed.');
    }
  };

  const handleResetCost = async () => {
    if (!confirm('Are you sure you want to reset company setup fees to official SECP baseline defaults?')) return;
    setIsSaving(true);
    const res = await resetCompanyCostConfigApi();
    setIsSaving(false);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.message || 'Reset failed.');
    }
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

  // ==================== 1. LOADING SCREEN ====================
  if (isAuthChecking) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0E1114',
          color: '#ffffff',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              border: '3.5px solid rgba(255,255,255,0.1)',
              borderTopColor: '#A31D24',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px' }}>
            Verifying Executive Partner Credentials
          </h2>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Establishing encrypted governance session with QWCA Server &amp; MongoDB...
          </p>
        </div>
      </main>
    );
  }

  // ==================== 2. SINGLE ADMIN LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 10%, #1e2229 0%, #0E1114 100%)',
          padding: '24px',
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            background: '#16191D',
            border: '1.5px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(163, 29, 36, 0.15)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Top Brand Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #A31D24 0%, #761419 100%)',
              padding: '28px 24px',
              textAlign: 'center',
              color: '#ffffff',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Lock size={26} strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, background: 'rgba(0,0,0,0.25)', padding: '2px 10px', borderRadius: '999px' }}>
                Restricted Access
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, margin: '4px 0 6px', letterSpacing: '-0.3px' }}>
              QWCA Executive Portal
            </h1>
            <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>
              Authorized Firm Administrator &amp; Managing Partner Sign-In
            </p>
          </div>

          {/* Form Body */}
          <div style={{ padding: '32px 28px' }}>
            {loginError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '20px',
                  lineHeight: '1.4',
                }}
              >
                <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Identifier Field */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#cbd5e1',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Admin Username or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                    }}
                  />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. admin or admin@qwca.com.pk"
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      background: '#0E1114',
                      border: '1.5px solid #2d333b',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14.5px',
                      outline: 'none',
                      transition: 'border 0.2s',
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#cbd5e1',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Administrator Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Key
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 40px',
                      background: '#0E1114',
                      border: '1.5px solid #2d333b',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14.5px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                style={{
                  marginTop: '8px',
                  padding: '14px',
                  background: isLoggingIn ? '#6c1519' : 'var(--primary, #A31D24)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(163, 29, 36, 0.4)',
                  transition: 'background 0.2s, transform 0.1s',
                }}
              >
                {isLoggingIn ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Authenticate &amp; Access Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Helper Card for Administrator */}
            <div
              style={{
                marginTop: '24px',
                padding: '14px',
                background: '#0E1114',
                borderRadius: '8px',
                border: '1px solid #262a30',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} color="#10b981" /> Single Admin Credentials
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoCreds}
                  style={{
                    fontSize: '11px',
                    background: 'rgba(163, 29, 36, 0.2)',
                    color: '#ff8a8f',
                    border: '1px solid rgba(163, 29, 36, 0.4)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Auto-Fill
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div><strong>User:</strong> <code style={{ color: '#cbd5e1' }}>admin@qwca.com.pk</code> (or <code style={{ color: '#cbd5e1' }}>admin</code>)</div>
                <div><strong>Password:</strong> <code style={{ color: '#cbd5e1' }}>qwcaAdmin@2026!</code></div>
              </div>
            </div>

            {/* Return Link */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link
                href="/"
                style={{
                  fontSize: '13px',
                  color: '#94a3b8',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.2s',
                }}
              >
                &larr; Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==================== 3. AUTHENTICATED DASHBOARD ====================
  return (
    <main className="section page-content-section admin-portal-page" style={{ paddingTop: '105px', minHeight: '100vh', background: '#f8fafc' }}>
      <div className="container">
        {/* Top Header & Server Status */}
        <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="eyebrow" style={{ color: 'var(--primary, #A31D24)', fontWeight: 800 }}>Executive Management</span>
              <span style={{ fontSize: '11.5px', background: '#1A1D20', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                Single Admin Portal
              </span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Customization &amp; Rate Governance Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>
              Directly calibrate FBR Annual Tax Slabs, Corporate Tax Rates, and SECP Incorporation Fee Schedules.
            </p>
          </div>

          {/* Admin Profile & Connection Status Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            {/* Authenticated User Badge & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: '#0E1114',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  border: '1px solid #2d333b',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px #10b981',
                  }}
                />
                <span>{adminUser?.name || 'Managing Partner'}</span>
              </div>

              {/* Change Password Button */}
              <button
                type="button"
                onClick={() => setShowChangePassModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Change administrator password"
              >
                <Key size={14} />
                <span>Password</span>
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: '#dc2626',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                title="Log out of executive portal"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>

            {/* Connection Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: serverOnline ? '#ecfdf5' : '#fffbeb',
                border: `1px solid ${serverOnline ? '#10b981' : '#f59e0b'}`,
                color: serverOnline ? '#065f46' : '#92400e',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <span>
                {serverOnline
                  ? `Backend: Port 5000 (${serverInfo?.database?.includes('MongoDB') ? 'MongoDB Docker Online' : 'In-Memory'})`
                  : 'Express Backend Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Notification Alert Banner */}
        {saveNotification && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: saveNotification.type === 'success' ? '#f0fdf4' : '#fef2f2',
              border: `1.5px solid ${saveNotification.type === 'success' ? '#22c55e' : '#ef4444'}`,
              color: saveNotification.type === 'success' ? '#15803d' : '#b91c1c',
              fontSize: '14px',
              fontWeight: 700,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {saveNotification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{saveNotification.message}</span>
          </div>
        )}

        {/* Main Tab Controls */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setActiveMainTab('tax')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontWeight: 800,
              fontSize: '14.5px',
              background: 'none',
              border: 'none',
              borderBottom: activeMainTab === 'tax' ? '3px solid var(--primary, #A31D24)' : '3px solid transparent',
              color: activeMainTab === 'tax' ? 'var(--primary, #A31D24)' : '#64748b',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            <Calculator size={18} />
            <span>Annual Tax Slabs Manager</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('cost')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontWeight: 800,
              fontSize: '14.5px',
              background: 'none',
              border: 'none',
              borderBottom: activeMainTab === 'cost' ? '3px solid var(--primary, #A31D24)' : '3px solid transparent',
              color: activeMainTab === 'cost' ? 'var(--primary, #A31D24)' : '#64748b',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            <Building2 size={18} />
            <span>Company Cost Estimator Manager</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('guide')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontWeight: 800,
              fontSize: '14.5px',
              background: 'none',
              border: 'none',
              borderBottom: activeMainTab === 'guide' ? '3px solid var(--primary, #A31D24)' : '3px solid transparent',
              color: activeMainTab === 'guide' ? 'var(--primary, #A31D24)' : '#64748b',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            <Server size={18} />
            <span>Backend &amp; DB Status</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: TAX SLABS MANAGER */}
        {/* ========================================================= */}
        {activeMainTab === 'tax' && (
          <div>
            {/* Year Selection & Actions Row */}
            <div
              style={{
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={18} color="var(--primary, #A31D24)" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>Select Tax Year to Edit:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontWeight: 800,
                    fontSize: '14px',
                    background: '#f8fafc',
                    color: '#0f172a',
                    cursor: 'pointer',
                  }}
                >
                  {taxYearsList.map((yr) => (
                    <option key={yr} value={yr}>
                      Tax Year {yr} {yr === '2026-2027' ? '(Current FY27)' : ''}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowNewYearModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px dashed var(--primary, #A31D24)',
                    background: 'rgba(163, 29, 36, 0.05)',
                    color: 'var(--primary, #A31D24)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={15} />
                  <span>Add New Tax Year</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleResetTax}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title="Reset to default FBR rates"
                >
                  <RotateCcw size={14} />
                  <span>Reset to Baseline</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveTaxYear}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isSaving ? '#6c1519' : 'var(--primary, #A31D24)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 10px rgba(163, 29, 36, 0.25)',
                  }}
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving to Database...' : `Save Tax Slabs (${selectedYear})`}</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Salary, Business, Rental, Property */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', background: '#e2e8f0', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
              <button
                type="button"
                onClick={() => setActiveTaxSubTab('salary')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTaxSubTab === 'salary' ? '#ffffff' : 'transparent',
                  color: activeTaxSubTab === 'salary' ? 'var(--primary, #A31D24)' : '#64748b',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTaxSubTab === 'salary' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                1. Salaried Individuals
              </button>
              <button
                type="button"
                onClick={() => setActiveTaxSubTab('business')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTaxSubTab === 'business' ? '#ffffff' : 'transparent',
                  color: activeTaxSubTab === 'business' ? 'var(--primary, #A31D24)' : '#64748b',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTaxSubTab === 'business' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                2. Business, AOP &amp; Corporate
              </button>
              <button
                type="button"
                onClick={() => setActiveTaxSubTab('rental')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTaxSubTab === 'rental' ? '#ffffff' : 'transparent',
                  color: activeTaxSubTab === 'rental' ? 'var(--primary, #A31D24)' : '#64748b',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTaxSubTab === 'rental' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                3. Rental Income
              </button>
              <button
                type="button"
                onClick={() => setActiveTaxSubTab('property')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTaxSubTab === 'property' ? '#ffffff' : 'transparent',
                  color: activeTaxSubTab === 'property' ? 'var(--primary, #A31D24)' : '#64748b',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTaxSubTab === 'property' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                4. Property Tax (FBR Federal)
              </button>
            </div>

            {/* Sub-Tab 1: Salaried Table Editor */}
            {activeTaxSubTab === 'salary' && (
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      Salaried Income Tax Slabs ({selectedYear})
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                      Edit threshold levels, percentage tax rates, fixed base taxes, and textual descriptions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSalarySlab}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: '1px solid var(--primary, #A31D24)',
                      background: 'var(--primary, #A31D24)',
                      color: '#fff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    <span>Add Tier / Slab</span>
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', color: '#475569', fontWeight: 800, borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '10px 14px' }}>#</th>
                        <th style={{ padding: '10px 14px' }}>Min (Rs.)</th>
                        <th style={{ padding: '10px 14px' }}>Max (Rs.)</th>
                        <th style={{ padding: '10px 14px' }}>Rate (%)</th>
                        <th style={{ padding: '10px 14px' }}>Base Fixed (Rs.)</th>
                        <th style={{ padding: '10px 14px' }}>Range Label</th>
                        <th style={{ padding: '10px 14px' }}>Rate Display</th>
                        <th style={{ padding: '10px 14px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTaxYearData.salarySlabs?.map((slab: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="number"
                              value={slab.min}
                              onChange={(e) => handleSalarySlabChange(idx, 'min', Number(e.target.value))}
                              style={{ width: '110px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="number"
                              value={slab.max}
                              onChange={(e) => handleSalarySlabChange(idx, 'max', Number(e.target.value))}
                              style={{ width: '120px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="number"
                              step="0.005"
                              value={slab.rate}
                              onChange={(e) => handleSalarySlabChange(idx, 'rate', Number(e.target.value))}
                              style={{ width: '75px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="number"
                              value={slab.baseTax}
                              onChange={(e) => handleSalarySlabChange(idx, 'baseTax', Number(e.target.value))}
                              style={{ width: '100px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="text"
                              value={slab.rangeText}
                              onChange={(e) => handleSalarySlabChange(idx, 'rangeText', e.target.value)}
                              style={{ width: '180px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="text"
                              value={slab.rateText}
                              onChange={(e) => handleSalarySlabChange(idx, 'rateText', e.target.value)}
                              style={{ width: '80px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveSalarySlab(idx)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete Slab"
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

            {/* Sub-Tab 2: Business & Corporate Rates */}
            {activeTaxSubTab === 'business' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* Corporate Tax Rates Card */}
                <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                    Corporate Income Tax Rates ({selectedYear})
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
                    Statutory corporate income tax rates under First Schedule Division II.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(currentTaxYearData.corporateRates || {}).map(([key, val]: [string, any]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                          {key.replace('_', ' ')} Company:
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            step="0.005"
                            value={val}
                            onChange={(e) => {
                              const updated = { ...currentTaxYearData.corporateRates, [key]: Number(e.target.value) };
                              setCurrentTaxYearData({ ...currentTaxYearData, corporateRates: updated });
                            }}
                            style={{ width: '80px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'right' }}
                          />
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>({(val * 100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Super Tax Card */}
                <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                    Super Tax on High Earning Persons (Section 4C)
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
                    Graduated rates for high net worth individuals, AOPs, and corporations.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {currentTaxYearData.superTaxBrackets?.map((bracket: any, bIdx: number) => (
                      <div key={bIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: '#475569', fontWeight: 600 }}>{bracket.text}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            step="0.01"
                            value={bracket.rate}
                            onChange={(e) => {
                              const updated = [...currentTaxYearData.superTaxBrackets];
                              updated[bIdx] = { ...updated[bIdx], rate: Number(e.target.value), rateText: `${(Number(e.target.value) * 100).toFixed(0)}%` };
                              setCurrentTaxYearData({ ...currentTaxYearData, superTaxBrackets: updated });
                            }}
                            style={{ width: '65px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px', textAlign: 'right' }}
                          />
                          <span style={{ fontWeight: 700, color: 'var(--primary, #A31D24)' }}>{bracket.rateText}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Rental Income */}
            {activeTaxSubTab === 'rental' && (
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                  Rental Income Slabs (Section 15B)
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
                  Progressive slabs for income from property applicable to individuals &amp; AOPs.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentTaxYearData.rentalSlabs?.map((rSlab: any, rIdx: number) => (
                    <div key={rIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '6px' }}>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{rSlab.rangeText}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{rSlab.formula}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Rate:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={rSlab.rate}
                          onChange={(e) => {
                            const updated = [...currentTaxYearData.rentalSlabs];
                            updated[rIdx] = { ...updated[rIdx], rate: Number(e.target.value), rateText: `${(Number(e.target.value) * 100).toFixed(0)}%` };
                            setCurrentTaxYearData({ ...currentTaxYearData, rentalSlabs: updated });
                          }}
                          style={{ width: '70px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'right' }}
                        />
                        <span style={{ fontWeight: 800, color: 'var(--primary, #A31D24)' }}>{rSlab.rateText}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Property Tax */}
            {activeTaxSubTab === 'property' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* Buying Rates Card */}
                <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                    Property Purchase Tax (Sec 236K)
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
                    Advance tax collected from buyer at transfer time.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentTaxYearData.propertyPurchaseSlabs?.map((pSlab: any, pIdx: number) => (
                      <div key={pIdx} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px' }}>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{pSlab.label}</strong>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                          <label style={{ fontSize: '12px', color: '#475569' }}>
                            Filer:
                            <input
                              type="number"
                              step="0.0025"
                              value={pSlab.filerRate}
                              onChange={(e) => {
                                const updated = [...currentTaxYearData.propertyPurchaseSlabs];
                                updated[pIdx] = { ...updated[pIdx], filerRate: Number(e.target.value) };
                                setCurrentTaxYearData({ ...currentTaxYearData, propertyPurchaseSlabs: updated });
                              }}
                              style={{ width: '65px', padding: '3px 6px', marginLeft: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </label>
                          <label style={{ fontSize: '12px', color: '#b91c1c' }}>
                            Non-Filer:
                            <input
                              type="number"
                              step="0.005"
                              value={pSlab.nonFilerRate}
                              onChange={(e) => {
                                const updated = [...currentTaxYearData.propertyPurchaseSlabs];
                                updated[pIdx] = { ...updated[pIdx], nonFilerRate: Number(e.target.value) };
                                setCurrentTaxYearData({ ...currentTaxYearData, propertyPurchaseSlabs: updated });
                              }}
                              style={{ width: '65px', padding: '3px 6px', marginLeft: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selling Rates Card */}
                <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                    Property Sale Advance Tax (Sec 236C)
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
                    Adjustable advance income tax collected from seller.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(currentTaxYearData.propertySaleRates || {}).map(([key, val]: [string, any]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                          {key}:
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            step="0.0025"
                            value={val}
                            onChange={(e) => {
                              const updated = { ...currentTaxYearData.propertySaleRates, [key]: Number(e.target.value) };
                              setCurrentTaxYearData({ ...currentTaxYearData, propertySaleRates: updated });
                            }}
                            style={{ width: '80px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'right' }}
                          />
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>({(val * 100).toFixed(2)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COMPANY COST ESTIMATOR MANAGER */}
        {/* ========================================================= */}
        {activeMainTab === 'cost' && (
          <div>
            {/* Action Bar */}
            <div
              style={{
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  SECP Incorporation &amp; Advisory Fees Config
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                  Adjust statutory filing costs, advisory service packages, and optional licensing fees.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleResetCost}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title="Reset to default company setup pricing"
                >
                  <RotateCcw size={14} />
                  <span>Reset Fees</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveCompanyCost}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isSaving ? '#6c1519' : 'var(--primary, #A31D24)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 10px rgba(163, 29, 36, 0.25)',
                  }}
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Company Setup Fees'}</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {/* Entity Base Packages */}
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
                  Business Entity Legal Packages (PKR)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {companyCostData.entityTiers?.map((entity: any, eIdx: number) => (
                    <div key={entity.id} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{entity.name}</strong>
                        <span style={{ fontSize: '11px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          {entity.badge}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Base Package: PKR</span>
                        <input
                          type="number"
                          value={entity.baseFee}
                          onChange={(e) => {
                            const updated = [...companyCostData.entityTiers];
                            updated[eIdx] = { ...updated[eIdx], baseFee: Number(e.target.value) };
                            setCompanyCostData({ ...companyCostData, entityTiers: updated });
                          }}
                          style={{ width: '110px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authorized Capital Tiers */}
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
                  SECP Authorized Capital Tiers (PKR)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {companyCostData.capitalTiers?.map((cap: any, cIdx: number) => (
                    <div key={cap.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: '#334155', fontWeight: 600 }}>{cap.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#94a3b8' }}>PKR</span>
                        <input
                          type="number"
                          value={cap.fee}
                          onChange={(e) => {
                            const updated = [...companyCostData.capitalTiers];
                            updated[cIdx] = { ...updated[cIdx], fee: Number(e.target.value) };
                            setCompanyCostData({ ...companyCostData, capitalTiers: updated });
                          }}
                          style={{ width: '90px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'right', fontWeight: 700 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Add-ons */}
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
                  Tax, Chamber &amp; Licensing Add-ons (PKR)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {companyCostData.serviceAddons?.map((addon: any, aIdx: number) => (
                    <div key={addon.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: '#334155', fontWeight: 600, maxWidth: '200px' }}>{addon.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#94a3b8' }}>PKR</span>
                        <input
                          type="number"
                          value={addon.fee}
                          onChange={(e) => {
                            const updated = [...companyCostData.serviceAddons];
                            updated[aIdx] = { ...updated[aIdx], fee: Number(e.target.value) };
                            setCompanyCostData({ ...companyCostData, serviceAddons: updated });
                          }}
                          style={{ width: '90px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'right', fontWeight: 700 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BACKEND & MONGO STATUS GUIDE */}
        {/* ========================================================= */}
        {activeMainTab === 'guide' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
                QWCA Full-Stack Architecture Status
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px' }}>
                High-performance decoupled architecture: Next.js Client on port 3000 and Express REST API on port 5000 with Dockerized MongoDB.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Express REST Server</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: serverOnline ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                    {serverOnline ? 'Connected (Port 5000)' : 'Offline / Standalone'}
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: '6px 0 0' }}>
                    API Endpoint: <code>http://localhost:5000/api</code>
                  </p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Database Engine</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                    {serverInfo?.database || (serverOnline ? 'MongoDB Docker Online' : 'In-Memory Fallback')}
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: '6px 0 0' }}>
                    MongoDB URI: <code>mongodb://127.0.0.1:27017/qwca_database</code>
                  </p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Security &amp; Auth</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                    JWT Bearer (Active)
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: '6px 0 0' }}>
                    Signed in as: <code>{adminUser?.email || 'admin@qwca.com.pk'}</code>
                  </p>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', borderRadius: '8px', padding: '14px 18px', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '13.5px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Zero-Downtime Resilience:</strong>
                <p style={{ margin: 0 }}>
                  If the Express backend or MongoDB is starting up, stopped, or offline, the Next.js client seamlessly falls back to the official built-in statutory baseline. The public website never goes down.
                </p>
              </div>
            </div>

            <div style={{ background: '#1A1D20', borderRadius: '10px', padding: '20px', color: '#f8fafc' }}>
              <strong style={{ display: 'block', fontSize: '14px', color: '#ff8a8f', marginBottom: '8px' }}>
                Quick Terminal Run Commands:
              </strong>
              <pre style={{ margin: 0, fontSize: '13px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', overflowX: 'auto' }}>
                {`# 1. Start Docker MongoDB & Mongo-Express
npm run docker:up

# 2. Start Express Backend on http://localhost:5000
npm run dev:server

# 3. Start Next.js Client on http://localhost:3000
npm run dev:client`}
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

        {/* Modal: Change Password */}
        {showChangePassModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
            }}
          >
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(163, 29, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A31D24' }}>
                  <Key size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Change Admin Password
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
                Update the single administrator access key for QWCA Governance Portal.
              </p>

              {changePassStatus && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    background: changePassStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${changePassStatus.type === 'success' ? '#22c55e' : '#ef4444'}`,
                    color: changePassStatus.type === 'success' ? '#15803d' : '#b91c1c',
                    fontSize: '13px',
                    fontWeight: 700,
                    marginBottom: '14px',
                  }}
                >
                  {changePassStatus.message}
                </div>
              )}

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    placeholder="Enter current password"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    New Password (Min 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="Enter new strong password"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassInput}
                    onChange={(e) => setConfirmPassInput(e.target.value)}
                    placeholder="Re-enter new password"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassModal(false);
                      setChangePassStatus(null);
                    }}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPass}
                    style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: 'var(--primary, #A31D24)', color: '#fff', fontWeight: 800, cursor: isChangingPass ? 'not-allowed' : 'pointer' }}
                  >
                    {isChangingPass ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
