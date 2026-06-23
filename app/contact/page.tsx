import React from 'react';
import { Mail, ShieldAlert } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white border border-border-custom rounded-lg p-6 md:p-8 shadow-sm space-y-6 max-w-3xl mx-auto text-xs sm:text-sm text-gray-600">
      <h2 className="text-xl font-bold text-secondary border-b pb-2">Contact Us</h2>
      <p className="leading-relaxed">
        For advertising inquiries, content corrections, or copyright/DMCA issues, please contact the SelectionSure desk. We make every effort to respond to emails within 24-48 business hours.
      </p>
      
      <div className="flex items-center space-x-3 bg-gray-50 border border-gray-150 p-4 rounded-md">
        <Mail className="w-6 h-6 text-primary" />
        <div>
          <h3 className="font-bold text-gray-800">Email Address</h3>
          <p className="text-primary font-semibold">support@SelectionSure.com</p>
        </div>
      </div>

      <div className="flex items-start space-x-2 text-gray-400">
        <ShieldAlert className="w-5 h-5 text-gray-400 shrink-0" />
        <p className="leading-relaxed">
          Please note: We do NOT recruit candidates directly. We only publish notices. Do not send your resume or private ID cards to our support email.
        </p>
      </div>
    </div>
  );
}
