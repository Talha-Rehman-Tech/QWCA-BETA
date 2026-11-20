'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  NON_SALARIED_SLABS,
  SUPER_TAX_BRACKETS
} from '@/data/tax-calculator-data';
import { getTaxYearsApi } from '@/lib/api';
import { subscribeToRealtime } from '@/lib/realtime';
import {
  Building2,
  User,
  Calculator,
  Info,
  CheckCircle2,
  ArrowRight,
  Home,
  Landmark,
  Clock
} from 'lucide-react';

export default function BusinessTaxCalculator() {
  const [bizYear, setBizYear] = useState<string>('2026-2027');
  const [bizEntity, setBizEntity] = useState<'individual' | 'corporate'>('corporate');
  const [bizCategory, setBizCategory] = useState<string>('general');
  const [bizProfit, setBizProfit] = useState<number>(10000000);
  const [bizTaxpayerStatus, setBizTaxpayerStatus] = useState<'filer' | 'lateFiler'>('filer');
  const [bizTableYear, setBizTableYear] = useState<string>('2026-2027');

  // Dynamic live tax data synchronized with MongoDB Backend
  const [allYearsData, setAllYearsData] = useState<Record<string, any>>({});
  const [availableYears, setAvailableYears] = useState<string[]>(['2026-2027', '2025-2026', '2024-2025', '2023-2024']);

  useEffect(() => {
    async function syncBizWithBackend() {
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
            if (!years.includes(bizYear)) {
              setBizYear(years[0]);
              setBizTableYear(years[0]);
            }
          }
        }
      } catch (err) {
        console.warn('Operating with baseline business tax data');
      }
    }
    syncBizWithBackend();

    // Instant Realtime Sync: Auto-update DOM when Admin updates slabs
    const unsubscribe = subscribeToRealtime((event) => {
      if (event.type === 'tax_slabs_updated') {
        syncBizWithBackend();
      }
    });

    return () => unsubscribe();
  }, [bizYear]);

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

    const currentYearRecord = allYearsData[bizYear];

    if (isInd) {
      const isProfAop = bizCategory === 'prof_aop';
      categoryTag = isProfAop ? 'Professional Firm AOP (Max 40% Cap)' : 'Commercial Business / Sole Proprietor';
      const yearSlabs = currentYearRecord?.nonSalariedSlabs || (NON_SALARIED_SLABS as any)[bizYear] || (NON_SALARIED_SLABS as any)['2026-2027'];

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
      const dynamicCorpRates = currentYearRecord?.corporateRates;
      let corporateRate = 0.29;

      if (bizCategory === 'small') {
        corporateRate = dynamicCorpRates?.small ?? 0.20;
        categoryTag = `Small Company (${(corporateRate * 100).toFixed(0)}% Reduced Rate)`;
      } else if (bizCategory === 'banking') {
        corporateRate = dynamicCorpRates?.banking ?? 0.39;
        categoryTag = `Banking Company (${(corporateRate * 100).toFixed(0)}% Corporate Rate + Super Tax)`;
      } else if (bizCategory === 'modaraba') {
        corporateRate = dynamicCorpRates?.modaraba ?? 0.25;
        categoryTag = `Modaraba (${(corporateRate * 100).toFixed(0)}% Corporate Rate)`;
      } else if (bizCategory === 'sme_cat1') {
        corporateRate = dynamicCorpRates?.sme_cat1 ?? 0.075;
        categoryTag = `SME Manufacturing Category 1 (${(corporateRate * 100).toFixed(1)}% Normal Tax)`;
      } else if (bizCategory === 'sme_cat2') {
        corporateRate = dynamicCorpRates?.sme_cat2 ?? 0.15;
        categoryTag = `SME Manufacturing Category 2 (${(corporateRate * 100).toFixed(0)}% Normal Tax)`;
      } else {
        corporateRate = dynamicCorpRates?.general ?? 0.29;
        categoryTag = `All Other Companies (General Corporate Rate: ${(corporateRate * 100).toFixed(0)}%)`;
      }

      baseTax = Math.round(profit * corporateRate);
      rateText = `${(corporateRate * 100).toFixed(1)}%`;

      // Super Tax (Section 4C)
      const superBrackets = currentYearRecord?.superTaxBrackets || SUPER_TAX_BRACKETS;
      if (bizCategory === 'banking') {
        superTax = Math.round(profit * 0.10);
      } else if (profit > 150000000) {
        let matchedRate = 0;
        for (const bracket of superBrackets) {
          if (profit > bracket.min) {
            matchedRate = bracket.rate;
          }
        }
        superTax = Math.round(profit * matchedRate);
      }

      totalTax = baseTax + superTax;
      activeSlabDesc = `${categoryTag} with statutory corporate compliance.`;
    }

    let lateFilerPenalty = 0;
    if (bizTaxpayerStatus === 'lateFiler') {
      if (isInd) {
        lateFilerPenalty = bizCategory === 'prof_aop'
          ? (currentYearRecord?.lateFilerRules?.aopSurcharge ?? 10000)
          : (currentYearRecord?.lateFilerRules?.individualSurcharge ?? 1000);
      } else {
        lateFilerPenalty = currentYearRecord?.lateFilerRules?.corporateSurcharge ?? 20000;
      }
    }
    totalTax = totalTax + lateFilerPenalty;

    const pat = Math.max(0, profit - totalTax);
    const effectiveRate = profit > 0 ? (totalTax / profit) * 100 : 0;

    return {
      profit,
      isInd,
      baseTax,
      superTax,
      lateFilerPenalty,
      totalTax,
      pat,
      effectiveRate,
      rateText,
      categoryTag,
      activeSlabIndex,
      activeSlabDesc
    };
  }, [bizProfit, bizEntity, bizCategory, bizTaxpayerStatus, bizYear, allYearsData]);

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
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {allYearsData[yr]?.label || `Tax Year ${yr}`} {yr === '2026-2027' ? '(Current)' : ''}
                    </option>
                  ))}
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

              {/* Taxpayer Filing Status (Active vs Late Filer) */}
              <div className="form-group">
                <label>FBR Tax Filing Status</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={`sme-regime-pill ${bizTaxpayerStatus === 'filer' ? 'active' : ''}`}
                    onClick={() => setBizTaxpayerStatus('filer')}
                    style={{ flex: 1, padding: '7px 12px', fontSize: '12.5px' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Active Filer</span>
                  </button>
                  <button
                    type="button"
                    className={`sme-regime-pill ${bizTaxpayerStatus === 'lateFiler' ? 'active' : ''}`}
                    onClick={() => setBizTaxpayerStatus('lateFiler')}
                    style={{ flex: 1, padding: '7px 12px', fontSize: '12.5px' }}
                  >
                    <Clock size={14} />
                    <span>Late Filer (Post Due-Date)</span>
                  </button>
                </div>
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

            {businessCalc.lateFilerPenalty > 0 && (
              <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', color: '#b45309', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, margin: '10px 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} />
                <span>Late Filer Mode: Includes {formatPKR(businessCalc.lateFilerPenalty)} statutory ATL restoration surcharge.</span>
              </div>
            )}

            <div className="result-highlight-box">
              <div className="res-item primary-res">
                <span className="res-label">Profit After Tax (PAT)</span>
                <span className="res-value take-home">{formatPKR(businessCalc.pat)}</span>
                <span className="res-sub">Net retained enterprise earnings</span>
              </div>
              <div className="res-item highlight-tax">
                <span className="res-label">Total Tax Liability</span>
                <span className="res-value tax-amt">{formatPKR(businessCalc.totalTax)}</span>
                <span className="res-sub">
                  Base Tax + Super Tax {businessCalc.lateFilerPenalty > 0 ? '+ Late Surcharge' : ''}
                </span>
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
              <Link href="/contact" className="calc-consult-link">
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
