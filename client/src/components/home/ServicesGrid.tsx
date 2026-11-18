'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  ShieldCheck,
  Briefcase,
  Globe,
  Calculator,
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
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

      // Staggered horizontal service cards entrance
      gsap.fromTo(
        '.service-card-horizontal',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-dept-grid',
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
        return <FileText size={18} />;
      case 'ShieldCheck':
        return <ShieldCheck size={18} />;
      case 'Briefcase':
        return <Briefcase size={18} />;
      case 'Globe':
        return <Globe size={18} />;
      case 'Calculator':
        return <Calculator size={18} />;
      case 'TrendingUp':
        return <TrendingUp size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  return (
    <section ref={sectionRef} className="section services-preview-section" id="services">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow services-anim-heading">Practice Disciplines &amp; Advisory</span>
          <div
            className="services-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2 className="services-anim-heading">Our Core Services</h2>
          <p className="services-anim-heading">
            Dependable, ICAP-approved chartered accountancy solutions to ensure statutory compliance, optimize tax liabilities, and secure corporate governance.
          </p>
        </div>

        {/* 2-Column Grid of Horizontal Split Cards (Image on one side, details on the other) */}
        <div className="services-dept-grid">
          {servicesData.map((service) => (
            <article key={service.slug} className="service-card-horizontal">
              {/* Left Side: Service Image (Team-Style Photo Frame) */}
              <div className="service-card-photo-wrap">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={400}
                  height={280}
                  className="service-card-photo"
                />
                <div className="service-card-icon-tag" aria-hidden="true">
                  {getIcon(service.icon)}
                </div>
              </div>

              {/* Right Side: Service Details */}
              <div className="service-card-info">
                <div className="service-card-top-row">
                  <span className="service-badge-pill">{service.pill}</span>
                </div>

                <h3 className="service-card-heading">
                  <Link href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </h3>

                <p className="service-card-summary">
                  {service.shortDescription}
                </p>

                {/* Scope highlights list */}
                <ul className="service-scope-list">
                  {service.scope.slice(0, 3).map((item, index) => (
                    <li key={index} className="service-scope-item">
                      <CheckCircle2 size={14} className="service-check-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="service-card-footer">
                  <Link href={`/services/${service.slug}`} className="service-view-details-link">
                    <span>View Service Scope</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link href="/services" className="button button-outline">
            <span>Explore All Practice Areas &amp; Engagements</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
