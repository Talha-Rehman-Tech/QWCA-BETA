'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

interface Partner {
  id: string;
  acronym: string;
  name: string;
  designation: string;
  badge: string;
  logo: string;
}

const partners: Partner[] = [
  {
    id: 'icap',
    acronym: 'ICAP',
    name: 'Institute of Chartered Accountants of Pakistan',
    designation: 'Affiliated Practicing Firm · ATO Approved',
    badge: 'Regulating Body',
    logo: '/assets/logos/icap.svg'
  },
  {
    id: 'secp',
    acronym: 'SECP',
    name: 'Securities & Exchange Commission of Pakistan',
    designation: 'Certified Digital Intermediary · eZfile',
    badge: 'Corporate Regulator',
    logo: '/assets/logos/secp.svg'
  },
  {
    id: 'fbr',
    acronym: 'FBR',
    name: 'Federal Board of Revenue (Inland Revenue)',
    designation: 'Authorized Tax Practitioners & E-filing',
    badge: 'Federal Tax Authority',
    logo: '/assets/logos/fbr.svg'
  },
  {
    id: 'pra',
    acronym: 'PRA',
    name: 'Punjab Revenue Authority',
    designation: 'Registered Sales Tax Advisory & Defense',
    badge: 'Provincial Revenue',
    logo: '/assets/logos/pra.svg'
  },
  {
    id: 'boi',
    acronym: 'BOI',
    name: 'Board of Investment (Prime Minister’s Office)',
    designation: 'FDI, Branch & Liaison Office Approvals',
    badge: 'Inward Investment',
    logo: '/assets/logos/boi.svg'
  },
  {
    id: 'fiedmc',
    acronym: 'FIEDMC',
    name: 'Faisalabad Industrial Estate (M-3 City & AIIC)',
    designation: '10-Year SEZ Tax Holiday & Land Allotments',
    badge: 'Special Economic Zones',
    logo: '/assets/logos/fiedmc.svg'
  },
  {
    id: 'sbp',
    acronym: 'SBP',
    name: 'State Bank of Pakistan',
    designation: 'Prudential Regulatory & Foreign Exchange Compliance',
    badge: 'Central Banking',
    logo: '/assets/logos/sbp.svg'
  },
  {
    id: 'fcci',
    acronym: 'FCCI',
    name: 'Faisalabad Chamber of Commerce & Industry',
    designation: 'Corporate Member & Advisory Partner',
    badge: 'Industrial Chamber',
    logo: '/assets/logos/fcci.svg'
  },
  {
    id: 'cpec',
    acronym: 'CPEC',
    name: 'China-Pakistan Economic Corridor Desk',
    designation: 'Cross-Border FDI & Chinese Enterprise Liaison',
    badge: 'Strategic Corridor',
    logo: '/assets/logos/cpec.svg'
  },
  {
    id: 'srb',
    acronym: 'SRB',
    name: 'Sindh Revenue Board',
    designation: 'Provincial Sales Tax on Services Representation',
    badge: 'Provincial Revenue',
    logo: '/assets/logos/srb.svg'
  }
];

export default function TrustedPartnersScroller() {
  // Duplicate array for seamless infinite marquee loop
  const marqueeList = [...partners, ...partners];

  return (
    <section className="trusted-partners-section" aria-label="Trusted Partners and Regulatory Affiliations">
      <div className="container">
        {/* Header Ribbon */}
        <div className="partners-header-bar">
          <div className="partners-header-label">
            <span className="partners-pulse-dot" aria-hidden="true" />
            <span className="partners-eyebrow">Institutional Affiliations &amp; Regulatory Partners</span>
          </div>
          <span className="partners-sublabel">
            Operating under strict statutory oversight and recognized by Pakistan’s foremost financial authorities
          </span>
        </div>
      </div>

      {/* Infinite Seamless Scrolling Track */}
      <div className="partners-marquee-viewport">
        <div className="partners-marquee-track">
          {marqueeList.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="partner-card"
              title={`${partner.acronym} - ${partner.name}`}
            >
              <div className="partner-card-header">
                <span className="partner-acronym-badge">{partner.acronym}</span>
                <span className="partner-type-tag">{partner.badge}</span>
              </div>

              <div className="partner-card-body">
                <div className="partner-logo-frame" aria-hidden="true">
                  <Image
                    src={partner.logo}
                    alt={`${partner.acronym} Official Government Emblem`}
                    width={46}
                    height={46}
                    className="partner-org-logo"
                  />
                </div>
                <div className="partner-text-wrap">
                  <h4 className="partner-name">{partner.name}</h4>
                  <p className="partner-designation">
                    <CheckCircle2 size={12} className="partner-check-icon" />
                    <span>{partner.designation}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
