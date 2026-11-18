'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, FileText, ArrowRight, Globe2, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RecentPublications() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        '.pub-anim-head',
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
        '.pub-accent-line',
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
        '.publication-domain-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.publication-cards-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const domains = [
    {
      id: 'taxation',
      category: 'Taxation & Fiscal Law',
      badge: 'Finance Act',
      icon: FileText,
      title: 'Statutory Tax Commentary & Slabs Manuals',
      desc: 'Annual Finance Act analysis, salaried tax brackets, Super Tax (Section 4C), and provincial sales tax (PRA/SRB) filing compliance.',
      link: '/publications',
    },
    {
      id: 'corporate',
      category: 'Corporate Governance',
      badge: 'Companies Act 2017',
      icon: ShieldCheck,
      title: 'SECP Director & Secretarial Compliance Guide',
      desc: 'Statutory annual return mandates, Form A/29, ultimate beneficial ownership (UBO) filings, and board resolution standards.',
      link: '/publications',
    },
    {
      id: 'foreign',
      category: 'Cross-Border Investment',
      badge: 'CPEC & Foreign Desk',
      icon: Globe2,
      title: 'Foreign Direct Investment & Chinese Enterprise Manual',
      desc: 'SECP foreign director clearance, Board of Investment (BOI) visas, SBP profit repatriation, and 10-year SEZ income tax holidays.',
      link: '/publications',
    },
    {
      id: 'audit',
      category: 'Assurance & Reporting',
      badge: 'IFRS Standards',
      icon: BookOpen,
      title: 'Audit Readiness & Financial Internal Controls',
      desc: 'Best practices for CFOs and finance managers to align financial statements with IFRS for SMEs and ensure swift external audits.',
      link: '/publications',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section recent-publications-section"
      style={{ background: 'var(--bg-subtle)' }}
      id="publications-preview"
    >
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow pub-anim-head">Thought Leadership &amp; Research</span>
          <div
            className="pub-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2 className="pub-anim-head">Authoritative Research, Tax Manuals &amp; Corporate Briefs</h2>
          <p className="pub-anim-head">
            Our practicing chartered accountants author in-depth regulatory manuals, Finance Act commentaries, and foreign investor roadmaps to keep corporate leaders ahead of statutory changes.
          </p>
        </div>

        {/* 4 Knowledge Domain Showcase Cards */}
        <div
          className="services publication-cards-grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', marginTop: '36px' }}
        >
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <article
                key={domain.id}
                className="card publication-domain-card"
                style={{ display: 'flex', flexDirection: 'column', padding: '28px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(163, 29, 36, 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: '#e9ecef',
                      color: 'var(--navy-900)',
                    }}
                  >
                    {domain.badge}
                  </span>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  {domain.category}
                </div>

                <h3 style={{ fontSize: '17px', lineHeight: 1.4, marginBottom: '10px', color: 'var(--navy-900)' }}>
                  {domain.title}
                </h3>

                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '20px', flexGrow: 1 }}>
                  {domain.desc}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  <Link
                    href={domain.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--primary)',
                    }}
                  >
                    <span>Read Brief &amp; Download</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/publications" className="button">
            <span>Access All Research &amp; Bulletins</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
