'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSnapshot() {
  const sectionRef = useRef<HTMLElement>(null);
  const m1Ref = useRef<HTMLSpanElement>(null);
  const m2Ref = useRef<HTMLSpanElement>(null);
  const m3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Animate section heading and text
      gsap.fromTo(
        '.about-anim-fade',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
          },
        }
      );

      // Animate decorative accent line expanding
      gsap.fromTo(
        '.about-accent-line',
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

      // Animate checklist items with checkmark pop
      gsap.fromTo(
        '.about-feature-item',
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-features-list',
            start: 'top 85%',
          },
        }
      );

      // Animate metrics card entrance and count-up
      gsap.fromTo(
        '.about-metrics-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-metrics-card',
            start: 'top 85%',
          },
        }
      );

      // Smooth Number Counting on Scroll
      const counter = { n1: 0, n2: 0, n3: 0 };
      gsap.to(counter, {
        n1: 10,
        n2: 500,
        n3: 100,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-metrics-card',
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          if (m1Ref.current) m1Ref.current.textContent = `${Math.floor(counter.n1)}+`;
          if (m2Ref.current) m2Ref.current.textContent = `${Math.floor(counter.n2)}+`;
          if (m3Ref.current) m3Ref.current.textContent = `${Math.floor(counter.n3)}%`;
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section about-snapshot-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="eyebrow about-anim-fade">About Our Practice</span>
            <div
              className="about-accent-line section-accent-line"
              style={{ transformOrigin: 'left center' }}
            />
            <h2 className="about-anim-fade">
              Trusted chartered accountants steering corporate growth with integrity.
            </h2>
            <p className="about-anim-fade">
              Headquartered in Faisalabad’s premier commercial district,{' '}
              <strong>Qummar Waheed Chartered Accountants (QWCA)</strong> is an ICAP-affiliated practicing firm providing end-to-end statutory audit, taxation, SECP corporate secretarial, and business advisory services.
            </p>
            <p className="about-anim-fade">
              We blend deep regulatory knowledge of Pakistani corporate jurisprudence—including the Companies Act 2017, Income Tax Ordinance 2001, and Special Economic Zones Act 2012—with practical commercial insights to safeguard enterprise value and ensure uninterrupted compliance.
            </p>

            <div className="about-features-list">
              <div className="about-feature-item">
                <CheckCircle2 className="about-feature-icon" size={20} />
                <div>
                  <strong>ICAP-Approved Training Organization</strong>
                  <span>Adhering to strict international standards on auditing (ISA) and professional code of ethics.</span>
                </div>
              </div>

              <div className="about-feature-item">
                <CheckCircle2 className="about-feature-icon" size={20} />
                <div>
                  <strong>FBR &amp; Provincial Tax Representation</strong>
                  <span>Direct representation before FBR, PRA, SRB, and appellate authorities for assessments and notices.</span>
                </div>
              </div>

              <div className="about-feature-item">
                <CheckCircle2 className="about-feature-icon" size={20} />
                <div>
                  <strong>Cross-Border &amp; Foreign Investment Desk</strong>
                  <span>Specialized advisory for foreign directors, Chinese joint ventures, and CPEC industrial setups.</span>
                </div>
              </div>
            </div>

            <div className="about-actions about-anim-fade" style={{ marginTop: '24px' }}>
              <Link href="/team" className="button">
                <span>Meet Our Leadership Team</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="about-metrics-card">
            <div className="metric-box">
              <span ref={m1Ref} className="metric-number">
                10+
              </span>
              <span className="metric-label">Years of Practice Experience</span>
            </div>
            <div className="metric-box">
              <span ref={m2Ref} className="metric-number">
                500+
              </span>
              <span className="metric-label">Corporate Clients Served</span>
            </div>
            <div className="metric-box">
              <span ref={m3Ref} className="metric-number">
                100%
              </span>
              <span className="metric-label">Statutory Compliance Track Record</span>
            </div>
            <div className="metric-box">
              <span className="metric-number">10-Year</span>
              <span className="metric-label">SEZ Tax Holiday Structuring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
