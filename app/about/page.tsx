import React from 'react';

export default function AboutPage() {
  return (
    <div className="bg-white border border-border-custom rounded-lg p-6 md:p-8 shadow-sm space-y-6 max-w-3xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-secondary border-b pb-2">About SelectionSure</h2>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        Welcome to <strong>SelectionSure</strong>, India&apos;s leading online destination for recruitment information, admit cards, answer keys, and Sarkari Results.
      </p>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        Our dedicated team tracks state and central government announcements around the clock to compile vacancy details, eligibility rules, age criteria, physical parameters, and link coordinates into clean tables.
      </p>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold">
        SelectionSure is committed to speed, accuracy, and ease of access. Thank you for making us your preferred job portal.
      </p>
    </div>
  );
}
