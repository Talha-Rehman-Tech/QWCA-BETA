'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 280);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    // Check if lenis is active on window
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Top Reading Progress Line */}
      <div
        className="scroll-progress-line-track"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3.5px',
          zIndex: 99999,
          pointerEvents: 'none',
          background: 'rgba(26, 29, 32, 0.08)',
        }}
      >
        <div
          className="scroll-progress-line-fill"
          style={{
            height: '100%',
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #A31D24 0%, #D32F2F 60%, #E53935 100%)',
            boxShadow: '0 0 10px rgba(163, 29, 36, 0.65), 0 0 4px rgba(229, 57, 53, 0.9)',
            transition: 'width 0.08s linear',
            willChange: 'width',
          }}
        />
      </div>

      {/* Floating Scroll to Top Pill with Circular Progress */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`back-to-top-button ${isVisible ? 'visible' : ''}`}
        aria-label="Scroll back to top"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: '#1A1D20',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(26, 29, 32, 0.28), 0 2px 6px rgba(163, 29, 36, 0.2)',
          zIndex: 900,
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? 'visible' : 'hidden',
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* SVG Progress Circle */}
        <svg
          width="46"
          height="46"
          viewBox="0 0 44 44"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
            pointerEvents: 'none',
          }}
        >
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="2.5"
          />
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="#A31D24"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.08s linear',
            }}
          />
        </svg>

        <ArrowUp size={18} strokeWidth={2.5} style={{ position: 'relative', zIndex: 2 }} />
      </button>
    </>
  );
}
