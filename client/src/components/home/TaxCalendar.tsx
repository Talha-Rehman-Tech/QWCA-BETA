'use client';

import React, { useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Clock, Building, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TaxCalendar() {
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        '.cal-anim-head',
        { y: 30, opacity: 0 },
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

      // Section line expansion
      gsap.fromTo(
        '.cal-accent-line',
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

      // Table wrap reveal
      if (tableRef.current) {
        gsap.fromTo(
          tableRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tableRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const complianceEvents = [
    {
      title: 'Sales Tax Return (E-Filing)',
      authority: 'FBR / PRA / SRB',
      frequency: 'Monthly',
      deadline: '15th of each month (Annexure-C) & 18th (Payment/Return)',
      badgeClass: 'badge-fbr',
      notes: 'Mandatory for all sales tax registered persons, manufacturers, and service providers.',
    },
    {
      title: 'Withholding Tax (WHT) Statement',
      authority: 'FBR (Section 165)',
      frequency: 'Quarterly',
      deadline: '20th day of the month following end of quarter',
      badgeClass: 'badge-fbr',
      notes: 'Quarterly statements of tax collected or deducted under all withholding provisions.',
    },
    {
      title: 'Annual Income Tax Return (Companies)',
      authority: 'FBR (Section 114)',
      frequency: 'Annual',
      deadline: '31st December (for financial year ending June 30)',
      badgeClass: 'badge-fbr',
      notes: 'Audited financial statements and statutory tax reconciliation required.',
    },
    {
      title: 'Annual Company Return (Form A / Form 29)',
      authority: 'SECP (Companies Act 2017)',
      frequency: 'Annual',
      deadline: 'Within 30 days of Annual General Meeting (AGM)',
      badgeClass: 'badge-secp',
      notes: 'Statutory filing of directors, registered office, and beneficial ownership.',
    },
  ];

  return (
    <section ref={sectionRef} className="section calendar" id="calendar">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow cal-anim-head">Statutory Compliance</span>
          <div
            className="cal-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2 className="cal-anim-head">Tax &amp; Compliance Calendar</h2>
          <p className="cal-anim-head">
            Statutory tax and corporate deadlines in Pakistan. Dates may be extended via official circulars by FBR or SECP.
          </p>
        </div>

        <div ref={tableRef} className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Filing &amp; Statutory Requirement</th>
                <th>Authority</th>
                <th>Frequency</th>
                <th>Statutory Deadline &amp; Guidelines</th>
              </tr>
            </thead>
            <tbody>
              {complianceEvents.map((evt, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{evt.title}</strong>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {evt.notes}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${evt.badgeClass}`}>{evt.authority}</span>
                  </td>
                  <td>{evt.frequency}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarIcon size={14} color="var(--primary)" />
                      <span>{evt.deadline}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
