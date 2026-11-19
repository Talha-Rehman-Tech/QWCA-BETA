'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  entityTypes,
  capitalSlabs,
  setupAddons,
  EntityTypeOption,
  CapitalSlab,
  SetupAddon
} from '@/data/calculator-data';
import { getCompanyCostConfigApi } from '@/lib/api';
import { subscribeToRealtime } from '@/lib/realtime';
import {
  Calculator,
  Check,
  ShieldCheck,
  HelpCircle,
  FileText,
  Printer,
  ArrowRight,
  Info,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';

export default function CostCalculator() {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('pvt-limited');
  const [selectedCapitalId, setSelectedCapitalId] = useState<string>('1m');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Dynamic live cost data synchronized with MongoDB Backend
  const [liveEntityTypes, setLiveEntityTypes] = useState<EntityTypeOption[]>(entityTypes);
  const [liveCapitalSlabs, setLiveCapitalSlabs] = useState<CapitalSlab[]>(capitalSlabs);
  const [liveSetupAddons, setLiveSetupAddons] = useState<SetupAddon[]>(setupAddons);

  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    setupAddons.forEach((addon) => {
      initial[addon.id] = addon.required || !!addon.defaultChecked;
    });
    return initial;
  });

  useEffect(() => {
    async function syncCostWithBackend() {
      try {
        const config = await getCompanyCostConfigApi();
        if (config) {
          // 1. Sync Entity Packages
          if (config.entityTiers && config.entityTiers.length > 0) {
            setLiveEntityTypes((prev) =>
              prev.map((ent) => {
                const match = config.entityTiers.find(
                  (t: any) =>
                    t.id === ent.id ||
                    (ent.id === 'smc-private' && t.id === 'smc') ||
                    (ent.id === 'pvt-limited' && t.id === 'pvt_ltd') ||
                    (ent.id === 'foreign-subsidiary' && t.id === 'cpec_foreign') ||
                    (ent.id === 'public-unlisted' && t.id === 'public_unlisted')
                );
                if (match) {
                  const totalFee = match.baseFee;
                  const baseGov = match.baseGovFee !== undefined ? match.baseGovFee : Math.min(ent.baseGovFee, totalFee);
                  const baseConsult = match.baseConsultingFee !== undefined ? match.baseConsultingFee : Math.max(0, totalFee - baseGov);
                  return {
                    ...ent,
                    name: match.name || ent.name,
                    description: match.desc || ent.description,
                    badge: match.badge || ent.badge,
                    baseGovFee: baseGov,
                    baseConsultingFee: baseConsult,
                  };
                }
                return ent;
              })
            );
          }

          // 2. Sync Capital Slabs
          if (config.capitalTiers && config.capitalTiers.length > 0) {
            setLiveCapitalSlabs((prev) =>
              prev.map((cap) => {
                const match = config.capitalTiers.find(
                  (t: any) =>
                    t.id === cap.id ||
                    (cap.id === '100k' && t.id === 'cap_100k') ||
                    (cap.id === '1m' && t.id === 'cap_1m') ||
                    (cap.id === '5m' && t.id === 'cap_5m') ||
                    (cap.id === '10m' && t.id === 'cap_10m')
                );
                if (match) {
                  return {
                    ...cap,
                    label: match.label || cap.label,
                    secpCapitalFee: match.fee,
                  };
                }
                return cap;
              })
            );
          }

          // 3. Sync Service Add-ons
          if (config.serviceAddons && config.serviceAddons.length > 0) {
            setLiveSetupAddons((prev) =>
              prev.map((addon) => {
                const match = config.serviceAddons.find(
                  (a: any) =>
                    a.id === addon.id ||
                    (addon.id === 'secp-incorporation' && a.id === 'secp_incorp') ||
                    (addon.id === 'moa-aoa-drafting' && a.id === 'moa_aoa') ||
                    (addon.id === 'corporate-ntn' && a.id === 'fbr_ntn') ||
                    (addon.id === 'sales-tax-strn' && a.id === 'sales_tax') ||
                    (addon.id === 'chamber-membership' && a.id === 'chamber') ||
                    (addon.id === 'weboc-import-export' && a.id === 'weboc') ||
                    (addon.id === 'trademark-filing' && a.id === 'trademark') ||
                    (addon.id === 'bank-account-resolution' && a.id === 'bank_resolution') ||
                    (addon.id === 'foreign-director-clearance' && a.id === 'foreign_clearance')
                );
                if (match) {
                  const totalFee = match.fee;
                  const govFee = match.govtFee !== undefined ? match.govtFee : Math.min(addon.govtFee, totalFee);
                  const consultFee = match.consultingFee !== undefined ? match.consultingFee : Math.max(0, totalFee - govFee);
                  return {
                    ...addon,
                    name: match.name || addon.name,
                    description: match.desc || addon.description,
                    category: match.category || addon.category,
                    govtFee: govFee,
                    consultingFee: consultFee,
                  };
                }
                return addon;
              })
            );
          }
        }
      } catch (err) {
        console.warn('Operating with baseline company cost data');
      }
    }
    syncCostWithBackend();

    // Instant Realtime Sync: Auto-update DOM when Admin updates company cost
    const unsubscribe = subscribeToRealtime((event) => {
      if (event.type === 'company_cost_updated') {
        syncCostWithBackend();
      }
    });

    return () => unsubscribe();
  }, []);

  const selectedEntity = useMemo(
    () => liveEntityTypes.find((e) => e.id === selectedEntityId) || liveEntityTypes[1] || liveEntityTypes[0],
    [selectedEntityId, liveEntityTypes]
  );

  const selectedCapital = useMemo(
    () => liveCapitalSlabs.find((c) => c.id === selectedCapitalId) || liveCapitalSlabs[1] || liveCapitalSlabs[0],
    [selectedCapitalId, liveCapitalSlabs]
  );

  const toggleAddon = (id: string, required?: boolean) => {
    if (required) return;
    setSelectedAddons((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = ['All', 'SECP & Incorporation', 'Taxation & FBR', 'Licensing & Foreign', 'IP & Operations'];

  const filteredAddons = useMemo(() => {
    if (activeCategoryFilter === 'All') return liveSetupAddons;
    return liveSetupAddons.filter((a) => a.category === activeCategoryFilter);
  }, [activeCategoryFilter, liveSetupAddons]);

  // Dynamic calculations via useMemo
  const calculation = useMemo(() => {
    let govtTotal = selectedEntity.baseGovFee + selectedCapital.secpCapitalFee;
    let consultingTotal = selectedEntity.baseConsultingFee;

    const activeAddonsList: SetupAddon[] = [];

    liveSetupAddons.forEach((addon) => {
      if (selectedAddons[addon.id]) {
        activeAddonsList.push(addon);
        govtTotal += addon.govtFee;
        consultingTotal += addon.consultingFee;
      }
    });

    const grandTotal = govtTotal + consultingTotal;

    return {
      govtTotal,
      consultingTotal,
      grandTotal,
      activeAddonsList
    };
  }, [selectedEntity, selectedCapital, selectedAddons, liveSetupAddons]);

  const formatPKR = (amount: number) => {
    return 'PKR ' + amount.toLocaleString('en-PK');
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSummary = () => {
    const el = document.getElementById('calculatorSummary');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="cost-calculator-wrapper">
      <div className="calculator-layout-grid">
        {/* Left Column: Interactive Form Controls */}
        <div className="calculator-controls-panel">
          {/* Step 1: Choose Entity Structure */}
          <div className="calc-step-card">
            <div className="calc-step-header">
              <span className="step-badge">STEP 01</span>
              <div>
                <h3 className="step-title">Select Business Legal Structure</h3>
                <p className="step-desc">
                  Choose the entity type that fits your ownership model and liability preferences.
                </p>
              </div>
            </div>

            <div className="entity-selection-grid">
              {liveEntityTypes.map((entity) => {
                const isSelected = selectedEntityId === entity.id;
                return (
                  <div
                    key={entity.id}
                    className={`entity-radio-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedEntityId(entity.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        setSelectedEntityId(entity.id);
                      }
                    }}
                  >
                    <div className="entity-radio-top">
                      <div className="entity-radio-title-wrap">
                        <div
                          className={`custom-radio-dot ${isSelected ? 'checked' : ''}`}
                          aria-hidden="true"
                        />
                        <strong className="entity-card-title">{entity.name}</strong>
                      </div>
                      {entity.badge && <span className="entity-pill">{entity.badge}</span>}
                    </div>
                    <p className="entity-desc">{entity.description}</p>
                    <div className="entity-base-fee">
                      Base Legal Package: {formatPKR(entity.baseGovFee + entity.baseConsultingFee)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Authorized Share Capital */}
          <div className="calc-step-card">
            <div className="calc-step-header">
              <span className="step-badge">STEP 02</span>
              <div>
                <h3 className="step-title">Select Authorized Capital Tier</h3>
                <p className="step-desc">
                  SECP charges statutory registration fee based on authorized capital. Start with PKR 100k or 1 Million for optimal initial cost.
                </p>
              </div>
            </div>

            <div className="capital-selection-grid">
              {liveCapitalSlabs.map((slab) => {
                const isActive = selectedCapitalId === slab.id;
                return (
                  <button
                    type="button"
                    key={slab.id}
                    className={`capital-chip ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCapitalId(slab.id)}
                  >
                    <span className="capital-label">{slab.label}</span>
                    <span className="capital-secp-fee">+{formatPKR(slab.secpCapitalFee)} SECP fee</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Registration Steps & Add-on Modules (Interactive Checklist) */}
          <div className="calc-step-card">
            <div className="calc-step-header">
              <span className="step-badge">STEP 03</span>
              <div>
                <h3 className="step-title">Statutory &amp; Operational Setup Checklist</h3>
                <p className="step-desc">
                  Click any service below to toggle. Selected items immediately add to your live fee estimate on the right.
                </p>
              </div>
            </div>

            {/* Category Filter Chips for Steps */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: activeCategoryFilter === cat ? '1px solid var(--primary)' : '1px solid var(--line)',
                    background: activeCategoryFilter === cat ? 'var(--primary-light)' : 'transparent',
                    color: activeCategoryFilter === cat ? 'var(--primary)' : 'var(--text-body)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="addons-list">
              {filteredAddons.map((addon) => {
                const isChecked = !!selectedAddons[addon.id];
                const totalItemFee = addon.govtFee + addon.consultingFee;

                return (
                  <div
                    key={addon.id}
                    className={`addon-item-row ${isChecked ? 'active' : ''} ${addon.required ? 'is-required' : ''}`}
                    onClick={(e) => {
                      // Prevent double triggering when clicking on input directly
                      if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
                      toggleAddon(addon.id, addon.required);
                    }}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={addon.required ? -1 : 0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleAddon(addon.id, addon.required);
                      }
                    }}
                  >
                    <div className="addon-checkbox-col">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={addon.required}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleAddon(addon.id, addon.required);
                        }}
                        aria-label={addon.name}
                      />
                    </div>
                    <div className="addon-text-col">
                      <div className="addon-title-row">
                        <span className="addon-name">{addon.name}</span>
                        {addon.required ? (
                          <span className="addon-required-badge">Mandatory Statutory</span>
                        ) : isChecked ? (
                          <span className="addon-added-badge">
                            <Check size={11} strokeWidth={3} /> Added to Estimate
                          </span>
                        ) : null}
                      </div>
                      <p className="addon-desc">{addon.description}</p>
                    </div>
                    <div className="addon-price-col">
                      <span className="addon-price-total">
                        {totalItemFee === 0 ? 'Free' : formatPKR(totalItemFee)}
                      </span>
                      <span className="addon-price-split">
                        Gov: {formatPKR(addon.govtFee)} | Adv: {formatPKR(addon.consultingFee)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Sticky Summary Panel */}
        <div className="calculator-summary-panel">
          <div className="summary-sticky-card" id="calculatorSummary">
            <div className="summary-header">
              <div className="summary-icon-box">
                <Calculator size={20} />
              </div>
              <div>
                <h4 className="summary-title">Live Cost Estimate</h4>
                <span className="summary-subtitle">Statutory + Professional Advisory</span>
              </div>
            </div>

            <div className="summary-total-banner">
              <span className="total-label">Total Estimated Setup Cost</span>
              <span className="total-value">{formatPKR(calculation.grandTotal)}</span>
              <span className="total-note">Includes SECP challans, government duties &amp; professional vetting</span>
            </div>

            {/* Live Auto-Calculated Selected Items Breakdown */}
            <div className="summary-live-breakdown-card">
              <div className="summary-breakdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={13} className="text-primary" />
                  <span className="breakdown-header-title">
                    Included Package Items ({calculation.activeAddonsList.length + 2})
                  </span>
                </div>
                <span className="breakdown-realtime-badge">Real-Time</span>
              </div>

              <div className="breakdown-items-scroll">
                {/* 1. Base Entity Incorporation Package */}
                <div className="breakdown-item-chip base">
                  <div className="chip-left">
                    <span className="chip-dot base"></span>
                    <span className="chip-title">{selectedEntity.name} (Base Legal Setup)</span>
                  </div>
                  <span className="chip-price">
                    {formatPKR(selectedEntity.baseGovFee + selectedEntity.baseConsultingFee)}
                  </span>
                </div>

                {/* 2. SECP Authorized Capital Duty */}
                <div className="breakdown-item-chip base">
                  <div className="chip-left">
                    <span className="chip-dot base"></span>
                    <span className="chip-title">SECP Capital Duty ({selectedCapital.label})</span>
                  </div>
                  <span className="chip-price">{formatPKR(selectedCapital.secpCapitalFee)}</span>
                </div>

                {/* 3. Dynamic Checklist Items */}
                {calculation.activeAddonsList.map((addon) => {
                  const itemTotal = addon.govtFee + addon.consultingFee;
                  return (
                    <div key={addon.id} className="breakdown-item-chip addon">
                      <div className="chip-left">
                        <span className="chip-dot addon"></span>
                        <span className="chip-title">{addon.name}</span>
                        {addon.required && <span className="chip-mand-pill">Mandatory</span>}
                      </div>
                      <div className="chip-right">
                        <span className="chip-price">
                          {itemTotal === 0 ? 'Included' : formatPKR(itemTotal)}
                        </span>
                        {!addon.required && (
                          <button
                            type="button"
                            className="chip-remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAddon(addon.id, false);
                            }}
                            title={`Remove ${addon.name} from estimate`}
                            aria-label={`Remove ${addon.name}`}
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtotals Breakdown */}
            <div className="summary-breakdown-list">
              <div className="summary-line">
                <span>Government Statutory Fees:</span>
                <strong className="text-navy">{formatPKR(calculation.govtTotal)}</strong>
              </div>
              <div className="summary-line">
                <span>QWCA Legal Advisory Fees:</span>
                <strong className="text-navy">{formatPKR(calculation.consultingTotal)}</strong>
              </div>
            </div>

            <div className="summary-actions">
              <Link
                href={`/#contact?entity=${selectedEntity.id}&total=${calculation.grandTotal}`}
                className="button"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Book Setup Consultation</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                className="button button-outline"
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                onClick={handlePrint}
              >
                <Printer size={16} />
                <span>Print / Save Quotation</span>
              </button>
            </div>

            <div className="summary-disclaimer">
              <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                Fees reflect official SECP, FBR, and Chamber schedules. Actual government costs may vary slightly based on final stamp duty, capital tier, and specific business clauses.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar for Mobile Devices */}
      <div className="calc-mobile-floating-bar">
        <div className="calc-mobile-floating-content">
          <div>
            <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#adb5bd', letterSpacing: '0.04em' }}>
              Live Total ({calculation.activeAddonsList.length + 2} Items)
            </span>
            <strong style={{ fontSize: '18px', color: '#ff6b72', fontWeight: 800 }}>
              {formatPKR(calculation.grandTotal)}
            </strong>
          </div>
          <button type="button" className="button" onClick={scrollToSummary} style={{ padding: '8px 16px', fontSize: '13.5px' }}>
            <span>View Breakdown</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ===================================================================
          OFFICIAL 1-PAGE PRINT / PDF QUOTATION DOSSIER (Visible ONLY on Print)
          =================================================================== */}
      <div className="calculator-print-dossier" aria-hidden="true">
        {/* Letterhead Header */}
        <div className="dossier-letterhead">
          <div className="dossier-brand-col">
            <div className="dossier-firm-name">QUMMAR WAHEED &amp; CO.</div>
            <div className="dossier-firm-sub">CHARTERED ACCOUNTANTS</div>
            <div className="dossier-firm-icap">Associate Chartered Accountants · ICAP Member Firm · SECP Registered</div>
          </div>
          <div className="dossier-meta-col">
            <div className="dossier-doc-type">OFFICIAL SETUP ESTIMATE &amp; FEE SCHEDULE</div>
            <div className="dossier-meta-line">
              <span>Reference:</span>
              <strong>QWCA-EST-{selectedEntity.id.toUpperCase()}-2025</strong>
            </div>
            <div className="dossier-meta-line">
              <span>Date of Issue:</span>
              <strong>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
            </div>
            <div className="dossier-meta-line">
              <span>Quotation Validity:</span>
              <strong>30 Calendar Days</strong>
            </div>
          </div>
        </div>

        <div className="dossier-divider" />

        {/* Selected Scope Summary Strip */}
        <div className="dossier-scope-strip">
          <div className="dossier-scope-cell">
            <span className="dossier-scope-label">Legal Business Entity</span>
            <strong className="dossier-scope-val">{selectedEntity.name}</strong>
          </div>
          <div className="dossier-scope-cell">
            <span className="dossier-scope-label">Authorized Capital Slab</span>
            <strong className="dossier-scope-val">{selectedCapital.label}</strong>
          </div>
          <div className="dossier-scope-cell">
            <span className="dossier-scope-label">Selected Add-on Modules</span>
            <strong className="dossier-scope-val">{calculation.activeAddonsList.length} Active Services</strong>
          </div>
          <div className="dossier-scope-cell">
            <span className="dossier-scope-label">Estimated Turnaround</span>
            <strong className="dossier-scope-val">3 – 5 Business Days</strong>
          </div>
        </div>

        {/* Itemized Fee Schedule Table (Active Items Only) */}
        <div className="dossier-table-wrap">
          <div className="dossier-table-heading">ITEMIZED SCHEDULE OF SELECTED STATUTORY &amp; ADVISORY SCOPE</div>
          <table className="dossier-table">
            <thead>
              <tr>
                <th style={{ width: '6%', textAlign: 'center' }}>Sr.</th>
                <th style={{ width: '44%' }}>Scope of Service / Deliverable</th>
                <th style={{ width: '22%' }}>Regulatory Body</th>
                <th style={{ width: '14%', textAlign: 'right' }}>Govt Duty</th>
                <th style={{ width: '14%', textAlign: 'right' }}>QWCA Fee</th>
              </tr>
            </thead>
            <tbody>
              {/* 1. Base Corporate Formation Package */}
              <tr>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>01</td>
                <td>
                  <strong>{selectedEntity.name} Formation</strong>
                  <div className="dossier-item-desc">SECP name reservation, digital incorporation drafting, MOA &amp; AOA vetting</div>
                </td>
                <td>SECP eZfile Portal</td>
                <td style={{ textAlign: 'right' }}>{formatPKR(selectedEntity.baseGovFee)}</td>
                <td style={{ textAlign: 'right' }}>{formatPKR(selectedEntity.baseConsultingFee)}</td>
              </tr>

              {/* 2. Capital Duty */}
              <tr>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>02</td>
                <td>
                  <strong>SECP Capital Duty &amp; Registration Fee</strong>
                  <div className="dossier-item-desc">Statutory capital registration duty for {selectedCapital.label}</div>
                </td>
                <td>SECP Schedule VII</td>
                <td style={{ textAlign: 'right' }}>{formatPKR(selectedCapital.secpCapitalFee)}</td>
                <td style={{ textAlign: 'right' }}>Included</td>
              </tr>

              {/* 3. Selected Checklist Add-ons */}
              {calculation.activeAddonsList.map((addon, index) => {
                return (
                  <tr key={addon.id}>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{String(index + 3).padStart(2, '0')}</td>
                    <td>
                      <strong>{addon.name}</strong>
                      <div className="dossier-item-desc">{addon.description}</div>
                    </td>
                    <td>{addon.category}</td>
                    <td style={{ textAlign: 'right' }}>
                      {addon.govtFee === 0 ? 'Nil' : formatPKR(addon.govtFee)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {addon.consultingFee === 0 ? 'Free' : formatPKR(addon.consultingFee)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>Government Statutory Challans Subtotal:</td>
                <td colSpan={2} style={{ textAlign: 'right', fontWeight: 700 }}>{formatPKR(calculation.govtTotal)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>QWCA Chartered Advisory &amp; Legal Fee Subtotal:</td>
                <td colSpan={2} style={{ textAlign: 'right', fontWeight: 700 }}>{formatPKR(calculation.consultingTotal)}</td>
              </tr>
              <tr className="dossier-grand-total-row">
                <td colSpan={3} style={{ textAlign: 'right', fontSize: '12pt', fontWeight: 800 }}>TOTAL ESTIMATED SETUP INVESTMENT:</td>
                <td colSpan={2} style={{ textAlign: 'right', fontSize: '13pt', fontWeight: 900, color: '#A31D24' }}>
                  {formatPKR(calculation.grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes & Chambers Sign-off */}
        <div className="dossier-notes-footer">
          <div className="dossier-notes">
            <strong>Statutory Compliance Notes:</strong>
            <ul>
              <li>Government fees are statutory duties payable directly via official SECP 1Link PSID and FBR Iris challans.</li>
              <li>Package includes complete subscriber verification, digital incorporation certificate, and corporate NTN registration.</li>
              <li>Generated client-side via QWCA Cost Estimator. Subject to final corporate object clauses and capital structure.</li>
            </ul>
          </div>

          <div className="dossier-signatures">
            <div className="dossier-sig-block">
              <div className="dossier-sig-line" />
              <div className="dossier-sig-name">Qummar Waheed, ACA</div>
              <div className="dossier-sig-role">Managing Partner &amp; Lead Consultant</div>
              <div className="dossier-sig-firm">Qummar Waheed &amp; Co. Chartered Accountants</div>
            </div>
            <div className="dossier-contact-block">
              <div><strong>Chambers:</strong> Executive Wing, Wapda City Plaza, Faisalabad</div>
              <div><strong>International:</strong> Dubai, UAE · Shenzhen, China</div>
              <div><strong>UAN / WhatsApp:</strong> +92 300 0000000 · contact@qwca.com.pk</div>
              <div><strong>Web:</strong> www.qwca.com.pk</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
