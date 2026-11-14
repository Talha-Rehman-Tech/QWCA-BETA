import type { Metadata } from 'next';
import Link from 'next/link';
import { servicesData } from '@/data/services';
import { FileText, ShieldCheck, Briefcase, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import ScrollRevealContainer from '@/components/layout/ScrollRevealContainer';

export const metadata: Metadata = {
  title: 'Professional Services & Practice Areas | QWCA',
  description:
    'Comprehensive corporate advisory, statutory audit, taxation, SECP compliance, and SEZ tax holiday advisory in Pakistan.',
};

export default function ServicesPage() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText size={26} />;
      case 'ShieldCheck':
        return <ShieldCheck size={26} />;
      case 'Briefcase':
        return <Briefcase size={26} />;
      case 'Globe':
        return <Globe size={26} />;
      default:
        return <FileText size={26} />;
    }
  };

  return (
    <main className="section page-content-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Professional Practice</span>
          <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>Our Services &amp; Practice Areas</h1>
          <p style={{ maxWidth: '780px', margin: '0 auto' }}>
            Delivering robust audit integrity, precision tax compliance, and seamless SECP corporate secretarial governance for forward-thinking enterprises.
          </p>
        </div>

        <ScrollRevealContainer selector=".services-detailed-card" stagger={0.12} y={35}>
          <div className="services-detailed-list" style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '40px' }}>
            {servicesData.map((service, index) => (
              <article
                key={service.slug}
                className="card services-detailed-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '32px',
                  padding: '36px',
                  alignItems: 'center'
                }}
              >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(163, 29, 36, 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getIcon(service.icon)}
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                      Practice Area {index + 1}
                    </span>
                    <h2 style={{ fontSize: '24px', margin: 0, color: 'var(--navy-900)' }}>{service.title}</h2>
                  </div>
                </div>

                <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {service.fullDescription}
                </p>

                <Link href={`/services/${service.slug}`} className="button">
                  <span>View Full Service Scope</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  border: '1px solid var(--line)'
                }}
              >
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '12px' }}>
                  Key Capabilities &amp; Engagements
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {service.scope.slice(0, 4).map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--text-body)' }}>
                      <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
          </div>
        </ScrollRevealContainer>
      </div>
    </main>
  );
}

