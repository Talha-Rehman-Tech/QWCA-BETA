'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  entityTypes,
  capitalSlabs,
  setupAddons,
  EntityTypeOption,
  CapitalSlab,
  SetupAddon
} from '@/data/calculator-data';
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
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    setupAddons.forEach((addon) => {
      initial[addon.id] = addon.required || !!addon.defaultChecked;
    });
    return initial;
  });

  const selectedEntity = useMemo(
    () => entityTypes.find((e) => e.id === selectedEntityId) || entityTypes[1],
    [selectedEntityId]
  );

  const selectedCapital = useMemo(
    () => capitalSlabs.find((c) => c.id === selectedCapitalId) || capitalSlabs[1],
    [selectedCapitalId]
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
    if (activeCategoryFilter === 'All') return setupAddons;
    return setupAddons.filter((a) => a.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  // Dynamic calculations via useMemo
  const calculation = useMemo(() => {
    let govtTotal = selectedEntity.baseGovFee + selectedCapital.secpCapitalFee;
    let consultingTotal = selectedEntity.baseConsultingFee;

    const activeAddonsList: SetupAddon[] = [];

    setupAddons.forEach((addon) => {
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
  }, [selectedEntity, selectedCapital, selectedAddons]);

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
              <span className="step-badge">Step 1</span>
              <div>
                <h3 className="step-title">Select Business Legal Structure</h3>
                <p className="step-desc">
                  Choose the entity type that fits your ownership model and liability preferences.
                </p>
              </div>
            </div>

            <div className="entity-selection-grid">
              {entityTypes.map((entity) => {
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
              <span className="step-badge">Step 2</span>
              <div>
                <h3 className="step-title">Select Authorized Capital Tier</h3>
                <p className="step-desc">
                  SECP charges statutory registration fee based on authorized capital. Start with PKR 100k or 1 Million for optimal initial cost.
                </p>
              </div>
            </div>

            <div className="capital-selection-grid">
              {capitalSlabs.map((slab) => {
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
              <span className="step-badge">Step 3</span>
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
    </div>
  );
}
