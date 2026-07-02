import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import BreakingNews from '@/components/layout/BreakingNews';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Footer from '@/components/layout/Footer';
import StickyMobileTabs from '@/components/layout/StickyMobileTabs';
import { ReduxProvider } from '@/store/Provider';

const notoSans = Noto_Sans({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://selectionsure.app'),
  title: 'SelectionSure - Latest Government Jobs, Admit Cards & Sarkari Results',
  description: 'Get real-time updates for latest government jobs, SSC, UPSC, Railway (RRB) exams, Admit Cards, Sarkari Results, Syllabi, and Answer Keys on SelectionSure.',
  keywords: 'Sarkari Result, Government Jobs, Free Job Alert, SSC, UPSC, Railway Jobs, Admit Card, Answer Key',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SelectionSure - Latest Government Jobs',
    description: 'Get real-time updates for latest government jobs, SSC, UPSC, Railway (RRB) exams, Admit Cards, Sarkari Results, Syllabi, and Answer Keys.',
    url: 'https://selectionsure.app',
    siteName: 'SelectionSure',
    images: [
      {
        url: '/asset/branding.png',
        width: 800,
        height: 600,
        alt: 'SelectionSure Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SelectionSure - Latest Government Jobs',
    description: 'Get real-time updates for latest government jobs, SSC, UPSC, Railway (RRB) exams, Admit Cards, Sarkari Results, Syllabi, and Answer Keys.',
    creator: '@selectionsure',
    images: ['/asset/branding.png'],
  },
};

import { connectToDatabase } from '@/lib/server/db';
import { Job as JobModel } from '@/lib/server/models/Job';
import Script from 'next/script';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch today's job count
  let todayJobsCount = 0;
  try {
    await connectToDatabase();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    todayJobsCount = await JobModel.countDocuments({ createdAt: { $gte: startOfToday } });
  } catch (error) {
    console.error('Failed to fetch today jobs count:', error);
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-8YSMYPTPJ3';

  return (
    <html lang="en">
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${notoSans.variable} antialiased min-h-screen flex flex-col pb-14 md:pb-0`}>
        <ReduxProvider>
          <div className="sticky top-0 z-50 print:hidden">
            <Navbar todayJobsCount={todayJobsCount} />
            <BreakingNews />
            <div className="max-w-7xl w-full mx-auto px-4">
              <Breadcrumbs />
            </div>
          </div>
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 md:py-10">
            {children}
          </main>
          <div className="print:hidden">
            <Footer />
            <StickyMobileTabs />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
