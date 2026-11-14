'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { teamData } from '@/data/team';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TeamPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredMembers = teamData.slice(0, 4);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        '.team-anim-head',
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
        '.team-accent-line',
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

      // Staggered team cards
      gsap.fromTo(
        '.team-member-card',
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.team-dept-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section team-preview-section" id="team-preview">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow team-anim-head">Leadership &amp; Practice Experts</span>
          <div
            className="team-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2 className="team-anim-head">Meet Our Leadership Team</h2>
          <p className="team-anim-head">
            Our multidisciplinary team of chartered accountants, financial managers, and corporate consultants delivers dependable audit, taxation, and corporate advisory.
          </p>
        </div>

        <div className="team-dept-grid">
          {featuredMembers.map((member) => (
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
                <h4 className="team-member-name">
                  {member.linkedin ? (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      {member.name}
                    </a>
                  ) : (
                    member.name
                  )}
                </h4>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-qual">{member.qualification}</p>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/team" className="button button-outline">
            <span>View Full Leadership &amp; Practice Team</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
