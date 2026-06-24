import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useCallback } from 'react';
import './Admin.css';

const MenuBar = ({ editor, onImageUpload }) => {
  if (!editor) return null;

  const addImage = useCallback(() => {
    if (onImageUpload) {
      onImageUpload((url) => {
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      });
    }
  }, [editor, onImageUpload]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="editor-menu">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'active' : ''}
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'active' : ''}
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'active' : ''}
        title="Strikethrough"
      >
        S
      </button>
      <span className="menu-divider" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
        title="Heading 3"
      >
        H3
      </button>
      <span className="menu-divider" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'active' : ''}
        title="Bullet List"
      >
        •
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'active' : ''}
        title="Numbered List"
      >
        1.
      </button>
      <span className="menu-divider" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'active' : ''}
        title="Quote"
      >
        "
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'active' : ''}
        title="Code Block"
      >
        {'</>'}
      </button>
      <span className="menu-divider" />
      <button
        type="button"
        onClick={setLink}
        className={editor.isActive('link') ? 'active' : ''}
        title="Link"
      >
        Link
      </button>
      <button
        type="button"
        onClick={addImage}
        title="Image"
      >
        Img
      </button>
      <span className="menu-divider" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        Redo
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, onImageUpload }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="rich-text-editor">
      <MenuBar editor={editor} onImageUpload={onImageUpload} />
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
