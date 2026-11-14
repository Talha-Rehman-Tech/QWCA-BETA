'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function PageTransitionLoader() {
  const [isDone, setIsDone] = useState(false);
  const [percent, setPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const movingBadgeRef = useRef<HTMLDivElement>(null);
  const glowHeadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const counter = { val: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
        },
      });

      // Animate percentage, progress bar, and the moving 0-100 indicator badge
      tl.to(counter, {
        val: 100,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: () => {
          const current = Math.floor(counter.val);
          setPercent(current);
          if (movingBadgeRef.current) {
            movingBadgeRef.current.style.left = `${current}%`;
          }
          if (glowHeadRef.current) {
            glowHeadRef.current.style.left = `${current}%`;
          }
        },
      })
      .to(
        progressBarRef.current,
        {
          width: '100%',
          duration: 1.4,
          ease: 'power2.inOut',
        },
        '<'
      )
      // Celebratory punch on reaching 100%
      .to(movingBadgeRef.current, {
        scale: 1.15,
        duration: 0.16,
        yoyo: true,
        repeat: 1,
        ease: 'power1.out',
      })
      // Fade out inner content
      .to(contentRef.current, {
        opacity: 0,
        y: -24,
        scale: 0.98,
        duration: 0.45,
        ease: 'power3.in',
      })
      // Slide up preloader curtain
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (isDone) return null;

  const getStageMessage = (pct: number) => {
    if (pct < 28) return 'Connecting to SECP & FBR Systems...';
    if (pct < 62) return 'Loading Statutory Tax Slabs & Fee Tables...';
    if (pct < 88) return 'Initializing QWCA Advisory Engine...';
    return 'Practice Portal Ready · Welcome to QWCA';
  };

  return (
    <div
      ref={containerRef}
      className="page-preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#141618',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient gradient glow */}
      <div
        style={{
          position: 'absolute',
          width: 'clamp(500px, 50vw, 1000px)',
          height: 'clamp(500px, 50vw, 1000px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(163, 29, 36, 0.22) 0%, rgba(20, 22, 24, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={contentRef}
        className="preloader-content-wrap"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '540px',
          width: '100%',
          padding: '0 24px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Logo Shield */}
        <div
          className="preloader-logo-chamber"
          style={{
            position: 'relative',
            width: '76px',
            height: '76px',
            marginBottom: '20px',
            padding: '8px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Image
            src="/assets/logo.png"
            alt="QWCA Logo"
            width={60}
            height={60}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Firm Title */}
        <span
          className="preloader-eyebrow"
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            fontWeight: 700,
            color: '#A31D24',
            marginBottom: '6px',
          }}
        >
          Qummar Waheed Chartered Accountants
        </span>
        <h2
          className="preloader-title"
          style={{
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '-0.3px',
            color: '#FFFFFF',
            margin: '0 0 10px 0',
            fontFamily: 'inherit',
          }}
        >
          Audit · Tax · Corporate Law · SEZ Advisory
        </h2>
        <p
          className="preloader-subtitle"
          style={{
            fontSize: '12px',
            color: '#ADB5BD',
            margin: '0 0 44px 0',
            letterSpacing: '0.2px',
          }}
        >
          ICAP Approved Training Organization · Faisalabad &amp; Nationwide
        </p>

        {/* Dynamic Moving Counter & Progress Track Area */}
        <div
          className="preloader-track-wrapper"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            paddingTop: '32px',
            marginBottom: '18px',
          }}
        >
          {/* MOVING 0 to 100 PERCENTAGE BADGE */}
          <div
            ref={movingBadgeRef}
            className="preloader-moving-badge"
            style={{
              position: 'absolute',
              top: '0px',
              left: '0%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #A31D24 0%, #D32F2F 100%)',
              color: '#FFFFFF',
              padding: '3px 9px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 14px rgba(163, 29, 36, 0.7), 0 0 8px rgba(229, 57, 53, 0.6)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              transition: 'transform 0.05s ease-out',
              willChange: 'left',
            }}
          >
            <span>{percent}%</span>
            {/* Little pointer triangle pointing to the line */}
            <div
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '5px solid #D32F2F',
              }}
            />
          </div>

          {/* Progress Bar Track */}
          <div
            className="preloader-progress-track"
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              position: 'relative',
            }}
          >
            {/* Filled Progress Line */}
            <div
              ref={progressBarRef}
              className="preloader-progress-fill"
              style={{
                width: '0%',
                height: '100%',
                background: 'linear-gradient(90deg, #A31D24 0%, #E53935 100%)',
                borderRadius: '999px',
                boxShadow: '0 0 14px rgba(163, 29, 36, 0.9)',
              }}
            />

            {/* Glowing Head Point moving along with line */}
            <div
              ref={glowHeadRef}
              className="preloader-glow-head"
              style={{
                position: 'absolute',
                top: '50%',
                left: '0%',
                transform: 'translate(-50%, -50%)',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 12px 3px #E53935, 0 0 20px 6px rgba(163, 29, 36, 0.8)',
                pointerEvents: 'none',
                willChange: 'left',
              }}
            />
          </div>
        </div>

        {/* Dynamic Stage Status Message */}
        <span
          className="preloader-stage-text"
          style={{
            fontSize: '11.5px',
            color: '#ADB5BD',
            letterSpacing: '0.4px',
            fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
        >
          {getStageMessage(percent)}
        </span>
      </div>
    </div>
  );
}
