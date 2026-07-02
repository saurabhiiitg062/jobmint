import React from 'react';

export const revalidate = 86400;

export default function DisclaimerPage() {
  return (
    <div className="bg-white border border-border-custom rounded-lg p-6 md:p-8 shadow-sm space-y-6 max-w-3xl mx-auto text-xs sm:text-sm text-gray-600 leading-relaxed">
      <h2 className="text-xl font-bold text-secondary border-b pb-2">Disclaimer</h2>
      <p>
        The content published on <strong>selectionsure.app</strong> is strictly for general informational purposes.
      </p>
      <p className="bg-red-50 p-4 border border-red-100 text-primary font-semibold rounded">
        SelectionSure is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any government organization, board (like SSC, UPSC, RRB), or commission.
      </p>
      <p>
        While we make every attempt to ensure information on this site is updated from official source gazettes, job aspirants must double check parameters (last date, qualifications, fee, eligibility rules) directly with official portals.
      </p>
      <p>
        We are not responsible for any selection issues, document rejection, or fees misdirected.
      </p>
    </div>
  );
}
