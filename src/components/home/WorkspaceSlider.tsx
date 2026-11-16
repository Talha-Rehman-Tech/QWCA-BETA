'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  ArrowDown
} from 'lucide-react';
import gsap from 'gsap';

export interface SlideText {
  label: string;
  title: string;
  caption: string;
  location: string;
}

export interface MinimalWorkspaceSlide {
  id: string;
  num: string;
  image: string;
  alt: string;
  translations: {
    en: SlideText;
    ur: SlideText;
    'zh-CN': SlideText;
    ar: SlideText;
  };
}

const uiTranslations = {
  headquarters: {
    en: 'QWCA Headquarters',
    ur: 'کیو ڈبلیو سی اے ہیڈ کوارٹرز',
    'zh-CN': 'QWCA 事务所总部',
    ar: 'المقر الرئيسي لـ QWCA',
  },
  scheduleConsultation: {
    en: 'Schedule Office Consultation',
    ur: 'شیڈول آفس کنسلٹیشن',
    'zh-CN': '预约现场合规咨询',
    ar: 'حجز استشارة مكتبية',
  },
  explorePractice: {
    en: 'Explore Practice',
    ur: 'پریکٹس دریافت کریں',
    'zh-CN': '了解业务领域',
    ar: 'استكشف خدماتنا',
  },
  firmProfile: {
    en: 'Firm Profile & Services',
    ur: 'فرم پروفائل اور خدمات',
    'zh-CN': '公司简介与专业服务',
    ar: 'ملف الشركة والخدمات',
  },
};

const slides: MinimalWorkspaceSlide[] = [
  {
    id: 'office',
    num: '01',
    image: '/assets/office.jpg',
    alt: 'QWCA Managing Partner and Executive Office in Faisalabad',
    translations: {
      en: {
        label: 'Executive Chambers',
        title: 'Managing Partner & Practice Chambers',
        caption: 'Equipped for statutory audit reviews, tax appeals, and confidential corporate consultations.',
        location: 'Executive Wing · Wapda City Plaza, Faisalabad',
      },
      ur: {
        label: 'ایگزیکٹو چیمبرز',
        title: 'مینجنگ پارٹنر اور پریکٹس چیمبرز',
        caption: 'قانونی آڈٹ کے جائزے، ٹیکس اپیلز اور خفیہ کارپوریٹ مشاورت کے لیے مکمل لیس۔',
        location: 'ایگزیکٹو ونگ · واپڈا سٹی پلازہ، فیصل آباد',
      },
      'zh-CN': {
        label: '高级行政办公室',
        title: '管理合伙人与合规执业办公室',
        caption: '专为法定审计审查、税务申诉和企业机密合规咨询而设。',
        location: '行政翼 · 费萨拉巴德瓦普达城广场',
      },
      ar: {
        label: 'المكاتب التنفيذية',
        title: 'الشريك الإداري وغرف الاستشارات القانونية',
        caption: 'مجهزة للمراجعات القانونية والتدقيق، واستئنافات الضرائب، والاستشارات المؤسسية السرية.',
        location: 'الجناح التنفيذي · ساحة مدينة وابدا، فيصل آباد',
      },
    },
  },
  {
    id: 'reception',
    num: '02',
    image: '/assets/reception.jpg',
    alt: 'QWCA Client Reception Desk and Corporate Lounge',
    translations: {
      en: {
        label: 'Client Reception',
        title: 'Client Reception & Executive Lounge',
        caption: 'Welcoming corporate leaders, SECP applicants, and international investors with prompt concierge.',
        location: 'Front Desk & Reception · Entrance Level',
      },
      ur: {
        label: 'کلائنٹ استقبالیہ',
        title: 'کلائنٹ استقبالیہ اور ایگزیکٹو لاؤنج',
        caption: 'کارپوریٹ رہنماؤں، ایس ای سی پی درخواست دہندگان اور بین الاقوامی سرمایہ کاروں کا پرتپاک استقبال۔',
        location: 'فرنٹ ڈیسک اور استقبالیہ · مین انٹرنس',
      },
      'zh-CN': {
        label: '贵宾接待厅',
        title: '客户接待处与行政贵宾厅',
        caption: '以高效专业的礼宾服务，热情迎接企业高管、SECP申报者及跨国投资者。',
        location: '前台与迎宾大厅 · 首层入口',
      },
      ar: {
        label: 'استقبال العملاء',
        title: 'استقبال العملاء والصالة التنفيذية',
        caption: 'الترحيب بقادة الشركات، ومقدمي طلبات SECP، والمستثمرين الدوليين بخدمة راقية وفورية.',
        location: 'مكتب الاستقبال · مستوى المدخل',
      },
    },
  },
  {
    id: 'meeting',
    num: '03',
    image: '/assets/meeting.jpg',
    alt: 'QWCA Boardroom and Statutory Audit Conference Table',
    translations: {
      en: {
        label: 'Conference Boardroom',
        title: 'Statutory Audit & Conference Suite',
        caption: 'Boardroom deliberations, tax dispute defense sessions, and hybrid video conferencing.',
        location: 'Conference Chamber · Suite A',
      },
      ur: {
        label: 'کانفرنس بورڈ روم',
        title: 'قانونی آڈٹ اور کانفرنس سویٹ',
        caption: 'بورڈ روم کے باہمی مباحثے، ٹیکس تنازعات کے دفاعی اجلاس اور ویڈیو کانفرنسنگ۔',
        location: 'کانفرنس چیمبر · سویٹ اے',
      },
      'zh-CN': {
        label: '高级会议室',
        title: '法定审计与多功能会议厅',
        caption: '用于董事会深度审议、税务争议抗辩答辩与跨国混合视频会议。',
        location: '会议大厅 · A号套房',
      },
      ar: {
        label: 'قاعة الاجتماعات',
        title: 'جناح التدقيق القانوني والمؤتمرات',
        caption: 'مداولات مجالس الإدارة، وجلسات الدفاع في النزاعات الضريبية، والاجتماعات الافتراضية المدمجة.',
        location: 'غرفة المؤتمرات · جناح أ',
      },
    },
  },
  {
    id: 'team',
    num: '04',
    image: '/assets/team.jpg',
    alt: 'QWCA Multidisciplinary Team Workspace and Accounting Floor',
    translations: {
      en: {
        label: 'Operations Floor',
        title: 'Multidisciplinary Advisory Floor',
        caption: 'Qualified chartered accountants and tax specialists collaborating on enterprise corporate filings.',
        location: 'Practice Operations · Suite B',
      },
      ur: {
        label: 'آپریشنز فلور',
        title: 'کثیر الشعبہ مشاورتی فلور',
        caption: 'کوالیفائیڈ چارٹرڈ اکاؤنٹنٹس اور ٹیکس ماہرین جو انٹرپرائز کارپوریٹ فائلنگز پر مل کر کام کرتے ہیں۔',
        location: 'پریکٹس آپریشنز · سویٹ بی',
      },
      'zh-CN': {
        label: '业务运营大厅',
        title: '综合财税咨询办公区',
        caption: '资深特许公认会计师与税务专家通力协作，高效处理大型企业法定申报。',
        location: '业务运营中心 · B号套房',
      },
      ar: {
        label: 'طابق العمليات',
        title: 'طابق الاستشارات متعدد التخصصات',
        caption: 'محاسبون قانونيون وخبراء ضرائب مؤهلون يتعاونون لإنجاز الإيداعات المؤسسية للشركات.',
        location: 'عمليات الممارسة · جناح ب',
      },
    },
  },
];

