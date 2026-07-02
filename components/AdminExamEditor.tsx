"use client";

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { DynamicTable as DynamicTableType } from '@/types';
import DynamicTableBuilder from './DynamicTableBuilder';
import EditorToolbar from './EditorToolbar';

interface Props {
  initialOverview?: string;
  initialVacancyDetails?: DynamicTableType[];
  initialHistoricalCutoffs?: DynamicTableType[];
  onChange?: (data: { overview: string; vacancyDetails: DynamicTableType[]; historicalCutoffs: DynamicTableType[] }) => void;
}

export default function AdminExamEditor({ 
  initialOverview = '', 
  initialVacancyDetails = [],
  initialHistoricalCutoffs = [],
  onChange 
}: Props) {
  const [overview, setOverview] = useState(initialOverview);
  const [vacancyDetails, setVacancyDetails] = useState<DynamicTableType[]>(initialVacancyDetails);
  const [historicalCutoffs, setHistoricalCutoffs] = useState<DynamicTableType[]>(initialHistoricalCutoffs);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit, 
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
        }
      }),
      Underline
    ],
    content: initialOverview,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const newOverview = editor.getHTML();
      setOverview(newOverview);
      if (onChange) {
        onChange({ overview: newOverview, vacancyDetails, historicalCutoffs });
      }
    },
  });

  const handleVacancyChange = (newTables: DynamicTableType[]) => {
    setVacancyDetails(newTables);
    if (onChange) {
      onChange({ overview, vacancyDetails: newTables, historicalCutoffs });
    }
  };

  const handleCutoffsChange = (newTables: DynamicTableType[]) => {
    setHistoricalCutoffs(newTables);
    if (onChange) {
      onChange({ overview, vacancyDetails, historicalCutoffs: newTables });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white border border-border-custom rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Exam Overview</h2>
        <p className="text-xs text-gray-500 mb-4">
          Add the basic introduction and overview of this exam.
        </p>
        <div className="border border-border-custom rounded-lg overflow-hidden flex flex-col">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} className="bg-white flex-1" />
        </div>
      </div>

      <div className="p-4 bg-white border border-border-custom rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Vacancy Details Tables</h2>
        <DynamicTableBuilder tables={vacancyDetails} onChange={handleVacancyChange} />
      </div>

      <div className="p-4 bg-white border border-border-custom rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Historical Cutoffs Tables</h2>
        <DynamicTableBuilder tables={historicalCutoffs} onChange={handleCutoffsChange} />
      </div>
    </div>
  );
}
