import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import BusinessTaxCalculator from '@/components/calculator/BusinessTaxCalculator';
import TaxCalendar from '@/components/home/TaxCalendar';

export const metadata: Metadata = {
  title: 'Business & Corporate Tax Calculator 2026–2027 | Super Tax (Sec 4C) | QWCA',
  description:
    'Compute enterprise tax liability for Sole Proprietors, AOP Partnerships, Private Ltd companies, Small Companies (20%), and Super Tax under Section 4C.',
};

export default function BusinessTaxPage() {
  return (
    <main className="section page-content-section">
      <Suspense fallback={<div style={{ padding: '60px 0', textAlign: 'center' }}>Loading business tax calculator...</div>}>
        <BusinessTaxCalculator />
      </Suspense>
      <div className="container" style={{ marginTop: '50px' }}>
        <TaxCalendar />
      </div>
    </main>
  );
}
