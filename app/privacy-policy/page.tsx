import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white border border-border-custom rounded-lg p-6 md:p-8 shadow-sm space-y-4 max-w-3xl mx-auto text-xs sm:text-sm text-gray-600 leading-relaxed">
      <h2 className="text-xl font-bold text-secondary border-b pb-2">Privacy Policy</h2>
      <p>
        At JobJanta, accessible from JobJanta.com, candidate privacy is one of our main priorities. This document details the types of information we gather and record, and how we handle it.
      </p>
      <h3 className="font-bold text-gray-800 text-sm">Log Files & Cookies</h3>
      <p>
        JobJanta follows a standard procedure of using log files and cookies to analyze traffic, count views on job listings, and customize advertising displays (e.g. Google AdSense).
      </p>
      <h3 className="font-bold text-gray-800 text-sm">Third Party Policies</h3>
      <p>
        Google, as a third-party vendor, uses cookies to serve ads on our site. Users may choose to opt-out of cookie tracking by visiting Google Ad network terms.
      </p>
    </div>
  );
}
