"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export default function AdminJobEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: '',
  });

  const handleSubmit = () => {
    const payload = {
      description: editor?.getHTML() ?? '',
    };
    console.log('Job payload:', payload);
    alert('Job submitted – check console for HTML content.');
  };

  return (
    <div className="p-4 bg-white border border-border-custom rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Create Job Post</h2>
      <div className="mb-4">
        <EditorContent editor={editor} className="border rounded p-2 min-h-[200px]" />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
      >
        Submit Job
      </button>
    </div>
  );
}
