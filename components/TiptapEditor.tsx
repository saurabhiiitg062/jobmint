"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TiptapEditor({
  value,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[350px] p-4 focus:outline-none prose max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-border-custom rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 border rounded text-xs"
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 border rounded text-xs"
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-3 py-1 border rounded text-xs"
        >
          Underline
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="px-3 py-1 border rounded text-xs"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="px-3 py-1 border rounded text-xs"
        >
          H3
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className="px-3 py-1 border rounded text-xs"
        >
          Bullet List
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className="px-3 py-1 border rounded text-xs"
        >
          Number List
        </button>

        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter URL");

            if (url) {
              editor
                .chain()
                .focus()
                .setLink({ href: url })
                .run();
            }
          }}
          className="px-3 py-1 border rounded text-xs"
        >
          Link
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="px-3 py-1 border rounded text-xs"
        >
          Clear
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}