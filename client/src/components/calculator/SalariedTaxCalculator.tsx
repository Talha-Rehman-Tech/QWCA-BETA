'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SALARY_TAX_DATA } from '@/data/tax-calculator-data';
import { getTaxYearsApi } from '@/lib/api';
import { subscribeToRealtime } from '@/lib/realtime';
import {
  Calculator,
  User,
  Info,
  CheckCircle2,
  ArrowRight,
  Building2,
  Home,
  Landmark,
  Clock
} from 'lucide-react';

export default function SalariedTaxCalculator() {
  const [salYear, setSalYear] = useState<string>('2026-2027');
  const [salPeriod, setSalPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [salAmount, setSalAmount] = useState<number>(100000);
  const [salTaxpayerStatus, setSalTaxpayerStatus] = useState<'filer' | 'lateFiler'>('filer');
  const [salTableYear, setSalTableYear] = useState<string>('2026-2027');

  // Dynamic live tax data synchronized with MongoDB Backend
  const [allYearsData, setAllYearsData] = useState<Record<string, any>>(SALARY_TAX_DATA);
  const [availableYears, setAvailableYears] = useState<string[]>(['2026-2027', '2025-2026', '2024-2025', '2023-2024']);

  useEffect(() => {
    async function syncWithBackend() {
      try {
        const records = await getTaxYearsApi();
        if (records && records.length > 0) {
          const mapped: Record<string, any> = { ...SALARY_TAX_DATA };
          const years: string[] = [];

          records.forEach((rec: any) => {
            if (rec.year && rec.salarySlabs && rec.salarySlabs.length > 0) {
              years.push(rec.year);
              mapped[rec.year] = {
                year: rec.year,
                label: rec.label || `Tax Year ${rec.year}`,
                title: rec.title || `Income Tax Slabs ${rec.year}`,
                desc: rec.desc || '',
                slabs: rec.salarySlabs,
              };
            }
          });

          if (years.length > 0) {
            setAllYearsData(mapped);
            setAvailableYears(years);
            if (!years.includes(salYear)) {
              setSalYear(years[0]);
              setSalTableYear(years[0]);
            }
          }
        }
      } catch (err) {
        console.warn('Operating with baseline salary tax data');
      }
    }
    syncWithBackend();

    // Instant Realtime Sync: Auto-update DOM when Admin updates slabs
    const unsubscribe = subscribeToRealtime((event) => {
      if (event.type === 'tax_slabs_updated') {
        syncWithBackend();
      }
    });

    return () => unsubscribe();
  }, [salYear]);

  const formatPKR = (num: number) => {
    return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
  };

  const parseNumber = (val: string) => {
    const clean = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  // Salaried Computation
  const salaryCalc = useMemo(() => {
    const annualSalary = salPeriod === 'monthly' ? salAmount * 12 : salAmount;
    const monthlySalary = Math.round(annualSalary / 12);
    const yearConfig = allYearsData[salYear] || allYearsData['2026-2027'] || SALARY_TAX_DATA['2026-2027'];

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
  }, [salAmount, salPeriod, salYear, allYearsData]);

  return (
    <section className="section tax-calc-section" id="salaried-calculator">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="calc-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Salaried Income Tax Calculator</span>
        </nav>

        <div className="section-heading" style={{ marginTop: '20px' }}>
          <span className="eyebrow">Dedicated Individual Tax Tool</span>
          <h1>Salaried Income Tax Calculator</h1>
          <p>
            Official withholding calculator for salaried professionals under Section 149 and Division I, Part I of the First Schedule to the Income Tax Ordinance, 2001.
          </p>
        </div>

        <div className="tax-calc-grid">
          {/* Input Card */}
          <div className="calc-card calc-input-card">
            <div className="calc-card-header">
              <div className="calc-card-icon" aria-hidden="true">
                <Calculator size={22} />
              </div>
              <div>
                <h3>Salary Parameters</h3>
                <p>Select your fiscal year and enter your gross compensation</p>
              </div>
            </div>

            <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="salYearSelect">Applicable Tax Year</label>
                <select
                  id="salYearSelect"
                  value={salYear}
                  onChange={(e) => {
                    setSalYear(e.target.value);
                    setSalTableYear(e.target.value);
                  }}
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {allYearsData[yr]?.label || `Tax Year ${yr}`} {yr === '2026-2027' ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <div className="salary-input-header">
                  <label htmlFor="salAmountInput">
                    {salPeriod === 'monthly' ? 'Monthly Gross Salary (PKR)' : 'Annual Gross Salary (PKR)'}
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
                    id="salAmountInput"
                    inputMode="numeric"
                    placeholder="e.g. 100,000"
                    value={salAmount.toLocaleString('en-PK')}
                    onChange={(e) => setSalAmount(parseNumber(e.target.value))}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              {/* Tax Filing Status */}
              <div className="form-group">
                <label>Tax Filing Status</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={`preset-pill ${salTaxpayerStatus === 'filer' ? 'active' : ''}`}
                    onClick={() => setSalTaxpayerStatus('filer')}
                    style={{ flex: 1, padding: '7px 12px', fontSize: '12.5px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Active Filer</span>
                  </button>
                  <button
                    type="button"
                    className={`preset-pill ${salTaxpayerStatus === 'lateFiler' ? 'active' : ''}`}
                    onClick={() => setSalTaxpayerStatus('lateFiler')}
                    style={{ flex: 1, padding: '7px 12px', fontSize: '12.5px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Clock size={14} />
                    <span>Late Filer</span>
                  </button>
                </div>
              </div>

              <div className="salary-presets" aria-label="Quick salary presets">
                <span className="presets-label">Quick select presets:</span>
                <div className="presets-row">
                  {(salPeriod === 'monthly'
                    ? [50000, 100000, 150000, 250000, 500000, 1000000]
                    : [600000, 1200000, 1800000, 3000000, 6000000, 12000000]
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
              <span>
                Tax is calculated on taxable salary after allowable employee deductions and rebates (medical, education, donations under Sec 61).
              </span>
            </div>
          </div>

          {/* Result Card */}
          <div className="calc-card calc-result-card">
            <div className="result-header">
              <span className="result-badge">Tax Year {salYear}</span>
              <h3>Calculation Summary</h3>
            </div>

            {salTaxpayerStatus === 'lateFiler' && (
              <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', color: '#b45309', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, margin: '8px 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} />
                <span>Late Filer Mode: Statutory ATL restoration surcharge of Rs. 1,000 applies under Section 182(2).</span>
              </div>
            )}

            <div className="result-highlight-box">
              <div className="res-item primary-res">
                <span className="res-label">Monthly Take-Home</span>
                <span className="res-value take-home">{formatPKR(salaryCalc.monthlyTakeHome)}</span>
                <span className="res-sub">Net disposable pay</span>
              </div>
              <div className="res-item highlight-tax">
                <span className="res-label">Monthly Tax Deduction</span>
                <span className="res-value tax-amt">{formatPKR(salaryCalc.monthlyTax)}</span>
                <span className="res-sub">Section 149 employer withholding</span>
              </div>
            </div>

            <div className="result-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Annual Gross Salary</span>
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
              <Link href="/contact" className="calc-consult-link">
                Need employee payroll structuring or tax refund support? Consult QWCA &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Official Slabs Table */}
        <div className="tax-slabs-container" style={{ marginTop: '40px' }}>
          <div className="slabs-table-header">
            <div>
              <h3>FBR Salary Income Tax Slabs ({salTableYear})</h3>
              <p>{allYearsData[salTableYear]?.desc || SALARY_TAX_DATA[salTableYear]?.desc}</p>
            </div>
            <div className="slabs-tabs" role="tablist">
              {availableYears.map((y) => (
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
                  <th>Annual Taxable Income (PKR)</th>
                  <th>Applicable Rate</th>
                  <th>Statutory Tax Formula</th>
                </tr>
              </thead>
              <tbody>
                {(allYearsData[salTableYear]?.slabs || SALARY_TAX_DATA[salTableYear]?.slabs || []).map((slab: any, idx: number) => {
                  const isActive = salTableYear === salYear && idx === salaryCalc.activeSlabIndex;
                  return (
                    <tr key={idx} className={isActive ? 'active-slab-row' : ''}>
                      <td><strong>{slab.rangeText}</strong></td>
                      <td>
                        <span className={slab.rate === 0 ? 'st-rate zero-rate' : 'st-rate'}>
                          {slab.rateText}
                        </span>
                      </td>
                      <td>{slab.payableText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Dedicated Tax Calculators Section */}
        <div className="other-calculators-section">
          <h3>Other Dedicated Tax Calculators</h3>
          <p>Need to calculate business, rental, or property tax? Open our dedicated tools:</p>
          <div className="other-calcs-grid">
            <Link href="/tax-calculator/business" className="other-calc-card">
              <div className="other-calc-icon"><Building2 size={20} /></div>
              <div className="other-calc-info">
                <strong>Business &amp; Corporate Tax</strong>
                <span>AOP, Sole Proprietor, Corporate (29%), Small Company (20%) &amp; Super Tax (Sec 4C)</span>
              </div>
              <ArrowRight size={16} className="other-calc-arrow" />
            </Link>

            <Link href="/tax-calculator/rental" className="other-calc-card">
              <div className="other-calc-icon"><Home size={20} /></div>
              <div className="other-calc-info">
                <strong>Rental Income Tax</strong>
                <span>Section 155 progressive individual slabs &amp; corporate 15% flat withholding</span>
              </div>
              <ArrowRight size={16} className="other-calc-arrow" />
            </Link>

            <Link href="/tax-calculator/property" className="other-calc-card">
              <div className="other-calc-icon"><Landmark size={20} /></div>
              <div className="other-calc-info">
                <strong>Property &amp; Real Estate Tax</strong>
                <span>Buyer tax (236K), Seller tax (236C) &amp; Capital Gains Tax (Sec 37)</span>
              </div>
              <ArrowRight size={16} className="other-calc-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
