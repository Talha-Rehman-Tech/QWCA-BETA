'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';

export type LanguageCode = 'en' | 'ur' | 'zh-CN';

interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'ur',
    label: 'Urdu',
    nativeLabel: 'اردو',
    flag: '🇵🇰',
  },
  {
    code: 'zh-CN',
    label: 'Chinese',
    nativeLabel: '中文 (简体)',
    flag: '🇨🇳',
  },
];

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

interface LanguageSelectorProps {
  variant?: 'topbar' | 'navbar' | 'mobile';
}

export default function LanguageSelector({ variant = 'navbar' }: LanguageSelectorProps) {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize and read existing language preference
  useEffect(() => {
    // Check cookie or localStorage
    const saved = localStorage.getItem('qwca_lang') as LanguageCode | null;
    if (saved && (saved === 'en' || saved === 'ur' || saved === 'zh-CN')) {
      setCurrentLang(saved);
      applyLanguage(saved, false);
    }

    // Load Google Translate script dynamically
    loadGoogleTranslateScript();

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadGoogleTranslateScript = () => {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ur,zh-CN',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  };

  const applyLanguage = (code: LanguageCode, reloadIfNeeded = true) => {
    // 1. Set Google Translate Cookie
    const hostname = window.location.hostname;
    const cookieVal = `/en/${code}`;

    document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;

    // Also set for localhost domain variants
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      document.cookie = `googtrans=${cookieVal}; path=/;`;
    }

    localStorage.setItem('qwca_lang', code);
    setCurrentLang(code);

    // 2. Set HTML attributes
    const html = document.documentElement;
    html.setAttribute('lang', code);
    if (code === 'ur') {
      html.setAttribute('dir', 'rtl');
      document.body.classList.add('lang-ur');
      document.body.classList.remove('lang-zh');
    } else if (code === 'zh-CN') {
      html.setAttribute('dir', 'ltr');
      document.body.classList.add('lang-zh');
      document.body.classList.remove('lang-ur');
    } else {
      html.setAttribute('dir', 'ltr');
      document.body.classList.remove('lang-ur', 'lang-zh');
    }

    // 3. Trigger Google Translate combo box if present
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
    } else if (reloadIfNeeded) {
      // If the translate element hasn't wired up yet, quick reload ensures cookie triggers translation
      window.location.reload();
    }
  };

  const handleSelect = (code: LanguageCode) => {
    setIsOpen(false);
    if (code === currentLang) return;
    applyLanguage(code, true);
  };

  const currentOption = languages.find((l) => l.code === currentLang) || languages[0];

  if (variant === 'topbar') {
    return (
      <div ref={dropdownRef} className="lang-selector-topbar" style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="lang-selector-topbar-btn"
          aria-expanded={isOpen}
          aria-label="Select website language (English, Urdu, Chinese)"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            color: '#FFFFFF',
            borderRadius: '999px',
            padding: '3px 10px',
            fontSize: '11.5px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Languages size={13} style={{ color: '#ff8a8f' }} />
          <span>{currentOption.flag}</span>
          <span>{currentOption.nativeLabel}</span>
          <ChevronDown size={11} style={{ opacity: 0.7 }} />
        </button>

        {isOpen && (
          <div
            className="lang-dropdown-menu"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '6px',
              backgroundColor: '#1A1D20',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              padding: '6px',
              minWidth: '150px',
              boxShadow: '0 10px 28px rgba(0, 0, 0, 0.5)',
              zIndex: 99999,
            }}
          >
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  background: item.code === currentLang ? 'rgba(163, 29, 36, 0.35)' : 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{item.flag}</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', fontWeight: 600 }}>
                      {item.nativeLabel}
                    </strong>
                    <span style={{ fontSize: '10px', color: '#ADB5BD' }}>{item.label}</span>
                  </div>
                </div>
                {item.code === currentLang && <Check size={13} color="#4ade80" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="lang-selector-mobile" style={{ padding: '12px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ADB5BD', marginBottom: '8px' }}>
          <Languages size={14} color="#A31D24" />
          <span>Language / زبان / 语言</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '8px 4px',
                borderRadius: '8px',
                backgroundColor: item.code === currentLang ? '#A31D24' : 'rgba(255, 255, 255, 0.06)',
                border: item.code === currentLang ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.flag}</span>
              <span>{item.nativeLabel}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop Navbar Variant
  return (
    <div ref={dropdownRef} className="lang-selector-navbar" style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="lang-selector-nav-btn"
        aria-expanded={isOpen}
        aria-label="Select language (English, Urdu, Chinese)"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          color: '#FFFFFF',
          borderRadius: '999px',
          padding: '8px 14px',
          fontSize: '13.5px',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <Languages size={15} style={{ color: '#A31D24' }} />
        <span>{currentOption.flag}</span>
        <span>{currentOption.nativeLabel}</span>
        <ChevronDown size={13} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <div
          className="lang-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            backgroundColor: '#1A1D20',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '12px',
            padding: '8px',
            minWidth: '180px',
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.55)',
            zIndex: 99999,
          }}
        >
          <div
            style={{
              fontSize: '10.5px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#ADB5BD',
              padding: '4px 10px 8px 10px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '6px',
            }}
          >
            Translate Website
          </div>

          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '8px',
                background: item.code === currentLang ? 'rgba(163, 29, 36, 0.35)' : 'transparent',
                border: item.code === currentLang ? '1px solid rgba(163, 29, 36, 0.5)' : '1px solid transparent',
                color: '#FFFFFF',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '17px' }}>{item.flag}</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>
                    {item.nativeLabel}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#ADB5BD' }}>{item.label}</span>
                </div>
              </div>
              {item.code === currentLang && <Check size={14} color="#4ade80" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
