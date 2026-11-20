'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Award,
  Globe,
  Building2,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { officesData } from '@/data/offices-data';

function ContactContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || 'Taxation & Advisory';
  const initialEntity = searchParams.get('entity') || '';
  const initialTotal = searchParams.get('total') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: initialService,
    advisoryMode: 'In-Person (Faisalabad Head Office)',
    preferredDate: '',
    message: initialEntity
      ? `Inquiry regarding registration of ${initialEntity.toUpperCase()} with estimated setup cost PKR ${Number(initialTotal).toLocaleString('en-PK')}.`
      : '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeOfficeTab, setActiveOfficeTab] = useState<'pakistan' | 'uae' | 'china'>('pakistan');
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const activeOffice = officesData.find((o) => o.id === activeOfficeTab) || officesData[0];

  const handleCopyAddress = (address: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `QWCA Consultation Request - ${formData.service} (${formData.name})`;
    const body = [
      `CONSULTATION & ADVISORY BOOKING - QWCA`,
      `--------------------------------------------------`,
      `Client Name: ${formData.name}`,
      `Corporate Email: ${formData.email}`,
      `Phone / WhatsApp: ${formData.phone || 'Not provided'}`,
      `Company / Entity: ${formData.company || 'Individual / New Startup'}`,
      `Practice Area: ${formData.service}`,
      `Preferred Mode: ${formData.advisoryMode}`,
      `Preferred Date / Time: ${formData.preferredDate || 'Earliest Available'}`,
      ``,
      `Consultation Scope & Message:`,
      formData.message,
      `--------------------------------------------------`,
      `Sent via QWCA Official Digital Portal`,
    ].join('\n');

    const composeUrl = new URL('https://mail.google.com/mail/');
    composeUrl.search = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: 'info@qwca.pk',
      su: subject,
      body: body,
    }).toString();

    setSubmitted(true);
    window.open(composeUrl.toString(), '_blank');
  };

  return (
    <main className="section page-content-section contact-page-main" style={{ paddingTop: '105px', minHeight: '100vh', background: '#F8FAFC' }}>
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
              Contact &amp; Advisory Portal
            </li>
          </ol>
        </nav>

        {/* Hero Section Banner */}
        <div
          className="contact-hero-banner"
          style={{
            background: 'linear-gradient(135deg, #111417 0%, #1A1D20 60%, #262B30 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '42px 36px',
            color: '#ffffff',
            marginBottom: '36px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
            <span
              style={{
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
                border: '1px solid rgba(163, 29, 36, 0.5)',
              }}
            >
              <CalendarCheck size={13} />
              <span>Executive Client Consultation</span>
            </span>
            <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              Connect With Our Chartered Accountants &amp; Corporate Advisors
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#cbd5e1', margin: 0 }}>
              Schedule a confidential advisory meeting with Managing Partner Qummar Waheed (ACA) and our corporate practice leads. We provide audit assurance, statutory FBR tax defense, SECP company formation, and cross-border CPEC investment facilitation.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f1f3f5' }}>
              <Award size={15} color="#ff8a8f" />
              <span>ICAP Practicing Member Firm</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f1f3f5' }}>
              <Building2 size={15} color="#ff8a8f" />
              <span>FBR, PRA &amp; SECP Authorized Representative</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f1f3f5' }}>
              <ShieldCheck size={15} color="#ff8a8f" />
              <span>Guaranteed 24-Hour Business Response SLA</span>
            </div>
          </div>
        </div>

        {/* Quick Contact Hotline Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '36px',
          }}
        >
          {/* Card 1: Direct Telephone */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(163, 29, 36, 0.1)',
                color: 'var(--primary, #A31D24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Phone size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>
                Principal Telephones
              </span>
              <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <a
                  href="tel:+92415392192"
                  style={{ color: '#0f172a', fontWeight: 800, fontSize: '15px', textDecoration: 'none' }}
                >
                  +92-41-5392192
                </a>
                <a
                  href="tel:+923008660309"
                  style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}
                >
                  Mob: +92-300-8660309
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Official Email */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(163, 29, 36, 0.1)',
                color: 'var(--primary, #A31D24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Mail size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>
                Official Practice Email
              </span>
              <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <a
                  href="mailto:info@qwca.pk"
                  style={{ color: '#0f172a', fontWeight: 800, fontSize: '15px', textDecoration: 'none' }}
                >
                  info@qwca.pk
                </a>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Encrypted &amp; Confidential</span>
              </div>
            </div>
          </div>

          {/* Card 3: Head Office */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(163, 29, 36, 0.1)',
                color: 'var(--primary, #A31D24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MapPin size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>
                Principal Head Office
              </span>
              <p style={{ margin: '4px 0 0', color: '#0f172a', fontWeight: 700, fontSize: '13.5px', lineHeight: '1.4' }}>
                20 - J Commercial Plaza, 4th Floor, Wapda City, Faisalabad
              </p>
            </div>
          </div>

          {/* Card 4: WhatsApp Desk */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(37, 211, 102, 0.12)',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MessageSquare size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>
                Direct WhatsApp Channel
              </span>
              <div style={{ marginTop: '4px' }}>
                <a
                  href="https://wa.me/923008660309"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#16a34a',
                    fontWeight: 800,
                    fontSize: '14.5px',
                    textDecoration: 'none',
                  }}
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink size={13} />
                </a>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Instant Corporate Queries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid: Form & Office Information */}
        <div
          id="inquiry-form"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '28px',
            marginBottom: '48px',
          }}
        >
          {/* Left Column: Interactive Consultation Booking Form */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ marginBottom: '22px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary, #A31D24)', letterSpacing: '0.5px' }}>
                Schedule an Appointment
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '4px 0 6px' }}>
                Book Consultation with CA
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                Fill out the details below. Our corporate coordination team will confirm your session with the relevant practice lead.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Full Name & Corporate Email */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M. Tariq Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tariq@enterprise.com.pk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Phone & Company Name */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92-300-1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Business / Enterprise Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Textiles (Pvt.) Ltd."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Practice Area Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Practice Area / Consultation Subject *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a',
                    background: '#f8fafc',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Taxation & Advisory">Corporate &amp; Individual Taxation Advisory (FBR / PRA)</option>
                  <option value="Statutory & Internal Audit">Statutory &amp; Internal Audit (Companies Act 2017)</option>
                  <option value="SECP Company Registration">SECP Digital Company Registration &amp; Secretarial</option>
                  <option value="SEZ & Industrial Advisory">Special Economic Zones (SEZ) &amp; FIEDMC Tax Holidays</option>
                  <option value="Foreign & Chinese Company Setup">Foreign Direct Investment (FDI) &amp; CPEC Company Setup</option>
                  <option value="Accounting & Financial Outsourcing">Accounting, Bookkeeping &amp; Financial Outsourcing</option>
                  <option value="Urgent Tax Audit Notice Defense">Urgent Defense for FBR Tax Audit / Show-Cause Notice</option>
                </select>
              </div>

              {/* Preferred Meeting Mode */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Preferred Consultation Mode *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                  {[
                    'In-Person (Faisalabad Office)',
                    'Online (Google Meet / Zoom)',
                    'Telephone Consultation',
                  ].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFormData({ ...formData, advisoryMode: mode })}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: formData.advisoryMode === mode ? '2px solid var(--primary, #A31D24)' : '1px solid #cbd5e1',
                        background: formData.advisoryMode === mode ? 'rgba(163, 29, 36, 0.06)' : '#ffffff',
                        color: formData.advisoryMode === mode ? 'var(--primary, #A31D24)' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: formData.advisoryMode === mode ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message / Scope */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Scope of Advisory / Specific Business Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe your financial requirements, tax year issues, SECP corporate goals, or relevant deadlines..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a',
                    background: '#f8fafc',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  padding: '14px 24px',
                  background: 'var(--primary, #A31D24)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(163, 29, 36, 0.35)',
                  transition: 'background 0.2s, transform 0.1s',
                }}
              >
                <span>Submit &amp; Open Encrypted Email Draft</span>
                <Send size={16} />
              </button>

              {submitted && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    color: '#065f46',
                    fontSize: '13.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>
                    Consultation request drafted! An encrypted message window opened to transmit your inquiry directly to <strong>info@qwca.pk</strong>.
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Office Location Details & Google Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Interactive Office Switcher Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary, #A31D24)', letterSpacing: '0.5px' }}>
                    Regional Practice Corridors
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '4px 0 0' }}>
                    Our Office Locations
                  </h3>
                </div>

                {/* Country Tabs */}
                <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                  {officesData.map((office) => (
                    <button
                      key={office.id}
                      type="button"
                      onClick={() => setActiveOfficeTab(office.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeOfficeTab === office.id ? '#ffffff' : 'transparent',
                        color: activeOfficeTab === office.id ? 'var(--primary, #A31D24)' : '#64748b',
                        fontWeight: 800,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        boxShadow: activeOfficeTab === office.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{office.flag}</span>
                      <span>{office.country}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Office Info Card */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      {activeOffice.title}
                    </h4>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                      {activeOffice.subtitle}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', background: 'rgba(163, 29, 36, 0.1)', color: 'var(--primary, #A31D24)', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                    {activeOffice.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#334155', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <MapPin size={17} color="var(--primary, #A31D24)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <strong>Address:</strong> {activeOffice.fullAddress}
                      <button
                        type="button"
                        onClick={() => handleCopyAddress(activeOffice.fullAddress)}
                        style={{
                          marginLeft: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'none',
                          border: 'none',
                          color: copiedAddress ? '#16a34a' : 'var(--primary, #A31D24)',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {copiedAddress ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={17} color="var(--primary, #A31D24)" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Telephone:</strong> <a href={`tel:${activeOffice.phoneTel}`} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 700 }}>{activeOffice.phone}</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={17} color="var(--primary, #A31D24)" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Email:</strong> <a href={`mailto:${activeOffice.email}`} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 700 }}>{activeOffice.email}</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={17} color="var(--primary, #A31D24)" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Operating Hours:</strong> {activeOffice.hours} ({activeOffice.timezoneCode})
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UserCheck size={17} color="var(--primary, #A31D24)" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Practice Lead:</strong> {activeOffice.liaisonLead}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  <a
                    href={activeOffice.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      background: 'var(--primary, #A31D24)',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Get Google Map Directions</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Embedded Google Maps Container */}
              <div
                style={{
                  height: '240px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  position: 'relative',
                }}
              >
                <iframe
                  title={`${activeOffice.title} Map`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(activeOffice.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>

            {/* Advisory Protocols & Confidentiality Notice */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--primary, #A31D24)" />
                <span>ICAP Professional Secrecy &amp; Confidentiality Guarantee</span>
              </h4>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                As an accredited Member Firm of the Institute of Chartered Accountants of Pakistan (ICAP), all consultations, financial disclosures, and strategic corporate documents are governed by statutory professional confidentiality regulations and non-disclosure obligations.
              </p>
            </div>
          </div>
        </div>

        {/* Client FAQ Section */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '36px',
            marginBottom: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary, #A31D24)', letterSpacing: '0.5px' }}>
              Client Guidance
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '4px 0 0' }}>
              Frequently Asked Consultation Questions
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '14.5px', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                How do I schedule an in-person meeting with a Partner?
              </strong>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                You can book directly using the advisory form above, or call our Faisalabad headquarters hotline at <strong>+92-41-5392192</strong>. In-person consultations are hosted at our Wapda City executive chambers.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '14.5px', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                What documents should I prepare for corporate or tax review?
              </strong>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                For company registration, bring original CNIC/passports of proposed directors. For tax advisory or audit defense, bring previous returns, CPR payment receipts, and any statutory notices issued by FBR/PRA.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '14.5px', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                Can overseas investors or foreign directors meet online?
              </strong>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Yes. Our international liaison desk routinely conducts video consultations across time zones via Google Meet and Zoom, providing bilingual English and Chinese documentation support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '140px 20px', textAlign: 'center', background: '#F8FAFC', minHeight: '100vh' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #cbd5e1', borderTopColor: '#A31D24', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Loading QWCA Contact &amp; Advisory Portal...</p>
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}
