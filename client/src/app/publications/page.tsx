'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { publicationsData, Publication } from '@/data/publications';
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import gsap from 'gsap';

export default function PublicationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const listRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Taxation', 'Corporate Law', 'Auditing', 'Foreign Investment'];

  const filteredPublications = publicationsData.filter((pub) => {
    const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !listRef.current) return;

    gsap.fromTo(
      listRef.current.children,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, [selectedCategory, searchQuery]);

  const handleDownload = (pub: Publication) => {
    alert(`Downloading "${pub.title}" (PDF format).\n\nIn this production build, the official publication dossier is bundled for client distribution.`);
  };

  return (
    <main className="section page-content-section">
      <div className="container">
        {/* Page Heading */}
        <div className="section-heading">
          <span className="eyebrow">Knowledge Center &amp; Research</span>
          <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>Research, Publications &amp; Tax Manuals</h1>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>
            Authoritative whitepapers, statutory tax commentary, SECP corporate governance guides, and foreign investment manuals authored by our practicing chartered accountants.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            margin: '36px 0 28px',
            background: 'var(--bg-white)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          {/* Category Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`capital-chip ${selectedCategory === cat ? 'active' : ''}`}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--line)',
                  background: selectedCategory === cat ? 'var(--primary-light)' : 'transparent',
                  color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-body)',
                  fontSize: '13.5px',
                  fontWeight: 600
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search reports or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Publications Grid */}
        {filteredPublications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
            <FileText size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ color: 'var(--navy-900)' }}>No publications found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or selected category filter.</p>
          </div>
        ) : (
          <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {filteredPublications.map((pub) => (
              <article
                key={pub.id}
                className="card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '28px',
                  padding: '32px',
                  alignItems: 'start'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)'
                      }}
                    >
                      {pub.category}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {pub.publishDate}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      {pub.readTime}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '22px', lineHeight: 1.4, color: 'var(--navy-900)', marginBottom: '12px' }}>
                    {pub.title}
                  </h2>

                  <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                    {pub.summary}
                  </p>

                  <button
                    type="button"
                    className="button"
                    onClick={() => handleDownload(pub)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Download size={15} />
                    <span>Download PDF Manual</span>
                  </button>
                </div>

                {pub.tableOfContents && (
                  <div
                    style={{
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      border: '1px solid var(--line)'
                    }}
                  >
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Key Topics Covered
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {pub.tableOfContents.map((topic, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-body)' }}>
                          <CheckCircle2 size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

