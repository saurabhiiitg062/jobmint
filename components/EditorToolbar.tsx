import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon
} from 'lucide-react';

interface Props {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton = ({ onClick, isActive, disabled, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded hover:bg-gray-100 ${
        isActive ? 'bg-gray-200 text-primary' : 'text-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border-custom p-2 bg-gray-50 rounded-t">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
      >
        <Underline className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive('link')}
      >
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}
