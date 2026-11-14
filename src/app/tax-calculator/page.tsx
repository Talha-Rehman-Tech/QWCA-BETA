import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import IncomeTaxCalculator from '@/components/calculator/IncomeTaxCalculator';
import TaxCalendar from '@/components/home/TaxCalendar';

export const metadata: Metadata = {
  title: 'Pakistan Income Tax Calculator 2026–2027 (Salaried, Business & Rental) | QWCA',
  description:
    'Official interactive calculator for salaried income tax, corporate business tax, Super Tax (Sec 4C), and property rental tax under FBR Income Tax Ordinance 2001.',
};

export default function TaxCalculatorPage() {
  return (
    <main className="section page-content-section">
      <div className="container">
        <Suspense fallback={<div style={{ padding: '60px 0', textAlign: 'center' }}>Loading tax calculator...</div>}>
          <IncomeTaxCalculator />
        </Suspense>
        <div style={{ marginTop: '50px' }}>
          <TaxCalendar />
        </div>
      </div>
    </main>
  );
}
