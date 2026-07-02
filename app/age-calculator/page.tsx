import type { Metadata } from 'next';
import AgeCalculatorTool from '@/components/tools/AgeCalculatorTool';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Age Calculator for Govt Jobs - SelectionSure',
  description: 'Calculate your exact age in years, months, and days. Check your eligibility for SSC, UPSC, and other government exams using a specific cutoff date.',
  keywords: 'age calculator, government job age calculator, SSC age limit calculator, UPSC age limit, calculate exact age, age cutoff calculator',
  alternates: {
    canonical: '/age-calculator',
  },
  openGraph: {
    title: 'Age Calculator for Govt Jobs - SelectionSure',
    description: 'Calculate your exact age in years, months, and days for government job eligibility.',
    url: 'https://SelectionSure.com/age-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator for Govt Jobs - SelectionSure',
    description: 'Calculate your exact age in years, months, and days for government job eligibility.',
  },
};

export default function AgeCalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Govt Job Age Calculator',
    operatingSystem: 'Any',
    applicationCategory: 'UtilitiesApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: 'Calculate exact age in years, months, and days for government job eligibility exams like SSC, UPSC, Banking, and State Govt.',
    url: 'https://SelectionSure.com/age-calculator',
  };

  return (
    <>
      <StructuredData data={schema} />
      <AgeCalculatorTool />
    </>
  );
}
