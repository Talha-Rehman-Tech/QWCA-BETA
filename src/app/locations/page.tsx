import type { Metadata } from 'next';
import OfficeLocationsSection from '@/components/home/OfficeLocationsSection';
import Link from 'next/link';
import { ChevronRight, Award, ShieldCheck, Globe, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Global Office Locations | Pakistan, UAE & China | QWCA',
  description:
    'Visit or contact QWCA Chartered Accountants offices in Faisalabad (Pakistan), Dubai (UAE), and Beijing (China). Interactive Google Maps, contact details, and cross-border advisory.',
};

export default function LocationsPage() {
  return (
    <main className="section page-content-section locations-page-main">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav" aria-label="Breadcrumb" style={{ marginBottom: '24px' }}>
          <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontSize: '13.5px', color: 'var(--text-muted)' }}>
            <li>
              <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Home
              </Link>
            </li>
            <li>
              <ChevronRight size={14} />
            </li>
            <li style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Office Locations &amp; Global Desks
            </li>
          </ol>
        </nav>

        {/* Global Network Overview Banner */}
        <div className="locations-hero-banner" style={{
          background: 'linear-gradient(135deg, #111417 0%, #1A1D20 60%, #262B30 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '38px 32px',
          color: '#ffffff',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16)'
        }}>
          <div style={{ maxWidth: '820px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(163, 29, 36, 0.35)',
              color: '#ff8a8f',
              fontSize: '11.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '4px 12px',
              borderRadius: '9999px',
              marginBottom: '14px',
              border: '1px solid rgba(163, 29, 36, 0.5)'
            }}>
              <Globe size={13} />
              <span>International Practice Corridors</span>
            </span>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Our Office Locations &amp; Regional Desks
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#ced4da', margin: 0 }}>
              QWCA operates across critical business gateways in Pakistan, the United Arab Emirates, and the People’s Republic of China, providing high-integrity audit, cross-border corporate taxation, and turnkey FDI advisory.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f1f3f5' }}>
              <Award size={15} color="#ff8a8f" />
              <span>ICAP Practicing Member Firm</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f1f3f5' }}>
              <Building size={15} color="#ff8a8f" />
              <span>SECP, FBR &amp; PRA Authorized</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f1f3f5' }}>
              <ShieldCheck size={15} color="#ff8a8f" />
              <span>CPEC &amp; Cross-Border FDI Facilitation</span>
            </div>
          </div>
        </div>

        {/* Interactive Office Locations & Google Map Section */}
        <OfficeLocationsSection />
      </div>
    </main>
  );
}
