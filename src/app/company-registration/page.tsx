'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
  Building2,
  Factory,
  Globe2,
  TrendingUp,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function CompanyRegistrationPage() {
  const [activeTab, setActiveTab] = useState<'chinese' | 'investors' | 'manufacturers' | 'industrial'>('chinese');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [activeTab]);

  return (
    <main className="section page-content-section">
      <div className="container">
        {/* Page Hero */}
        <div className="section-heading">
          <span className="eyebrow">Corporate Formation &amp; Structuring</span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '14px', lineHeight: 1.25 }}>
            Company Registration &amp; Industrial Formation Hub
          </h1>
          <p style={{ maxWidth: '820px', margin: '0 auto', fontSize: '16px' }}>
            A statutory roadmap for domestic startups, manufacturing plants, industrial enterprises, and Chinese corporations incorporating in Pakistan under CPEC and SECP frameworks.
          </p>
        </div>

        {/* Mobile-Friendly Horizontal Scrollable Segmented Tab Bar */}
        <div className="reg-tabs-scroll-wrap" style={{ margin: '36px 0 32px' }}>
          <div className="reg-tabs-container">
            <button
              type="button"
              className={`reg-tab-btn ${activeTab === 'chinese' ? 'active' : ''}`}
              onClick={() => setActiveTab('chinese')}
            >
              <Globe2 size={16} />
              <span>Chinese &amp; Foreign Companies (CPEC)</span>
              <span className="reg-tab-pill">Priority</span>
            </button>

            <button
              type="button"
              className={`reg-tab-btn ${activeTab === 'investors' ? 'active' : ''}`}
              onClick={() => setActiveTab('investors')}
            >
              <TrendingUp size={16} />
              <span>Domestic Investors &amp; Startups</span>
            </button>

            <button
              type="button"
              className={`reg-tab-btn ${activeTab === 'manufacturers' ? 'active' : ''}`}
              onClick={() => setActiveTab('manufacturers')}
            >
              <Factory size={16} />
              <span>Manufacturers &amp; Production</span>
            </button>

            <button
              type="button"
              className={`reg-tab-btn ${activeTab === 'industrial' ? 'active' : ''}`}
              onClick={() => setActiveTab('industrial')}
            >
              <Building2 size={16} />
              <span>Industrial Estates &amp; SEZs</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div ref={panelRef} className="tab-content-panel">
          {/* TAB 1: Chinese Companies & Foreign Incorporation */}
          {activeTab === 'chinese' && (
            <div className="card" style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(163, 29, 36, 0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Globe2 size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Foreign Direct Investment Desk
                  </span>
                  <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', margin: '2px 0 0', color: 'var(--navy-900)' }}>
                    Foreign Incorporation &amp; Chinese Enterprise Setup
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: 'var(--text-body)', marginBottom: '24px' }}>
                Pakistan permits 100% foreign equity ownership in manufacturing, trading, and technology sectors. QWCA provides dedicated bilingual advisory for Chinese enterprises, multinationals, and foreign directors seeking to incorporate wholly-owned subsidiaries, branch offices, or joint ventures in Pakistan under the China-Pakistan Economic Corridor (CPEC) framework.
              </p>

              {/* Redesigned Executive CPEC Legal Rights Card */}
              <div className="cpec-legal-feature-box">
                <div className="cpec-box-header">
                  <div className="cpec-icon-badge">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <span className="cpec-badge-tag">CPEC &amp; Foreign Direct Investment (FDI) Protection</span>
                    <h3 className="cpec-box-title">
                      Cross-Border Foreign Investor Legal Rights &amp; Guarantees
                    </h3>
                  </div>
                </div>

                <div className="cpec-rights-grid">
                  <div className="cpec-right-card">
                    <div className="right-card-header">
                      <CheckCircle2 size={18} className="text-primary-check" />
                      <strong className="right-card-title">100% Foreign Equity Ownership</strong>
                    </div>
                    <p className="right-card-desc">
                      No statutory requirement for a local Pakistani shareholder or director in manufacturing, commercial, or IT sectors. Wholly-owned foreign subsidiaries are fully permitted.
                    </p>
                  </div>

                  <div className="cpec-right-card">
                    <div className="right-card-header">
                      <CheckCircle2 size={18} className="text-primary-check" />
                      <strong className="right-card-title">State Bank (SBP) Profit Repatriation</strong>
                    </div>
                    <p className="right-card-desc">
                      Statutory legal guarantee under the Foreign Private Investment Act to convert and repatriate capital, 100% net dividends, and royalties to overseas corporate accounts in foreign currency (USD/RMB).
                    </p>
                  </div>

                  <div className="cpec-right-card">
                    <div className="right-card-header">
                      <CheckCircle2 size={18} className="text-primary-check" />
                      <strong className="right-card-title">Pak-China Bilateral Tax Treaty</strong>
                    </div>
                    <p className="right-card-desc">
                      Reduced withholding tax rates on cross-border dividends, technical advisory remittances, and full protection against domestic double taxation.
                    </p>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '19px', color: 'var(--navy-900)', marginBottom: '16px', marginTop: '28px' }}>
                SECP Statutory Requirements for Foreign Directors
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '32px' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: '15.5px', color: 'var(--navy-900)', marginBottom: '8px' }}>1. Embassy Attestation</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Foreign passport copies and parent company Board Resolutions must be notarized and attested by the Pakistan Embassy/Consulate in the investor’s home country.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: '15.5px', color: 'var(--navy-900)', marginBottom: '8px' }}>2. MOI Security Clearance</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    SECP facilitates security clearance with the Ministry of Interior. Provisional digital incorporation is granted so commercial setup can proceed without delays.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: '15.5px', color: 'var(--navy-900)', marginBottom: '8px' }}>3. Board of Investment Visas</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Assistance with obtaining 1 to 2 year multiple-entry Business &amp; Work Visas for Chinese management and technical personnel through Board of Investment portals.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
                <Link href="/cost-estimator" className="button">
                  <span>Estimate Foreign Setup Cost</span>
                  <ArrowRight size={15} />
                </Link>
                <Link href="/#contact" className="button button-outline">
                  <span>Consult Cross-Border CA Partner</span>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: Domestic Investors & Startups */}
          {activeTab === 'investors' && (
            <div className="card" style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(163, 29, 36, 0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <TrendingUp size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Corporate Structuring
                  </span>
                  <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', margin: '2px 0 0', color: 'var(--navy-900)' }}>
                    Registration for Founders, Startups &amp; SMEs
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: 'var(--text-body)', marginBottom: '24px' }}>
                Whether you are launching a Single Member Company (SMC-Private) or a multi-shareholder Private Limited Company, QWCA guides you through digital name reservation on the SECP eZfile system, drafting bespoke object clauses, capital structuring, and immediate FBR NTN registration.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div style={{ padding: '22px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: '16px', color: 'var(--navy-900)', marginBottom: '8px' }}>Single Member Company (SMC-Pvt)</h4>
                  <ul style={{ fontSize: '13.5px', color: 'var(--text-body)', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
                    <li>100% owned and directed by a single individual</li>
                    <li>Full corporate limited liability shielding personal assets</li>
                    <li>Requires nomination of a legal nominee director</li>
                  </ul>
                </div>

                <div style={{ padding: '22px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: '16px', color: 'var(--navy-900)', marginBottom: '8px' }}>Private Limited Company (Pvt. Ltd.)</h4>
                  <ul style={{ fontSize: '13.5px', color: 'var(--text-body)', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
                    <li>Minimum 2 shareholders and 2 directors</li>
                    <li>The preferred vehicle for equity funding, venture capital, and bank credit</li>
                    <li>Enables distinct classes of shares and corporate ESOPs</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <Link href="/cost-estimator" className="button">
                  <span>Calculate Startup Incorporation Cost</span>
                  <ArrowRight size={15} />
                </Link>
                <Link href="/#contact" className="button button-outline">
                  <span>Request Name Availability Check</span>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: Manufacturers & Production Units */}
          {activeTab === 'manufacturers' && (
            <div className="card" style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(163, 29, 36, 0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Factory size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Industrial Production
                  </span>
                  <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', margin: '2px 0 0', color: 'var(--navy-900)' }}>
                    Manufacturers &amp; Factory Setup Compliance
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: 'var(--text-body)', marginBottom: '24px' }}>
                Establishing a manufacturing unit in Pakistan requires coordination across multiple regulatory authorities beyond standard SECP registration. QWCA assists with the entire lifecycle of manufacturing compliance.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '28px' }}>
                <div style={{ padding: '20px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: '15.5px', color: 'var(--navy-900)', marginBottom: '8px' }}>Sales Tax Manufacturer Status</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Biometric verification, physical premise inspection by FBR Inland Revenue, and registration on Iris as an active manufacturer to claim input sales tax on raw materials.
                  </p>
                </div>

                <div style={{ padding: '20px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: '15.5px', color: 'var(--navy-900)', marginBottom: '8px' }}>Customs WeBOC &amp; Import/Export</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Issuance of WeBOC ID for computerized import of capital machinery and export of finished goods through dry ports and seaports.
                  </p>
                </div>

                <div style={{ padding: '20px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: '15.5px', color: 'var(--navy-900)', marginBottom: '8px' }}>Labor &amp; Social Welfare</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Enrollment with Punjab Employees Social Security Institution (PESSI), Employees’ Old-Age Benefits Institution (EOBI), and Factory Act licensing.
                  </p>
                </div>
              </div>

              <Link href="/#contact" className="button">
                <span>Request Manufacturing Setup Advisory</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {/* TAB 4: Industrial Estates & SEZ Setups */}
          {activeTab === 'industrial' && (
            <div className="card" style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(163, 29, 36, 0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Building2 size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Economic Zones &amp; Concessions
                  </span>
                  <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', margin: '2px 0 0', color: 'var(--navy-900)' }}>
                    Special Economic Zones (SEZ) &amp; FIEDMC Advisory
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: 'var(--text-body)', marginBottom: '24px' }}>
                Faisalabad is Pakistan’s manufacturing nucleus, home to prime Special Economic Zones including <strong>M-3 Industrial City</strong> and <strong>Allama Iqbal Industrial City (AIIC)</strong> under FIEDMC.
              </p>

              {/* Redesigned SEZ Tax Holiday Card */}
              <div className="sez-tax-holiday-box">
                <div className="sez-box-header">
                  <div className="sez-icon-badge">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <span className="sez-badge-tag">SEZ Act 2012 · Statutory Incentive</span>
                    <h3 className="sez-box-title">Statutory 10-Year 100% Income Tax Holiday</h3>
                  </div>
                </div>
                <p className="sez-box-desc">
                  Enterprises approved under the Special Economic Zones Act 2012 enjoy a <strong>100% statutory tax holiday on income</strong> derived from industrial operations for 10 consecutive years, plus <strong>zero customs duty and sales tax</strong> on imported capital plant, machinery, and equipment.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <Link href="/services/sez-advisory" className="button">
                  <span>View Detailed SEZ Services</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Entity Comparison Matrix Table */}
        <div style={{ marginTop: '50px' }}>
          <div className="section-heading" style={{ marginBottom: '24px', textAlign: 'left' }}>
            <span className="eyebrow">Comparative Analysis</span>
            <h3 style={{ fontSize: '24px', color: 'var(--navy-900)' }}>Corporate Entity Comparison at a Glance</h3>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Entity Feature</th>
                  <th>Single Member (SMC-Pvt)</th>
                  <th>Private Limited (Pvt. Ltd.)</th>
                  <th>Foreign Subsidiary (CPEC)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Ownership Structure</strong></td>
                  <td>1 Individual</td>
                  <td>2 to 50 Shareholders</td>
                  <td>100% Foreign Parent Entity</td>
                </tr>
                <tr>
                  <td><strong>Min. Number of Directors</strong></td>
                  <td>1 Director + 1 Nominee</td>
                  <td>2 Directors</td>
                  <td>2 Directors (Foreign or Local)</td>
                </tr>
                <tr>
                  <td><strong>Foreign Ownership</strong></td>
                  <td>Permitted</td>
                  <td>Permitted</td>
                  <td>100% Foreign Equity Allowed</td>
                </tr>
                <tr>
                  <td><strong>Security Clearance</strong></td>
                  <td>Not required for locals</td>
                  <td>Not required for locals</td>
                  <td>Ministry of Interior (MOI)</td>
                </tr>
                <tr>
                  <td><strong>Statutory Audit</strong></td>
                  <td>Required if capital &gt; 1M</td>
                  <td>Required under Companies Act</td>
                  <td>Mandatory Annual CA Audit</td>
                </tr>
                <tr>
                  <td><strong>SECP Registration Time</strong></td>
                  <td>1 to 3 Business Days</td>
                  <td>2 to 4 Business Days</td>
                  <td>3 to 7 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
