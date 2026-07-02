import React from 'react';

export const revalidate = 86400;

export default function TermsPage() {
  return (
    <div className="bg-white border border-border-custom rounded-lg p-6 md:p-8 shadow-sm space-y-4 max-w-3xl mx-auto text-xs sm:text-sm text-gray-600 leading-relaxed">
      <h2 className="text-xl font-bold text-secondary border-b pb-2">Terms and Conditions</h2>
      <p>
        Welcome to SelectionSure! These terms outline the rules and regulations for the use of SelectionSure&apos;s Website, located at SelectionSure.com.
      </p>
      <p>
        By accessing this website, we assume you accept these terms and conditions. Do not continue to use SelectionSure if you do not agree to take all of the terms and conditions stated on this page.
      </p>
      <h3 className="font-bold text-gray-800 text-sm">License & Copyright</h3>
      <p>
        Unless otherwise stated, SelectionSure owns the intellectual property rights for all educational and informative text listings. Scraping or bulk content duplication is strictly prohibited.
      </p>
    </div>
  );
}
