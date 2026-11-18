'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck, Calculator, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TaxComplianceOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        '.tax-overview-anim-head',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
          },
        }
      );

      // Section line expansion
      gsap.fromTo(
        '.tax-overview-accent-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
          },
        }
      );

      // Cards stagger
      gsap.fromTo(
        '.tax-overview-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.tax-overview-cards-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section tax-overview-section"
      style={{ background: 'var(--bg-subtle)' }}
    >
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow tax-overview-anim-head">Corporate Fiscal Advisory</span>
          <div
            className="tax-overview-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2 className="tax-overview-anim-head">Corporate Tax &amp; Regulatory Compliance Mastery</h2>
          <p className="tax-overview-anim-head">
            Ensuring precision compliance across the Income Tax Ordinance 2001, provincial sales tax regimes, and SECP regulations to protect your enterprise from audits, surcharges, and penal proceedings.
          </p>
        </div>

        <div
          className="services tax-overview-cards-grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
        >
          <div className="card tax-overview-card">
            <div className="card-icon" style={{ background: 'rgba(163, 29, 36, 0.1)', color: 'var(--primary)' }}>
              <ShieldCheck size={22} />
            </div>
            <h3>Direct Taxation &amp; Iris E-Filing</h3>
            <p>
              Strategic corporate tax preparation, statutory reconciliations, and representation for annual income tax returns. We ensure full documentation of admissible business deductions and depreciation allowances.
            </p>
            <ul className="service-highlights">
              <li>Annual corporate &amp; SME return filing</li>
              <li>Advance tax quarterly estimations (Sec 147)</li>
              <li>Tax audit scrutiny defense before FBR</li>
            </ul>
          </div>

          <div className="card tax-overview-card">
            <div className="card-icon" style={{ background: 'rgba(163, 29, 36, 0.1)', color: 'var(--primary)' }}>
              <FileCheck size={22} />
            </div>
            <h3>Sales Tax &amp; Provincial PRAs</h3>
            <p>
              Navigating federal sales tax on goods (FBR) and provincial sales tax on services (PRA Punjab, SRB Sindh, KPRA). Full electronic invoice verification and input tax credit optimization.
            </p>
            <ul className="service-highlights">
              <li>Monthly sales tax return e-filing</li>
              <li>Input tax reconciliation &amp; refund claims</li>
              <li>Point of Sale (POS) integration support</li>
            </ul>
          </div>

          <div className="card tax-overview-card">
            <div className="card-icon" style={{ background: 'rgba(163, 29, 36, 0.1)', color: 'var(--primary)' }}>
              <Calculator size={22} />
            </div>
            <h3>Super Tax &amp; Minimum Tax (Sec 113)</h3>
            <p>
              Expert assessment of Minimum Turnover Tax (Section 113), Alternate Corporate Tax (Section 113C), and progressive Super Tax under Section 4C for high-net-worth companies and AOPs.
            </p>
            <ul className="service-highlights">
              <li>Super Tax (Sec 4C) bracket simulations</li>
              <li>Alternate Corporate Tax (ACT) comparisons</li>
              <li>Turnover tax minimum liability calculations</li>
            </ul>
          </div>

          <div className="card tax-overview-card">
            <div className="card-icon" style={{ background: 'rgba(163, 29, 36, 0.1)', color: 'var(--primary)' }}>
              <Calendar size={22} />
            </div>
            <h3>Withholding Tax Agent Compliance</h3>
            <p>
              Guidance for designated withholding agents under Sections 149, 151, 153, 155, and 236. Complete electronic WHT statements and exemption certificate procurement under Section 159.
            </p>
            <ul className="service-highlights">
              <li>Bi-annual / monthly WHT return filing</li>
              <li>Sec 159 zero-rate exemption certificates</li>
              <li>Vendor WHT deduction audit verification</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/services/taxation-advisory" className="button">
            <span>Learn More About Tax Practice</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
