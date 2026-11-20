import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { teamData } from '@/data/team';
import { Award, Briefcase, Code, ArrowRight } from 'lucide-react';
import ScrollRevealContainer from '@/components/layout/ScrollRevealContainer';

export const metadata: Metadata = {
  title: 'Our Leadership & Practice Team | QWCA',
  description:
    'Meet the chartered accountants, tax advisors, and technology leaders steering Qummar Waheed Chartered Accountants.',
};

export default function TeamPage() {
  const financeTeam = teamData.filter((m) => m.department === 'Finance & Accounting');
  const itTeam = teamData.filter((m) => m.department === 'Information Technology & Systems');

  return (
    <main className="section page-content-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Professional Leadership</span>
          <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>Meet the QWCA Practice Team</h1>
          <p style={{ maxWidth: '780px', margin: '0 auto' }}>
            Our multidisciplinary team combines seasoned chartered accountancy and corporate law expertise with modern enterprise software engineering.
          </p>
        </div>

        {/* Category 1: Finance and Accounting Team */}
        <div className="team-department" style={{ marginTop: '40px' }}>
          <div className="dept-header">
            <span className="dept-badge">
              <Briefcase size={15} strokeWidth={2.2} />
              <span>Finance &amp; Accounting Team</span>
            </span>
            <h2 className="dept-title">Accounting, Audit &amp; Taxation Advisory</h2>
            <p className="dept-desc">
              Chartered accountants and financial advisors providing statutory audit, corporate and individual taxation, SECP compliance, and business advisory services.
            </p>
          </div>

          <ScrollRevealContainer selector=".team-member-card" stagger={0.12} y={35}>
            <div className="team-dept-grid">
              {financeTeam.map((member) => (
                <article key={member.id} className="team-member-card">
                  <div className="team-member-photo-wrap">
                    <Image
                      className="team-member-photo"
                      src={member.image}
                      alt={`${member.name}, ${member.role}`}
                      width={400}
                      height={450}
                    />
                  </div>
                  <div className="team-member-info">
                    <div className="team-member-top">
                      <span className="team-member-pill">{member.pill}</span>
                      {member.linkedin && (
                        <a
                          className="team-linkedin-btn"
                          href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${member.name}'s LinkedIn profile`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.46 1.46 0 0 0-2.91 0c0 .8.65 1.45 1.46 1.45m1.37 9.74v-8.37H5.09v8.37z" />
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                  <h3 className="team-member-name">
                    {member.linkedin ? (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        {member.name}
                      </a>
                    ) : (
                      member.name
                    )}
                  </h3>
                  <p className="team-member-role">{member.role}</p>
                  <div className="team-member-meta">
                    <span>{member.qualification}</span>
                  </div>
                  <p className="team-member-bio">{member.bio}</p>
                </div>
              </article>
            ))}
            </div>
          </ScrollRevealContainer>
        </div>

        {/* Category 2: Information Technology & Systems Department */}
        <div className="team-department" style={{ marginTop: '60px' }}>
          <div className="dept-header">
            <span className="dept-badge">
              <Code size={15} strokeWidth={2.2} />
              <span>Information Technology &amp; Systems Department</span>
            </span>
            <h2 className="dept-title">Technology &amp; Digital Engineering</h2>
            <p className="dept-desc">
              Our software engineers design, develop, and maintain secure digital systems, automated taxation portals, and high-performance IT infrastructure for the firm and its corporate clients.
            </p>
          </div>

          <ScrollRevealContainer selector=".team-member-card" stagger={0.12} y={35}>
            <div className="team-dept-grid">
              {itTeam.map((member) => (
                <article key={member.id} className="team-member-card">
                  <div className="team-member-photo-wrap">
                    <Image
                      className="team-member-photo"
                      src={member.image}
                      alt={`${member.name}, ${member.role}`}
                      width={400}
                      height={450}
                    />
                  </div>
                  <div className="team-member-info">
                    <div className="team-member-top">
                      <span className="team-member-pill">{member.pill}</span>
                      {member.linkedin && (
                        <a
                          className="team-linkedin-btn"
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${member.name}'s LinkedIn profile`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.46 1.46 0 0 0-2.91 0c0 .8.65 1.45 1.46 1.45m1.37 9.74v-8.37H5.09v8.37z" />
                          </svg>
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                    <h3 className="team-member-name">
                      {member.linkedin ? (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          {member.name}
                        </a>
                      ) : (
                        member.name
                      )}
                    </h3>
                    <p className="team-member-role">{member.role}</p>
                    <div className="team-member-meta">
                      <span>{member.qualification}</span>
                    </div>
                    <p className="team-member-bio">{member.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </ScrollRevealContainer>
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <div
            style={{
              padding: '32px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--line)',
              maxWidth: '680px',
              margin: '0 auto'
            }}
          >
            <h3 style={{ fontSize: '20px', color: 'var(--navy-900)', marginBottom: '8px' }}>
              Want to work with our Chartered Accountants?
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-body)', marginBottom: '20px' }}>
              Schedule a preliminary consultation to evaluate your business audit, corporate structuring, or tax advisory requirements.
            </p>
            <Link href="/contact" className="button">
              <span>Contact Our Practice</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

