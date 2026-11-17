'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, Building2, Home, Landmark, ArrowRight, Calculator } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TaxCalculatorCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        '.tax-cta-anim-head',
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
        '.tax-cta-accent-line',
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

      // 3 Category Cards entrance
      gsap.fromTo(
        '.tax-calc-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.tax-calc-cards-grid',
            start: 'top 85%',
          },
        }
      );

      // Bottom banner reveal
      gsap.fromTo(
        '.tax-portal-banner',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.tax-portal-banner',
            start: 'top 90%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section tax-calc-cta-section" id="tax-calculator">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow tax-cta-anim-head">Interactive Tax Tools</span>
          <div
            className="tax-cta-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2 className="tax-cta-anim-head">Calculate Your FBR Income Tax for Tax Year 2026–2027</h2>
          <p className="tax-cta-anim-head">
            Automated, 100% private client-side simulations pursuant to official FBR tax schedules and the Income Tax Ordinance, 2001. Choose your category to launch the full calculator:
          </p>
        </div>

        {/* 4 Dedicated Category Cards */}
        <div
          className="services tax-calc-cards-grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: '36px', gap: '20px' }}
        >
          {/* Card 1: Salaried Individuals */}
          <article className="card tax-calc-card" style={{ display: 'flex', flexDirection: 'column', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(163, 29, 36, 0.12)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={22} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  background: '#e9ecef',
                  color: 'var(--navy-900)',
                }}
              >
                Section 149 WHT
              </span>
            </div>

            <h3 style={{ fontSize: '19px', marginBottom: '10px', color: 'var(--navy-900)' }}>
              Salaried Tax Calculator
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '18px', flexGrow: 1 }}>
              Instantly compute monthly tax deductions, net in-pocket salary, and effective tax rates with live highlighting on official FBR salary slabs.
            </p>

            <ul className="service-highlights" style={{ marginBottom: '22px' }}>
              <li>First Rs. 600,000 annual salary 100% tax-free</li>
              <li>Monthly &amp; annual quick presets (50k to 500k)</li>
              <li>Multi-year historical comparisons (TY23 to TY27)</li>
            </ul>

            <Link href="/tax-calculator/salaried" className="button" style={{ justifyContent: 'center' }}>
              <span>Calculate Salary Tax</span>
              <ArrowRight size={15} />
            </Link>
          </article>

          {/* Card 2: Business & Corporate */}
          <article className="card tax-calc-card" style={{ display: 'flex', flexDirection: 'column', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(163, 29, 36, 0.12)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={22} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                }}
              >
                Corporate &amp; AOP
              </span>
            </div>

            <h3 style={{ fontSize: '19px', marginBottom: '10px', color: 'var(--navy-900)' }}>
              Business &amp; Corporate Tax
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '18px', flexGrow: 1 }}>
              Simulate profit after tax, 29% corporate flat rate, 20% small company incentives, 40% professional firm AOP cap, and Super Tax brackets.
            </p>

            <ul className="service-highlights" style={{ marginBottom: '22px' }}>
              <li>Super Tax (Section 4C) progressive brackets (1–10%)</li>
              <li>10% High-Income Surcharge (Sec 4AB) on profit &gt; 10M</li>
              <li>SME manufacturing concessions (7.5% and 15%)</li>
            </ul>

            <Link href="/tax-calculator/business" className="button" style={{ justifyContent: 'center' }}>
              <span>Calculate Business Tax</span>
              <ArrowRight size={15} />
            </Link>
          </article>

          {/* Card 3: Rental Property */}
          <article className="card tax-calc-card" style={{ display: 'flex', flexDirection: 'column', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(163, 29, 36, 0.12)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Home size={22} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  background: '#e9ecef',
                  color: 'var(--navy-900)',
                }}
              >
                Section 155
              </span>
            </div>

            <h3 style={{ fontSize: '19px', marginBottom: '10px', color: 'var(--navy-900)' }}>
              Rental Property Tax
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '18px', flexGrow: 1 }}>
              Compute withholding tax on property rentals under Section 155 for individual, AOP, and corporate landlords with monthly take-home projections.
            </p>

            <ul className="service-highlights" style={{ marginBottom: '22px' }}>
              <li>First Rs. 300,000 annual rental income is tax-free</li>
              <li>Progressive slabs (5%, 10%, 25%) for individuals</li>
              <li>Flat 15% statutory withholding for corporate landlords</li>
            </ul>

            <Link href="/tax-calculator/rental" className="button" style={{ justifyContent: 'center' }}>
              <span>Calculate Rental Tax</span>
              <ArrowRight size={15} />
            </Link>
          </article>

          {/* Card 4: Property & Real Estate */}
          <article className="card tax-calc-card" style={{ display: 'flex', flexDirection: 'column', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(163, 29, 36, 0.12)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Landmark size={22} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary)',
                  color: '#ffffff',
                }}
              >
                236K / 236C / CGT
              </span>
            </div>

            <h3 style={{ fontSize: '19px', marginBottom: '10px', color: 'var(--navy-900)' }}>
              Property Tax Calculator
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '18px', flexGrow: 1 }}>
              Official real estate transfer levies: Buyer purchase tax (236K), Seller advance tax (236C), Capital Gains Tax (Sec 37), and Provincial Stamp Duty.
            </p>

            <ul className="service-highlights" style={{ marginBottom: '22px' }}>
              <li>Buyer purchase tax: 1.25% filer vs 10.5%–18.5% non-filer</li>
              <li>Seller advance tax: 2.75% filer vs 11.5% non-filer</li>
              <li>Holding schedule CGT on open plots, houses &amp; flats</li>
            </ul>

            <Link href="/tax-calculator/property" className="button" style={{ justifyContent: 'center' }}>
              <span>Calculate Property Tax</span>
              <ArrowRight size={15} />
            </Link>
          </article>
        </div>

        {/* Bottom Banner directing audience to the dedicated portal */}
        <div
          className="tax-portal-banner"
          style={{
            marginTop: '36px',
            padding: '28px 36px',
            background: 'var(--dark-slate)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            color: '#fff',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff8a8f', marginBottom: '8px' }}>
              <Calculator size={18} />
              <strong style={{ fontSize: '16px' }}>Need customized enterprise tax planning or statutory filing support?</strong>
            </div>
            <p style={{ margin: 0, fontSize: '14.5px', color: '#dee2e6', lineHeight: 1.5 }}>
              Our qualified chartered accountants provide FBR advance tax credit assessments, withholding reconciliation certificates, and statutory audit representation.
            </p>
          </div>
          <div>
            <Link href="/#contact" className="button" style={{ whiteSpace: 'nowrap' }}>
              <span>Book Tax Consultation</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
