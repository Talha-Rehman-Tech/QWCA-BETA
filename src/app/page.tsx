import React from 'react';
import WorkspaceSlider from '@/components/home/WorkspaceSlider';
import HeroSlider from '@/components/home/HeroSlider';
import TrustedPartnersScroller from '@/components/home/TrustedPartnersScroller';
import AboutSnapshot from '@/components/home/AboutSnapshot';
import ServicesGrid from '@/components/home/ServicesGrid';
import TaxCalculatorCTA from '@/components/home/TaxCalculatorCTA';
import TaxComplianceOverview from '@/components/home/TaxComplianceOverview';
import RegistrationHighlights from '@/components/home/RegistrationHighlights';
import CostEstimatorCTA from '@/components/home/CostEstimatorCTA';
import TeamPreview from '@/components/home/TeamPreview';
import RecentPublications from '@/components/home/RecentPublications';
import ContactSection from '@/components/home/ContactSection';
import OfficeLocationsSection from '@/components/home/OfficeLocationsSection';

export default function HomePage() {
  return (
    <main>
      {/* 1. Premier Corporate Workspace Slider (Office, Reception, Boardroom & Team Floor) */}
      <WorkspaceSlider />

      {/* 2. Practice Overview & Executive Advisory Hero Slider */}
      <HeroSlider />

      {/* 2.5. Trusted Regulatory & Institutional Partners Infinite Marquee */}
      <TrustedPartnersScroller />

      {/* 3. About Us Snapshot */}
      <AboutSnapshot />

      {/* 3. Services Grid (linking to /services/[slug]) */}
      <ServicesGrid />

      {/* 4. Tax Calculator CTA (Directs audience to dedicated /tax-calculator route) */}
      <TaxCalculatorCTA />

      {/* 5. Tax & Compliance Corporate Highlights */}
      <TaxComplianceOverview />

      {/* 6. Company Registration Highlights (linking to /company-registration) */}
      <RegistrationHighlights />

      {/* 7. Business Cost Estimator CTA (linking to /cost-estimator) */}
      <CostEstimatorCTA />

      {/* 8. Meet Our Team (Preview linking to /team) */}
      <TeamPreview />

      {/* 9. Latest Research & Publications (linking to /publications) */}
      <RecentPublications />

      {/* 10. Contact & Consultation Section */}
      <ContactSection />

      {/* 11. Global Office Locations & Interactive Google Maps (Pakistan, UAE, China) */}
      <OfficeLocationsSection />
    </main>
  );
}
