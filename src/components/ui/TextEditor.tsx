import { FC, useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { Box } from '@mui/material';
import { Color } from '@tiptap/extension-color';
import { EditorContent, useEditor } from '@tiptap/react';
import { FormattingOptions } from './FormattingOptions';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

type FormData = {
  content: string;
  code: string;
  title: string;
  resume: string;
  imageUrl: string;
};

interface Props {
  setCharCount: (charCount: number) => void;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
}

const TextEditor: FC<Props> = ({ setCharCount, setValue, watch }) => {
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
    content: watch('content'),
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length <= 1500) {
        setCharCount(text.length);
        setValue('content', editor.getHTML());
      } else {
        editor.commands.undo();
      }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(watch('content') || '');
    }
    // eslint-disable-next-line
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        borderRadius: '4px',
        border: `1px solid ${theme.palette.divider}`,
      })}>
      <FormattingOptions editor={editor} />
      <div className="editor-box">
        <EditorContent editor={editor} />
      </div>
    </Box>
  );
};

export default TextEditor;
