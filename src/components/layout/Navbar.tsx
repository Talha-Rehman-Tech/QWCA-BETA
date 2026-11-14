'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ArrowRight,
  FileText,
  ShieldCheck,
  Briefcase,
  Globe,
  Building2,
  Calculator,
  PhoneCall,
  Mail,
  CalendarCheck
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import Topbar from './Topbar';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'services' | 'registration' | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Scroll effect for dynamic header elevation & glass blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click or touch
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const closeAll = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (e: React.MouseEvent, name: 'services' | 'registration') => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleMouseEnter = (name: 'services' | 'registration') => {
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      setOpenDropdown(name);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      setOpenDropdown(null);
    }
  };

  // Active path helpers
  const isServicesActive = pathname.startsWith('/services');
  const isRegistrationActive = pathname === '/company-registration' || pathname === '/cost-estimator';
  const isTaxCalculatorActive = pathname === '/tax-calculator';
  const isTeamActive = pathname === '/team';
  const isPublicationsActive = pathname === '/publications';

  return (
    <div className={`fixed-header-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
      <Topbar isScrolled={isScrolled} />
      <header className={`header ${isScrolled ? 'is-scrolled' : ''}`} ref={headerRef}>
        <div className="container nav">
        {/* Brand Suite: Architectural Executive Badge */}
        <Link
          href="/"
          className="brand-suite"
          aria-label="QWCA - Qummar Waheed Chartered Accountants"
          onClick={closeAll}
        >
          <div className="brand-emblem-chamber">
            <Image
              className="brand-mark-img"
              src="/assets/logo.png"
              alt="QWCA Emblem"
              width={38}
              height={38}
              priority
            />
          </div>
          <div className="brand-identity-stack">
            <div className="brand-primary-row">
              <span className="brand-acronym-bold">QWCA</span>
              <span className="brand-icap-tag">ICAP</span>
            </div>
            <span className="brand-firm-name">Qummar Waheed</span>
            <span className="brand-firm-sub">Chartered Accountants</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links-desktop" aria-label="Main navigation">
          <Link
            href="/"
            onClick={closeAll}
            className={`nav-link-item ${pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>

          {/* 1. Services Dropdown */}
          <div
            className={`nav-dropdown-wrapper ${openDropdown === 'services' ? 'is-open' : ''}`}
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`nav-dropdown-trigger ${openDropdown === 'services' ? 'open' : ''} ${isServicesActive ? 'active' : ''}`}
              onClick={(e) => handleDropdownToggle(e, 'services')}
              aria-expanded={openDropdown === 'services'}
            >
              <span>Services</span>
              <ChevronDown
                size={14}
                className={`dropdown-chevron ${openDropdown === 'services' ? 'rotated' : ''}`}
              />
            </button>

            <div className={`nav-dropdown-menu ${openDropdown === 'services' ? 'show' : ''}`}>
              <div className="dropdown-header">Practice Areas &amp; Advisory</div>

              <Link
                href="/services/taxation-advisory"
                className="dropdown-item"
                onClick={closeAll}
              >
                <div className="dropdown-icon-box">
                  <FileText size={16} />
                </div>
                <div className="dropdown-text-wrap">
                  <div className="dropdown-item-title">Taxation &amp; Advisory</div>
                  <div className="dropdown-item-desc">Corporate tax, PRA/FBR returns &amp; appeals</div>
                </div>
              </Link>

              <Link
                href="/services/audit-assurance"
                className="dropdown-item"
                onClick={closeAll}
              >
                <div className="dropdown-icon-box">
                  <ShieldCheck size={16} />
                </div>
                <div className="dropdown-text-wrap">
                  <div className="dropdown-item-title">Audit &amp; Assurance</div>
                  <div className="dropdown-item-desc">Statutory audits under IFRS &amp; ISA</div>
                </div>
              </Link>

              <Link
                href="/services/secp-corporate"
                className="dropdown-item"
                onClick={closeAll}
              >
                <div className="dropdown-icon-box">
                  <Briefcase size={16} />
                </div>
                <div className="dropdown-text-wrap">
                  <div className="dropdown-item-title">SECP &amp; Corporate Services</div>
                  <div className="dropdown-item-desc">Company incorporation &amp; annual compliance</div>
                </div>
              </Link>

              <Link
                href="/services/sez-advisory"
                className="dropdown-item"
                onClick={closeAll}
              >
                <div className="dropdown-icon-box">
                  <Globe size={16} />
                </div>
                <div className="dropdown-text-wrap">
                  <div className="dropdown-item-title">SEZ Advisory</div>
                  <div className="dropdown-item-desc">Special Economic Zones 10-yr tax holidays</div>
                </div>
              </Link>

              <div className="dropdown-divider"></div>
              <Link href="/services" className="dropdown-footer-link" onClick={closeAll}>
                <span>View All Practice Areas</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* 2. Registration Dropdown */}
          <div
            className={`nav-dropdown-wrapper ${openDropdown === 'registration' ? 'is-open' : ''}`}
            onMouseEnter={() => handleMouseEnter('registration')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`nav-dropdown-trigger ${openDropdown === 'registration' ? 'open' : ''} ${isRegistrationActive ? 'active' : ''}`}
              onClick={(e) => handleDropdownToggle(e, 'registration')}
              aria-expanded={openDropdown === 'registration'}
            >
              <span>Registration</span>
              <ChevronDown
                size={14}
                className={`dropdown-chevron ${openDropdown === 'registration' ? 'rotated' : ''}`}
              />
            </button>

            <div className={`nav-dropdown-menu ${openDropdown === 'registration' ? 'show' : ''}`} style={{ minWidth: '350px' }}>
              <div className="dropdown-header">Enterprise Formation &amp; Planning</div>

              <Link
                href="/company-registration"
                className="dropdown-item"
                onClick={closeAll}
              >
                <div className="dropdown-icon-box primary-tint">
                  <Building2 size={16} />
                </div>
                <div className="dropdown-text-wrap">
                  <div className="dropdown-item-title flex-title">
                    <span>Company Registration</span>
                    <span className="micro-badge cpec-badge">CPEC Desk</span>
                  </div>
                  <div className="dropdown-item-desc">
                    SECP incorporation for Local &amp; Chinese Enterprises
                  </div>
                </div>
              </Link>

              <Link
                href="/cost-estimator"
                className="dropdown-item"
                onClick={closeAll}
              >
                <div className="dropdown-icon-box primary-tint">
                  <Calculator size={16} />
                </div>
                <div className="dropdown-text-wrap">
                  <div className="dropdown-item-title flex-title">
                    <span>Cost Estimator</span>
                    <span className="micro-badge live-badge">Interactive</span>
                  </div>
                  <div className="dropdown-item-desc">
                    Calculate official SECP, legal &amp; advisory fees in real time
                  </div>
                </div>
              </Link>

              <div className="dropdown-divider"></div>
              <Link href="/company-registration" className="dropdown-footer-link" onClick={closeAll}>
                <span>Explore Incorporation Guide</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <Link
            href="/tax-calculator"
            onClick={closeAll}
            className={`nav-link-item ${isTaxCalculatorActive ? 'active' : ''}`}
          >
            <span>Tax Calculator</span>
          </Link>

          <Link
            href="/team"
            onClick={closeAll}
            className={`nav-link-item ${isTeamActive ? 'active' : ''}`}
          >
            Team
          </Link>

          <Link
            href="/publications"
            onClick={closeAll}
            className={`nav-link-item ${isPublicationsActive ? 'active' : ''}`}
          >
            Publications
          </Link>

          <Link
            href="/#contact"
            onClick={closeAll}
            className="nav-link-item"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTA Action Button & Language Switcher */}
        <div className="nav-desktop-action" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LanguageSelector variant="navbar" />
          <Link href="/#contact" className="nav-consultation-btn">
            <CalendarCheck size={14} />
            <span>Book Consultation</span>
            <ArrowRight size={13} className="btn-arrow" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={`nav-toggle ${mobileOpen ? 'active' : ''}`}
          id="navToggle"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="navMobileDrawer"
          onClick={() => {
            setMobileOpen((prev) => !prev);
            setOpenDropdown(null);
          }}
        >
          <span className="nav-toggle-icon">
            <span className="bar bar-top"></span>
            <span className="bar bar-mid"></span>
            <span className="bar bar-bot"></span>
          </span>
        </button>

        {/* Mobile Slide-down Drawer Navigation */}
        <div
          className={`nav-mobile-drawer ${mobileOpen ? 'active' : ''}`}
          id="navMobileDrawer"
          aria-label="Mobile navigation menu"
        >
          <div className="drawer-inner">
            <Link
              href="/"
              onClick={closeAll}
              className={`drawer-link ${pathname === '/' ? 'active' : ''}`}
            >
              <span>Home</span>
            </Link>

            {/* Mobile Services Accordion */}
            <div className={`drawer-accordion ${openDropdown === 'services' ? 'expanded' : ''}`}>
              <button
                type="button"
                className={`drawer-accordion-btn ${openDropdown === 'services' ? 'active' : ''} ${isServicesActive ? 'highlight' : ''}`}
                onClick={(e) => handleDropdownToggle(e, 'services')}
              >
                <span>Services</span>
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${openDropdown === 'services' ? 'rotated' : ''}`}
                />
              </button>

              <div className={`drawer-accordion-content ${openDropdown === 'services' ? 'show' : ''}`}>
                <Link
                  href="/services/taxation-advisory"
                  className="drawer-subitem"
                  onClick={closeAll}
                >
                  <FileText size={15} className="drawer-subitem-icon" />
                  <div>
                    <div className="drawer-subitem-title">Taxation &amp; Advisory</div>
                    <div className="drawer-subitem-desc">Income &amp; sales tax, PRA/FBR returns</div>
                  </div>
                </Link>

                <Link
                  href="/services/audit-assurance"
                  className="drawer-subitem"
                  onClick={closeAll}
                >
                  <ShieldCheck size={15} className="drawer-subitem-icon" />
                  <div>
                    <div className="drawer-subitem-title">Audit &amp; Assurance</div>
                    <div className="drawer-subitem-desc">Statutory audits under IFRS &amp; ISA</div>
                  </div>
                </Link>

                <Link
                  href="/services/secp-corporate"
                  className="drawer-subitem"
                  onClick={closeAll}
                >
                  <Briefcase size={15} className="drawer-subitem-icon" />
                  <div>
                    <div className="drawer-subitem-title">SECP &amp; Corporate Services</div>
                    <div className="drawer-subitem-desc">Company formation &amp; annual compliance</div>
                  </div>
                </Link>

                <Link
                  href="/services/sez-advisory"
                  className="drawer-subitem"
                  onClick={closeAll}
                >
                  <Globe size={15} className="drawer-subitem-icon" />
                  <div>
                    <div className="drawer-subitem-title">SEZ Advisory</div>
                    <div className="drawer-subitem-desc">10-year tax holiday &amp; duty exemptions</div>
                  </div>
                </Link>

                <Link href="/services" className="drawer-view-all" onClick={closeAll}>
                  <span>Explore All Services</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Mobile Registration Accordion */}
            <div className={`drawer-accordion ${openDropdown === 'registration' ? 'expanded' : ''}`}>
              <button
                type="button"
                className={`drawer-accordion-btn ${openDropdown === 'registration' ? 'active' : ''} ${isRegistrationActive ? 'highlight' : ''}`}
                onClick={(e) => handleDropdownToggle(e, 'registration')}
              >
                <span>Registration</span>
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${openDropdown === 'registration' ? 'rotated' : ''}`}
                />
              </button>

              <div className={`drawer-accordion-content ${openDropdown === 'registration' ? 'show' : ''}`}>
                <Link
                  href="/company-registration"
                  className="drawer-subitem"
                  onClick={closeAll}
                >
                  <Building2 size={15} className="drawer-subitem-icon" />
                  <div>
                    <div className="drawer-subitem-title flex-title">
                      <span>Company Registration</span>
                      <span className="micro-badge cpec-badge">CPEC Desk</span>
                    </div>
                    <div className="drawer-subitem-desc">
                      Investors, Industrial &amp; Chinese incorporation
                    </div>
                  </div>
                </Link>

                <Link
                  href="/cost-estimator"
                  className="drawer-subitem"
                  onClick={closeAll}
                >
                  <Calculator size={15} className="drawer-subitem-icon" />
                  <div>
                    <div className="drawer-subitem-title flex-title">
                      <span>Cost Estimator</span>
                      <span className="micro-badge live-badge">Live Tool</span>
                    </div>
                    <div className="drawer-subitem-desc">
                      Real-time fee calculation for setup &amp; filing
                    </div>
                  </div>
                </Link>

                <Link href="/company-registration" className="drawer-view-all" onClick={closeAll}>
                  <span>View Full Incorporation Guide</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <Link
              href="/tax-calculator"
              onClick={closeAll}
              className={`drawer-link ${isTaxCalculatorActive ? 'active' : ''}`}
            >
              <span>Tax Calculator</span>
              <span className="drawer-pill-highlight">FY 2024-25</span>
            </Link>

            <Link
              href="/team"
              onClick={closeAll}
              className={`drawer-link ${isTeamActive ? 'active' : ''}`}
            >
              <span>Our Team</span>
            </Link>

            <Link
              href="/publications"
              onClick={closeAll}
              className={`drawer-link ${isPublicationsActive ? 'active' : ''}`}
            >
              <span>Publications &amp; Research</span>
            </Link>

            <Link
              href="/#contact"
              onClick={closeAll}
              className="drawer-link"
            >
              <span>Contact Office</span>
            </Link>

            {/* Mobile Language Selector */}
            <LanguageSelector variant="mobile" />

            {/* Mobile Drawer Footer with Contact Actions */}
            <div className="drawer-footer-actions">
              <Link
                href="/#contact"
                className="button drawer-cta-button"
                onClick={closeAll}
              >
                <CalendarCheck size={16} />
                <span>Schedule a Consultation</span>
              </Link>

              <div className="drawer-quick-contact-bar">
                <a href="tel:+92415392192" className="drawer-contact-chip">
                  <PhoneCall size={13} />
                  <span>Call +92-41-5392192</span>
                </a>
                <a href="mailto:info@qwca.pk" className="drawer-contact-chip">
                  <Mail size={13} />
                  <span>info@qwca.pk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
);
}
