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
  initialDescription?: string;
  initialTables?: DynamicTableType[];
  onChange?: (data: { description: string; tables: DynamicTableType[] }) => void;
}

export default function AdminJobEditor({ 
  initialDescription = '', 
  initialTables = [],
  onChange 
}: Props) {
  const [description, setDescription] = useState(initialDescription);
  const [tables, setTables] = useState<DynamicTableType[]>(initialTables);

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
    content: initialDescription,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const newDescription = editor.getHTML();
      setDescription(newDescription);
      if (onChange) {
        onChange({ description: newDescription, tables });
      }
    },
  });

  const handleTablesChange = (newTables: DynamicTableType[]) => {
    setTables(newTables);
    if (onChange) {
      onChange({ description, tables: newTables });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white border border-border-custom rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Job Description & Details</h2>
        <p className="text-xs text-gray-500 mb-4">
          Use the editor below to add headings, bullet points, links, and text formatting for Eligibility, Selection Process, etc.
        </p>
        <div className="border border-border-custom rounded-lg overflow-hidden flex flex-col">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} className="bg-white flex-1" />
        </div>
      </div>

      <DynamicTableBuilder tables={tables} onChange={handleTablesChange} />
    </div>
  );
}
