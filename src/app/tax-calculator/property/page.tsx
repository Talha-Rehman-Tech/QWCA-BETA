import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import PropertyTaxCalculator from '@/components/calculator/PropertyTaxCalculator';
import TaxCalendar from '@/components/home/TaxCalendar';

export const metadata: Metadata = {
  title: 'Property Tax Calculator 2026–2027 (Purchase 236K, Sale 236C & CGT Sec 37) | QWCA',
  description:
    'Official Pakistan Property Tax Calculator: Section 236K purchase tax, Section 236C selling withholding, and Capital Gains Tax (Section 37) on open plots, constructed property and flats.',
};

export default function PropertyTaxPage() {
  return (
    <main className="section page-content-section">
      <Suspense fallback={<div style={{ padding: '60px 0', textAlign: 'center' }}>Loading property tax calculator...</div>}>
        <PropertyTaxCalculator />
      </Suspense>
      <div className="container" style={{ marginTop: '50px' }}>
        <TaxCalendar />
      </div>
    </main>
  );
}
