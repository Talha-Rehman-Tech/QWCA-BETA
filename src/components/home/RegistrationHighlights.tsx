'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Building2, Globe2, Factory, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RegistrationHighlights() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        '.reg-anim-head',
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
        '.reg-accent-line',
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
        '.reg-highlight-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.reg-highlight-cards-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section registration-highlights-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow reg-anim-head">Enterprise Formation</span>
          <div
            className="reg-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2 className="reg-anim-head">Company Incorporation &amp; Industrial Setup Hub</h2>
          <p className="reg-anim-head">
            From single-member startups to multinational industrial joint ventures, QWCA streamlines your corporate registration on the SECP eZfile system with complete legal compliance.
          </p>
        </div>

        <div className="services reg-highlight-cards-grid">
          <div className="card reg-highlight-card">
            <div className="card-icon" style={{ background: 'rgba(163, 29, 36, 0.1)', color: 'var(--primary)' }}>
              <Building2 size={22} />
            </div>
            <h3>For Domestic Investors &amp; Startups</h3>
            <p>
              Incorporate Single Member Companies (SMC-Pvt) or standard Private Limited entities with tailored Memorandum &amp; Articles of Association (MOA &amp; AOA) and instant corporate NTN.
            </p>
            <ul className="service-highlights">
              <li>Digital SECP eZfile name reservation</li>
              <li>FBR NTN &amp; bank resolution kit</li>
              <li>Shareholders agreement drafting</li>
            </ul>
          </div>

          <div className="card reg-highlight-card">
            <div className="card-icon" style={{ background: 'rgba(163, 29, 36, 0.1)', color: 'var(--primary)' }}>
              <Factory size={22} />
            </div>
            <h3>For Industrialists &amp; Manufacturers</h3>
            <p>
              Comprehensive industrial setup support: factory registration, Chamber of Commerce membership, WeBOC customs import/export ID, and sales tax manufacturing status.
            </p>
            <ul className="service-highlights">
              <li>Sales Tax (STRN) manufacturing profile</li>
              <li>Customs WeBOC user ID clearance</li>
              <li>Labor &amp; Social Security (PESSI/EOBI)</li>
            </ul>
          </div>

          <div className="card reg-highlight-card">
            <div className="card-icon" style={{ background: 'rgba(163, 29, 36, 0.1)', color: 'var(--primary)' }}>
              <Globe2 size={22} />
            </div>
            <h3>Chinese Companies &amp; Foreign Direct Inflows</h3>
            <p>
              Specialized cross-border incorporation: SECP Form 43/44, Ministry of Interior (MOI) security clearance, Board of Investment (BOI) work visas, and CPEC Special Economic Zone entry.
            </p>
            <ul className="service-highlights">
              <li>Foreign director security clearance</li>
              <li>SBP foreign capital inflow &amp; repatriation</li>
              <li>10-year SEZ income tax holiday</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/company-registration" className="button">
            <span>Explore Full Company Registration Guide</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
