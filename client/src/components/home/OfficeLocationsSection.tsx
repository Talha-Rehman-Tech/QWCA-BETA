'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  ExternalLink,
  CheckCircle2,
  Navigation,
  Copy,
  Check,
  Building,
  UserCheck
} from 'lucide-react';
import { officesData, OfficeLocation } from '@/data/offices-data';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OfficeLocationsSection() {
  const [activeOfficeId, setActiveOfficeId] = useState<'pakistan' | 'uae' | 'china'>('pakistan');
  const [copied, setCopied] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const activeOffice = officesData.find((o) => o.id === activeOfficeId) || officesData[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.offices-anim-heading',
        { y: 25, opacity: 0 },
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

      // Section line
      gsap.fromTo(
        '.offices-accent-line',
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

      // Main columns
      gsap.fromTo(
        '.offices-col-left',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.offices-col-right',
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleOfficeChange = (id: 'pakistan' | 'uae' | 'china') => {
    if (id === activeOfficeId) return;
    setIsMapLoading(true);
    setActiveOfficeId(id);
    setTimeout(() => {
      setIsMapLoading(false);
    }, 450);
  };

  const handleCopyAddress = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(activeOffice.fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section ref={sectionRef} className="section offices-section" id="offices">
      <div className="container">
        {/* Section Heading */}
        <div className="section-heading offices-section-heading">
          <span className="eyebrow offices-anim-heading">Global Presence &amp; Regional Desks</span>
          <div
            className="offices-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2 className="offices-anim-heading">Our Office Locations</h2>
          <p className="offices-anim-heading">
            Operating across key commercial corridors to provide direct chartered accountancy, corporate tax defense, and cross-border advisory in Pakistan, the UAE, and China.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left Details + Right Google Map */}
        <div className="offices-layout-grid">
          {/* Left Column: Office Selector Tabs & Active Dossier */}
          <div className="offices-col-left">
            {/* Quick Country Selector Tabs */}
            <div className="offices-tab-bar" role="tablist" aria-label="Select office location">
              {officesData.map((office) => {
                const isActive = office.id === activeOfficeId;
                return (
                  <button
                    key={office.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`office-tab-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleOfficeChange(office.id)}
                  >
                    <span className="office-tab-flag" aria-hidden="true">
                      {office.flag}
                    </span>
                    <span className="office-tab-text">
                      <strong className="office-tab-country">{office.country}</strong>
                      <span className="office-tab-city">{office.city}</span>
                    </span>
                    {isActive && <span className="office-tab-active-dot" />}
                  </button>
                );
              })}
            </div>

            {/* Active Office Detailed Card */}
            <article className="card office-active-card">
              <div className="office-card-top-bar">
                <span className="office-country-badge">
                  <span className="flag-icon">{activeOffice.flag}</span>
                  <span>{activeOffice.country}</span>
                </span>
                <span className="office-status-pill">{activeOffice.badge}</span>
              </div>

              <h3 className="office-primary-title">{activeOffice.title}</h3>
              <p className="office-primary-subtitle">{activeOffice.subtitle}</p>

              {/* Office Contact & Address Grid */}
              <div className="office-details-list">
                {/* 1. Address with Copy Button */}
                <div className="office-detail-row">
                  <div className="detail-icon-wrap" aria-hidden="true">
                    <MapPin size={17} />
                  </div>
                  <div className="detail-body">
                    <span className="detail-label">Physical Office Address:</span>
                    <p className="detail-value address-text">{activeOffice.fullAddress}</p>
                    <button
                      type="button"
                      className="office-copy-address-btn"
                      onClick={handleCopyAddress}
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="copy-icon-success" />
                          <span>Address Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Direct Phone & WhatsApp */}
                <div className="office-detail-row">
                  <div className="detail-icon-wrap" aria-hidden="true">
                    <Phone size={17} />
                  </div>
                  <div className="detail-body">
                    <span className="detail-label">Direct Phone &amp; Inquiry:</span>
                    <div className="detail-links-group">
                      <a href={`tel:${activeOffice.phoneTel}`} className="detail-link phone-link">
                        {activeOffice.phone}
                      </a>
                      {activeOffice.whatsapp && (
                        <a
                          href={`https://wa.me/${activeOffice.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-badge-link"
                        >
                          <span>WhatsApp Desk</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Official Email */}
                <div className="office-detail-row">
                  <div className="detail-icon-wrap" aria-hidden="true">
                    <Mail size={17} />
                  </div>
                  <div className="detail-body">
                    <span className="detail-label">Official Communications:</span>
                    <a href={`mailto:${activeOffice.email}`} className="detail-link email-link">
                      {activeOffice.email}
                    </a>
                  </div>
                </div>

                {/* 4. Operating Hours & Timezone */}
                <div className="office-detail-row">
                  <div className="detail-icon-wrap" aria-hidden="true">
                    <Clock size={17} />
                  </div>
                  <div className="detail-body">
                    <span className="detail-label">Working Hours &amp; Timezone:</span>
                    <p className="detail-value hours-text">
                      {activeOffice.hours}
                      <span className="timezone-tag">
                        <Globe size={12} />
                        <span>{activeOffice.timezoneCode} ({activeOffice.utcOffset})</span>
                      </span>
                    </p>
                  </div>
                </div>

                {/* 5. Liaison Lead */}
                <div className="office-detail-row">
                  <div className="detail-icon-wrap" aria-hidden="true">
                    <UserCheck size={17} />
                  </div>
                  <div className="detail-body">
                    <span className="detail-label">Practice Lead / Regional Liaison:</span>
                    <strong className="detail-value partner-name">{activeOffice.liaisonLead}</strong>
                  </div>
                </div>
              </div>

              {/* Key Jurisdictions & Services Chips */}
              <div className="office-services-strip">
                <span className="services-strip-label">Practice Focus:</span>
                <div className="services-chips-wrap">
                  {activeOffice.keyServices.map((service, idx) => (
                    <span key={idx} className="office-service-chip">
                      <CheckCircle2 size={12} className="chip-check" />
                      <span>{service}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="office-actions-row">
                <a
                  href={activeOffice.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button office-maps-btn"
                >
                  <Navigation size={15} />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink size={13} />
                </a>

                <Link href="/contact" className="button button-outline office-inquiry-btn">
                  <span>Schedule Consultation</span>
                </Link>
              </div>
            </article>
          </div>

          {/* Right Column: Google Maps Viewport with Live Pin Header */}
          <div className="offices-col-right">
            <div className="office-map-frame-wrapper">
              {/* Map Frame Header Strip */}
              <div className="map-frame-header">
                <div className="map-frame-title-wrap">
                  <span className="map-flag-badge">{activeOffice.flag}</span>
                  <div>
                    <strong className="map-title">{activeOffice.city} Office</strong>
                    <span className="map-subtitle">{activeOffice.country}</span>
                  </div>
                </div>

                <a
                  href={activeOffice.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-fullscreen-link"
                  title="Open full interactive map on Google Maps"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Interactive Google Map Iframe */}
              <div className="map-canvas-container">
                <iframe
                  title={`Google Maps location of QWCA ${activeOffice.city} office`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(activeOffice.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className={`google-map-iframe ${isMapLoading ? 'is-loading' : ''}`}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating Bottom Card Over Map */}
                <div className="map-floating-pill">
                  <MapPin size={15} className="floating-pin-icon" />
                  <div className="floating-pill-content">
                    <strong>{activeOffice.title}</strong>
                    <span>{activeOffice.address}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick-Switch Bar on Map */}
              <div className="map-bottom-controls">
                <span className="quick-switch-label">Quick Switch:</span>
                <div className="quick-switch-btns">
                  {officesData.map((office) => (
                    <button
                      key={office.id}
                      type="button"
                      className={`map-switch-chip ${office.id === activeOfficeId ? 'active' : ''}`}
                      onClick={() => handleOfficeChange(office.id)}
                    >
                      <span>{office.flag}</span>
                      <span>{office.country}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
