import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react'; // Using MessageCircle or a similar icon for Telegram

export default function JoinTelegramWidget() {
  // Replace with actual Telegram link
  const telegramLink = 'https://t.me/SelectionSure';

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
      <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        Get Instant Updates
      </h4>
      <p className="text-xs text-blue-700 mb-4 leading-relaxed">
        Join our official Telegram channel to never miss a job notification, admit card, or result update.
      </p>
      <a 
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-[#0088cc] text-white py-2 rounded font-semibold text-sm hover:bg-[#0077b3] transition-colors shadow-sm"
      >
        Join Telegram
      </a>
    </div>
  );
}
