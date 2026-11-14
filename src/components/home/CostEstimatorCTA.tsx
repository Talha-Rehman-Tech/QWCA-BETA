'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CostEstimatorCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 35, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo(
        '.cost-cta-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
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
      className="section cta-banner-section"
      style={{ paddingTop: '20px', paddingBottom: '40px' }}
    >
      <div className="container">
        <div
          ref={cardRef}
          style={{
            background: 'linear-gradient(135deg, #141618 0%, #1A1D20 60%, #2a1517 100%)',
            border: '1px solid rgba(163, 29, 36, 0.35)',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 40px',
            color: '#fff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div>
            <div
              className="cost-cta-item"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(163, 29, 36, 0.25)',
                color: '#ff8a8f',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '16px',
                border: '1px solid rgba(163, 29, 36, 0.4)',
              }}
            >
              <Calculator size={15} />
              <span>Interactive Decision Tool</span>
            </div>
            <h2
              className="cost-cta-item"
              style={{ color: '#fff', fontSize: '32px', marginBottom: '14px', lineHeight: 1.25 }}
            >
              Estimate Your Total Company Setup Cost in Under 60 Seconds
            </h2>
            <p
              className="cost-cta-item"
              style={{ color: '#ced4da', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}
            >
              Transparent pricing with no hidden charges. Select your business structure, authorized capital, SECP filing, FBR tax registrations, Chamber of Commerce, and trademark options to view instant statutory vs advisory estimates.
            </p>

            <div
              className="cost-cta-item"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#e9ecef' }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Real-Time Government Fee Slabs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#e9ecef' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Zero Data Stored · 100% Client-Side</span>
              </div>
            </div>

            <Link
              href="/cost-estimator"
              className="button cost-cta-item"
              style={{ padding: '14px 28px', fontSize: '16px' }}
            >
              <span>Launch Cost Calculator</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#adb5bd', fontWeight: 600 }}>
              Included Cost Breakdown Engines
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span>SECP Official Filing Fee</span>
              <strong style={{ color: '#ff8a8f' }}>Computed Live</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span>National Tax Number (NTN) &amp; Bank Resolution</span>
              <strong style={{ color: '#4ade80' }}>Free with Package</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span>Chamber of Commerce &amp; WeBOC Option</span>
              <strong style={{ color: '#e9ecef' }}>Configurable</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span style={{ fontWeight: 600 }}>Summary Schedule</span>
              <span style={{ color: '#ff8a8f', fontSize: '14px', fontWeight: 600 }}>Instant PDF Export</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
