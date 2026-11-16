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
          className="cost-cta-card-wrap"
        >
          <div className="cost-cta-content-col">
            <div
              className="cost-cta-item cost-cta-badge"
            >
              <Calculator size={15} />
              <span>Interactive Decision Tool</span>
            </div>
            <h2
              className="cost-cta-item cost-cta-title"
            >
              Estimate Your Total Company Setup Cost in Under 60 Seconds
            </h2>
            <p
              className="cost-cta-item cost-cta-desc"
            >
              Transparent pricing with no hidden charges. Select your business structure, authorized capital, SECP filing, FBR tax registrations, Chamber of Commerce, and trademark options to view instant statutory vs advisory estimates.
            </p>

            <div
              className="cost-cta-item cost-cta-features"
            >
              <div className="cost-cta-feature-pill">
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Real-Time Government Fee Slabs</span>
              </div>
              <div className="cost-cta-feature-pill">
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Zero Data Stored · 100% Client-Side</span>
              </div>
            </div>

            <Link
              href="/cost-estimator"
              className="button cost-cta-item cost-cta-launch-btn"
            >
              <span>Launch Cost Calculator</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="cost-cta-box">
            <div className="cost-cta-box-header">
              Included Cost Breakdown Engines
            </div>
            <div className="cost-cta-row">
              <span className="cost-cta-row-label">SECP Official Filing Fee</span>
              <strong className="cost-cta-tag-red">Computed Live</strong>
            </div>
            <div className="cost-cta-row">
              <span className="cost-cta-row-label">National Tax Number (NTN) &amp; Bank Resolution</span>
              <strong className="cost-cta-tag-green">Free with Package</strong>
            </div>
            <div className="cost-cta-row">
              <span className="cost-cta-row-label">Chamber of Commerce &amp; WeBOC Option</span>
              <strong className="cost-cta-tag-gray">Configurable</strong>
            </div>
            <div className="cost-cta-row cost-cta-row-last">
              <span className="cost-cta-row-label" style={{ fontWeight: 600 }}>Summary Schedule</span>
              <span className="cost-cta-tag-pdf">Instant PDF Export</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
