import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import ScrollProgress from '@/components/layout/ScrollProgress';
import PageTransitionLoader from '@/components/layout/PageTransitionLoader';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://qwca.pk'),
  title: {
    default: 'QWCA | Chartered Accountants, Corporate Law & Business Advisory',
    template: '%s | QWCA Chartered Accountants',
  },
  description:
    'Qummar Waheed Chartered Accountants provides statutory audit, corporate taxation, SECP compliance, foreign incorporation, and business consulting services in Faisalabad and across Pakistan.',
  keywords: [
    'Chartered Accountants Faisalabad',
    'Tax Consultant Faisalabad',
    'SECP Company Registration Pakistan',
    'CPEC Chinese Company Incorporation',
    'Income Tax Return FBR',
    'Statutory Audit Assurance Pakistan',
    'ICAP Approved Training Organization',
  ],
  authors: [{ name: 'Qummar Waheed Chartered Accountants' }],
  creator: 'QWCA',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://qwca.pk',
    title: 'QWCA | Chartered Accountants, Corporate Law & Business Advisory',
    description:
      'ICAP approved practicing firm providing statutory audit, corporate taxation, SECP compliance, and CPEC foreign investment advisory in Pakistan.',
    siteName: 'QWCA Chartered Accountants',
    images: [
      {
        url: '/assets/logo.png',
        width: 800,
        height: 800,
        alt: 'QWCA Chartered Accountants Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QWCA | Chartered Accountants, Corporate Law & Business Advisory',
    description: 'ICAP approved practicing firm providing statutory audit, tax planning, and SECP compliance in Pakistan.',
    images: ['/assets/logo.png'],
  },
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div id="google_translate_element" style={{ display: 'none' }} aria-hidden="true" />
        <PageTransitionLoader />
        <ScrollProgress />
        <SmoothScroll>
          <Navbar />
          <div className="site-page-body">
            {children}
          </div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
