import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import RentalTaxCalculator from '@/components/calculator/RentalTaxCalculator';
import TaxCalendar from '@/components/home/TaxCalendar';

export const metadata: Metadata = {
  title: 'Rental Income Tax Calculator 2026–2027 | Section 155 WHT | QWCA',
  description:
    'Calculate property rental income withholding tax (Section 155), net rental take-home yield, and individual vs corporate landlord obligations.',
};

export default function RentalTaxPage() {
  return (
    <main className="section page-content-section">
      <Suspense fallback={<div style={{ padding: '60px 0', textAlign: 'center' }}>Loading rental income tax calculator...</div>}>
        <RentalTaxCalculator />
      </Suspense>
      <div className="container" style={{ marginTop: '50px' }}>
        <TaxCalendar />
      </div>
    </main>
  );
}
