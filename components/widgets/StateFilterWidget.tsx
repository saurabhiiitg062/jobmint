import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

const STATES = [
  { name: 'Uttar Pradesh', slug: 'up', code: 'UP' },
  { name: 'Bihar', slug: 'bihar', code: 'BR' },
  { name: 'Rajasthan', slug: 'rajasthan', code: 'RJ' },
  { name: 'Madhya Pradesh', slug: 'mp', code: 'MP' },
  { name: 'Delhi', slug: 'delhi', code: 'DL' },
  { name: 'Haryana', slug: 'haryana', code: 'HR' },
];

export default function StateFilterWidget() {
  return (
    <div className="bg-white border border-border-custom rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="flex items-center gap-2 text-base font-extrabold text-secondary">
          <MapPin className="w-5 h-5 text-primary" />
          Jobs by State
        </h3>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {STATES.map((state) => (
            <Link 
              key={state.slug} 
              href={`/state/${state.slug}`}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors group shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                {state.code}
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors truncate">
                {state.name}
              </span>
            </Link>
          ))}
        </div>
        
        <Link 
          href="/state"
          className="mt-4 block w-full text-center py-2.5 rounded-lg bg-gray-50 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
        >
          View All States
        </Link>
      </div>
    </div>
  );
}
