'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  MapPin,
  Phone,
  Mail,
  Shield,
  FileText,
  AlertTriangle,
  ArrowRight,
  Printer,
  X
} from 'lucide-react';

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <footer className="site-footer">
        <div className="container footer-container">
          {/* Main 4-Column Grid */}
          <div className="footer-main-grid">
            {/* Col 1: Firm Overview & Affiliation */}
            <div className="footer-col footer-col-brand">
              <Link href="/" className="footer-brand" aria-label="QWCA - Qummar Waheed Chartered Accountants">
                <div className="brand-top">
                  <Image
                    className="brand-mark"
                    src="/assets/logo.png"
                    alt="QWCA Logo"
                    width={32}
                    height={32}
                  />
                  <span className="brand-acronym">QWCA</span>
                </div>
                <span className="brand-fullname">Qummar Waheed Chartered Accountants</span>
              </Link>
              <p className="footer-firm-desc">
                A premier practicing firm affiliated with the Institute of Chartered Accountants of Pakistan (ICAP). Providing audit, assurance, taxation, SECP corporate compliance, and strategic business advisory with uncompromising ethical and professional excellence.
              </p>
              <div className="footer-badges-row">
                <span className="footer-badge">
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                  ICAP Member Firm
                </span>
                <span className="footer-badge">
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                  FBR Authorized Representative
                </span>
              </div>
            </div>

            {/* Col 2: Practice Areas */}
            <div className="footer-col">
              <h4 className="footer-col-title">Practice Areas</h4>
              <ul className="footer-links-list">
                <li><Link href="/services/taxation-advisory">Corporate &amp; Individual Taxation</Link></li>
                <li><Link href="/services/audit-assurance">Statutory &amp; Internal Audit</Link></li>
                <li><Link href="/services/secp-corporate">SECP Compliance &amp; Incorporation</Link></li>
                <li><Link href="/services/sez-advisory">SEZ Tax Concessions Advisory</Link></li>
                <li><Link href="/company-registration">Foreign &amp; Chinese Company Setup</Link></li>
                <li><Link href="/services">Accounting &amp; Financial Outsourcing</Link></li>
              </ul>
            </div>

            {/* Col 3: Key Links & Tools */}
            <div className="footer-col">
              <h4 className="footer-col-title">Advisory &amp; Resources</h4>
              <ul className="footer-links-list">
                <li><Link href="/cost-estimator">Business Cost Estimator</Link></li>
                <li><Link href="/company-registration">Company Registration Portal</Link></li>
                <li><Link href="/publications">Research &amp; Publications</Link></li>
                <li><Link href="/team">Our Chartered Accountants</Link></li>
                <li><Link href="/tax-calculator/salaried">Salaried Tax Calculator</Link></li>
                <li><Link href="/tax-calculator/business">Business &amp; Corporate Tax</Link></li>
                <li><Link href="/tax-calculator/rental">Rental Income Tax</Link></li>
                <li><Link href="/tax-calculator/property">Property &amp; Real Estate Tax</Link></li>
                <li><Link href="/admin" className="text-[#A31D24] font-semibold">⚙️ Tax &amp; Cost Customizer (Admin)</Link></li>
              </ul>
            </div>

            {/* Col 4: Faisalabad Office & Legal */}
            <div className="footer-col">
              <h4 className="footer-col-title">Office &amp; Governance</h4>
              <div className="footer-office-item">
                <MapPin size={15} strokeWidth={2} aria-hidden="true" />
                <span>20 - J Commercial Plaza, 4th Floor, Main Blvd, Wapda City, Faisalabad, Pakistan</span>
              </div>
              <div className="footer-office-item">
                <Phone size={15} strokeWidth={2} aria-hidden="true" />
                <a href="tel:+92415392192">+92-41-5392192</a>
              </div>
              <div className="footer-office-item">
                <Mail size={15} strokeWidth={2} aria-hidden="true" />
                <a href="mailto:info@qwca.pk">info@qwca.pk</a>
              </div>
              <div style={{ marginTop: '10px', marginBottom: '14px' }}>
                <Link
                  href="/locations"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#ff8a8f', fontWeight: 600, textDecoration: 'none' }}
                >
                  <MapPin size={13} />
                  <span>Global Offices: Pakistan · UAE · China</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
              <div className="footer-governance-links">
                <button
                  type="button"
                  className="footer-inline-legal-btn"
                  onClick={() => setPrivacyOpen(true)}
                >
                  <Shield size={14} strokeWidth={2} aria-hidden="true" />
                  <span>View Full Privacy Policy</span>
                </button>
                <button
                  type="button"
                  className="footer-inline-legal-btn"
                  onClick={() => setTermsOpen(true)}
                >
                  <FileText size={14} strokeWidth={2} aria-hidden="true" />
                  <span>Terms of Use &amp; Disclaimers</span>
                </button>
              </div>
            </div>
          </div>

          {/* Prominent Tax Disclaimer Card */}
          <div className="footer-disclaimer-card" id="taxDisclaimerCard">
            <div className="footer-disclaimer-icon" aria-hidden="true">
              <AlertTriangle size={24} strokeWidth={2.2} />
            </div>
            <div className="footer-disclaimer-body">
              <div className="footer-disclaimer-header">
                <h4>Mandatory Notice: Tax Calculations Are Indicative &amp; Not Final</h4>
                <span className="disclaimer-alert-pill">Always Consult a Qualified Accountant</span>
              </div>
              <p>
                All computations generated by the interactive estimators on this website are automated mathematical simulations based on standard provisions of the <strong>Income Tax Ordinance, 2001</strong> and prevailing Finance Acts. <strong>These computations are NOT final tax assessments, do not constitute formal legal or tax opinions, and must not be used as official declarations.</strong>
              </p>
              <p>
                Actual tax liability, admissible deductions, withholding tax adjustments, Minimum Turnover Tax (Sec 113), Alternate Corporate Tax (Sec 113C), and Super Tax (Sec 4C) require scrutiny of audited books, statutory records, and entity classifications. <strong>Always consult a qualified Chartered Accountant at QWCA before making financial decisions or filing statutory returns.</strong>
              </p>
              <div className="footer-disclaimer-actions">
                <Link href="/contact" className="disclaimer-action-btn primary">
                  <span>Book Accountant Consultation</span>
                  <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  className="disclaimer-action-btn secondary"
                  onClick={() => setPrivacyOpen(true)}
                >
                  <span>Read QWCA Privacy Policy</span>
                  <Shield size={14} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="footer-bottom-bar">
            <div className="footer-bottom-left">
              <span className="footer-copyright">&copy; {currentYear} Qummar Waheed Chartered Accountants. All Rights Reserved.</span>
              <span className="footer-credit">
                Designed and Developed by{' '}
                <a
                  href="https://www.linkedin.com/in/talharehman23542/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credit-link"
                >
                  Talha Rehman
                </a>
              </span>
            </div>

            <div className="footer-bottom-nav">
              <button
                type="button"
                className="footer-bottom-link"
                onClick={() => setPrivacyOpen(true)}
              >
                Privacy Policy
              </button>
              <span className="footer-sep">&bull;</span>
              <button
                type="button"
                className="footer-bottom-link"
                onClick={() => setTermsOpen(true)}
              >
                Terms of Use
              </button>
              <span className="footer-sep">&bull;</span>
              <Link href="/cost-estimator" className="footer-bottom-link">Cost Calculator</Link>
              <span className="footer-sep">&bull;</span>
              <Link href="/contact" className="footer-bottom-link">Contact</Link>
              <span className="footer-sep">&bull;</span>
              <Link href="/admin" className="footer-bottom-link font-medium hover:text-[#A31D24]">Admin Portal</Link>
            </div>

            <div className="footer-social-links" aria-label="Official Social Channels">
              <a
                href="https://www.linkedin.com/company/qummar-waheed-chartered-accountants/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon linkedin"
                title="Follow QWCA on LinkedIn"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.46 1.46 0 0 0-2.91 0c0 .8.65 1.45 1.46 1.45m1.37 9.74v-8.37H5.09v8.37z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/p/Qummar-Waheed-Chartered-Accountants-61558036131738/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon facebook"
                title="Visit QWCA on Facebook"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {privacyOpen && (
        <div className="policy-modal active" role="dialog" aria-modal="true">
          <div className="policy-modal-dialog">
            <div className="policy-modal-header">
              <div className="policy-modal-title-wrap">
                <span className="policy-modal-badge">
                  <Shield size={14} strokeWidth={2.5} />
                  Official Privacy &amp; Data Protection Policy
                </span>
                <h3 className="policy-modal-title">Privacy Policy</h3>
                <p className="policy-modal-subtitle">
                  Qummar Waheed Chartered Accountants (QWCA) · Effective Date: July 1, 2024 · Last Revised: Tax Year 2026–2027
                </p>
              </div>
              <div className="policy-modal-actions">
                <button type="button" className="policy-modal-btn" onClick={handlePrint} title="Print this Privacy Policy">
                  <Printer size={14} strokeWidth={2} />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  className="policy-modal-close"
                  aria-label="Close dialog"
                  onClick={() => setPrivacyOpen(false)}
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="policy-modal-body">
              <div className="policy-callout success">
                <Shield size={20} strokeWidth={2} />
                <div>
                  <strong>100% Private Client-Side Tax Calculators:</strong> All figures entered into the calculators on this website run strictly in your local browser. No financial data, salary amounts, profits, or rent numbers are ever transmitted, logged, or stored on our servers.
                </div>
              </div>

              <div className="policy-callout warning">
                <AlertTriangle size={20} strokeWidth={2} />
                <div>
                  <strong>Calculations Are Indicative &amp; Not Final:</strong> Online tax calculations are automated estimations based on general statutory slabs of the Income Tax Ordinance, 2001. They do NOT constitute formal legal, accounting, or tax opinions. You must always consult a qualified Chartered Accountant before making any financial decisions.
                </div>
              </div>

              <h4>1. Information We Collect</h4>
              <p>
                When you submit an inquiry through our contact form, we collect your name, email address, phone number, and brief description of your engagement requirement. This information is strictly used to evaluate and reply to your inquiry.
              </p>

              <h4>2. Professional Confidentiality</h4>
              <p>
                As members of the Institute of Chartered Accountants of Pakistan (ICAP), all partners and staff at QWCA are bound by the ICAP Code of Ethics regarding strict confidentiality and protection of client affairs and financial information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Use Modal */}
      {termsOpen && (
        <div className="policy-modal active" role="dialog" aria-modal="true">
          <div className="policy-modal-dialog">
            <div className="policy-modal-header">
              <div className="policy-modal-title-wrap">
                <span className="policy-modal-badge">
                  <FileText size={14} strokeWidth={2.5} />
                  Professional Engagement Terms
                </span>
                <h3 className="policy-modal-title">Terms of Use &amp; Disclaimers</h3>
                <p className="policy-modal-subtitle">
                  QWCA Practice Guidelines · Chartered Accountants Act &amp; ICAP Regulations
                </p>
              </div>
              <div className="policy-modal-actions">
                <button type="button" className="policy-modal-btn" onClick={handlePrint} title="Print Terms">
                  <Printer size={14} strokeWidth={2} />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  className="policy-modal-close"
                  aria-label="Close dialog"
                  onClick={() => setTermsOpen(false)}
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="policy-modal-body">
              <h4>1. No Client-Practitioner Relationship Formed via Website</h4>
              <p>
                Visiting this website, using interactive calculators, or sending an electronic message does not by itself establish a formal Chartered Accountant-Client relationship. An engagement is only formalized upon execution of an official Engagement Letter signed by a practicing Partner of QWCA.
              </p>

              <h4>2. Limitation of Liability</h4>
              <p>
                While QWCA makes every reasonable effort to keep statutory tax rates and legal references up to date in accordance with the latest Finance Acts and SROs, fiscal laws in Pakistan change frequently. QWCA disclaims all liability for any actions taken or not taken based on the general contents of this site without independent professional counsel.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