export default function WorkspaceSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [lang, setLang] = useState<'en' | 'ur' | 'zh-CN' | 'ar'>('en');

  // Real-time language synchronizer (responds to LanguageSelector, Google Translate cookie, and DOM attributes)
  useEffect(() => {
    const detectLanguage = () => {
      const saved = localStorage.getItem('qwca_lang');
      const htmlLang = typeof document !== 'undefined' ? document.documentElement.getAttribute('lang') : null;
      const match = typeof document !== 'undefined' ? document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/) : null;
      const cookieLang = match ? match[1] : null;

      const active = saved || cookieLang || htmlLang || 'en';
      if (active.startsWith('zh')) setLang('zh-CN');
      else if (active.startsWith('ur')) setLang('ur');
      else if (active.startsWith('ar')) setLang('ar');
      else setLang('en');
    };

    detectLanguage();

    const handleLangEvent = (e: Event) => {
      const custom = (e as CustomEvent).detail?.lang;
      if (custom) {
        if (custom.startsWith('zh')) setLang('zh-CN');
        else if (custom.startsWith('ur')) setLang('ur');
        else if (custom.startsWith('ar')) setLang('ar');
        else setLang('en');
      } else {
        detectLanguage();
      }
    };

    window.addEventListener('qwca_language_change', handleLangEvent);

    const observer = new MutationObserver(() => {
      detectLanguage();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir', 'class'] });

    return () => {
      window.removeEventListener('qwca_language_change', handleLangEvent);
      observer.disconnect();
    };
  }, []);

  const slideDuration = 4500; // 4.5 seconds auto-scroll
  const stepTime = 50;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
  }, []);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setProgress(0);
  };

  // Continuous Auto-scrolling Timer (always on)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextVal = prev + (stepTime / slideDuration) * 100;
        if (nextVal >= 100) {
          nextSlide();
          return 0;
        }
        return nextVal;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, [nextSlide]);

  // GSAP subtle animation on slide transition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.fromTo(
      '.ws-minimal-anim',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
    );
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStartX(null);
  };

  const scrollToOverview = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('firm-overview');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const current = slides[currentIndex];
  const content = current.translations[lang] || current.translations.en;
  const ui = {
    headquarters: uiTranslations.headquarters[lang] || uiTranslations.headquarters.en,
    scheduleConsultation: uiTranslations.scheduleConsultation[lang] || uiTranslations.scheduleConsultation.en,
    explorePractice: uiTranslations.explorePractice[lang] || uiTranslations.explorePractice.en,
    firmProfile: uiTranslations.firmProfile[lang] || uiTranslations.firmProfile.en,
  };

  return (
    <section
      id="workspace"
      className="workspace-minimal-hero"
      aria-label="QWCA Practice Workspace Showcase"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Full-Screen Enhanced Image Track */}
      <div
        className="workspace-minimal-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={slide.id} className="workspace-minimal-pane" aria-hidden={idx !== currentIndex}>
            <div className="workspace-pane-media">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                quality={92}
                className={`workspace-enhanced-img ${idx === currentIndex ? 'is-active-zoom' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Ultra-Light Ambient Overlay (Preserves clear image brightness) */}
      <div className="workspace-light-overlay" aria-hidden="true" />
      <div className="workspace-bottom-vignette" aria-hidden="true" />

      {/* 3. Top Floating Location Pill & Slide Counter */}
      <div className="container workspace-minimal-topbar">
        <div className="workspace-live-badge">
          <span className="live-pulsing-dot" />
          <span className="live-badge-txt">{ui.headquarters}</span>
        </div>

        <div className="workspace-top-right-meta">
          <div className="workspace-top-loc">
            <MapPin size={13} className="text-crimson" />
            <span>{content.location}</span>
          </div>
          <div className="workspace-top-counter">
            <span className="counter-curr">{current.num}</span>
            <span className="counter-sep">/</span>
            <span className="counter-total">0{slides.length}</span>
          </div>
        </div>
      </div>

      {/* 4. Minimal Overlay Text Box (Clean, Elegant & Compact) */}
      <div className="container workspace-minimal-overlay-content">
        <div className="workspace-minimal-card">
          <div className="workspace-chip ws-minimal-anim">
            <span>{content.label}</span>
          </div>

          <h1 key={`title-${current.id}-${lang}`} className="workspace-minimal-title ws-minimal-anim">
            {content.title}
          </h1>

          <p key={`cap-${current.id}-${lang}`} className="workspace-minimal-caption ws-minimal-anim">
            {content.caption}
          </p>

          <div className="workspace-minimal-actions ws-minimal-anim">
            <Link href="#contact" className="button button-sm workspace-action-primary">
              <span>{ui.scheduleConsultation}</span>
              <ArrowRight size={14} />
            </Link>

            <Link href="/services" className="button button-sm workspace-action-glass">
              <span>{ui.explorePractice}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Left & Right Minimal Arrow Controls */}
      <button
        type="button"
        className="workspace-minimal-chevron ws-chevron-left"
        onClick={prevSlide}
        aria-label="Previous image"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        className="workspace-minimal-chevron ws-chevron-right"
        onClick={nextSlide}
        aria-label="Next image"
      >
        <ChevronRight size={22} />
      </button>

      {/* 6. Minimal Bottom Bar: Slide Indicators & Downward Scroll Link */}
      <div className="container workspace-minimal-bottombar">
        <div className="workspace-minimal-indicators">
          {slides.map((s, idx) => {
            const isActive = idx === currentIndex;
            const slideLabel = s.translations[lang]?.label || s.translations.en.label;
            return (
              <button
                key={s.id}
                type="button"
                className={`workspace-dash-indicator ${isActive ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Switch to slide ${idx + 1}: ${slideLabel}`}
              >
                <span className="indicator-label">{slideLabel}</span>
                <span className="indicator-bar">
                  {isActive && (
                    <span
                      className="indicator-bar-fill"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <a
          href="#firm-overview"
          onClick={scrollToOverview}
          className="workspace-glide-down"
          aria-label="Scroll down to firm overview"
        >
          <span>{ui.firmProfile}</span>
          <ArrowDown size={13} className="glide-down-arrow" />
        </a>
      </div>

      {/* 7. Subtle Bottom Progress Line */}
      <div className="workspace-edge-progress" aria-hidden="true">
        <div
          className="workspace-edge-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}
