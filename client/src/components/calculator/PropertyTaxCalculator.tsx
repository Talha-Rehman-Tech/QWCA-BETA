'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  PROPERTY_PURCHASE_SLABS,
  PROPERTY_SALE_RATES,
  CGT_HOLDING_SCHEDULE,
  PropertyPurchaseSlab,
  CGTHoldingBracket
} from '@/data/tax-calculator-data';
import {
  Home,
  Building,
  Building2,
  User,
  Landmark,
  Key,
  ShieldCheck,
  TrendingUp,
  Coins,
  Calculator,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export default function PropertyTaxCalculator() {
  const [activeMode, setActiveMode] = useState<'buying' | 'selling' | 'cgt' | 'schedules'>('buying');

  // ================= 1. BUYING / PURCHASE TAX (SECTION 236K) STATE =================
  const [buyValue, setBuyValue] = useState<number>(15000000);
  const [buyTaxpayerStatus, setBuyTaxpayerStatus] = useState<'filer' | 'nonFiler' | 'overseas'>('filer');

  // ================= 2. SELLING / ADVANCE TAX (SECTION 236C) STATE =================
  const [sellValue, setSellValue] = useState<number>(20000000);
  const [sellTaxpayerStatus, setSellTaxpayerStatus] = useState<'filer' | 'nonFiler' | 'overseas'>('filer');

  // ================= 3. CAPITAL GAINS TAX (CGT - SECTION 37) STATE =================
  const [cgtPropType, setCgtPropType] = useState<'openPlot' | 'constructed' | 'flat'>('openPlot');
  const [cgtAcquisitionRegime, setCgtAcquisitionRegime] = useState<'preJuly24' | 'postJuly24'>('preJuly24');
  const [cgtPurchaseCost, setCgtPurchaseCost] = useState<number>(12000000);
  const [cgtSalePrice, setCgtSalePrice] = useState<number>(20000000);
  const [cgtHoldingPeriod, setCgtHoldingPeriod] = useState<string>('1-to-2');
  const [cgtTaxpayerStatus, setCgtTaxpayerStatus] = useState<'filer' | 'nonFiler'>('filer');
  const [adjust236C, setAdjust236C] = useState<boolean>(true);

  const formatPKR = (num: number) => {
    return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
  };

  const parseNumber = (val: string) => {
    const clean = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  // ================= BUYING TAX CALCULATIONS (SEC 236K) =================
  const purchaseCalc = useMemo(() => {
    let slab: PropertyPurchaseSlab = PROPERTY_PURCHASE_SLABS[0];
    for (const s of PROPERTY_PURCHASE_SLABS) {
      if (buyValue > s.min) {
        slab = s;
      }
    }

    let rate = slab.filerRate;
    if (buyTaxpayerStatus === 'nonFiler') {
      rate = slab.nonFilerRate;
    } else if (buyTaxpayerStatus === 'overseas') {
      rate = slab.overseasRate;
    }

    const sec236kTax = Math.round(buyValue * rate);
    const totalTaxes = sec236kTax;
    const totalAcquisitionCost = buyValue + totalTaxes;

    return {
      slab,
      rate,
      sec236kTax,
      totalTaxes,
      totalAcquisitionCost
    };
  }, [buyValue, buyTaxpayerStatus]);

  // ================= SELLING TAX CALCULATIONS (SEC 236C) =================
  const saleCalc = useMemo(() => {
    let rate = PROPERTY_SALE_RATES.filer;
    if (sellTaxpayerStatus === 'nonFiler') {
      rate = PROPERTY_SALE_RATES.nonFiler;
    } else if (sellTaxpayerStatus === 'overseas') {
      rate = PROPERTY_SALE_RATES.overseas;
    }

    const sec236cTax = Math.round(sellValue * rate);

    return {
      rate,
      sec236cTax,
      netProceeds: sellValue - sec236cTax
    };
  }, [sellValue, sellTaxpayerStatus]);

  // ================= CGT CALCULATIONS (SECTION 37) =================
  const cgtCalc = useMemo(() => {
    const capitalGain = Math.max(0, cgtSalePrice - cgtPurchaseCost);
    let applicableRate = 0;
    let isExempt = false;

    if (cgtAcquisitionRegime === 'postJuly24') {
      // Finance Act 2024 new regime: Flat 15% for filers on capital gain
      applicableRate = cgtTaxpayerStatus === 'filer' ? 0.15 : 0.30;
    } else {
      // Pre-1 July 2024 acquisition: Declining holding period schedule
      const bracket = CGT_HOLDING_SCHEDULE.find((b) => b.periodId === cgtHoldingPeriod) || CGT_HOLDING_SCHEDULE[0];
      if (cgtPropType === 'openPlot') {
        applicableRate = bracket.openPlotRate;
      } else if (cgtPropType === 'constructed') {
        applicableRate = bracket.constructedRate;
      } else {
        applicableRate = bracket.flatRate;
      }

      if (cgtTaxpayerStatus === 'nonFiler' && applicableRate > 0) {
        // Penalized non-filer rate
        applicableRate = Math.min(0.45, applicableRate * 2);
      }

      if (applicableRate === 0) {
        isExempt = true;
      }
    }

    const grossCGT = Math.round(capitalGain * applicableRate);

    // Section 236C credit (seller advance tax paid at 2.75% or 11.5%)
    const paid236C = adjust236C
      ? Math.round(cgtSalePrice * (cgtTaxpayerStatus === 'filer' ? PROPERTY_SALE_RATES.filer : PROPERTY_SALE_RATES.nonFiler))
      : 0;

    const netCGTPayable = Math.max(0, grossCGT - paid236C);
    const refundOrExcessCredit = paid236C > grossCGT ? paid236C - grossCGT : 0;

    return {
      capitalGain,
      applicableRate,
      isExempt,
      grossCGT,
      paid236C,
      netCGTPayable,
      refundOrExcessCredit
    };
  }, [
    cgtPropType,
    cgtAcquisitionRegime,
    cgtPurchaseCost,
    cgtSalePrice,
    cgtHoldingPeriod,
    cgtTaxpayerStatus,
    adjust236C
  ]);

  return (
    <section className="section property-tax-calc-section" id="property-calculator">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="calc-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Property &amp; Real Estate Tax Calculator</span>
        </nav>

        <div className="section-heading" style={{ marginTop: '20px' }}>
          <span className="eyebrow">Dedicated Real Estate Transfer Tool</span>
          <h1>Property &amp; Real Estate Tax Calculator</h1>
          <p>
            Official Pakistan property tax calculator: Purchase Tax on Buyer (Section 236K), Advance Withholding on Seller (Section 236C), and Capital Gains Tax on Profit (CGT Section 37).
          </p>
        </div>

        {/* Sub-navigation Segmented Mode Switcher */}
        <div className="prop-calc-nav-wrapper">
        <div className="prop-calc-nav-pills">
          <button
            type="button"
            className={`prop-nav-pill ${activeMode === 'buying' ? 'active' : ''}`}
            onClick={() => setActiveMode('buying')}
          >
            <Key size={16} />
            <span>1. Purchase Tax (Sec 236K)</span>
          </button>

          <button
            type="button"
            className={`prop-nav-pill ${activeMode === 'selling' ? 'active' : ''}`}
            onClick={() => setActiveMode('selling')}
          >
            <Coins size={16} />
            <span>2. Selling Tax (Sec 236C)</span>
          </button>

          <button
            type="button"
            className={`prop-nav-pill ${activeMode === 'cgt' ? 'active' : ''}`}
            onClick={() => setActiveMode('cgt')}
          >
            <TrendingUp size={16} />
            <span>3. Capital Gains Tax (CGT Sec 37)</span>
          </button>

          <button
            type="button"
            className={`prop-nav-pill ${activeMode === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveMode('schedules')}
          >
            <FileText size={16} />
            <span>Official FBR Rate Schedules</span>
          </button>
        </div>
      </div>

      {/* ===================================================================
          MODE 1: PROPERTY PURCHASE TAX (SECTION 236K)
          =================================================================== */}
      {activeMode === 'buying' && (
        <div className="calc-card-grid">
          {/* Controls Panel */}
          <div className="calc-inputs-panel">
            <div className="calc-panel-header">
              <span className="step-badge">Section 236K</span>
              <h3 className="calc-panel-title">Property Purchase Tax Calculator</h3>
              <p className="calc-panel-desc">
                Advance withholding tax collected from the buyer at property transfer pursuant to Section 236K of the Income Tax Ordinance, 2001.
              </p>
            </div>

            {/* Input 1: Property Value */}
            <div className="calc-field-group">
              <div className="calc-label-row">
                <label htmlFor="buyValInput" className="calc-field-label">
                  Property Value / DC Rate (PKR)
                </label>
                <span className="calc-field-hint">{formatPKR(buyValue)}</span>
              </div>
              <div className="calc-input-addon-wrap">
                <span className="input-currency-tag">PKR</span>
                <input
                  id="buyValInput"
                  type="text"
                  className="calc-text-input"
                  value={buyValue ? buyValue.toLocaleString('en-PK') : ''}
                  onChange={(e) => setBuyValue(parseNumber(e.target.value))}
                  placeholder="e.g. 15,000,000"
                />
              </div>
              <div className="calc-quick-pills">
                {[5000000, 15000000, 35000000, 60000000, 120000000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="calc-quick-chip"
                    onClick={() => setBuyValue(v)}
                  >
                    {v >= 10000000 ? `${v / 10000000} Crore` : `${v / 100000} Lakh`}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Buyer Taxpayer Status */}
            <div className="calc-field-group">
              <label className="calc-field-label">Buyer Tax Filing Status</label>
              <div className="calc-segment-group">
                <button
                  type="button"
                  className={`calc-segment-btn ${buyTaxpayerStatus === 'filer' ? 'active' : ''}`}
                  onClick={() => setBuyTaxpayerStatus('filer')}
                >
                  <CheckCircle2 size={15} />
                  <span>Active Filer (1.25%)</span>
                </button>

                <button
                  type="button"
                  className={`calc-segment-btn ${buyTaxpayerStatus === 'nonFiler' ? 'active' : ''}`}
                  onClick={() => setBuyTaxpayerStatus('nonFiler')}
                >
                  <AlertTriangle size={15} />
                  <span>Non-Filer (10.5% - 18.5%)</span>
                </button>

                <button
                  type="button"
                  className={`calc-segment-btn ${buyTaxpayerStatus === 'overseas' ? 'active' : ''}`}
                  onClick={() => setBuyTaxpayerStatus('overseas')}
                >
                  <Sparkles size={15} />
                  <span>Overseas (NICOP / POC)</span>
                </button>
              </div>
              {buyTaxpayerStatus === 'overseas' && (
                <div className="calc-info-alert">
                  <Info size={14} className="text-primary flex-shrink-0" />
                  <span>
                    Non-resident Pakistanis holding a valid NICOP or Pakistan Origin Card (POC) pay the lower 1.25% filer rate even without a local FBR tax return.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary Panel */}
          <div className="calc-summary-panel">
            <div className="summary-sticky-card">
              <div className="summary-header">
                <div className="summary-icon-box">
                  <Key size={20} />
                </div>
                <div>
                  <h4 className="summary-title">Purchase Tax Assessment</h4>
                  <span className="summary-subtitle">Section 236K Advance Withholding</span>
                </div>
              </div>

              <div className="summary-total-banner">
                <span className="total-label">FBR Purchase Tax (Sec 236K)</span>
                <span className="total-value">{formatPKR(purchaseCalc.totalTaxes)}</span>
                <span className="total-note">
                  Effective Rate: {((purchaseCalc.totalTaxes / buyValue) * 100).toFixed(2)}% on purchase consideration
                </span>
              </div>

              <div className="summary-breakdown-list">
                <div className="summary-line">
                  <span>
                    FBR Advance Tax (Sec 236K):
                    <small style={{ display: 'block', color: 'var(--text-muted)' }}>
                      Slab: {purchaseCalc.slab.label} ({(purchaseCalc.rate * 100).toFixed(2)}%)
                    </small>
                  </span>
                  <strong>{formatPKR(purchaseCalc.sec236kTax)}</strong>
                </div>

                <div className="summary-divider" />

                <div className="summary-line" style={{ fontSize: '15px' }}>
                  <strong>Gross Property Value:</strong>
                  <span>{formatPKR(buyValue)}</span>
                </div>

                <div className="summary-line" style={{ fontSize: '15px', color: 'var(--primary)' }}>
                  <strong>Total Purchase Outflow:</strong>
                  <strong>{formatPKR(purchaseCalc.totalAcquisitionCost)}</strong>
                </div>
              </div>

              <div className="summary-disclaimer">
                <ShieldCheck size={14} className="text-primary flex-shrink-0" />
                <span>
                  Section 236K is adjustable against your annual income tax liability if you are an active tax filer.
                </span>
              </div>

              <div className="summary-actions" style={{ marginTop: '16px' }}>
                <Link href="/#contact" className="button" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Consult Real Estate Tax Advisor</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODE 2: PROPERTY SALE TAX (SECTION 236C)
          =================================================================== */}
      {activeMode === 'selling' && (
        <div className="calc-card-grid">
          <div className="calc-inputs-panel">
            <div className="calc-panel-header">
              <span className="step-badge">Section 236C</span>
              <h3 className="calc-panel-title">Property Sale Advance Withholding</h3>
              <p className="calc-panel-desc">
                Advance income tax collected from the seller at the time of property transfer. Fully adjustable against final Capital Gains Tax (CGT).
              </p>
            </div>

            <div className="calc-field-group">
              <div className="calc-label-row">
                <label htmlFor="sellValInput" className="calc-field-label">
                  Property Sale Value (PKR)
                </label>
                <span className="calc-field-hint">{formatPKR(sellValue)}</span>
              </div>
              <div className="calc-input-addon-wrap">
                <span className="input-currency-tag">PKR</span>
                <input
                  id="sellValInput"
                  type="text"
                  className="calc-text-input"
                  value={sellValue ? sellValue.toLocaleString('en-PK') : ''}
                  onChange={(e) => setSellValue(parseNumber(e.target.value))}
                  placeholder="e.g. 20,000,000"
                />
              </div>
              <div className="calc-quick-pills">
                {[10000000, 20000000, 50000000, 100000000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="calc-quick-chip"
                    onClick={() => setSellValue(v)}
                  >
                    {v / 10000000} Crore
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-field-group">
              <label className="calc-field-label">Seller Tax Filing Status</label>
              <div className="calc-segment-group">
                <button
                  type="button"
                  className={`calc-segment-btn ${sellTaxpayerStatus === 'filer' ? 'active' : ''}`}
                  onClick={() => setSellTaxpayerStatus('filer')}
                >
                  <CheckCircle2 size={15} />
                  <span>Active Filer (2.75%)</span>
                </button>

                <button
                  type="button"
                  className={`calc-segment-btn ${sellTaxpayerStatus === 'nonFiler' ? 'active' : ''}`}
                  onClick={() => setSellTaxpayerStatus('nonFiler')}
                >
                  <AlertTriangle size={15} />
                  <span>Non-Filer (11.5%)</span>
                </button>

                <button
                  type="button"
                  className={`calc-segment-btn ${sellTaxpayerStatus === 'overseas' ? 'active' : ''}`}
                  onClick={() => setSellTaxpayerStatus('overseas')}
                >
                  <Sparkles size={15} />
                  <span>Overseas (NICOP/POC 2.75%)</span>
                </button>
              </div>
            </div>

            <div className="calc-info-alert" style={{ marginTop: '16px' }}>
              <Info size={16} className="text-primary flex-shrink-0" />
              <div>
                <strong>Important Legal Protection for Sellers:</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', lineHeight: 1.5 }}>
                  Section 236C is NOT a final tax. It is an advance payment credited against your annual Capital Gains Tax under Section 37. If your property was held for more than the CGT exemption period (or if you incur a capital loss), the excess 236C deduction can be claimed as a refund or adjusted against other tax liabilities.
                </p>
              </div>
            </div>
          </div>

          <div className="calc-summary-panel">
            <div className="summary-sticky-card">
              <div className="summary-header">
                <div className="summary-icon-box">
                  <Coins size={20} />
                </div>
                <div>
                  <h4 className="summary-title">Seller Tax Assessment</h4>
                  <span className="summary-subtitle">Section 236C Advance Withholding</span>
                </div>
              </div>

              <div className="summary-total-banner">
                <span className="total-label">Advance Tax Deducted at Transfer</span>
                <span className="total-value">{formatPKR(saleCalc.sec236cTax)}</span>
                <span className="total-note">
                  Rate: {(saleCalc.rate * 100).toFixed(2)}% on gross selling value
                </span>
              </div>

              <div className="summary-breakdown-list">
                <div className="summary-line">
                  <span>Gross Property Value:</span>
                  <strong>{formatPKR(sellValue)}</strong>
                </div>

                <div className="summary-line">
                  <span>Section 236C Deduction:</span>
                  <strong className="text-primary">-{formatPKR(saleCalc.sec236cTax)}</strong>
                </div>

                <div className="summary-divider" />

                <div className="summary-line" style={{ fontSize: '15px' }}>
                  <strong>Net Proceeds Received by Seller:</strong>
                  <strong className="text-navy">{formatPKR(saleCalc.netProceeds)}</strong>
                </div>
              </div>

              <div className="summary-disclaimer">
                <ShieldCheck size={14} className="text-primary flex-shrink-0" />
                <span>
                  Obtain CPR (Computerized Payment Receipt) from the registrar to claim this amount in your annual tax return.
                </span>
              </div>

              <div className="summary-actions" style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  className="button button-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setCgtSalePrice(sellValue);
                    setActiveMode('cgt');
                  }}
                >
                  <span>Calculate Capital Gains Tax (CGT)</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODE 3: CAPITAL GAINS TAX (CGT - SECTION 37)
          =================================================================== */}
      {activeMode === 'cgt' && (
        <div className="calc-card-grid">
          <div className="calc-inputs-panel">
            <div className="calc-panel-header">
              <span className="step-badge">Section 37</span>
              <h3 className="calc-panel-title">Capital Gains Tax on Property Profit</h3>
              <p className="calc-panel-desc">
                Calculates statutory capital gain on property sale based on holding duration and FBR rate schedules.
              </p>
            </div>

            {/* Property Classification */}
            <div className="calc-field-group">
              <label className="calc-field-label">Property Category</label>
              <div className="calc-segment-group">
                <button
                  type="button"
                  className={`calc-segment-btn ${cgtPropType === 'openPlot' ? 'active' : ''}`}
                  onClick={() => setCgtPropType('openPlot')}
                >
                  <MapPin size={15} />
                  <span>Open Plot</span>
                </button>
                <button
                  type="button"
                  className={`calc-segment-btn ${cgtPropType === 'constructed' ? 'active' : ''}`}
                  onClick={() => setCgtPropType('constructed')}
                >
                  <Home size={15} />
                  <span>Constructed Property</span>
                </button>
                <button
                  type="button"
                  className={`calc-segment-btn ${cgtPropType === 'flat' ? 'active' : ''}`}
                  onClick={() => setCgtPropType('flat')}
                >
                  <Building size={15} />
                  <span>Residential / Commercial Flat</span>
                </button>
              </div>
            </div>

            {/* Acquisition Date Regime */}
            <div className="calc-field-group">
              <label className="calc-field-label">Date of Acquisition</label>
              <div className="calc-segment-group">
                <button
                  type="button"
                  className={`calc-segment-btn ${cgtAcquisitionRegime === 'preJuly24' ? 'active' : ''}`}
                  onClick={() => setCgtAcquisitionRegime('preJuly24')}
                >
                  <Clock size={15} />
                  <span>On or Before 30 June 2024 (Holding Schedule)</span>
                </button>
                <button
                  type="button"
                  className={`calc-segment-btn ${cgtAcquisitionRegime === 'postJuly24' ? 'active' : ''}`}
                  onClick={() => setCgtAcquisitionRegime('postJuly24')}
                >
                  <Sparkles size={15} />
                  <span>On or After 1 July 2024 (15% Flat Regime)</span>
                </button>
              </div>
            </div>

            {/* Cost & Sale Inputs */}
            <div className="calc-two-col-inputs">
              <div className="calc-field-group">
                <label htmlFor="cgtCostInput" className="calc-field-label">
                  Purchase Cost + Improvements (PKR)
                </label>
                <div className="calc-input-addon-wrap">
                  <span className="input-currency-tag">PKR</span>
                  <input
                    id="cgtCostInput"
                    type="text"
                    className="calc-text-input"
                    value={cgtPurchaseCost ? cgtPurchaseCost.toLocaleString('en-PK') : ''}
                    onChange={(e) => setCgtPurchaseCost(parseNumber(e.target.value))}
                    placeholder="e.g. 12,000,000"
                  />
                </div>
              </div>

              <div className="calc-field-group">
                <label htmlFor="cgtSaleInput" className="calc-field-label">
                  Sale Value / Selling Price (PKR)
                </label>
                <div className="calc-input-addon-wrap">
                  <span className="input-currency-tag">PKR</span>
                  <input
                    id="cgtSaleInput"
                    type="text"
                    className="calc-text-input"
                    value={cgtSalePrice ? cgtSalePrice.toLocaleString('en-PK') : ''}
                    onChange={(e) => setCgtSalePrice(parseNumber(e.target.value))}
                    placeholder="e.g. 20,000,000"
                  />
                </div>
              </div>
            </div>

            {/* Holding Period (if pre-July 2024) */}
            {cgtAcquisitionRegime === 'preJuly24' && (
              <div className="calc-field-group">
                <label className="calc-field-label">Holding Period Duration</label>
                <div className="calc-grid-options" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                  {CGT_HOLDING_SCHEDULE.map((b) => (
                    <button
                      key={b.periodId}
                      type="button"
                      className={`calc-option-chip ${cgtHoldingPeriod === b.periodId ? 'active' : ''}`}
                      onClick={() => setCgtHoldingPeriod(b.periodId)}
                    >
                      <span>{b.label}</span>
                      <span className="chip-rate-tag">
                        {cgtPropType === 'openPlot'
                          ? `${(b.openPlotRate * 100).toFixed(1)}%`
                          : cgtPropType === 'constructed'
                          ? `${(b.constructedRate * 100).toFixed(1)}%`
                          : `${(b.flatRate * 100).toFixed(1)}%`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Taxpayer Status & 236C Adjustment */}
            <div className="calc-field-group">
              <div className="calc-label-row">
                <label className="calc-field-label">Seller Tax Status</label>
                <label className="calc-checkbox-inline">
                  <input
                    type="checkbox"
                    checked={adjust236C}
                    onChange={(e) => setAdjust236C(e.target.checked)}
                  />
                  <span>Credit Section 236C Advance Tax Paid</span>
                </label>
              </div>
              <div className="calc-segment-group">
                <button
                  type="button"
                  className={`calc-segment-btn ${cgtTaxpayerStatus === 'filer' ? 'active' : ''}`}
                  onClick={() => setCgtTaxpayerStatus('filer')}
                >
                  <CheckCircle2 size={15} />
                  <span>Active Filer</span>
                </button>
                <button
                  type="button"
                  className={`calc-segment-btn ${cgtTaxpayerStatus === 'nonFiler' ? 'active' : ''}`}
                  onClick={() => setCgtTaxpayerStatus('nonFiler')}
                >
                  <AlertTriangle size={15} />
                  <span>Non-Filer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary Panel */}
          <div className="calc-summary-panel">
            <div className="summary-sticky-card">
              <div className="summary-header">
                <div className="summary-icon-box">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="summary-title">Capital Gains Tax Assessment</h4>
                  <span className="summary-subtitle">Section 37 Income Tax Ordinance 2001</span>
                </div>
              </div>

              <div className="summary-total-banner">
                <span className="total-label">Net CGT Payable to FBR</span>
                <span className="total-value">{formatPKR(cgtCalc.netCGTPayable)}</span>
                <span className="total-note">
                  {cgtCalc.isExempt
                    ? 'Property holding period qualifies for 100% CGT exemption.'
                    : `Applicable CGT Rate: ${(cgtCalc.applicableRate * 100).toFixed(1)}% on net capital gain`}
                </span>
              </div>

              <div className="summary-breakdown-list">
                <div className="summary-line">
                  <span>Gross Capital Gain (Profit):</span>
                  <strong>{formatPKR(cgtCalc.capitalGain)}</strong>
                </div>

                <div className="summary-line">
                  <span>Total Gross CGT Liability:</span>
                  <strong>{formatPKR(cgtCalc.grossCGT)}</strong>
                </div>

                {adjust236C && (
                  <div className="summary-line">
                    <span>Less Advance Tax Paid (Sec 236C):</span>
                    <strong className="text-primary">-{formatPKR(cgtCalc.paid236C)}</strong>
                  </div>
                )}

                <div className="summary-divider" />

                <div className="summary-line" style={{ fontSize: '15px' }}>
                  <strong>Final Net CGT Due:</strong>
                  <strong className="text-navy">{formatPKR(cgtCalc.netCGTPayable)}</strong>
                </div>

                {cgtCalc.refundOrExcessCredit > 0 && (
                  <div className="summary-line" style={{ color: '#2b8a3e', fontSize: '13.5px' }}>
                    <span>Refundable / Excess Credit:</span>
                    <strong>{formatPKR(cgtCalc.refundOrExcessCredit)}</strong>
                  </div>
                )}
              </div>

              <div className="summary-disclaimer">
                <Info size={14} className="text-primary flex-shrink-0" />
                <span>
                  Documentary proof of original purchase deed and approved development cost receipts are mandatory to claim base cost deductions.
                </span>
              </div>

              <div className="summary-actions" style={{ marginTop: '16px' }}>
                <Link href="/#contact" className="button" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Book Property Tax Advisory</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODE 4: OFFICIAL FBR STATUTORY SCHEDULES (From User Images)
          =================================================================== */}
      {activeMode === 'schedules' && (
        <div className="schedules-view-container">
          {/* Section 1: Purchase Tax Slabs (236K) */}
          <div className="schedule-box-card">
            <div className="schedule-box-head">
              <span className="step-badge">1. Purchase Tax</span>
              <h3 className="schedule-box-title">Section 236K Advance Withholding on Property Buyer</h3>
              <p className="schedule-box-desc">
                Collected from the buyer at the time of property transfer by the registration authority / sub-registrar.
              </p>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Property Value Bracket</th>
                    <th>Active Taxpayer (Filer) Rate</th>
                    <th>Non-Filer Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Up to Rs. 50 Million</strong></td>
                    <td>1.25%</td>
                    <td>10.5%</td>
                  </tr>
                  <tr>
                    <td><strong>Rs. 50 Million to Rs. 100 Million</strong></td>
                    <td>1.25%</td>
                    <td>14.5%</td>
                  </tr>
                  <tr>
                    <td><strong>Above Rs. 100 Million</strong></td>
                    <td>1.25%</td>
                    <td>18.5%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="schedule-callout-note">
              <Sparkles size={16} className="text-primary flex-shrink-0" />
              <span>
                <strong>Overseas Pakistanis:</strong> Non-residents holding a valid <strong>NICOP</strong> or <strong>Pakistan Origin Card (POC)</strong> pay the lower filer rate (<strong>1.25%</strong>) even if they have not filed a local tax return in Pakistan.
              </span>
            </div>
          </div>

          {/* Section 2: Sale Tax Slabs (236C) */}
          <div className="schedule-box-card" style={{ marginTop: '32px' }}>
            <div className="schedule-box-head">
              <span className="step-badge">2. Sale Tax</span>
              <h3 className="schedule-box-title">Section 236C Advance Withholding on Property Seller</h3>
              <p className="schedule-box-desc">
                Collected from the seller at the time of transfer as advance income tax (credited against final CGT when filing annual returns).
              </p>
            </div>

            <div className="schedule-pill-grid">
              <div className="schedule-rate-tile">
                <span className="tile-label">Active Taxpayer (Filer)</span>
                <span className="tile-val">2.75%</span>
                <span className="tile-desc">Adjustable against annual CGT</span>
              </div>
              <div className="schedule-rate-tile alert-tile">
                <span className="tile-label">Non-Filer</span>
                <span className="tile-val">11.5%</span>
                <span className="tile-desc">Punitive withholding rate</span>
              </div>
              <div className="schedule-rate-tile">
                <span className="tile-label">Overseas Pakistani (NICOP/POC)</span>
                <span className="tile-val">2.75%</span>
                <span className="tile-desc">Filer rate concession</span>
              </div>
            </div>
          </div>

          {/* Section 3: Capital Gain Tax Rates Table (Image 3) */}
          <div className="schedule-box-card" style={{ marginTop: '32px' }}>
            <div className="schedule-box-head">
              <span className="step-badge">3. Capital Gains Tax</span>
              <h3 className="schedule-box-title">Capital Gain Tax Rates on Property in Pakistan (Section 37)</h3>
              <p className="schedule-box-desc">
                The immovable-property schedule separates property acquired on or before 30 June 2024 from property acquired on or after 1 July 2024. Older property retains the declining holding-period table.
              </p>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Holding Period</th>
                    <th>Open Plot</th>
                    <th>Constructed Property</th>
                    <th>Flat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Up to 1 year</strong></td>
                    <td>15%</td>
                    <td>15%</td>
                    <td>15%</td>
                  </tr>
                  <tr>
                    <td><strong>Over 1 to 2 years</strong></td>
                    <td>12.5%</td>
                    <td>10%</td>
                    <td>7.5%</td>
                  </tr>
                  <tr>
                    <td><strong>Over 2 to 3 years</strong></td>
                    <td>10%</td>
                    <td>7.5%</td>
                    <td><span className="status-badge-green">0% (Exempt)</span></td>
                  </tr>
                  <tr>
                    <td><strong>Over 3 to 4 years</strong></td>
                    <td>7.5%</td>
                    <td>5%</td>
                    <td><span className="status-badge-green">—</span></td>
                  </tr>
                  <tr>
                    <td><strong>Over 4 to 5 years</strong></td>
                    <td>5%</td>
                    <td><span className="status-badge-green">0% (Exempt)</span></td>
                    <td><span className="status-badge-green">—</span></td>
                  </tr>
                  <tr>
                    <td><strong>Over 5 to 6 years</strong></td>
                    <td>2.5%</td>
                    <td><span className="status-badge-green">—</span></td>
                    <td><span className="status-badge-green">—</span></td>
                  </tr>
                  <tr>
                    <td><strong>Over 6 years</strong></td>
                    <td><span className="status-badge-green">0% (Exempt)</span></td>
                    <td><span className="status-badge-green">—</span></td>
                    <td><span className="status-badge-green">—</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="schedule-callout-note" style={{ marginTop: '16px' }}>
              <Info size={16} className="text-primary flex-shrink-0" />
              <span>
                <strong>Acquisitions on or after 1 July 2024:</strong> Subject to a flat 15% rate on capital gains for filers regardless of holding duration, while non-filers are subject to progressive individual slab rates under Section 37(1A).
              </span>
            </div>
          </div>
        </div>
      )}

        {/* Other Dedicated Tax Calculators Section */}
        <div className="other-calculators-section">
          <h3>Other Dedicated Tax Calculators</h3>
          <p>Need to calculate salary, business, or rental tax? Open our dedicated tools:</p>
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

            <Link href="/tax-calculator/rental" className="other-calc-card">
              <div className="other-calc-icon"><Home size={20} /></div>
              <div className="other-calc-info">
                <strong>Rental Income Tax</strong>
                <span>Section 155 progressive individual slabs &amp; corporate 15% flat withholding</span>
              </div>
              <ArrowRight size={16} className="other-calc-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
