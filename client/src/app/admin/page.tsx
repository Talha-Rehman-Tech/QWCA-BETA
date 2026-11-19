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
  LogIn,
  Clock,
  Settings,
  HelpCircle,
  FileText,
  Sliders,
  Tag,
  Percent,
  DollarSign
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
  deleteTaxYearApi,
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
  const [activeTaxSubTab, setActiveTaxSubTab] = useState<'salary' | 'business' | 'rental' | 'property' | 'custom' | 'lateFiler'>('salary');

  // Server & DB Status
  const [serverOnline, setServerOnline] = useState<boolean>(false);
  const [serverInfo, setServerInfo] = useState<ApiHealthResponse | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveNotification, setSaveNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // ==================== 1. TAX SLABS STATE ====================
  const [taxYearsList, setTaxYearsList] = useState<string[]>(['2026-2027', '2025-2026', '2024-2025', '2023-2024']);
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
    customSections: [
      {
        sectionId: 'SEC-7E',
        title: 'Section 7E Tax on Deemed Income from Inactive Properties',
        category: 'property',
        description: 'Imposes 1% effective tax on fair market value of capital assets exceeding PKR 25 Million.',
        effectiveRate: 0.01,
        fixedAmount: 0,
        applicableTo: 'All Residents (Excluding 1 Self-Occupied Residence)',
        status: 'active',
      },
    ],
    lateFilerRules: {
      atlSurchargeIndividual: 1000,
      atlSurchargeAOP: 10000,
      atlSurchargeCompany: 20000,
      propertyPurchaseLateRate: 0.055,
      propertySaleLateRate: 0.045,
      description: 'Under Finance Act 2024 and Section 182(2), late filers on ATL bear graduated surcharge penalties and higher withholding rates until ATL status is fully regularized.',
    },
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

      const health = await checkServerHealth();
      setServerOnline(health.online);
      if (health.data) setServerInfo(health.data);

      if (health.online) {
        const taxYears = await getTaxYearsApi();
        if (taxYears && taxYears.length > 0) {
          const sorted = taxYears
            .map((y: any) => y.year)
            .sort((a: string, b: string) => b.localeCompare(a, undefined, { numeric: true }));
          setTaxYearsList(sorted);
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
        nonSalariedSlabs: NON_SALARIED_SLABS[year] || NON_SALARIED_SLABS['2026-2027'] || [],
      }));
    }
  };

  // Add New Tax Year
  const handleCreateNewYear = () => {
    if (!newYearInput || taxYearsList.includes(newYearInput)) {
      alert('Please enter a valid, unique Tax Year (e.g. 2027-2028 or 2023-2024).');
      return;
    }

    const cloned = JSON.parse(JSON.stringify(currentTaxYearData));
    delete cloned._id;
    delete cloned.__v;
    delete cloned.createdAt;
    delete cloned.updatedAt;

    cloned.year = newYearInput;
    cloned.label = `Tax Year ${newYearInput}`;
    cloned.title = `Income Tax Slabs ${newYearInput}`;

    const updatedList = [newYearInput, ...taxYearsList].sort((a, b) =>
      b.localeCompare(a, undefined, { numeric: true })
    );
    setTaxYearsList(updatedList);
    setSelectedYear(newYearInput);
    setCurrentTaxYearData(cloned);
    setShowNewYearModal(false);
    setSaveNotification({
      type: 'success',
      message: `Tax Year ${newYearInput} created! Remember to click "Save Tax Year Slabs" to persist to database.`,
    });
  };

  // Delete Current Tax Year
  const handleDeleteTaxYear = async () => {
    if (taxYearsList.length <= 1) {
      alert('At least one Tax Year must remain in the system.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete Tax Year ${selectedYear} from MongoDB?`)) {
      return;
    }
    setIsSaving(true);
    const res = await deleteTaxYearApi(selectedYear);
    setIsSaving(false);
    if (res.success) {
      const remaining = taxYearsList.filter((y) => y !== selectedYear);
      setTaxYearsList(remaining);
      const nextYear = remaining[0];
      setSelectedYear(nextYear);
      handleYearChange(nextYear);
      setSaveNotification({
        type: 'success',
        message: `Tax Year ${selectedYear} successfully removed from database.`,
      });
    } else {
      setSaveNotification({
        type: 'error',
        message: res.message || 'Failed to delete tax year.',
      });
    }
    setTimeout(() => setSaveNotification(null), 5000);
  };

  // Save Current Tax Year Slabs
  const handleSaveTaxYear = async () => {
    setIsSaving(true);
    setSaveNotification(null);

    const payload = JSON.parse(JSON.stringify(currentTaxYearData));
    delete payload._id;
    delete payload.__v;

    const result = await saveTaxYearApi(selectedYear, payload);
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

    const payload = JSON.parse(JSON.stringify(companyCostData));
    delete payload._id;
    delete payload.__v;

    const result = await saveCompanyCostConfigApi(payload);
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

  // ==================== SALARY SLAB HANDLERS ====================
  const handleSalarySlabChange = (index: number, field: string, value: any) => {
    const updatedSlabs = [...(currentTaxYearData.salarySlabs || [])];
    updatedSlabs[index] = { ...updatedSlabs[index], [field]: value };
    setCurrentTaxYearData({ ...currentTaxYearData, salarySlabs: updatedSlabs });
  };

  const handleAddSalarySlab = () => {
    const slabs = currentTaxYearData.salarySlabs || [];
    const last = slabs[slabs.length - 1];
    const newMin = last ? last.max : 0;
    const newMax = newMin + 1000000;
    const newSlab = {
      min: newMin,
      max: newMax,
      rate: 0.35,
      baseTax: last ? last.baseTax + 200000 : 0,
      rangeText: `Rs. ${newMin.toLocaleString()} to Rs. ${newMax.toLocaleString()}`,
      rateText: '35%',
      payableText: 'Tax formula for new slab',
      formulaDesc: `Rate applicable on excess above ${newMin.toLocaleString()}`,
    };
    setCurrentTaxYearData({
      ...currentTaxYearData,
      salarySlabs: [...slabs, newSlab],
    });
  };

  const handleRemoveSalarySlab = (index: number) => {
    const slabs = currentTaxYearData.salarySlabs || [];
    if (slabs.length <= 1) {
      alert('You must have at least one salary slab.');
      return;
    }
    const updatedSlabs = slabs.filter((_: any, i: number) => i !== index);
    setCurrentTaxYearData({ ...currentTaxYearData, salarySlabs: updatedSlabs });
  };

  // ==================== NON-SALARIED SLAB HANDLERS ====================
  const handleNonSalariedSlabChange = (index: number, field: string, value: any) => {
    const updatedSlabs = [...(currentTaxYearData.nonSalariedSlabs || [])];
    updatedSlabs[index] = { ...updatedSlabs[index], [field]: value };
    setCurrentTaxYearData({ ...currentTaxYearData, nonSalariedSlabs: updatedSlabs });
  };

  const handleAddNonSalariedSlab = () => {
    const slabs = currentTaxYearData.nonSalariedSlabs || [];
    const last = slabs[slabs.length - 1];
    const newMin = last ? last.max : 0;
    const newMax = newMin + 1000000;
    const newSlab = {
      min: newMin,
      max: newMax,
      rate: 0.35,
      baseTax: last ? last.baseTax + 250000 : 0,
      rangeText: `Rs. ${newMin.toLocaleString()} to Rs. ${newMax.toLocaleString()}`,
      rateText: '35%',
      payableText: 'Tax formula for new non-salaried slab',
      formulaDesc: `Rate applicable on excess above ${newMin.toLocaleString()}`,
    };
    setCurrentTaxYearData({
      ...currentTaxYearData,
      nonSalariedSlabs: [...slabs, newSlab],
    });
  };

  const handleRemoveNonSalariedSlab = (index: number) => {
    const slabs = currentTaxYearData.nonSalariedSlabs || [];
    if (slabs.length <= 1) {
      alert('You must have at least one non-salaried slab.');
      return;
    }
    const updatedSlabs = slabs.filter((_: any, i: number) => i !== index);
    setCurrentTaxYearData({ ...currentTaxYearData, nonSalariedSlabs: updatedSlabs });
  };

  // ==================== CUSTOM SECTIONS HANDLERS ====================
  const handleCustomSectionChange = (index: number, field: string, value: any) => {
    const sections = [...(currentTaxYearData.customSections || [])];
    sections[index] = { ...sections[index], [field]: value };
    setCurrentTaxYearData({ ...currentTaxYearData, customSections: sections });
  };

  const handleAddCustomSection = () => {
    const sections = currentTaxYearData.customSections || [];
    const newSec = {
      sectionId: `SEC-${Date.now().toString().slice(-4)}`,
      title: 'New Statutory Provision / WHT Clause',
      category: 'general',
      description: 'Custom regulatory rule or withholding section under Income Tax Ordinance, 2001.',
      effectiveRate: 0.02,
      fixedAmount: 0,
      applicableTo: 'All Taxpayers',
      status: 'active',
    };
    setCurrentTaxYearData({
      ...currentTaxYearData,
      customSections: [...sections, newSec],
    });
  };

  const handleRemoveCustomSection = (index: number) => {
    const sections = currentTaxYearData.customSections || [];
    const updated = sections.filter((_: any, i: number) => i !== index);
    setCurrentTaxYearData({ ...currentTaxYearData, customSections: updated });
  };

  // ==================== LATE FILER RULES HANDLER ====================
  const handleLateFilerRuleChange = (field: string, value: any) => {
    const updated = {
      ...(currentTaxYearData.lateFilerRules || {}),
      [field]: value,
    };
    setCurrentTaxYearData({ ...currentTaxYearData, lateFilerRules: updated });
  };

  // ==================== CGT HOLDING SCHEDULE HANDLER ====================
  const handleCGTBracketChange = (index: number, field: string, value: any) => {
    const updated = [...(currentTaxYearData.cgtHoldingSchedule || [])];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentTaxYearData({ ...currentTaxYearData, cgtHoldingSchedule: updated });
  };

  // ==================== COMPANY COST CONFIG HANDLERS ====================
  // Entity Tiers
  const handleEntityTierChange = (index: number, field: string, value: any) => {
    const updated = [...(companyCostData.entityTiers || [])];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'baseGovFee' || field === 'baseConsultingFee') {
      const gov = field === 'baseGovFee' ? Number(value) : (updated[index].baseGovFee || 0);
      const con = field === 'baseConsultingFee' ? Number(value) : (updated[index].baseConsultingFee || 0);
      updated[index].baseFee = gov + con;
    }
    setCompanyCostData({ ...companyCostData, entityTiers: updated });
  };

  const handleAddEntityTier = () => {
    const tiers = companyCostData.entityTiers || [];
    const newTier = {
      id: `custom-entity-${Date.now()}`,
      name: 'Special Enterprise Structure',
      badge: 'Custom',
      baseGovFee: 5000,
      baseConsultingFee: 30000,
      baseFee: 35000,
      turnaround: '3 to 5 Days',
      description: 'Special legal framework customized for domestic or cross-border venture.',
    };
    setCompanyCostData({ ...companyCostData, entityTiers: [...tiers, newTier] });
  };

  const handleRemoveEntityTier = (index: number) => {
    const tiers = companyCostData.entityTiers || [];
    if (tiers.length <= 1) {
      alert('You must have at least one legal entity structure.');
      return;
    }
    setCompanyCostData({ ...companyCostData, entityTiers: tiers.filter((_: any, i: number) => i !== index) });
  };

  // Capital Tiers
  const handleCapitalTierChange = (index: number, field: string, value: any) => {
    const updated = [...(companyCostData.capitalTiers || [])];
    updated[index] = { ...updated[index], [field]: value };
    setCompanyCostData({ ...companyCostData, capitalTiers: updated });
  };

  const handleAddCapitalTier = () => {
    const tiers = companyCostData.capitalTiers || [];
    const newCap = {
      id: `cap-${Date.now()}`,
      label: 'PKR 10M to PKR 25M Authorized Capital',
      fee: 45000,
      govtFee: 35000,
    };
    setCompanyCostData({ ...companyCostData, capitalTiers: [...tiers, newCap] });
  };

  const handleRemoveCapitalTier = (index: number) => {
    const tiers = companyCostData.capitalTiers || [];
    if (tiers.length <= 1) {
      alert('You must have at least one capital tier.');
      return;
    }
    setCompanyCostData({ ...companyCostData, capitalTiers: tiers.filter((_: any, i: number) => i !== index) });
  };

  // Service Addons
  const handleServiceAddonChange = (index: number, field: string, value: any) => {
    const updated = [...(companyCostData.serviceAddons || [])];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'govtFee' || field === 'consultingFee') {
      const gov = field === 'govtFee' ? Number(value) : (updated[index].govtFee || 0);
      const con = field === 'consultingFee' ? Number(value) : (updated[index].consultingFee || 0);
      updated[index].fee = gov + con;
    }
    setCompanyCostData({ ...companyCostData, serviceAddons: updated });
  };

  const handleAddServiceAddon = () => {
    const addons = companyCostData.serviceAddons || [];
    const newAddon = {
      id: `addon-${Date.now()}`,
      name: 'Custom Regulatory / Advisory Service',
      description: 'Statutory or operational compliance authorization.',
      fee: 20000,
      govtFee: 5000,
      consultingFee: 15000,
      required: false,
      defaultChecked: false,
      category: 'advisory',
    };
    setCompanyCostData({ ...companyCostData, serviceAddons: [...addons, newAddon] });
  };

  const handleRemoveServiceAddon = (index: number) => {
    const addons = companyCostData.serviceAddons || [];
    if (addons.length <= 1) {
      alert('You must have at least one add-on service.');
      return;
    }
    setCompanyCostData({ ...companyCostData, serviceAddons: addons.filter((_: any, i: number) => i !== index) });
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
                    }}
                  />
                </div>
              </div>

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
              Directly calibrate FBR Annual Tax Slabs, Corporate Tax Rates, Late Filer Penalties, and SECP Incorporation Fee Schedules.
            </p>
          </div>

          {/* Admin Profile & Connection Status Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
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
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px', overflowX: 'auto' }}>
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
              whiteSpace: 'nowrap',
            }}
          >
            <Calculator size={18} />
            <span>Annual Tax Slabs &amp; Governance</span>
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
              whiteSpace: 'nowrap',
            }}
          >
            <Building2 size={18} />
            <span>Company Cost Estimator Manager (9 Sections)</span>
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
              whiteSpace: 'nowrap',
            }}
          >
            <Server size={18} />
            <span>Backend &amp; DB Architecture Status</span>
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
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <Calendar size={18} color="var(--primary, #A31D24)" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>Active Tax Year:</span>
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
                  title="Add previous or upcoming tax year (e.g. 2023-2024, 2027-2028)"
                >
                  <Plus size={15} />
                  <span>Add Tax Year</span>
                </button>

                {taxYearsList.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDeleteTaxYear}
                    disabled={isSaving}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #fecaca',
                      background: '#fff1f2',
                      color: '#e11d48',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title="Delete current tax year"
                  >
                    <Trash2 size={14} />
                    <span>Delete {selectedYear}</span>
                  </button>
                )}
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
                  <span>Reset Slabs</span>
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
                  <span>{isSaving ? 'Saving to DB...' : `Save Slabs (${selectedYear})`}</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Salary, Business, Rental, Property, Custom, Late Filer */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', background: '#e2e8f0', padding: '4px', borderRadius: '8px', width: 'fit-content', flexWrap: 'wrap' }}>
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
                4. Property (236K, 236C, CGT 37)
              </button>
              <button
                type="button"
                onClick={() => setActiveTaxSubTab('custom')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTaxSubTab === 'custom' ? '#ffffff' : 'transparent',
                  color: activeTaxSubTab === 'custom' ? 'var(--primary, #A31D24)' : '#64748b',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTaxSubTab === 'custom' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                5. Custom Statutory Sections
              </button>
              <button
                type="button"
                onClick={() => setActiveTaxSubTab('lateFiler')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTaxSubTab === 'lateFiler' ? '#ffffff' : 'transparent',
                  color: activeTaxSubTab === 'lateFiler' ? 'var(--primary, #A31D24)' : '#64748b',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTaxSubTab === 'lateFiler' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                6. Late Filer Governance
              </button>
            </div>

            {/* Sub-Tab 1: Salaried Table Editor */}
            {activeTaxSubTab === 'salary' && (
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      Salaried Income Tax Slabs ({selectedYear})
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                      First Schedule Division I, Part I. Threshold levels, percentage tax rates, fixed base taxes, and textual formulas.
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
                    <span>Add Salary Slab</span>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Non-Salaried Business Slabs (Sole Proprietors & AOPs) */}
                <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                          Non-Salaried Business Slabs (Sole Proprietors &amp; AOPs) — ({selectedYear})
                        </h3>
                        <span style={{ fontSize: '11px', background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          First Schedule Div I
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                        Applicable to commercial enterprises, individual business owners, and partnership firms (AOPs).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNonSalariedSlab}
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
                      <span>Add Non-Salaried Slab</span>
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
                        {currentTaxYearData.nonSalariedSlabs?.map((slab: any, idx: number) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 700, color: '#94a3b8' }}>{idx + 1}</td>
                            <td style={{ padding: '8px 10px' }}>
                              <input
                                type="number"
                                value={slab.min}
                                onChange={(e) => handleNonSalariedSlabChange(idx, 'min', Number(e.target.value))}
                                style={{ width: '110px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <input
                                type="number"
                                value={slab.max}
                                onChange={(e) => handleNonSalariedSlabChange(idx, 'max', Number(e.target.value))}
                                style={{ width: '120px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <input
                                type="number"
                                step="0.005"
                                value={slab.rate}
                                onChange={(e) => handleNonSalariedSlabChange(idx, 'rate', Number(e.target.value))}
                                style={{ width: '75px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <input
                                type="number"
                                value={slab.baseTax}
                                onChange={(e) => handleNonSalariedSlabChange(idx, 'baseTax', Number(e.target.value))}
                                style={{ width: '100px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <input
                                type="text"
                                value={slab.rangeText}
                                onChange={(e) => handleNonSalariedSlabChange(idx, 'rangeText', e.target.value)}
                                style={{ width: '180px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <input
                                type="text"
                                value={slab.rateText}
                                onChange={(e) => handleNonSalariedSlabChange(idx, 'rateText', e.target.value)}
                                style={{ width: '80px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <button
                                type="button"
                                onClick={() => handleRemoveNonSalariedSlab(idx)}
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

                {/* Grid: Corporate Rates & Super Tax */}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {/* Buying Rates Card (Section 236K) */}
                  <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                          Property Purchase Tax (Sec 236K)
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                          Advance tax collected from purchaser at registration/transfer.
                        </p>
                      </div>
                      <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        Finance Act 2024
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      {currentTaxYearData.propertyPurchaseSlabs?.map((pSlab: any, pIdx: number) => (
                        <div key={pIdx} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                          <strong style={{ fontSize: '13px', color: '#0f172a' }}>{pSlab.label}</strong>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                            <label style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 700 }}>
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
                                style={{ width: '100%', padding: '4px 6px', marginTop: '2px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                              />
                            </label>
                            <label style={{ fontSize: '11.5px', color: '#d97706', fontWeight: 700 }}>
                              Late Filer:
                              <input
                                type="number"
                                step="0.0025"
                                value={pSlab.lateFilerRate ?? 0.055}
                                onChange={(e) => {
                                  const updated = [...currentTaxYearData.propertyPurchaseSlabs];
                                  updated[pIdx] = { ...updated[pIdx], lateFilerRate: Number(e.target.value) };
                                  setCurrentTaxYearData({ ...currentTaxYearData, propertyPurchaseSlabs: updated });
                                }}
                                style={{ width: '100%', padding: '4px 6px', marginTop: '2px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                              />
                            </label>
                            <label style={{ fontSize: '11.5px', color: '#b91c1c', fontWeight: 700 }}>
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
                                style={{ width: '100%', padding: '4px 6px', marginTop: '2px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selling Rates Card (Section 236C) */}
                  <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                          Property Sale Advance Tax (Sec 236C)
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                          Adjustable advance income tax deducted from seller at property alienation.
                        </p>
                      </div>
                      <span style={{ fontSize: '11px', background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        Seller WHT
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      {Object.entries(currentTaxYearData.propertySaleRates || {}).map(([key, val]: [string, any]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155', textTransform: 'capitalize' }}>
                            {key === 'lateFiler' ? 'Late Filer:' : key === 'filer' ? 'Active Filer:' : key === 'nonFiler' ? 'Non-Filer:' : 'Overseas (NICOP/POC):'}
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
                              style={{ width: '80px', padding: '5px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'right', fontWeight: 700 }}
                            />
                            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary, #A31D24)' }}>({(val * 100).toFixed(2)}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CGT Holding Schedule (Section 37) Card */}
                <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      Capital Gains Tax (CGT) Holding Period Schedule (Section 37)
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                      Statutory CGT rates graduated across holding periods for open plots, constructed property, and flats.
                    </p>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead style={{ background: '#f8fafc', color: '#475569', fontWeight: 800, borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                          <th style={{ padding: '10px 14px' }}>Holding Period</th>
                          <th style={{ padding: '10px 14px' }}>Active Filer Rate (%)</th>
                          <th style={{ padding: '10px 14px' }}>Late Filer Rate (%)</th>
                          <th style={{ padding: '10px 14px' }}>Non-Filer Rate (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTaxYearData.cgtHoldingSchedule?.map((bracket: any, bIdx: number) => (
                          <tr key={bIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>{bracket.period}</td>
                            <td style={{ padding: '8px 14px' }}>
                              <input
                                type="number"
                                step="0.005"
                                value={bracket.filerRate}
                                onChange={(e) => handleCGTBracketChange(bIdx, 'filerRate', Number(e.target.value))}
                                style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                              />
                              <span style={{ marginLeft: '6px', color: '#15803d', fontWeight: 700 }}>({(bracket.filerRate * 100).toFixed(1)}%)</span>
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <input
                                type="number"
                                step="0.005"
                                value={bracket.lateFilerRate ?? 0.20}
                                onChange={(e) => handleCGTBracketChange(bIdx, 'lateFilerRate', Number(e.target.value))}
                                style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                              />
                              <span style={{ marginLeft: '6px', color: '#d97706', fontWeight: 700 }}>({((bracket.lateFilerRate ?? 0.20) * 100).toFixed(1)}%)</span>
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <input
                                type="number"
                                step="0.005"
                                value={bracket.nonFilerRate}
                                onChange={(e) => handleCGTBracketChange(bIdx, 'nonFilerRate', Number(e.target.value))}
                                style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                              />
                              <span style={{ marginLeft: '6px', color: '#b91c1c', fontWeight: 700 }}>({(bracket.nonFilerRate * 100).toFixed(1)}%)</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 5: Custom Statutory Sections */}
            {activeTaxSubTab === 'custom' && (
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      Custom Statutory Sections &amp; WHT Provisions ({selectedYear})
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                      Define custom statutory provisions, deemed income rules (e.g. Section 7E), and special industry withholding clauses.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomSection}
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
                    <span>Add Custom Section</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(!currentTaxYearData.customSections || currentTaxYearData.customSections.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
                      <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                      <p style={{ margin: 0, fontWeight: 700 }}>No custom statutory sections defined for {selectedYear}.</p>
                      <button
                        type="button"
                        onClick={handleAddCustomSection}
                        style={{ marginTop: '10px', background: 'none', border: 'none', color: 'var(--primary, #A31D24)', fontWeight: 800, cursor: 'pointer' }}
                      >
                        + Click here to add your first custom section
                      </button>
                    </div>
                  )}

                  {currentTaxYearData.customSections?.map((cSec: any, cIdx: number) => (
                    <div
                      key={cIdx}
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11.5px', background: '#1A1D20', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                            {cSec.sectionId || `SEC-${cIdx + 1}`}
                          </span>
                          <input
                            type="text"
                            value={cSec.title}
                            onChange={(e) => handleCustomSectionChange(cIdx, 'title', e.target.value)}
                            placeholder="Section Title / Statutory Clause"
                            style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 10px', minWidth: '260px' }}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <select
                            value={cSec.status || 'active'}
                            onChange={(e) => handleCustomSectionChange(cIdx, 'status', e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: cSec.status === 'inactive' ? '#fef2f2' : '#f0fdf4',
                              color: cSec.status === 'inactive' ? '#b91c1c' : '#15803d',
                            }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleRemoveCustomSection(cIdx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Delete Custom Section"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                            Category:
                          </label>
                          <select
                            value={cSec.category || 'general'}
                            onChange={(e) => handleCustomSectionChange(cIdx, 'category', e.target.value)}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                          >
                            <option value="general">General Statutory</option>
                            <option value="property">Property &amp; Real Estate</option>
                            <option value="business">Business / AOP</option>
                            <option value="corporate">Corporate / Company</option>
                            <option value="salary">Salaried Class</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                            Effective Rate (%):
                          </label>
                          <input
                            type="number"
                            step="0.005"
                            value={cSec.effectiveRate ?? 0}
                            onChange={(e) => handleCustomSectionChange(cIdx, 'effectiveRate', Number(e.target.value))}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                            Fixed Amount (Rs.):
                          </label>
                          <input
                            type="number"
                            value={cSec.fixedAmount ?? 0}
                            onChange={(e) => handleCustomSectionChange(cIdx, 'fixedAmount', Number(e.target.value))}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                            Applicable To:
                          </label>
                          <input
                            type="text"
                            value={cSec.applicableTo || ''}
                            onChange={(e) => handleCustomSectionChange(cIdx, 'applicableTo', e.target.value)}
                            placeholder="e.g. Assets > 25M, Filers, Importers"
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                          Statutory Description &amp; Legal Reference:
                        </label>
                        <textarea
                          rows={2}
                          value={cSec.description || ''}
                          onChange={(e) => handleCustomSectionChange(cIdx, 'description', e.target.value)}
                          placeholder="FBR statutory rationale, exemptions, and relevant sub-sections..."
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 6: Late Filer Governance */}
            {activeTaxSubTab === 'lateFiler' && (
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                        Late Filer Governance &amp; Section 182(2) Penalties ({selectedYear})
                      </h3>
                      <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        FBR ATL Rules
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                      Statutory surcharges under Section 182(2) required to appear on Active Taxpayer List (ATL) after due date, plus differential withholding rates.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '20px' }}>
                  {/* Surcharges Card */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                      Section 182(2) Late Surcharge (PKR)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                          Individual / Sole Proprietor:
                        </label>
                        <input
                          type="number"
                          value={currentTaxYearData.lateFilerRules?.atlSurchargeIndividual ?? 1000}
                          onChange={(e) => handleLateFilerRuleChange('atlSurchargeIndividual', Number(e.target.value))}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                          Association of Persons (AOP / Partnership):
                        </label>
                        <input
                          type="number"
                          value={currentTaxYearData.lateFilerRules?.atlSurchargeAOP ?? 10000}
                          onChange={(e) => handleLateFilerRuleChange('atlSurchargeAOP', Number(e.target.value))}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                          Corporate / Company (Pvt / Public):
                        </label>
                        <input
                          type="number"
                          value={currentTaxYearData.lateFilerRules?.atlSurchargeCompany ?? 20000}
                          onChange={(e) => handleLateFilerRuleChange('atlSurchargeCompany', Number(e.target.value))}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Late Property Tax Card */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                      Property Withholding Late Surcharges
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                          Sec 236K Property Purchase Late Baseline Rate (%):
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                            step="0.0025"
                            value={currentTaxYearData.lateFilerRules?.propertyPurchaseLateRate ?? 0.055}
                            onChange={(e) => handleLateFilerRuleChange('propertyPurchaseLateRate', Number(e.target.value))}
                            style={{ width: '90px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                          />
                          <span style={{ fontSize: '13px', color: '#d97706', fontWeight: 700 }}>
                            ({((currentTaxYearData.lateFilerRules?.propertyPurchaseLateRate ?? 0.055) * 100).toFixed(2)}%)
                          </span>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                          Sec 236C Property Sale Late Baseline Rate (%):
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                            step="0.0025"
                            value={currentTaxYearData.lateFilerRules?.propertySaleLateRate ?? 0.045}
                            onChange={(e) => handleLateFilerRuleChange('propertySaleLateRate', Number(e.target.value))}
                            style={{ width: '90px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                          />
                          <span style={{ fontSize: '13px', color: '#d97706', fontWeight: 700 }}>
                            ({((currentTaxYearData.lateFilerRules?.propertySaleLateRate ?? 0.045) * 100).toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Statutory Explanation &amp; Compliance Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={currentTaxYearData.lateFilerRules?.description || ''}
                    onChange={(e) => handleLateFilerRuleChange('description', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                  />
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
                  SECP Incorporation &amp; Advisory Fees Config (4 Entity Types, 4 Capital Tiers, 9 Add-ons)
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                  Adjust statutory filing fees, professional advisory charges, and customize all 9 registration steps matching official pricing.
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
                  <span>{isSaving ? 'Saving to DB...' : 'Save Company Setup Fees'}</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* 1. Entity Base Packages */}
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      1. Business Entity Legal Packages (4 Structures)
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0' }}>
                      Base consultation &amp; legal documentation fees per corporate structure.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEntityTier}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--primary, #A31D24)',
                      background: 'var(--primary, #A31D24)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Legal Entity</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {companyCostData.entityTiers?.map((entity: any, eIdx: number) => (
                    <div key={entity.id || eIdx} style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={entity.name}
                          onChange={(e) => handleEntityTierChange(eIdx, 'name', e.target.value)}
                          style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 6px', width: '180px' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            value={entity.badge || ''}
                            onChange={(e) => handleEntityTierChange(eIdx, 'badge', e.target.value)}
                            placeholder="Badge"
                            style={{ fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 5px', width: '80px' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveEntityTier(eIdx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Govt Official Fee:</label>
                          <input
                            type="number"
                            value={entity.baseGovFee ?? 3500}
                            onChange={(e) => handleEntityTierChange(eIdx, 'baseGovFee', Number(e.target.value))}
                            style={{ width: '100%', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 700 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>QWCA Legal Fee:</label>
                          <input
                            type="number"
                            value={entity.baseConsultingFee ?? (entity.baseFee - 3500)}
                            onChange={(e) => handleEntityTierChange(eIdx, 'baseConsultingFee', Number(e.target.value))}
                            style={{ width: '100%', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 700 }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Total Base Package:</span>
                        <span style={{ fontSize: '13.5px', fontWeight: 900, color: 'var(--primary, #A31D24)' }}>
                          PKR {(entity.baseFee || (entity.baseGovFee || 0) + (entity.baseConsultingFee || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Authorized Capital Tiers */}
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      2. SECP Authorized Capital Tiers (4 Tiers)
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0' }}>
                      Statutory capital registration fee scale charged by SECP.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCapitalTier}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--primary, #A31D24)',
                      background: 'var(--primary, #A31D24)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Capital Tier</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {companyCostData.capitalTiers?.map((cap: any, cIdx: number) => (
                    <div key={cap.id || cIdx} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <input
                          type="text"
                          value={cap.label}
                          onChange={(e) => handleCapitalTierChange(cIdx, 'label', e.target.value)}
                          style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 6px', width: '170px' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCapitalTier(cIdx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '11.5px', color: '#64748b' }}>Fee (PKR):</span>
                        <input
                          type="number"
                          value={cap.fee}
                          onChange={(e) => handleCapitalTierChange(cIdx, 'fee', Number(e.target.value))}
                          style={{ width: '90px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px', textAlign: 'right', fontWeight: 800 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Service & Setup Add-ons (All 9 Add-ons) */}
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      3. Regulatory, Tax &amp; Licensing Add-ons (9 Sections)
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0' }}>
                      SECP, FBR, Bank, Chamber, WebOC, PSEB, and Secretarial compliance components.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddServiceAddon}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--primary, #A31D24)',
                      background: 'var(--primary, #A31D24)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Service Add-on</span>
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', color: '#475569', fontWeight: 800, borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '10px 12px' }}>#</th>
                        <th style={{ padding: '10px 12px' }}>Service / Regulatory Clause</th>
                        <th style={{ padding: '10px 12px' }}>Govt Fee (PKR)</th>
                        <th style={{ padding: '10px 12px' }}>QWCA Fee (PKR)</th>
                        <th style={{ padding: '10px 12px' }}>Total (PKR)</th>
                        <th style={{ padding: '10px 12px' }}>Required?</th>
                        <th style={{ padding: '10px 12px' }}>Default Checked?</th>
                        <th style={{ padding: '10px 12px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyCostData.serviceAddons?.map((addon: any, aIdx: number) => (
                        <tr key={addon.id || aIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#94a3b8' }}>{aIdx + 1}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <input
                              type="text"
                              value={addon.name}
                              onChange={(e) => handleServiceAddonChange(aIdx, 'name', e.target.value)}
                              style={{ width: '230px', padding: '5px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 700 }}
                            />
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                              Category: {addon.category || 'statutory'}
                            </div>
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <input
                              type="number"
                              value={addon.govtFee ?? 0}
                              onChange={(e) => handleServiceAddonChange(aIdx, 'govtFee', Number(e.target.value))}
                              style={{ width: '85px', padding: '5px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <input
                              type="number"
                              value={addon.consultingFee ?? addon.fee}
                              onChange={(e) => handleServiceAddonChange(aIdx, 'consultingFee', Number(e.target.value))}
                              style={{ width: '85px', padding: '5px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                            />
                          </td>
                          <td style={{ padding: '8px 12px', fontWeight: 800, color: 'var(--primary, #A31D24)' }}>
                            PKR {(addon.fee || (addon.govtFee || 0) + (addon.consultingFee || 0)).toLocaleString()}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(addon.required)}
                              onChange={(e) => handleServiceAddonChange(aIdx, 'required', e.target.checked)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(addon.defaultChecked)}
                              onChange={(e) => handleServiceAddonChange(aIdx, 'defaultChecked', e.target.checked)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveServiceAddon(aIdx)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete Addon"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                Enter the fiscal year identifier (e.g. 2027-2028 or 2022-2023). Baseline slabs will be cloned for you to customize.
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
