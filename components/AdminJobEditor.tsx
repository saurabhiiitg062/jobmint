"use client";

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { DynamicTable as DynamicTableType } from '@/types';
import DynamicTableBuilder from './DynamicTableBuilder';

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
    extensions: [StarterKit, Link],
    content: initialDescription,
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

  const handleSubmit = () => {
    const payload = {
      description: editor?.getHTML() ?? '',
      tables,
    };
    console.log('Job payload:', payload);
    alert('Job submitted – check console for HTML content.');
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white border border-border-custom rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Job Description</h2>
        <div className="mb-4">
          <EditorContent editor={editor} className="border rounded p-2 min-h-[200px]" />
        </div>
      </div>

      <DynamicTableBuilder tables={tables} onChange={handleTablesChange} />

      <button
        onClick={handleSubmit}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
      >
        Submit Job
      </button>
    </div>
  );
}
