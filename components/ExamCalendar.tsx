"use client";

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Clock } from 'lucide-react';
import { Job } from '@/types';

interface ExamCalendarProps {
  exams: Job[]; // expects each job to have an importantDates.applyLastDate field
}

export default function ExamCalendar({ exams }: ExamCalendarProps) {
  // Selected date on calendar
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleDateClick = (date: Date) => setSelectedDate(date);
  const getExamDate = (job: Job) => {
    const mainDate = job.exam?.importantDates?.examDate || job.importantDates?.examDate || job.examDate;
    if (mainDate) return mainDate;
    
    if (job.rawData?.customDates) {
      const customDate = job.rawData.customDates.find((cd: any) => cd.label.toLowerCase().includes('exam date'));
      if (customDate?.date) return customDate.date;
    }
    return null;
  };

  // Extract dates (only date part) from exam jobs
  const examDates = exams
    .map((job) => getExamDate(job))
    .filter(Boolean)
    .map((dateStr) => new Date(dateStr as string))
    .filter((d) => !isNaN(d.getTime()));

  const eventsForDate = exams.filter((job) => {
    const d = getExamDate(job);
    return d && new Date(d).toDateString() === selectedDate.toDateString();
  });

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const hasExam = examDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    return hasExam ? (
      <div className="flex justify-center mt-1">
        <span
          className="w-2 h-2 bg-primary rounded-full"
          title="Exam Date"
        />
      </div>
    ) : null;
  };

  return (
    <div className="flex gap-4">
      <div className="bg-white border border-border-custom rounded-lg p-4 flex-1">
        <Calendar
          className="mx-auto"
          tileContent={tileContent}
          onClickDay={handleDateClick}
        />
      </div>
      <div className="bg-white border border-border-custom rounded-lg p-4 w-64">
        <h3 className="text-lg font-bold mb-2">
          Events on {selectedDate.toLocaleDateString()}
        </h3>
        {eventsForDate.length === 0 ? (
          <p className="text-sm text-gray-500">No events</p>
        ) : (
          <ul className="space-y-2">
            {eventsForDate.map((job) => {
              const d = getExamDate(job);
              return (
                <li key={job._id} className="text-sm">
                  <span className="font-medium">{job.title}</span>
                  {d && (
                    <span className="text-xs text-gray-400"> ({new Date(d).toLocaleDateString()})</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
