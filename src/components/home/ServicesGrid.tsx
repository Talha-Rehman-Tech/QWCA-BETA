'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, Briefcase, Globe, ArrowRight } from 'lucide-react';
import { servicesData } from '@/data/services';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        '.services-anim-heading',
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
        '.services-accent-line',
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

      // Staggered cards entrance
      gsap.fromTo(
        '.service-card-enhanced',
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-cards-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText size={22} />;
      case 'ShieldCheck':
        return <ShieldCheck size={22} />;
      case 'Briefcase':
        return <Briefcase size={22} />;
      case 'Globe':
        return <Globe size={22} />;
      default:
        return <FileText size={22} />;
    }
  };

  return (
    <section ref={sectionRef} className="section" id="services">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow services-anim-heading">How We Can Help</span>
          <div
            className="services-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2 className="services-anim-heading">Our Services</h2>
          <p className="services-anim-heading">
            Practical, professional support to ensure compliance, mitigate financial risks, and plan with confidence.
          </p>
        </div>

        <div className="services services-cards-grid">
          {servicesData.map((service) => (
            <article key={service.slug} className="card service-card-enhanced">
              <div className="card-icon" aria-hidden="true">
                {getIcon(service.icon)}
              </div>
              <h3>{service.title}</h3>
              <p>{service.shortDescription}</p>

              <ul className="service-highlights">
                {service.scope.slice(0, 3).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <div className="card-cta-wrapper" style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <Link href={`/services/${service.slug}`} className="service-view-more">
                  <span>View Details &amp; Scope</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/services" className="button button-outline">
            <span>Explore All Practice Areas</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
