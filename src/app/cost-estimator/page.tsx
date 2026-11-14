import type { Metadata } from 'next';
import CostCalculator from '@/components/calculator/CostCalculator';

export const metadata: Metadata = {
  title: 'Business Setup Cost Estimator | QWCA',
  description:
    'Calculate total estimated company registration, SECP fees, corporate NTN, sales tax, and legal drafting costs in Pakistan in real-time.',
};

export default function CostEstimatorPage() {
  return (
    <main className="section page-content-section">
      <div className="container">
        <div className="section-heading" style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Interactive Pricing &amp; Regulatory Tool</span>
          <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>Business Cost Estimation Calculator</h1>
          <p style={{ maxWidth: '780px', margin: '0 auto' }}>
            Transparent estimation of company registration, statutory SECP fees, FBR tax registrations, trademark filing, and professional legal drafting in Pakistan.
          </p>
        </div>

        <CostCalculator />
      </div>
    </main>
  );
}

