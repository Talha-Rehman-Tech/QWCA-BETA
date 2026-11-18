'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  selector?: string;
  stagger?: number;
  y?: number;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollRevealContainer({
  children,
  selector = '.card, article, .section-heading, .anim-reveal',
  stagger = 0.1,
  y = 35,
  duration = 0.75,
  delay = 0,
  className,
  style,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll(selector);
      if (!elements || elements.length === 0) return;

      gsap.fromTo(
        elements,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [selector, stagger, y, duration, delay]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}
