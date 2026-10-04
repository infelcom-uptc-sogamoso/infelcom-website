import { FC, useState } from 'react';
import { StarterKit } from '@tiptap/starter-kit';
import { Heading } from '@tiptap/extension-heading';
import { TextStyle } from '@tiptap/extension-text-style';
import { TextAlign } from '@tiptap/extension-text-align';
import { Box, FormLabel } from '@mui/material';
import { Color } from '@tiptap/extension-color';
import { EditorContent, useEditor } from '@tiptap/react';
import { FormattingOptions } from './FormattingOptions';

const MAX_CHARS = 1500;

interface Props {
  label: string;
  /** Initial HTML; remount the editor (via `key`) to load different content. */
  value: string;
  onChange: (html: string) => void;
}

const TextEditor: FC<Props> = ({ label, value, onChange }) => {
  const [charCount, setCharCount] = useState(0);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Heading.configure({
        levels: [2, 3, 4],
      }),
    ],
    content: value,
    immediatelyRender: false,
    onCreate: ({ editor }) => setCharCount(editor.getText().length),
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length <= MAX_CHARS) {
        setCharCount(text.length);
        onChange(editor.getHTML());
      } else {
        editor.commands.undo();
      }
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Box>
      <FormLabel sx={{ display: 'block', mb: 1 }}>{label}</FormLabel>
      <Box
        sx={{ borderRadius: '4px', border: 1, borderColor: 'divider' }}>
        <FormattingOptions editor={editor} />
        <div className="editor-box">
          <EditorContent editor={editor} />
        </div>
      </Box>
      <div className={`counter ${charCount === MAX_CHARS ? 'error' : ''}`}>
        {charCount} / {MAX_CHARS}
      </div>
    </Box>
  );
};

export default TextEditor;
