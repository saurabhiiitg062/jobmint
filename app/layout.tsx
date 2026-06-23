import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileTabs from '@/components/layout/StickyMobileTabs';
import { ReduxProvider } from '@/store/Provider';

const notoSans = Noto_Sans({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SelectionSure - Latest Government Jobs, Admit Cards & Sarkari Results 2026',
  description: 'Get real-time updates for latest government jobs, SSC, UPSC, Railway (RRB) exams, Admit Cards, Sarkari Results, Syllabi, and Answer Keys on SelectionSure.',
  keywords: 'Sarkari Result, Government Jobs, Free Job Alert, SSC, UPSC, Railway Jobs, Admit Card, Answer Key',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} antialiased min-h-screen flex flex-col pb-14 md:pb-0`}>
        <ReduxProvider>
          <Navbar />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 md:py-10">
            {children}
          </main>
          <Footer />
          <StickyMobileTabs />
        </ReduxProvider>
      </body>
    </html>
  );
}
