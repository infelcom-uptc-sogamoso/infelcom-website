import { FC, ReactNode, useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Redo,
  Undo,
} from '@mui/icons-material';
import { Divider, IconButton, MenuItem, Paper, Tooltip } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useT } from '@/i18n/useT';
import { ColorPicker } from './ColorPicker';

interface Props {
  editor: Editor;
}

export const FormattingOptions: FC<Props> = ({ editor }) => {
  const { t } = useT();
  const [fontSelected, setFontSelected] = useState('3');
  const [color, setColor] = useState('#222222');
  const options = [
    { label: t.admin.editor.subtitle, value: 2 },
    { label: t.admin.editor.paragraph, value: 3 },
    { label: t.admin.editor.quote, value: 4 },
  ];

  const handleFontOptions = (event: SelectChangeEvent) => {
    setFontSelected(event.target.value);
    const level = Number(event.target.value) as 2 | 3 | 4;
    editor.chain().focus().toggleHeading({ level }).run();
  };

  // Color is only applied when the admin picks one: a default color baked into every story
  // would make the text unreadable in dark mode.
  const changeColor = (value: string) => {
    setColor(value);
    editor.chain().focus().setColor(value).run();
  };

  const button = (label: string, icon: ReactNode, run: () => void) => (
    <Tooltip title={label}>
      <IconButton className={'menu-icon'} aria-label={label} onClick={run}>
        {icon}
      </IconButton>
    </Tooltip>
  );
  const chain = () => editor.chain().focus();

  return (
    <Paper
      elevation={0}
      sx={{
        padding: '8px',
        gap: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
      }}>
      {button(t.admin.editor.undo, <Undo />, () => chain().undo().run())}
      {button(t.admin.editor.redo, <Redo />, () => chain().redo().run())}
      <Divider orientation="vertical" flexItem />
      <Select className={'font-select'} onChange={handleFontOptions} value={fontSelected} size="small">
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      <Divider orientation="vertical" flexItem />
      {button(t.admin.editor.bold, <FormatBold />, () => chain().toggleBold().run())}
      {button(t.admin.editor.italic, <FormatItalic />, () => chain().toggleItalic().run())}
      <Divider orientation="vertical" flexItem />
      {button(t.admin.editor.alignLeft, <FormatAlignLeft />, () => chain().setTextAlign('left').run())}
      {button(t.admin.editor.alignCenter, <FormatAlignCenter />, () => chain().setTextAlign('center').run())}
      {button(t.admin.editor.alignRight, <FormatAlignRight />, () => chain().setTextAlign('right').run())}
      {button(t.admin.editor.justify, <FormatAlignJustify />, () => chain().setTextAlign('justify').run())}
      <Divider orientation="vertical" flexItem />
      <Tooltip title={t.admin.editor.color}>
        <span>
          <ColorPicker color={color} onChange={changeColor} />
        </span>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      {button(t.admin.editor.bulletList, <FormatListBulleted />, () => chain().toggleBulletList().run())}
      {button(t.admin.editor.orderedList, <FormatListNumbered />, () => chain().toggleOrderedList().run())}
    </Paper>
  );
};
