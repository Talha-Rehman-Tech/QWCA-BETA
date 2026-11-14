'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  SALARY_TAX_DATA,
  NON_SALARIED_SLABS,
  SUPER_TAX_BRACKETS,
  RENTAL_SLABS
} from '@/data/tax-calculator-data';
import {
  User,
  Building2,
  Home,
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';

export default function IncomeTaxCalculator() {
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get('tab') : null;
  const [activeTab, setActiveTab] = useState<'salaried' | 'business' | 'rental'>('salaried');

  useEffect(() => {
    if (tabParam === 'business' || tabParam === 'rental' || tabParam === 'salaried') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // ================= SALARIED STATE =================
  const [salYear, setSalYear] = useState<string>('2026-2027');
  const [salPeriod, setSalPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [salAmount, setSalAmount] = useState<number>(100000);
  const [salTableYear, setSalTableYear] = useState<string>('2026-2027');

  // ================= BUSINESS STATE =================
  const [bizYear, setBizYear] = useState<string>('2026-2027');
  const [bizEntity, setBizEntity] = useState<'individual' | 'corporate'>('corporate');
  const [bizCategory, setBizCategory] = useState<string>('general');
  const [bizProfit, setBizProfit] = useState<number>(10000000);
  const [bizTableYear, setBizTableYear] = useState<string>('2026-2027');

  // ================= RENTAL STATE =================
  const [rentYear, setRentYear] = useState<string>('2026-2027');
  const [rentOwnerType, setRentOwnerType] = useState<'individual' | 'company'>('individual');
  const [rentPeriod, setRentPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [rentAmount, setRentAmount] = useState<number>(100000);

  const formatPKR = (num: number) => {
    return 'Rs ' + Math.round(num).toLocaleString('en-PK');
  };

  const parseNumber = (val: string) => {
    const clean = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  // ================= SALARIED COMPUTATION =================
  const salaryCalc = useMemo(() => {
    const annualSalary = salPeriod === 'monthly' ? salAmount * 12 : salAmount;
    const monthlySalary = Math.round(annualSalary / 12);
    const yearConfig = SALARY_TAX_DATA[salYear] || SALARY_TAX_DATA['2026-2027'];

    let annualTax = 0;
    let activeSlabIndex = 0;
    let activeSlab = yearConfig.slabs[0];

    for (let i = 0; i < yearConfig.slabs.length; i++) {
      const slab = yearConfig.slabs[i];
      if (annualSalary > slab.min) {
        activeSlabIndex = i;
        activeSlab = slab;
      }
    }

    if (annualSalary > activeSlab.min) {
      const taxableOverMin = annualSalary - activeSlab.min;
      annualTax = activeSlab.baseTax + Math.round(taxableOverMin * activeSlab.rate);
    }

    const monthlyTax = Math.round(annualTax / 12);
    const annualTakeHome = Math.max(0, annualSalary - annualTax);
    const monthlyTakeHome = Math.round(annualTakeHome / 12);
    const effectiveRate = annualSalary > 0 ? (annualTax / annualSalary) * 100 : 0;

    return {
      annualSalary,
      monthlySalary,
      annualTax,
      monthlyTax,
      annualTakeHome,
      monthlyTakeHome,
      effectiveRate,
      activeSlabIndex,
      activeSlab,
      yearConfig
    };
  }, [salAmount, salPeriod, salYear]);

  // ================= BUSINESS COMPUTATION =================
  const businessCalc = useMemo(() => {
    const profit = Math.max(0, bizProfit);
    const isInd = bizEntity === 'individual';
    let baseTax = 0;
    let superTax = 0;
    let totalTax = 0;
    let activeSlabIndex = 0;
    let rateText = '';
    let categoryTag = '';
    let activeSlabDesc = '';

    if (isInd) {
      const isProfAop = bizCategory === 'prof_aop';
      categoryTag = isProfAop ? 'Professional Firm AOP (Max 40% Cap)' : 'Commercial Business / Sole Proprietor';
      const yearSlabs = (NON_SALARIED_SLABS as any)[bizYear] || (NON_SALARIED_SLABS as any)['2026-2027'];

      for (let i = 0; i < yearSlabs.length; i++) {
        if (profit > yearSlabs[i].min) {
          activeSlabIndex = i;
        }
      }

      const activeSlab = yearSlabs[activeSlabIndex];
      const taxable = profit - activeSlab.min;

      let effectiveSlabRate = activeSlab.rate;
      if (isProfAop && effectiveSlabRate > 0.40) {
        effectiveSlabRate = 0.40;
      }

      baseTax = activeSlab.fixed + Math.round(taxable * effectiveSlabRate);
      rateText = `${(effectiveSlabRate * 100).toFixed(0)}%`;
      activeSlabDesc = `${activeSlab.rangeText} (${rateText}): ${activeSlab.desc}`;

      // High-Income Surcharge (10% under Sec 4AB if profit > 10M)
      let surcharge = 0;
      if (profit > 10000000) {
        surcharge = Math.round(baseTax * 0.10);
      }
      totalTax = baseTax + surcharge;
    } else {
      // Corporate
      let corporateRate = 0.29;
      if (bizCategory === 'small') {
        corporateRate = 0.20;
        categoryTag = 'Small Company (20% Corporate Rate)';
      } else if (bizCategory === 'banking') {
        corporateRate = 0.39;
        categoryTag = 'Banking Company (39% Corporate Rate + 10% Super Tax)';
      } else if (bizCategory === 'modaraba') {
        corporateRate = 0.25;
        categoryTag = 'Modaraba (25% Corporate Rate)';
      } else if (bizCategory === 'sme_cat1') {
        corporateRate = 0.075;
        categoryTag = 'SME Manufacturing Category 1 (7.5% Normal Tax)';
      } else if (bizCategory === 'sme_cat2') {
        corporateRate = 0.15;
        categoryTag = 'SME Manufacturing Category 2 (15% Normal Tax)';
      } else {
        corporateRate = 0.29;
        categoryTag = 'All Other Companies (General Corporate Rate: 29%)';
      }

      baseTax = Math.round(profit * corporateRate);
      rateText = `${(corporateRate * 100).toFixed(1)}%`;

      // Super Tax (Section 4C)
      if (bizCategory === 'banking') {
        superTax = Math.round(profit * 0.10);
      } else if (profit > 150000000) {
        if (profit <= 200000000) superTax = Math.round(profit * 0.01);
        else if (profit <= 250000000) superTax = Math.round(profit * 0.02);
        else if (profit <= 300000000) superTax = Math.round(profit * 0.03);
        else if (profit <= 350000000) superTax = Math.round(profit * 0.04);
        else if (profit <= 400000000) superTax = Math.round(profit * 0.06);
        else if (profit <= 500000000) superTax = Math.round(profit * 0.08);
        else superTax = Math.round(profit * (bizYear === '2026-2027' ? 0.08 : 0.10));
      }

      totalTax = baseTax + superTax;
      activeSlabDesc = `${categoryTag} with statutory corporate compliance.`;
    }

    const pat = Math.max(0, profit - totalTax);
    const effectiveRate = profit > 0 ? (totalTax / profit) * 100 : 0;

    return {
      profit,
      isInd,
      baseTax,
      superTax,
      totalTax,
      pat,
      effectiveRate,
      rateText,
      categoryTag,
      activeSlabIndex,
      activeSlabDesc
    };
  }, [bizProfit, bizEntity, bizCategory, bizYear]);

  // ================= RENTAL COMPUTATION =================
  const rentalCalc = useMemo(() => {
    const isCompany = rentOwnerType === 'company';
    const annualGrossRent = rentPeriod === 'monthly' ? rentAmount * 12 : rentAmount;
    const monthlyGrossRent = Math.round(annualGrossRent / 12);

    let totalTax = 0;
    let slabIndex = 0;
    let activeSlabText = '';
    let activeSlabDescText = '';

    if (isCompany) {
      totalTax = Math.round(annualGrossRent * 0.15);
      slabIndex = 99;
      activeSlabText = 'Active Bracket: Corporate Company (15% Flat Rate)';
      activeSlabDescText = 'Section 155 requires 15% flat withholding on gross rent paid to corporate landlords from rupee one.';
    } else {
      if (annualGrossRent <= 300000) {
        totalTax = 0;
        slabIndex = 0;
        activeSlabText = 'Active Bracket: Up to Rs. 300,000 (0% Tax-Free)';
        activeSlabDescText = 'Tax-free threshold under Section 155 for individuals and AOPs.';
      } else if (annualGrossRent <= 600000) {
        totalTax = Math.round((annualGrossRent - 300000) * 0.05);
        slabIndex = 1;
        activeSlabText = 'Active Bracket: Rs. 300,001 to Rs. 600,000 (5%)';
        activeSlabDescText = '5% of the gross rental amount exceeding Rs. 300,000.';
      } else if (annualGrossRent <= 2000000) {
        totalTax = Math.round(15000 + (annualGrossRent - 600000) * 0.10);
        slabIndex = 2;
        activeSlabText = 'Active Bracket: Rs. 600,001 to Rs. 2,000,000 (10%)';
        activeSlabDescText = 'Rs. 15,000 + 10% of the gross rental amount exceeding Rs. 600,000.';
      } else {
        totalTax = Math.round(155000 + (annualGrossRent - 2000000) * 0.25);
        slabIndex = 3;
        activeSlabText = 'Active Bracket: Above Rs. 2,000,000 (25%)';
        activeSlabDescText = 'Rs. 155,000 + 25% of the gross rental amount exceeding Rs. 2,000,000.';
      }
    }

    const monthlyTax = Math.round(totalTax / 12);
    const netTakeHome = Math.max(0, annualGrossRent - totalTax);
    const monthlyTakeHome = Math.round(netTakeHome / 12);
    const effectiveRate = annualGrossRent > 0 ? (totalTax / annualGrossRent) * 100 : 0;

    return {
      annualGrossRent,
      monthlyGrossRent,
      totalTax,
      monthlyTax,
      netTakeHome,
      monthlyTakeHome,
      effectiveRate,
      isCompany,
      slabIndex,
      activeSlabText,
      activeSlabDescText
    };
  }, [rentAmount, rentPeriod, rentOwnerType]);

  return (
    <section className="section tax-calc-section" id="tax-calculator">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Interactive Estimator</span>
          <h2>Calculate Your Income Tax Instantly</h2>
          <p>
            Select your taxpayer category and enter your salary, business profit, or property rent to instantly estimate your tax liability pursuant to official FBR tax slabs.
          </p>
        </div>

        {/* Tax Category Switcher (Salaried vs Business vs Rental) */}
        <div className="tax-category-switch-wrap">
          <div className="tax-category-switch" role="tablist" aria-label="Taxpayer Category Selection">
            <button
              type="button"
              className={`category-tab ${activeTab === 'salaried' ? 'active' : ''}`}
              onClick={() => setActiveTab('salaried')}
              role="tab"
              aria-selected={activeTab === 'salaried'}
            >
              <User size={18} />
              <span>Salaried</span>
              <span className="cat-pill active-pill">Active</span>
            </button>

            <button
              type="button"
              className={`category-tab ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => setActiveTab('business')}
              role="tab"
              aria-selected={activeTab === 'business'}
            >
              <Building2 size={18} />
              <span>Business &amp; Corporate</span>
              <span className="cat-pill active-pill">Active</span>
            </button>

            <button
              type="button"
              className={`category-tab ${activeTab === 'rental' ? 'active' : ''}`}
              onClick={() => setActiveTab('rental')}
              role="tab"
              aria-selected={activeTab === 'rental'}
            >
              <Home size={18} />
              <span>Rental Property</span>
              <span className="cat-pill active-pill">Active</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            VIEW 1: SALARIED CALCULATOR
           ======================================================== */}
        {activeTab === 'salaried' && (
          <div id="salariedCalcView">
            <div className="tax-calc-grid">
              {/* Input Card */}
              <div className="calc-card calc-input-card">
                <div className="calc-card-header">
                  <div className="calc-card-icon" aria-hidden="true">
                    <Calculator size={22} />
                  </div>
                  <div>
                    <h3>Calculate Your Salary Tax</h3>
                    <p>Enter your details to compute your estimated tax liability</p>
                  </div>
                </div>

                <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label htmlFor="taxYearSelect">Tax Year</label>
                    <select
                      id="taxYearSelect"
                      value={salYear}
                      onChange={(e) => {
                        setSalYear(e.target.value);
                        setSalTableYear(e.target.value);
                      }}
                    >
                      <option value="2026-2027">Tax Year 2026–2027</option>
                      <option value="2025-2026">Tax Year 2025–2026</option>
                      <option value="2024-2025">Tax Year 2024–2025</option>
                      <option value="2023-2024">Tax Year 2023–2024</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="salary-input-header">
                      <label htmlFor="monthlySalary">
                        {salPeriod === 'monthly' ? 'Monthly Salary (PKR)' : 'Annual Salary (PKR)'}
                      </label>
                      <select
                        value={salPeriod}
                        onChange={(e) => setSalPeriod(e.target.value as any)}
                        className="salary-period-select"
                        aria-label="Salary calculation period"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>

                    <div className="currency-input-wrap">
                      <span className="currency-prefix">Rs</span>
                      <input
                        type="text"
                        id="monthlySalary"
                        inputMode="numeric"
                        placeholder="e.g. 100,000"
                        value={salAmount.toLocaleString('en-PK')}
                        onChange={(e) => setSalAmount(parseNumber(e.target.value))}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="salary-presets" aria-label="Quick salary presets">
                    <span className="presets-label">Quick select:</span>
                    <div className="presets-row">
                      {(salPeriod === 'monthly'
                        ? [50000, 100000, 150000, 250000, 500000]
                        : [600000, 1200000, 1800000, 3000000, 6000000]
                      ).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`preset-pill ${salAmount === preset ? 'active' : ''}`}
                          onClick={() => setSalAmount(preset)}
                        >
                          {preset >= 1000000 ? `${(preset / 1000000).toFixed(1)}M` : `${preset / 1000}k`}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

                <div className="calc-note">
                  <Info size={15} />
                  <span>Calculated pursuant to Section 149 and Division I, Part I of the First Schedule to the Income Tax Ordinance, 2001.</span>
                </div>
              </div>

              {/* Result Card */}
              <div className="calc-card calc-result-card">
                <div className="result-header">
                  <span className="result-badge">Tax Year {salYear}</span>
                  <h3>Calculation Summary</h3>
                </div>

                <div className="result-highlight-box">
                  <div className="res-item primary-res">
                    <span className="res-label">Monthly Take-Home</span>
                    <span className="res-value take-home">{formatPKR(salaryCalc.monthlyTakeHome)}</span>
                    <span className="res-sub">Net salary after tax</span>
                  </div>
                  <div className="res-item highlight-tax">
                    <span className="res-label">Monthly Tax Deduction</span>
                    <span className="res-value tax-amt">{formatPKR(salaryCalc.monthlyTax)}</span>
                    <span className="res-sub">Deducted at source (WHT)</span>
                  </div>
                </div>

                <div className="result-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-label">Annual Salary</span>
                    <span className="metric-value">{formatPKR(salaryCalc.annualSalary)}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Total Annual Tax</span>
                    <span className="metric-value">{formatPKR(salaryCalc.annualTax)}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Annual Take-Home</span>
                    <span className="metric-value">{formatPKR(salaryCalc.annualTakeHome)}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Effective Tax Rate</span>
                    <span className="metric-value">{salaryCalc.effectiveRate.toFixed(2)}%</span>
                  </div>
                </div>

                <div className="active-slab-banner">
                  <div className="slab-banner-icon" aria-hidden="true">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="slab-banner-text">
                    <strong>Active Slab: {salaryCalc.activeSlab.rangeText} ({salaryCalc.activeSlab.rateText})</strong>
                    <span>{salaryCalc.activeSlab.formulaDesc}</span>
                  </div>
                </div>

                <div className="calc-action-row">
                  <a href="#contact" className="calc-consult-link">
                    Need tax planning or filing advice? Consult QWCA &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Slabs Table */}
            <div className="tax-slabs-container">
              <div className="slabs-table-header">
                <div>
                  <h3>Income Tax Slabs {salTableYear}</h3>
                  <p>{SALARY_TAX_DATA[salTableYear]?.desc}</p>
                </div>
                <div className="slabs-tabs" role="tablist">
                  {Object.keys(SALARY_TAX_DATA).map((y) => (
                    <button
                      key={y}
                      type="button"
                      className={`tab-btn ${salTableYear === y ? 'active' : ''}`}
                      onClick={() => setSalTableYear(y)}
                    >
                      Tax Year {y}
                    </button>
                  ))}
                </div>
              </div>

              <div className="table-wrap slabs-table-wrap">
                <table className="slabs-table">
                  <thead>
                    <tr>
                      <th>Annual Taxable Income</th>
                      <th>Rate</th>
                      <th>Tax Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SALARY_TAX_DATA[salTableYear]?.slabs.map((slab, idx) => {
                      const isActive =
                        salTableYear === salYear && idx === salaryCalc.activeSlabIndex;
                      return (
                        <tr key={idx} className={isActive ? 'active-slab-row' : ''}>
                          <td><strong>{slab.rangeText}</strong></td>
                          <td><span className={slab.rate === 0 ? 'st-rate zero-rate' : 'st-rate'}>{slab.rateText}</span></td>
                          <td>{slab.payableText}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 2: BUSINESS & CORPORATE CALCULATOR
           ======================================================== */}
        {activeTab === 'business' && (
          <div id="businessCalcView">
            <div className="tax-calc-grid">
              {/* Input Card */}
              <div className="calc-card calc-input-card">
                <div className="calc-card-header">
                  <div className="calc-card-icon" aria-hidden="true">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3>Business &amp; Corporate Tax</h3>
                    <p>Compute corporate income tax, Super Tax (Sec 4C), and compliance obligations</p>
                  </div>
                </div>

                <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label htmlFor="bizTaxYearSelect">Tax Year</label>
                    <select
                      id="bizTaxYearSelect"
                      value={bizYear}
                      onChange={(e) => {
                        setBizYear(e.target.value);
                        setBizTableYear(e.target.value);
                      }}
                    >
                      <option value="2026-2027">Tax Year 2026–2027</option>
                      <option value="2025-2026">Tax Year 2025–2026</option>
                      <option value="2024-2025">Tax Year 2024–2025</option>
                      <option value="2023-2024">Tax Year 2023–2024</option>
                    </select>
                  </div>

                  {/* Business Entity Classification */}
                  <div className="form-group">
                    <label>Business Entity Classification</label>
                    <div className="sme-regime-pills" role="radiogroup">
                      <button
                        type="button"
                        className={`sme-regime-pill ${bizEntity === 'individual' ? 'active' : ''}`}
                        onClick={() => {
                          setBizEntity('individual');
                          setBizCategory('individual');
                        }}
                      >
                        <User size={14} />
                        <span>Individual / Sole Proprietor / AOP</span>
                      </button>
                      <button
                        type="button"
                        className={`sme-regime-pill ${bizEntity === 'corporate' ? 'active' : ''}`}
                        onClick={() => {
                          setBizEntity('corporate');
                          setBizCategory('general');
                        }}
                      >
                        <Building2 size={14} />
                        <span>Corporate / Companies</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="form-group">
                    <label htmlFor="bizCategorySelect">
                      {bizEntity === 'individual' ? 'Individual Business Category' : 'Corporate Company Category'}
                    </label>
                    <select
                      id="bizCategorySelect"
                      value={bizCategory}
                      onChange={(e) => setBizCategory(e.target.value)}
                    >
                      {bizEntity === 'individual' ? (
                        <>
                          <option value="individual">Commercial Business / Sole Proprietor</option>
                          <option value="prof_aop">Professional Firm AOP (Capped at 40%)</option>
                        </>
                      ) : (
                        <>
                          <option value="general">General Corporate Company (29%)</option>
                          <option value="small">Small Company (20%)</option>
                          <option value="banking">Banking Company (39%)</option>
                          <option value="sme_cat1">SME Manufacturing — Category 1 (7.5%)</option>
                          <option value="sme_cat2">SME Manufacturing — Category 2 (15%)</option>
                          <option value="modaraba">Modaraba (25%)</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* FBR Non-Salaried & AOP Key Provisions Callout */}
                  {bizEntity === 'individual' && (
                    <div className="biz-rules-callout">
                      <div className="biz-rules-callout-header">
                        <div className="rules-callout-title">
                          <Info size={15} />
                          <span>FBR Non-Salaried &amp; AOP Rules</span>
                        </div>
                        <span className="rules-pill-tag">First Schedule</span>
                      </div>
                      <ul className="biz-rules-list">
                        <li><strong>The 75% Rule:</strong> If less than 75% of your total income comes from salary, the entire income shifts to this non-salaried schedule.</li>
                        <li><strong>High-Income Surcharge (10%):</strong> An additional 10% surcharge (Sec 4AB) applies to calculated tax if profit exceeds Rs. 10 Million.</li>
                        <li><strong>Professional AOP Cap (40%):</strong> Qualifying professional partnerships (legal, medical, CA) are capped at a maximum 40% rate.</li>
                      </ul>
                    </div>
                  )}

                  {/* Profit Input */}
                  <div className="form-group">
                    <label htmlFor="bizProfitInput">Annual Net Taxable Profit (PKR)</label>
                    <div className="currency-input-wrap">
                      <span className="currency-prefix">Rs</span>
                      <input
                        type="text"
                        id="bizProfitInput"
                        inputMode="numeric"
                        placeholder="e.g. 10,000,000"
                        value={bizProfit.toLocaleString('en-PK')}
                        onChange={(e) => setBizProfit(parseNumber(e.target.value))}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  {/* Profit Presets */}
                  <div className="salary-presets">
                    <span className="presets-label">Quick select:</span>
                    <div className="presets-row">
                      {[2000000, 5000000, 10000000, 50000000, 200000000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`preset-pill ${bizProfit === preset ? 'active' : ''}`}
                          onClick={() => setBizProfit(preset)}
                        >
                          {preset / 1000000}M
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

                <div className="calc-note">
                  <Info size={15} />
                  <span>Calculated pursuant to Section 4C (Super Tax), Fourteenth Schedule (SMEs), and Division I &amp; II, Part I of First Schedule to Income Tax Ordinance, 2001.</span>
                </div>
              </div>

              {/* Result Card */}
              <div className="calc-card calc-result-card">
                <div className="result-header">
                  <span className="result-badge">Tax Year {bizYear}</span>
                  <h3>Business Tax Summary</h3>
                </div>

                <div className="biz-selected-entity-bar">
                  <span className="biz-entity-pill-label">Category:</span>
                  <span className="biz-entity-pill-value">{businessCalc.categoryTag}</span>
                </div>

                <div className="result-highlight-box">
                  <div className="res-item primary-res">
                    <span className="res-label">Profit After Tax (PAT)</span>
                    <span className="res-value take-home">{formatPKR(businessCalc.pat)}</span>
                    <span className="res-sub">Net retained earnings</span>
                  </div>
                  <div className="res-item highlight-tax">
                    <span className="res-label">Total Tax Liability</span>
                    <span className="res-value tax-amt">{formatPKR(businessCalc.totalTax)}</span>
                    <span className="res-sub">Base Tax + Super Tax (Sec 4C)</span>
                  </div>
                </div>

                <div className="result-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-label">Effective Tax Rate</span>
                    <span className="metric-value">{businessCalc.effectiveRate.toFixed(2)}%</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Base Tax</span>
                    <span className="metric-value">{formatPKR(businessCalc.baseTax)}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Super Tax (Sec 4C)</span>
                    <span className="metric-value">{formatPKR(businessCalc.superTax)}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Statutory Return</span>
                    <span className="metric-value"><span className="metric-badge-tag status-compliant">Form 114</span></span>
                  </div>
                </div>

                <div className="active-slab-banner">
                  <div className="slab-banner-icon" aria-hidden="true">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="slab-banner-text">
                    <strong>{businessCalc.activeSlabDesc}</strong>
                  </div>
                </div>

                <div className="calc-action-row">
                  <a href="#contact" className="calc-consult-link">
                    Corporate tax planning, audit or SECP filing? Consult QWCA &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Super Tax Section 4C Schedule */}
            {!businessCalc.isInd && (
              <div className="super-tax-schedule-card" style={{ marginTop: '28px' }}>
                <div className="super-tax-header">
                  <div>
                    <h4>Super Tax (Section 4C) Progressive Slab Schedule</h4>
                    <p>Applied to high-earning companies based on taxable income brackets pursuant to Finance Act provisions.</p>
                  </div>
                  <span className="badge badge-fbr">Section 4C</span>
                </div>
                <div className="super-tax-grid">
                  {SUPER_TAX_BRACKETS.map((st, i) => (
                    <div
                      key={i}
                      className={`super-tax-bracket-item ${
                        businessCalc.profit > st.min && (st.max === Infinity || businessCalc.profit <= st.max)
                          ? 'highlight-bracket'
                          : ''
                      }`}
                    >
                      <span className="st-range">{st.text}</span>
                      <span className="st-rate">{st.rateText}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            VIEW 3: RENTAL PROPERTY CALCULATOR
           ======================================================== */}
        {activeTab === 'rental' && (
          <div id="rentalCalcView">
            <div className="tax-calc-grid">
              {/* Input Card */}
              <div className="calc-card calc-input-card">
                <div className="calc-card-header">
                  <div className="calc-card-icon" aria-hidden="true">
                    <Home size={22} />
                  </div>
                  <div>
                    <h3>Rental Income Tax</h3>
                    <p>Compute rental income withholding tax (Section 155) and net take-home property income</p>
                  </div>
                </div>

                <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label htmlFor="rentTaxYearSelect">Tax Year</label>
                    <select
                      id="rentTaxYearSelect"
                      value={rentYear}
                      onChange={(e) => setRentYear(e.target.value)}
                    >
                      <option value="2026-2027">Tax Year 2026–2027</option>
                      <option value="2025-2026">Tax Year 2025–2026</option>
                      <option value="2024-2025">Tax Year 2024–2025</option>
                      <option value="2023-2024">Tax Year 2023–2024</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="rentOwnerTypeSelect">Property Ownership Type</label>
                    <select
                      id="rentOwnerTypeSelect"
                      value={rentOwnerType}
                      onChange={(e) => setRentOwnerType(e.target.value as any)}
                    >
                      <option value="individual">Individual / AOP</option>
                      <option value="company">Corporate Company (Flat 15%)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="salary-input-header">
                      <label htmlFor="grossRentInput">
                        {rentPeriod === 'monthly' ? 'Monthly Gross Rent (PKR)' : 'Annual Gross Rent (PKR)'}
                      </label>
                      <select
                        value={rentPeriod}
                        onChange={(e) => setRentPeriod(e.target.value as any)}
                        className="salary-period-select"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                    <div className="currency-input-wrap">
                      <span className="currency-prefix">Rs</span>
                      <input
                        type="text"
                        id="grossRentInput"
                        inputMode="numeric"
                        placeholder="e.g. 100,000"
                        value={rentAmount.toLocaleString('en-PK')}
                        onChange={(e) => setRentAmount(parseNumber(e.target.value))}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="salary-presets">
                    <span className="presets-label">Quick select:</span>
                    <div className="presets-row">
                      {(rentPeriod === 'monthly'
                        ? [30000, 60000, 100000, 200000, 500000]
                        : [360000, 720000, 1200000, 2400000, 6000000]
                      ).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`preset-pill ${rentAmount === preset ? 'active' : ''}`}
                          onClick={() => setRentAmount(preset)}
                        >
                          {preset >= 1000000 ? `${(preset / 1000000).toFixed(1)}M` : `${preset / 1000}k`}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

                <div className="calc-note">
                  <Info size={15} />
                  <span>Calculated pursuant to Section 15 (Income from Property) and Section 155 (Withholding on Property Rent) of the Income Tax Ordinance, 2001.</span>
                </div>
              </div>

              {/* Result Card */}
              <div className="calc-card calc-result-card">
                <div className="result-header">
                  <span className="result-badge">Tax Year {rentYear}</span>
                  <h3>Rental Tax Summary</h3>
                </div>

                <div className="biz-selected-entity-bar">
                  <span className="biz-entity-pill-label">Category:</span>
                  <span className="biz-entity-pill-value">
                    {rentalCalc.isCompany ? 'Corporate Company' : 'Individual / AOP'}
                  </span>
                </div>

                <div className="result-highlight-box">
                  <div className="res-item primary-res">
                    <span className="res-label">Net Rental Income (After Tax)</span>
                    <span className="res-value take-home">{formatPKR(rentalCalc.netTakeHome)}</span>
                    <span className="res-sub">{formatPKR(rentalCalc.monthlyTakeHome)} / month take-home</span>
                  </div>
                  <div className="res-item highlight-tax">
                    <span className="res-label">Annual Tax Liability / WHT</span>
                    <span className="res-value tax-amt">{formatPKR(rentalCalc.totalTax)}</span>
                    <span className="res-sub">{formatPKR(rentalCalc.monthlyTax)} / month withholding</span>
                  </div>
                </div>

                <div className="result-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-label">Effective Tax Rate</span>
                    <span className="metric-value">{rentalCalc.effectiveRate.toFixed(2)}%</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Annual Gross Rent</span>
                    <span className="metric-value">{formatPKR(rentalCalc.annualGrossRent)}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Monthly WHT Deduction</span>
                    <span className="metric-value">{formatPKR(rentalCalc.monthlyTax)}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Monthly Take-Home</span>
                    <span className="metric-value">{formatPKR(rentalCalc.monthlyTakeHome)}</span>
                  </div>
                </div>

                <div className="active-slab-banner">
                  <div className="slab-banner-icon" aria-hidden="true">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="slab-banner-text">
                    <strong>{rentalCalc.activeSlabText}</strong>
                    <span>{rentalCalc.activeSlabDescText}</span>
                  </div>
                </div>

                <div className="calc-action-row">
                  <a href="#contact" className="calc-consult-link">
                    Property tax planning or rent withholding certificate? Consult QWCA &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Rental Slabs Table */}
            <div className="tax-slabs-container biz-matrix-container" style={{ marginTop: '28px' }}>
              <div className="slabs-table-header">
                <div>
                  <h3>Official Rental Income Tax Slabs (Section 155)</h3>
                  <p>Statutory withholding tax rates for individuals, AOPs, and corporate landlords under the Income Tax Ordinance, 2001.</p>
                </div>
              </div>

              <div className="table-wrap slabs-table-wrap">
                <table className="slabs-table biz-matrix-table">
                  <thead>
                    <tr>
                      <th>Rental Income Bracket / Entity</th>
                      <th>Tax Rate (Section 155)</th>
                      <th>Calculation Formula</th>
                      <th>Statutory Treatment &amp; Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RENTAL_SLABS.map((rSlab, i) => {
                      const isActive = !rentalCalc.isCompany && rentalCalc.slabIndex === i;
                      return (
                        <tr key={i} className={isActive ? 'active-slab-row' : ''}>
                          <td><strong>{rSlab.rangeText}</strong></td>
                          <td><span className={rSlab.rate === 0 ? 'st-rate zero-rate' : 'st-rate'}>{rSlab.rateText}</span></td>
                          <td>{rSlab.formula}</td>
                          <td>{i === 0 ? 'Tax-free threshold for individuals & AOPs' : 'Adjustable against annual income tax return'}</td>
                        </tr>
                      );
                    })}
                    <tr className={rentalCalc.isCompany ? 'active-slab-row' : ''}>
                      <td><strong>Corporate Company</strong></td>
                      <td><span className="st-rate">15%</span></td>
                      <td>Flat 15% on total gross rental income</td>
                      <td>Applies from rupee one; no tax-free threshold</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

