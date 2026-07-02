import type { Metadata } from 'next';
import ImageResizerTool from '@/components/tools/ImageResizerTool';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Free Photo & Signature Resizer for Govt Jobs - SelectionSure',
  description: 'Resize and compress your passport size photo and signature to exact KB and dimensions required for SSC, UPSC, IBPS, and Railway online application forms. 100% Free & Secure.',
  keywords: 'photo resizer, signature resizer, compress photo to 50kb, resize photo for ssc, upsc photo resize, ibps signature size, sarkari form photo size',
  alternates: {
    canonical: '/image-resizer',
  },
  openGraph: {
    title: 'Free Photo & Signature Resizer for Govt Jobs',
    description: 'Compress your passport size photo and signature to exact KB and dimensions required for SSC, UPSC, and Bank forms.',
    url: 'https://SelectionSure.com/image-resizer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Photo & Signature Resizer for Govt Jobs',
    description: 'Compress your passport size photo and signature to exact KB and dimensions required for SSC, UPSC, and Bank forms.',
  },
};

export default function ImageResizerPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SelectionSure Photo & Signature Resizer',
    operatingSystem: 'Any',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: 'An online client-side tool to resize and compress photos and signatures for Indian government job application forms (SSC, UPSC, Banking, etc.).',
    url: 'https://SelectionSure.com/image-resizer',
  };

  return (
    <>
      <StructuredData data={schema} />
      <div className="py-6 sm:py-10">
        <ImageResizerTool />
      </div>
    </>
  );
}
