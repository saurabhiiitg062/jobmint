import type { Metadata } from 'next';
import AgeCalculatorTool from '@/components/tools/AgeCalculatorTool';

export const metadata: Metadata = {
  title: 'Age Calculator - SelectionSure',
  description: 'Calculate exact age in years, months, and days. Check your age on a cutoff date for government job eligibility.',
};

export default function AgeCalculatorPage() {
  return <AgeCalculatorTool />;
}
