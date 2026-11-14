import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { servicesData } from '@/data/services';
import ScrollRevealContainer from '@/components/layout/ScrollRevealContainer';
import {
  FileText,
  ShieldCheck,
  Briefcase,
  Globe,
  CheckCircle2,
  HelpCircle,
  Building,
  ArrowRight,
  PhoneCall
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
        return <FileText size={32} />;
      case 'ShieldCheck':
        return <ShieldCheck size={32} />;
      case 'Briefcase':
        return <Briefcase size={32} />;
      case 'Globe':
        return <Globe size={32} />;
      default:
        return <FileText size={32} />;
    }
  };

  return (
    <main className="section page-content-section">
      <div className="container">
        {/* Service Header Banner */}
        <div
          style={{
            background: 'var(--dark-slate)',
            color: '#fff',
            padding: '48px 36px',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '40px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(163, 29, 36, 0.25)',
                color: '#ff8a8f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getIcon(service.icon)}
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ff8a8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Practice Area
              </span>
              <h1 style={{ fontSize: '36px', margin: 0, color: '#fff' }}>{service.title}</h1>
            </div>
          </div>
          <p style={{ fontSize: '18px', color: '#dee2e6', maxWidth: '780px', lineHeight: 1.5, margin: 0 }}>
            {service.tagline}
          </p>
        </div>

        {/* Content Layout: Main Info + Sidebar */}
        <ScrollRevealContainer selector=".card" stagger={0.1} y={30}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            {/* Main Left Column */}
            <div>
              <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--navy-900)', marginBottom: '14px' }}>Overview</h3>
                <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: 'var(--text-body)' }}>
                  {service.fullDescription}
                </p>
              </div>

              <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--navy-900)', marginBottom: '16px' }}>Detailed Scope of Work</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {service.scope.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px' }}>
                      <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--navy-900)', marginBottom: '16px' }}>Client Deliverables</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {service.deliverables.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '14px 18px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--line)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--navy-900)'
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="card">
                  <h3 style={{ fontSize: '20px', color: 'var(--navy-900)', marginBottom: '18px' }}>Frequently Asked Questions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {service.faqs.map((faq, i) => (
                      <div key={i} style={{ borderBottom: i < service.faqs.length - 1 ? '1px solid var(--line)' : 'none', paddingBottom: '14px' }}>
                        <strong style={{ display: 'block', fontSize: '15px', color: 'var(--navy-900)', marginBottom: '6px' }}>
                          {faq.question}
                        </strong>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div>
              <div className="card" style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '17px', color: 'var(--navy-900)', marginBottom: '12px' }}>Regulatory Authorities</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.regulatoryBodies.map((body, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13.5px',
                          color: 'var(--text-body)'
                        }}
                      >
                        <Building size={15} color="var(--primary)" />
                        <span>{body}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '18px' }}>
                  <h4 style={{ fontSize: '17px', color: 'var(--navy-900)', marginBottom: '12px' }}>Strategic Benefits</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {service.keyBenefits.map((benefit, i) => (
                      <li key={i} style={{ fontSize: '13.5px', color: 'var(--text-body)', display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    background: 'var(--primary-light)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--primary-border)'
                  }}
                >
                  <h4 style={{ fontSize: '16px', color: 'var(--primary)', margin: '0 0 8px' }}>
                    Consult a Chartered Accountant
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-body)', margin: '0 0 16px', lineHeight: 1.5 }}>
                    Schedule a confidential discussion with our partners regarding your engagement.
                  </p>
                  <Link href="/#contact" className="button" style={{ width: '100%', justifyContent: 'center' }}>
                    <span>Book Consultation</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollRevealContainer>
      </div>
    </main>
  );
}

