'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Home,
  ArrowLeft,
  Calculator,
  Building2,
  Briefcase,
  Users,
  BookOpen,
  PhoneCall,
  Search,
  FileQuestion,
  ShieldAlert,
} from 'lucide-react';
import gsap from 'gsap';

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.not-found-badge',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.not-found-num',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.1, ease: 'back.out(1.4)' }
      );

      gsap.fromTo(
        '.not-found-text',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.not-found-card',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.35, stagger: 0.08, ease: 'power2.out' }
      );

      // Subtle float effect on the big 404
      gsap.to('.not-found-num', {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const quickLinks = [
    {
      title: 'Practice Areas & Services',
      desc: 'Statutory audit, tax planning, advisory & SEZ concessions',
      href: '/services',
      icon: Briefcase,
    },
    {
      title: 'Corporate Tax Calculator',
      desc: 'Estimate salaried, business & company tax liability under Pakistani law',
      href: '/tax-calculator',
      icon: Calculator,
    },
    {
      title: 'SECP Company Registration',
      desc: 'Incorporate Private Limited or SMC with full statutory compliance',
      href: '/company-registration',
      icon: Building2,
    },
    {
      title: 'Business Setup Cost Estimator',
      desc: 'Calculate official SECP, digital certificates, and filing fees',
      href: '/cost-estimator',
      icon: Search,
    },
    {
      title: 'Our Partners & Team',
      desc: 'Meet ICAP qualified chartered accountants and corporate attorneys',
      href: '/team',
      icon: Users,
    },
    {
      title: 'Research & Publications',
      desc: 'Tax updates, Finance Act commentary, and compliance bulletins',
      href: '/publications',
      icon: BookOpen,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="not-found-page-wrapper"
      style={{
        minHeight: '85vh',
        background: 'linear-gradient(180deg, #FAFAFB 0%, #FFFFFF 100%)',
        padding: '70px 24px 90px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative ambient background accents */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(163, 29, 36, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="container"
        style={{
          maxWidth: '960px',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Eyebrow Badge */}
        <div
          className="not-found-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary-light, #F8EBEB)',
            color: 'var(--primary, #A31D24)',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            border: '1px solid var(--primary-border, rgba(163, 29, 36, 0.2))',
          }}
        >
          <ShieldAlert size={14} />
          <span>Error 404 · Uncharted Route</span>
        </div>

        {/* Big 404 Typographic Artwork */}
        <div
          className="not-found-num"
          style={{
            fontSize: 'clamp(5rem, 14vw, 9.5rem)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-4px',
            background: 'linear-gradient(135deg, #1A1D20 30%, #A31D24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            userSelect: 'none',
          }}
        >
          404
        </div>

        {/* Header and description */}
        <div className="not-found-text" style={{ maxWidth: '640px', margin: '0 auto 36px auto' }}>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: 800,
              color: 'var(--navy-900, #1A1D20)',
              marginBottom: '14px',
              letterSpacing: '-0.5px',
            }}
          >
            The page you are looking for does not exist.
          </h1>
          <p
            style={{
              fontSize: '15.5px',
              color: 'var(--text-muted, #6C757D)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            The requested corporate advisory filing or link may have been renamed, relocated, or is undergoing statutory update under current regulatory guidelines.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '50px',
          }}
        >
          <Link
            href="/"
            className="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <Home size={16} />
            <span>Return to Homepage</span>
          </Link>

          <button
            type="button"
            onClick={handleGoBack}
            className="button button-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              background: '#FFFFFF',
            }}
          >
            <ArrowLeft size={16} />
            <span>Go Back Previous Page</span>
          </button>
        </div>

        {/* Quick Directory Grid */}
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <h3
            style={{
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              color: 'var(--navy-900, #1A1D20)',
              marginBottom: '18px',
              textAlign: 'center',
            }}
          >
            Recommended Practice Destinations
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="not-found-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid var(--line, #E9ECEF)',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    textDecoration: 'none',
                    color: 'inherit',
                    boxShadow: 'var(--shadow-xs, 0 1px 2px rgba(26, 29, 32, 0.05))',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(163, 29, 36, 0.3)';
                    e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(26, 29, 32, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--line, #E9ECEF)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs, 0 1px 2px rgba(26, 29, 32, 0.05))';
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary-light, #F8EBEB)',
                      color: 'var(--primary, #A31D24)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={19} />
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '14.5px',
                        fontWeight: 700,
                        color: 'var(--navy-900, #1A1D20)',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12.5px',
                        color: 'var(--text-muted, #6C757D)',
                        lineHeight: 1.45,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Direct Contact Bar */}
        <div
          style={{
            background: 'var(--dark-slate-deep, #141618)',
            borderRadius: '12px',
            padding: '20px 26px',
            color: '#FFFFFF',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            textAlign: 'left',
          }}
        >
          <div>
            <strong style={{ display: 'block', fontSize: '14.5px', marginBottom: '3px' }}>
              Require immediate statutory or corporate assistance?
            </strong>
            <span style={{ fontSize: '13px', color: '#ADB5BD' }}>
              Our senior partners are accessible for direct advisory consultations.
            </span>
          </div>

          <a
            href="tel:+92415392192"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--primary, #A31D24)',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <PhoneCall size={15} />
            <span>Call +92-41-5392192</span>
          </a>
        </div>
      </div>
    </div>
  );
}
