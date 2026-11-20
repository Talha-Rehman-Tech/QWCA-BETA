import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { servicesData } from '@/data/services';
import ScrollRevealContainer from '@/components/layout/ScrollRevealContainer';
import {
  FileText,
  ShieldCheck,
  Briefcase,
  Globe,
  Calculator,
  TrendingUp,
  CheckCircle2,
  Building,
  ArrowRight,
  PhoneCall,
  Award,
  Clock,
  ChevronRight,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicesData.map((s) => ({
    slug: s.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: 'Service Not Found | QWCA'
    };
  }

  return {
    title: `${service.title} | QWCA Chartered Accountants`,
    description: service.shortDescription
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText size={28} />;
      case 'ShieldCheck':
        return <ShieldCheck size={28} />;
      case 'Briefcase':
        return <Briefcase size={28} />;
      case 'Globe':
        return <Globe size={28} />;
      case 'Calculator':
        return <Calculator size={28} />;
      case 'TrendingUp':
        return <TrendingUp size={28} />;
      default:
        return <FileText size={28} />;
    }
  };

  const engagementPhases = [
    {
      step: '01',
      title: 'Initial Diagnostic & Gap Analysis',
      desc: 'Partner-led review of existing documentation, historical compliance, and statutory filings to identify risks and opportunities.'
    },
    {
      step: '02',
      title: 'Engagement Architecture',
      desc: 'Formulation of tailored compliance roadmaps, tax optimization strategies, or audit work plans aligned with Pakistani regulations.'
    },
    {
      step: '03',
      title: 'Execution & Quality Vetting',
      desc: 'Rigorous execution by qualified chartered accountants, incorporating ICAP quality benchmarks and internal four-eye reviews.'
    },
    {
      step: '04',
      title: 'Statutory Lodgement & Defense',
      desc: 'Final submission on Iris/eZfile/SECP portals, client dossier delivery, and continuous representation before regulatory authorities.'
    }
  ];

  return (
    <main className="section page-content-section service-detail-main">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav" aria-label="Breadcrumb" style={{ marginBottom: '24px' }}>
          <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontSize: '13.5px', color: 'var(--text-muted)' }}>
            <li>
              <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Home
              </Link>
            </li>
            <li>
              <ChevronRight size={14} />
            </li>
            <li>
              <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Services
              </Link>
            </li>
            <li>
              <ChevronRight size={14} />
            </li>
            <li style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {service.title}
            </li>
          </ol>
        </nav>

        {/* Executive Hero Banner */}
        <div className="service-hero-banner">
          <div className="service-hero-grid">
            <div className="service-hero-content">
              <div className="service-hero-badge-row">
                <span className="service-hero-pill">{service.pill}</span>
                <span className="service-hero-sub-pill">
                  <Award size={13} />
                  <span>Partner Led Advisory</span>
                </span>
              </div>

              <div className="service-hero-title-wrap">
                <div className="service-hero-icon-box">
                  {getIcon(service.icon)}
                </div>
                <h1 className="service-hero-title">{service.title}</h1>
              </div>

              <p className="service-hero-tagline">{service.tagline}</p>

              <div className="service-hero-meta-strip">
                <div className="meta-strip-item">
                  <CheckCircle2 size={16} className="meta-icon" />
                  <span>ICAP &amp; SECP Regulated Standards</span>
                </div>
                <div className="meta-strip-item">
                  <Clock size={16} className="meta-icon" />
                  <span>Statutory Timeline SLA</span>
                </div>
                <div className="meta-strip-item">
                  <ShieldCheck size={16} className="meta-icon" />
                  <span>100% Confidential Engagement</span>
                </div>
              </div>
            </div>

            <div className="service-hero-image-wrap">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 992px) 100vw, 420px"
                className="service-hero-image"
              />
              <div className="service-hero-image-overlay" />
            </div>
          </div>
        </div>

        {/* Main Content & Sidebar Layout */}
        <ScrollRevealContainer selector=".service-reveal-item" stagger={0.08} y={25}>
          <div className="service-detail-layout">
            {/* Left Content Column */}
            <div className="service-main-column">
              {/* Overview Card */}
              <section className="card service-reveal-item service-section-card">
                <div className="service-card-section-header">
                  <div className="section-icon-pill">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="service-card-heading">Practice Overview</h2>
                    <p className="service-card-subhead">Strategic context, legislative framework, and industry application</p>
                  </div>
                </div>
                <p className="service-lead-text">
                  {service.fullDescription}
                </p>
              </section>

              {/* Scope of Work */}
              <section className="card service-reveal-item service-section-card">
                <div className="service-card-section-header">
                  <div className="section-icon-pill">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h2 className="service-card-heading">Detailed Scope of Work</h2>
                    <p className="service-card-subhead">Core areas covered within this chartered practice discipline</p>
                  </div>
                </div>

                <div className="service-scope-grid">
                  {service.scope.map((item, idx) => (
                    <div key={idx} className="service-scope-card">
                      <div className="scope-check-circle">
                        <CheckCircle2 size={16} />
                      </div>
                      <p className="scope-text">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Engagement Methodology */}
              <section className="card service-reveal-item service-section-card">
                <div className="service-card-section-header">
                  <div className="section-icon-pill">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h2 className="service-card-heading">Engagement Methodology &amp; Process</h2>
                    <p className="service-card-subhead">Our proven four-stage engagement framework for quality assurance</p>
                  </div>
                </div>

                <div className="methodology-timeline">
                  {engagementPhases.map((phase, idx) => (
                    <div key={idx} className="timeline-step">
                      <div className="timeline-badge-wrap">
                        <span className="timeline-step-badge">{phase.step}</span>
                        {idx < engagementPhases.length - 1 && <span className="timeline-connector-line" />}
                      </div>
                      <div className="timeline-content">
                        <h3 className="timeline-step-title">{phase.title}</h3>
                        <p className="timeline-step-desc">{phase.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Client Deliverables */}
              <section className="card service-reveal-item service-section-card">
                <div className="service-card-section-header">
                  <div className="section-icon-pill">
                    <Award size={18} />
                  </div>
                  <div>
                    <h2 className="service-card-heading">Tangible Client Deliverables</h2>
                    <p className="service-card-subhead">Formal work products, signed reports, and regulatory documentation</p>
                  </div>
                </div>

                <div className="deliverables-grid">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="deliverable-item-card">
                      <span className="deliverable-bullet">&bull;</span>
                      <strong className="deliverable-text">{item}</strong>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQs */}
              {service.faqs && service.faqs.length > 0 && (
                <section className="card service-reveal-item service-section-card">
                  <div className="service-card-section-header">
                    <div className="section-icon-pill">
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <h2 className="service-card-heading">Frequently Asked Questions</h2>
                      <p className="service-card-subhead">Common inquiries regarding regulatory compliance and procedure</p>
                    </div>
                  </div>

                  <div className="service-faqs-list">
                    {service.faqs.map((faq, idx) => (
                      <div key={idx} className="service-faq-item">
                        <h3 className="faq-question-text">{faq.question}</h3>
                        <p className="faq-answer-text">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sticky Sidebar */}
            <aside className="service-sidebar-column">
              <div className="service-sticky-sidebar">
                {/* Consultation Card */}
                <div className="partner-consult-card">
                  <span className="consult-eyebrow">ICAP Chartered Accountants</span>
                  <h3 className="consult-heading">Consult a CA Partner</h3>
                  <p className="consult-desc">
                    Schedule a confidential advisory session with our managing partners regarding your corporate compliance.
                  </p>

                  <div className="consult-quick-points">
                    <div className="consult-point">
                      <CheckCircle2 size={14} className="consult-point-icon" />
                      <span>Direct Partner-Level Oversight</span>
                    </div>
                    <div className="consult-point">
                      <CheckCircle2 size={14} className="consult-point-icon" />
                      <span>Full Non-Disclosure Agreement (NDA)</span>
                    </div>
                    <div className="consult-point">
                      <CheckCircle2 size={14} className="consult-point-icon" />
                      <span>Fast Turnaround on Urgent Filings</span>
                    </div>
                  </div>

                  <Link href="/contact" className="button consult-button">
                    <span>Schedule Consultation</span>
                    <ArrowRight size={15} />
                  </Link>

                  <a
                    href="tel:+92418544444"
                    className="consult-phone-link"
                  >
                    <PhoneCall size={15} />
                    <span>Call Partner Desk: +92 41 8544444</span>
                  </a>
                </div>

                {/* Regulatory Bodies Card */}
                <div className="card sidebar-meta-card">
                  <h4 className="sidebar-card-title">Governing Regulatory Bodies</h4>
                  <div className="regulatory-badges-wrap">
                    {service.regulatoryBodies.map((body, idx) => (
                      <div key={idx} className="reg-badge-item">
                        <Building size={14} className="reg-icon" />
                        <span>{body}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategic Benefits */}
                <div className="card sidebar-meta-card">
                  <h4 className="sidebar-card-title">Key Strategic Advantages</h4>
                  <ul className="sidebar-benefits-list">
                    {service.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="benefit-list-item">
                        <span className="benefit-check-icon">&check;</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Other Services Link */}
                <div className="sidebar-navigation-box">
                  <span className="sidebar-nav-label">Explore More Practice Disciplines:</span>
                  <div className="sidebar-other-services">
                    {servicesData
                      .filter((s) => s.slug !== service.slug)
                      .slice(0, 4)
                      .map((other) => (
                        <Link
                          key={other.slug}
                          href={`/services/${other.slug}`}
                          className="sidebar-other-link"
                        >
                          <span>{other.title}</span>
                          <ChevronRight size={13} />
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </ScrollRevealContainer>
      </div>
    </main>
  );
}
