'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = prompt('URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = prompt('Image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="rich-editor">
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={addLink}
          className={`toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={addImage}
          className="toolbar-btn"
        >
          Image
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
