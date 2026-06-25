'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Clock3, Gift, RefreshCw } from 'lucide-react';

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  nextBirthdayInDays: number;
  nextBirthdayLabel: string;
};

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function parseDateAtMidday(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function diffInDays(from: Date, to: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function calculateAge(dateOfBirth: string, asOfDate: string): AgeResult | null {
  if (!dateOfBirth || !asOfDate) {
    return null;
  }

  const birth = parseDateAtMidday(dateOfBirth);
  const target = parseDateAtMidday(asOfDate);

  if (Number.isNaN(birth.getTime()) || Number.isNaN(target.getTime()) || birth > target) {
    return null;
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonthIndex = (target.getMonth() - 1 + 12) % 12;
    const previousMonthYear = previousMonthIndex === 11 ? target.getFullYear() - 1 : target.getFullYear();
    days += daysInMonth(previousMonthYear, previousMonthIndex);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let nextBirthdayYear = target.getFullYear();
  const birthdayThisYear = new Date(
    nextBirthdayYear,
    birth.getMonth(),
    Math.min(birth.getDate(), daysInMonth(nextBirthdayYear, birth.getMonth())),
    12,
    0,
    0,
    0
  );

  if (birthdayThisYear < target) {
    nextBirthdayYear += 1;
  }

  const nextBirthday = new Date(
    nextBirthdayYear,
    birth.getMonth(),
    Math.min(birth.getDate(), daysInMonth(nextBirthdayYear, birth.getMonth())),
    12,
    0,
    0,
    0
  );

  const totalDays = diffInDays(birth, target);

  return {
    years,
    months,
    days,
    totalMonths: years * 12 + months,
    totalWeeks: Math.floor(totalDays / 7),
    totalDays,
    nextBirthdayInDays: diffInDays(target, nextBirthday),
    nextBirthdayLabel: formatDateLabel(nextBirthday),
  };
}

export default function AgeCalculatorTool() {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [asOfDate, setAsOfDate] = useState(getTodayString());

  const result = useMemo(() => calculateAge(dateOfBirth, asOfDate), [dateOfBirth, asOfDate]);
  const hasInvalidRange = Boolean(dateOfBirth && asOfDate && parseDateAtMidday(dateOfBirth) > parseDateAtMidday(asOfDate));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border-custom rounded-lg p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold text-secondary border-b border-border-custom pb-2">
            Age Calculator
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Calculate your exact age in years, months, and days. You can also check your age on a future cutoff date for government job eligibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Date of Birth</span>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2.5 border border-border-custom rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Age As On Date</span>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-border-custom rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setAsOfDate(getTodayString())}
            className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            Use Today
          </button>
          <button
            type="button"
            onClick={() => {
              setDateOfBirth('');
              setAsOfDate(getTodayString());
            }}
            className="inline-flex items-center gap-2 border border-border-custom bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {hasInvalidRange && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Date of birth cannot be later than the selected age-as-on date.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-border-custom rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-secondary mb-4">Age Result</h2>

          {result ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border-custom bg-gray-50 p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-bold">Years</p>
                  <p className="mt-2 text-2xl font-extrabold text-primary">{result.years}</p>
                </div>
                <div className="rounded-lg border border-border-custom bg-gray-50 p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-bold">Months</p>
                  <p className="mt-2 text-2xl font-extrabold text-secondary">{result.months}</p>
                </div>
                <div className="rounded-lg border border-border-custom bg-gray-50 p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-bold">Days</p>
                  <p className="mt-2 text-2xl font-extrabold text-success">{result.days}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border-custom p-4">
                <p className="text-sm font-semibold text-gray-700">
                  Exact age: <span className="text-primary font-bold">{result.years} years, {result.months} months, {result.days} days</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="rounded-lg border border-border-custom p-4">
                  <p className="text-gray-500 font-semibold">Total Months</p>
                  <p className="mt-1 text-lg font-bold text-gray-800">{result.totalMonths}</p>
                </div>
                <div className="rounded-lg border border-border-custom p-4">
                  <p className="text-gray-500 font-semibold">Total Weeks</p>
                  <p className="mt-1 text-lg font-bold text-gray-800">{result.totalWeeks}</p>
                </div>
                <div className="rounded-lg border border-border-custom p-4">
                  <p className="text-gray-500 font-semibold">Total Days</p>
                  <p className="mt-1 text-lg font-bold text-gray-800">{result.totalDays}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border-custom p-6 text-sm text-gray-500">
              Enter your date of birth and choose an age-as-on date to see the calculation.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-bold text-secondary mb-4">Quick Summary</h2>
            {result ? (
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Clock3 className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-700">Age on Selected Date</p>
                    <p className="text-gray-600">{result.years} years {result.months} months {result.days} days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Gift className="w-4 h-4 text-secondary mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-700">Next Birthday</p>
                    <p className="text-gray-600">{result.nextBirthdayLabel}</p>
                    <p className="text-xs text-gray-500 mt-1">In {result.nextBirthdayInDays} day{result.nextBirthdayInDays === 1 ? '' : 's'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Results will appear here once you enter valid dates.</p>
            )}
          </div>

          <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-bold text-secondary mb-4">How to Use</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Enter your date of birth.</li>
              <li>Choose the cutoff date or keep today&apos;s date.</li>
              <li>Check exact age for job forms, exams, or admissions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
