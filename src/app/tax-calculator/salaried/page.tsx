import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import SalariedTaxCalculator from '@/components/calculator/SalariedTaxCalculator';
import TaxCalendar from '@/components/home/TaxCalendar';

export const metadata: Metadata = {
  title: 'Salaried Income Tax Calculator 2026–2027 | QWCA',
  description:
    'Calculate Pakistan salaried income tax under Section 149 and Division I, Part I of the First Schedule to the Income Tax Ordinance, 2001. View monthly take-home, withholding, and official tax slabs.',
};

export default function SalariedTaxPage() {
  return (
    <main className="section page-content-section">
      <Suspense fallback={<div style={{ padding: '60px 0', textAlign: 'center' }}>Loading salaried calculator...</div>}>
        <SalariedTaxCalculator />
      </Suspense>
      <div className="container" style={{ marginTop: '50px' }}>
        <TaxCalendar />
      </div>
    </main>
  );
}
