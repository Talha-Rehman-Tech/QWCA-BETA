'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Slide {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  photoUrl: string;
  photoAlt: string;
  badgeCode: string;
  badgeTitle: string;
  badgeSubtitle: string;
  badgeLink?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    eyebrow: 'Qummar Waheed Chartered Accountants',
    title: 'Clear advice for better business decisions.',
    description:
      'Reliable accounting, audit, taxation, and corporate advisory services for businesses and individuals across Faisalabad and nationwide.',
    primaryCtaText: 'Schedule a Consultation',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'Explore Services',
    secondaryCtaLink: '/services',
    photoUrl: '/assets/Qummar Waheed.webp',
    photoAlt: 'Qummar Waheed, ACA - Managing Partner of QWCA',
    badgeCode: 'ACA',
    badgeTitle: 'Qummar Waheed, ACA',
    badgeSubtitle: 'Managing Partner · QWCA',
    badgeLink: 'https://www.linkedin.com/in/qummar-waheed-aca-ab3b3164/'
  },
  {
    id: 2,
    eyebrow: 'Corporate Law & SECP Compliance',
    title: 'Seamless company registration & governance.',
    description:
      'Incorporate Private Limited, Single-Member, and foreign companies with expedited SECP eZfile filings and full regulatory compliance.',
    primaryCtaText: 'Company Registration Guide',
    primaryCtaLink: '/company-registration',
    secondaryCtaText: 'Estimate Setup Cost',
    secondaryCtaLink: '/cost-estimator',
    photoUrl: '/assets/Qummar Waheed.webp',
    photoAlt: 'Qummar Waheed, ACA - Corporate Practice Lead',
    badgeCode: 'SECP',
    badgeTitle: 'Qummar Waheed, ACA',
    badgeSubtitle: 'SECP Authorized Corporate Intermediary',
    badgeLink: 'https://www.linkedin.com/in/qummar-waheed-aca-ab3b3164/'
  },
  {
    id: 3,
    eyebrow: 'Cross-Border & SEZ Advisory',
    title: 'Foreign incorporation & CPEC tax concessions.',
    description:
      'Dedicated compliance and 10-year income tax holiday advisory for foreign direct investors, Chinese enterprises, and industrial manufacturers.',
    primaryCtaText: 'Foreign Incorporation Guide',
    primaryCtaLink: '/company-registration',
    secondaryCtaText: 'SEZ Tax Holiday Info',
    secondaryCtaLink: '/services/sez-advisory',
    photoUrl: '/assets/Qummar Waheed.webp',
    photoAlt: 'Qummar Waheed, ACA - Managing Partner',
    badgeCode: 'SEZ',
    badgeTitle: 'Qummar Waheed, ACA',
    badgeSubtitle: 'CPEC & SEZ Advisory Practice Lead',
    badgeLink: 'https://www.linkedin.com/in/qummar-waheed-aca-ab3b3164/'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // GSAP animation on slide change & initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Staggered slide content reveal
      gsap.fromTo(
        '.hero-slide-anim',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'power3.out' }
      );

      // Hero photo cross-scale transition
      gsap.fromTo(
        '.hero-photo',
        { opacity: 0.6, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      );

      // Badge entrance
      gsap.fromTo(
        '.hero-photo-badge',
        { y: 16, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.15, ease: 'back.out(1.4)' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [currentSlide]);

  // GSAP ScrollTrigger parallax & ambient floating
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Parallax effect on photo wrap during scroll
      if (photoWrapRef.current) {
        gsap.to(photoWrapRef.current, {
          y: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Continuous subtle ambient float for badge
      gsap.to('.hero-photo-badge', {
        y: -6,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const slide = slides[currentSlide];

  return (
    <section
      ref={heroRef}
      className="hero hero-slider-container"
      id="firm-overview"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container hero-layout">
        {/* Left Content */}
        <div className="hero-content">
          <span className="eyebrow hero-slide-anim">{slide.eyebrow}</span>
          <h1 key={`title-${slide.id}`} className="hero-animated-title hero-slide-anim">
            {slide.title}
          </h1>
          <p key={`desc-${slide.id}`} className="hero-animated-desc hero-slide-anim">
            {slide.description}
          </p>

          <div className="hero-actions hero-slide-anim">
            <Link className="button" href={slide.primaryCtaLink}>
              <span>{slide.primaryCtaText}</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>

            {slide.secondaryCtaText && slide.secondaryCtaLink && (
              <Link className="button button-outline" href={slide.secondaryCtaLink}>
                <span>{slide.secondaryCtaText}</span>
              </Link>
            )}
          </div>

          {/* Slider Controls */}
          <div className="hero-slider-nav hero-slide-anim">
            <div className="slider-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="slider-arrows">
              <button
                type="button"
                className="slider-arrow-btn"
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                aria-label="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="slider-arrow-btn"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                aria-label="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Photo */}
        <div ref={photoWrapRef} className="hero-photo-wrap">
          <Image
            className="hero-photo"
            src={slide.photoUrl}
            alt={slide.photoAlt}
            width={928}
            height={1152}
            priority
          />
          <div className="hero-photo-badge">
            <div className="hero-photo-badge-icon">{slide.badgeCode}</div>
            <div className="hero-photo-badge-text">
              {slide.badgeLink ? (
                <a
                  href={slide.badgeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${slide.badgeTitle}'s LinkedIn profile`}
                >
                  <strong>{slide.badgeTitle}</strong>
                </a>
              ) : (
                <strong>{slide.badgeTitle}</strong>
              )}
              <span>{slide.badgeSubtitle}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
