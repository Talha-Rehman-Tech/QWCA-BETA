'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  NON_SALARIED_SLABS,
  SUPER_TAX_BRACKETS
} from '@/data/tax-calculator-data';
import {
  Building2,
  User,
  Calculator,
  Info,
  CheckCircle2,
  ArrowRight,
  Home,
  Landmark
} from 'lucide-react';

export default function BusinessTaxCalculator() {
  const [bizYear, setBizYear] = useState<string>('2026-2027');
  const [bizEntity, setBizEntity] = useState<'individual' | 'corporate'>('corporate');
  const [bizCategory, setBizCategory] = useState<string>('general');
  const [bizProfit, setBizProfit] = useState<number>(10000000);
  const [bizTableYear, setBizTableYear] = useState<string>('2026-2027');

  const formatPKR = (num: number) => {
    return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
  };

  const parseNumber = (val: string) => {
    const clean = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  // Business Computation
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

  return (
    <section className="section tax-calc-section" id="business-calculator">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="calc-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Business &amp; Corporate Tax Calculator</span>
        </nav>

        <div className="section-heading" style={{ marginTop: '20px' }}>
          <span className="eyebrow">Dedicated Corporate &amp; Enterprise Tool</span>
          <h1>Business &amp; Corporate Tax Calculator</h1>
          <p>
            Official tax calculator for Sole Proprietors, AOP Partnerships, Private Ltd companies, Small Companies, and Super Tax (Section 4C) under the Income Tax Ordinance, 2001.
          </p>
        </div>

        <div className="tax-calc-grid">
          {/* Input Card */}
          <div className="calc-card calc-input-card">
            <div className="calc-card-header">
              <div className="calc-card-icon" aria-hidden="true">
                <Building2 size={22} />
              </div>
              <div>
                <h3>Business Parameters</h3>
                <p>Configure entity classification and annual net taxable profit</p>
              </div>
            </div>

            <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="bizTaxYearSelect">Applicable Tax Year</label>
                <select
                  id="bizTaxYearSelect"
                  value={bizYear}
                  onChange={(e) => {
                    setBizYear(e.target.value);
                    setBizTableYear(e.target.value);
                  }}
                >
                  <option value="2026-2027">Tax Year 2026–2027 (Current / Upcoming)</option>
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
                  {bizEntity === 'individual' ? 'Individual / AOP Category' : 'Corporate Company Category'}
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
                      <option value="small">Small Company (20% Reduced Rate)</option>
                      <option value="banking">Banking Company (39% + 10% Super Tax)</option>
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
                    <li><strong>The 75% Rule:</strong> If less than 75% of your total income comes from salary, your entire taxable income is assessed under this non-salaried schedule.</li>
                    <li><strong>High-Income Surcharge (10%):</strong> An additional 10% surcharge (Sec 4AB) applies to calculated tax if taxable profit exceeds Rs. 10 Million.</li>
                    <li><strong>Professional AOP Cap (40%):</strong> Qualifying professional partnerships (legal, medical, CA firms) are capped at a 40% maximum statutory rate.</li>
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
                <span className="presets-label">Quick select presets:</span>
                <div className="presets-row">
                  {[2000000, 5000000, 10000000, 50000000, 200000000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`preset-pill ${bizProfit === preset ? 'active' : ''}`}
                      onClick={() => setBizProfit(preset)}
                    >
                      {preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            <div className="calc-note">
              <Info size={15} />
              <span>
                Calculated pursuant to Section 4C (Super Tax), Fourteenth Schedule (SMEs), and Division I &amp; II, Part I of First Schedule to Income Tax Ordinance, 2001.
              </span>
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
                <span className="res-sub">Net retained enterprise earnings</span>
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
                <span className="metric-label">Base Normal Tax</span>
                <span className="metric-value">{formatPKR(businessCalc.baseTax)}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Super Tax (Sec 4C)</span>
                <span className="metric-value">{formatPKR(businessCalc.superTax)}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Statutory Filing</span>
                <span className="metric-value">
                  <span className="metric-badge-tag status-compliant">Form 114</span>
                </span>
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
              <Link href="/#contact" className="calc-consult-link">
                Need corporate tax planning, audit or SECP annual filing? Consult QWCA &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Super Tax Section 4C Schedule */}
        {!businessCalc.isInd && (
          <div className="super-tax-schedule-card" style={{ marginTop: '35px' }}>
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

        {/* Other Dedicated Tax Calculators Section */}
        <div className="other-calculators-section">
          <h3>Other Dedicated Tax Calculators</h3>
          <p>Need to calculate salary, rental, or property tax? Open our dedicated tools:</p>
          <div className="other-calcs-grid">
            <Link href="/tax-calculator/salaried" className="other-calc-card">
              <div className="other-calc-icon"><User size={20} /></div>
              <div className="other-calc-info">
                <strong>Salaried Income Tax</strong>
                <span>Section 149 employee withholding, monthly take-home &amp; progressive salary slabs</span>
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
                <span>Buyer tax (236K), Seller tax (236C), Capital Gains Tax (Sec 37) &amp; Stamp Duty</span>
              </div>
              <ArrowRight size={16} className="other-calc-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
