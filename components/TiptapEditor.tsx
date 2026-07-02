"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image } from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { useEffect } from "react";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, 
  Minus, Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Code, Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
  Eraser, Undo, Redo, PaintBucket
} from "lucide-react";

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
      Superscript,
      Subscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[350px] p-4 focus:outline-none prose prose-sm sm:prose-base max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton = ({ onClick, isActive, icon: Icon, title, disabled = false }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-2 rounded text-sm flex items-center justify-center transition-colors ${
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-gray-600 hover:bg-gray-100"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="border border-border-custom rounded-lg overflow-hidden flex flex-col bg-white">
      <div className="flex flex-wrap gap-1 p-2 border-b border-border-custom bg-gray-50 items-center">
        
        {/* Formatting Group */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} icon={Bold} title="Bold" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} icon={Italic} title="Italic" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} icon={UnderlineIcon} title="Underline" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} icon={Strikethrough} title="Strikethrough" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive("superscript")} icon={SuperscriptIcon} title="Superscript" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive("subscript")} icon={SubscriptIcon} title="Subscript" />
        </div>

        {/* Colors Group */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <label className="cursor-pointer p-1.5 rounded hover:bg-gray-100 flex items-center" title="Text Color">
            <PaintBucket className="w-4 h-4 text-gray-600" />
            <input
              type="color"
              onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-0 h-0 opacity-0 absolute"
            />
          </label>
          <label className="cursor-pointer p-1.5 rounded hover:bg-gray-100 flex items-center" title="Highlight Color">
            <Highlighter className="w-4 h-4 text-gray-600" />
            <input
              type="color"
              onInput={(event) => editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run()}
              className="w-0 h-0 opacity-0 absolute"
            />
          </label>
        </div>

        {/* Headings Group */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} icon={Heading1} title="Heading 1" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} icon={Heading2} title="Heading 2" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} icon={Heading3} title="Heading 3" />
        </div>

        {/* Alignment Group */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} title="Justify" />
        </div>

        {/* Lists & Insertions Group */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} icon={List} title="Bullet List" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} icon={ListOrdered} title="Numbered List" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} icon={Quote} title="Blockquote" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} icon={Code} title="Code Block" />
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} icon={Minus} title="Horizontal Rule" />
        </div>

        {/* Rich Media Group */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton onClick={setLink} isActive={editor.isActive("link")} icon={LinkIcon} title="Insert Link" />
          <ToolbarButton onClick={addImage} isActive={editor.isActive("image")} icon={ImageIcon} title="Insert Image" />
          <ToolbarButton onClick={addTable} isActive={editor.isActive("table")} icon={TableIcon} title="Insert Table" />
        </div>

        {/* Actions Group */}
        <div className="flex items-center gap-1 px-2">
          <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} isActive={false} icon={Eraser} title="Clear Formatting" />
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} title="Undo" />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} title="Redo" />
        </div>

      </div>

      <div className="flex-1 bg-white overflow-y-auto max-h-[600px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}