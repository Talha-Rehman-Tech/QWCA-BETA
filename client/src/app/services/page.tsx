import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { servicesData } from '@/data/services';
import {
  FileText,
  ShieldCheck,
  Briefcase,
  Globe,
  Calculator,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Award,
  Building,
  Sparkles
} from 'lucide-react';
import ScrollRevealContainer from '@/components/layout/ScrollRevealContainer';

export const metadata: Metadata = {
  title: 'Professional Services & Practice Areas | QWCA Chartered Accountants',
  description:
    'Comprehensive corporate advisory, statutory audit, taxation, SECP corporate secretarial compliance, SEZ tax holidays, and managed accounting in Pakistan.',
};

export default function ServicesPage() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText size={24} />;
      case 'ShieldCheck':
        return <ShieldCheck size={24} />;
      case 'Briefcase':
        return <Briefcase size={24} />;
      case 'Globe':
        return <Globe size={24} />;
      case 'Calculator':
        return <Calculator size={24} />;
      case 'TrendingUp':
        return <TrendingUp size={24} />;
      default:
        return <FileText size={24} />;
    }
  };

  return (
    <main className="section page-content-section services-index-page">
      <div className="container">
        {/* Section Heading */}
        <div className="section-heading services-index-header">
          <span className="eyebrow">Professional Practice Disciplines</span>
          <h1 className="services-main-title">Chartered Accountancy &amp; Corporate Advisory</h1>
          <p className="services-main-subtitle">
            Delivering statutory audit integrity, strategic tax optimization, and seamless SECP corporate secretarial governance for forward-thinking enterprises in Pakistan and abroad.
          </p>

          <div className="services-credential-badges">
            <span className="credential-badge">
              <Award size={14} />
              <span>ICAP Practicing Chartered Accountants</span>
            </span>
            <span className="credential-badge">
              <Building size={14} />
              <span>SECP &amp; FBR Authorized Intermediaries</span>
            </span>
            <span className="credential-badge">
              <Sparkles size={14} />
              <span>Multidisciplinary Advisory Firm</span>
            </span>
          </div>
        </div>

        {/* 3x2 Corporate Grid of Services */}
        <ScrollRevealContainer selector=".service-hub-card" stagger={0.1} y={30}>
          <div className="services-hub-grid">
            {servicesData.map((service, index) => (
              <article key={service.slug} className="card service-hub-card">
                {/* Media Image Frame */}
                <div className="hub-card-media-wrap">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="hub-card-image"
                  />
                  <div className="hub-card-media-overlay" />
                  <span className="hub-card-pill">{service.pill}</span>
                </div>

                {/* Card Content */}
                <div className="hub-card-body">
                  <div className="hub-card-header">
                    <div className="hub-card-icon-box">
                      {getIcon(service.icon)}
                    </div>
                    <div>
                      <span className="hub-card-discipline-label">Practice Area 0{index + 1}</span>
                      <h2 className="hub-card-title">
                        <Link href={`/services/${service.slug}`} className="hub-card-title-link">
                          {service.title}
                        </Link>
                      </h2>
                    </div>
                  </div>

                  <p className="hub-card-desc">{service.shortDescription}</p>

                  {/* Highlights list */}
                  <div className="hub-card-highlights">
                    <span className="highlights-heading">Core Scope:</span>
                    <ul className="highlights-list">
                      {service.scope.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="highlight-item">
                          <CheckCircle2 size={13} className="highlight-check" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverables tags */}
                  <div className="hub-card-deliverables-strip">
                    {service.deliverables.slice(0, 2).map((del, dIdx) => (
                      <span key={dIdx} className="hub-deliverable-chip">
                        {del}
                      </span>
                    ))}
                  </div>

                  {/* Footer CTA */}
                  <div className="hub-card-footer">
                    <Link href={`/services/${service.slug}`} className="hub-card-action-btn">
                      <span>Explore Practice Scope</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </ScrollRevealContainer>

        {/* Bottom Fast Action Banner */}
        <div className="services-bottom-cta-banner">
          <div className="bottom-cta-content">
            <span className="bottom-cta-eyebrow">Custom Regulatory Engagement</span>
            <h3 className="bottom-cta-title">Need specialized fiscal advice or multi-entity structuring?</h3>
            <p className="bottom-cta-desc">
              Our Senior Chartered Accountants provide direct consultation on cross-border taxation, corporate holding setups, and complex SECP filings.
            </p>
          </div>
          <div className="bottom-cta-actions">
            <Link href="/cost-estimator" className="button button-outline bottom-cta-btn">
              <span>Try Cost Estimator</span>
            </Link>
            <Link href="/#contact" className="button bottom-cta-btn">
              <span>Book Partner Discussion</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
