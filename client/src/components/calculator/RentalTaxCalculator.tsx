'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { RENTAL_SLABS } from '@/data/tax-calculator-data';
import { getTaxYearsApi } from '@/lib/api';
import {
  Home,
  Building2,
  User,
  Calculator,
  Info,
  CheckCircle2,
  ArrowRight,
  Landmark
} from 'lucide-react';

export default function RentalTaxCalculator() {
  const [rentYear, setRentYear] = useState<string>('2026-2027');
  const [rentOwnerType, setRentOwnerType] = useState<'individual' | 'company'>('individual');
  const [rentPeriod, setRentPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [rentAmount, setRentAmount] = useState<number>(100000);

  // Dynamic live tax data synchronized with MongoDB Backend
  const [allYearsData, setAllYearsData] = useState<Record<string, any>>({});
  const [availableYears, setAvailableYears] = useState<string[]>(['2026-2027', '2025-2026', '2024-2025']);

  useEffect(() => {
    async function syncRentalWithBackend() {
      try {
        const records = await getTaxYearsApi();
        if (records && records.length > 0) {
          const mapped: Record<string, any> = {};
          const years: string[] = [];

          records.forEach((rec: any) => {
            if (rec.year) {
              years.push(rec.year);
              mapped[rec.year] = rec;
            }
          });

          if (years.length > 0) {
            setAllYearsData(mapped);
            setAvailableYears(years);
            if (!years.includes(rentYear)) setRentYear(years[0]);
          }
        }
      } catch (err) {
        console.warn('Operating with baseline rental tax data');
      }
    }
    syncRentalWithBackend();
  }, []);

  const formatPKR = (num: number) => {
    return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
  };

  const parseNumber = (val: string) => {
    const clean = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  // Rental Computation
  const rentalCalc = useMemo(() => {
    const isCompany = rentOwnerType === 'company';
    const annualGrossRent = rentPeriod === 'monthly' ? rentAmount * 12 : rentAmount;
    const monthlyGrossRent = Math.round(annualGrossRent / 12);

    let totalTax = 0;
    let slabIndex = 0;
    let activeSlabText = '';
    let activeSlabDescText = '';

    const currentYearRecord = allYearsData[rentYear];
    const slabs = currentYearRecord?.rentalSlabs || RENTAL_SLABS;

    if (isCompany) {
      totalTax = Math.round(annualGrossRent * 0.15);
      slabIndex = 99;
      activeSlabText = 'Active Bracket: Corporate Company (15% Flat Rate)';
      activeSlabDescText = 'Section 155 requires 15% flat withholding on gross rent paid to corporate landlords from rupee one.';
    } else {
      for (let i = 0; i < slabs.length; i++) {
        if (annualGrossRent > slabs[i].min) {
          slabIndex = i;
        }
      }
      const activeSlab = slabs[slabIndex] || slabs[0];
      const taxable = annualGrossRent - activeSlab.min;

      let baseTax = 0;
      if (slabIndex === 1) baseTax = 0;
      else if (slabIndex === 2) baseTax = 15000;
      else if (slabIndex === 3) baseTax = 155000;

      totalTax = baseTax + Math.round(taxable * activeSlab.rate);
      activeSlabText = `Active Bracket: ${activeSlab.rangeText} (${activeSlab.rateText || (activeSlab.rate * 100) + '%'})`;
      activeSlabDescText = activeSlab.formula || 'Progressive rental tax under Section 155';
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
      activeSlabDescText,
      slabs
    };
  }, [rentAmount, rentPeriod, rentOwnerType, rentYear, allYearsData]);

  return (
    <section className="section tax-calc-section" id="rental-calculator">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="calc-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Rental Income Tax Calculator</span>
        </nav>

        <div className="section-heading" style={{ marginTop: '20px' }}>
          <span className="eyebrow">Dedicated Property Income Tool</span>
          <h1>Rental Income Tax Calculator</h1>
          <p>
            Calculate rental income withholding tax (Section 155), net rental take-home, and statutory tenant deduction liabilities under the Income Tax Ordinance, 2001.
          </p>
        </div>

        <div className="tax-calc-grid">
          {/* Input Card */}
          <div className="calc-card calc-input-card">
            <div className="calc-card-header">
              <div className="calc-card-icon" aria-hidden="true">
                <Home size={22} />
              </div>
              <div>
                <h3>Rental Parameters</h3>
                <p>Configure ownership category and monthly/annual rental revenue</p>
              </div>
            </div>

            <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="rentTaxYearSelect">Applicable Tax Year</label>
                <select
                  id="rentTaxYearSelect"
                  value={rentYear}
                  onChange={(e) => setRentYear(e.target.value)}
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {allYearsData[yr]?.label || `Tax Year ${yr}`} {yr === '2026-2027' ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rentOwnerTypeSelect">Property Landlord Ownership Type</label>
                <select
                  id="rentOwnerTypeSelect"
                  value={rentOwnerType}
                  onChange={(e) => setRentOwnerType(e.target.value as any)}
                >
                  <option value="individual">Individual / AOP Landlord (Progressive Slabs)</option>
                  <option value="company">Corporate Company Landlord (Flat 15%)</option>
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
                <span className="presets-label">Quick select presets:</span>
                <div className="presets-row">
                  {(rentPeriod === 'monthly'
                    ? [30000, 60000, 100000, 200000, 500000, 1000000]
                    : [360000, 720000, 1200000, 2400000, 6000000, 12000000]
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
              <span>
                Calculated pursuant to Section 15 (Income from Property) and Section 155 (Withholding on Property Rent) of the Income Tax Ordinance, 2001. Under Section 15A, 1/5th repair allowance and local property taxes are deductible where applicable.
              </span>
            </div>
          </div>

          {/* Result Card */}
          <div className="calc-card calc-result-card">
            <div className="result-header">
              <span className="result-badge">Tax Year {rentYear}</span>
              <h3>Rental Tax Summary</h3>
            </div>

            <div className="biz-selected-entity-bar">
              <span className="biz-entity-pill-label">Landlord Status:</span>
              <span className="biz-entity-pill-value">
                {rentalCalc.isCompany ? 'Corporate Company (Flat 15% WHT)' : 'Individual / AOP (Section 155 Slabs)'}
              </span>
            </div>

            <div className="result-highlight-box">
              <div className="res-item primary-res">
                <span className="res-label">Net Rental Income (After Tax)</span>
                <span className="res-value take-home">{formatPKR(rentalCalc.netTakeHome)}</span>
                <span className="res-sub">{formatPKR(rentalCalc.monthlyTakeHome)} / month net yield</span>
              </div>
              <div className="res-item highlight-tax">
                <span className="res-label">Annual Tax Withholding (WHT)</span>
                <span className="res-value tax-amt">{formatPKR(rentalCalc.totalTax)}</span>
                <span className="res-sub">{formatPKR(rentalCalc.monthlyTax)} / month deduction</span>
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
                <span className="metric-label">Monthly Net Inflow</span>
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
              <Link href="/contact" className="calc-consult-link">
                Need property tax planning, withholding certificates or appeals? Consult QWCA &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Rental Slabs Table */}
        <div className="tax-slabs-container biz-matrix-container" style={{ marginTop: '35px' }}>
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
                {(rentalCalc.slabs || RENTAL_SLABS).map((rSlab: any, i: number) => {
                  const isActive = !rentalCalc.isCompany && rentalCalc.slabIndex === i;
                  return (
                    <tr key={i} className={isActive ? 'active-slab-row' : ''}>
                      <td><strong>{rSlab.rangeText}</strong></td>
                      <td>
                        <span className={rSlab.rate === 0 ? 'st-rate zero-rate' : 'st-rate'}>
                          {rSlab.rateText}
                        </span>
                      </td>
                      <td>{rSlab.formula}</td>
                      <td>{i === 0 ? 'Tax-free threshold for individuals & AOPs' : 'Adjustable against annual income tax return'}</td>
                    </tr>
                  );
                })}
                <tr className={rentalCalc.isCompany ? 'active-slab-row' : ''}>
                  <td><strong>Corporate Company</strong></td>
                  <td><span className="st-rate">15%</span></td>
                  <td>Flat 15% on total gross rental income</td>
                  <td>Applies from rupee one; no basic threshold under Section 155</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Dedicated Tax Calculators Section */}
        <div className="other-calculators-section">
          <h3>Other Dedicated Tax Calculators</h3>
          <p>Need to calculate salary, corporate, or property tax? Open our dedicated tools:</p>
          <div className="other-calcs-grid">
            <Link href="/tax-calculator/salaried" className="other-calc-card">
              <div className="other-calc-icon"><User size={20} /></div>
              <div className="other-calc-info">
                <strong>Salaried Income Tax</strong>
                <span>Section 149 employee withholding, monthly take-home &amp; progressive salary slabs</span>
              </div>
              <ArrowRight size={16} className="other-calc-arrow" />
            </Link>

            <Link href="/tax-calculator/business" className="other-calc-card">
              <div className="other-calc-icon"><Building2 size={20} /></div>
              <div className="other-calc-info">
                <strong>Business &amp; Corporate Tax</strong>
                <span>AOP, Sole Proprietor, Corporate (29%), Small Company (20%) &amp; Super Tax (Sec 4C)</span>
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
