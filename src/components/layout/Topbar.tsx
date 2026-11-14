import React from 'react';
import { ShieldCheck } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface TopbarProps {
  isScrolled?: boolean;
}

export default function Topbar({ isScrolled }: TopbarProps) {
  return (
    <div className={`topbar ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container topbar-container">
        <div className="topbar-icap-tag">
          <span className="topbar-pulse-dot" aria-hidden="true"></span>
          <ShieldCheck size={14} strokeWidth={2.4} className="topbar-icap-icon" />
          <span className="topbar-text-desktop">
            Institute of Chartered Accountants of Pakistan (ICAP) · Registered Practicing Firm &amp; Approved Training Organization (ATO)
          </span>
          <span className="topbar-text-mobile">
            ICAP Registered Practicing Firm · ATO Approved
          </span>
        </div>

        {/* Translation Switcher Option: English | Urdu | Chinese */}
        <div className="topbar-actions">
          <LanguageSelector variant="topbar" />
        </div>
      </div>
    </div>
  );
}
