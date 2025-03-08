import { FC, useEffect, useState } from 'react';
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
import { Divider, IconButton, MenuItem, Paper } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ColorPicker } from './ColorPicker';

interface Props {
  editor: any;
}

export const FormattingOptions: FC<Props> = ({ editor }) => {
  const [fontSelected, setFontSelected] = useState('3');
  const [color, setColor] = useState('#222222');
  const options = [
    { label: 'Subtítulo', value: 2 },
    { label: 'Párrafo', value: 3 },
    { label: 'Cita', value: 4 },
  ];

  useEffect(() => {
    if (color) {
      editor.chain().focus().setColor(color).run();
    }
    // eslint-disable-next-line
  }, [color]);

  const handleFontOptions = (event: SelectChangeEvent) => {
    setFontSelected(event.target.value as string);
    editor.chain().focus().toggleHeading({ level: event.target.value }).run();
  };

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        padding: '8px',
        gap: '8px',
        display: 'flex',
        flexDirection: 'row',
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}>
      <IconButton className={'menu-icon'} onClick={() => editor.chain().focus().undo().run()}>
        <Undo />
      </IconButton>
      <IconButton className={'menu-icon'} onClick={() => editor.chain().focus().redo().run()}>
        <Redo />
      </IconButton>
      <Divider orientation="vertical" flexItem />
      <Select className={'font-select'} onChange={handleFontOptions} value={fontSelected}>
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      <Divider orientation="vertical" flexItem />
      <IconButton
        className={'menu-icon'}
        onClick={() => editor?.chain().focus().toggleBold().run()}>
        <FormatBold />
      </IconButton>
      <IconButton
        className={'menu-icon'}
        onClick={() => editor?.chain().focus().toggleItalic().run()}>
        <FormatItalic />
      </IconButton>
      <Divider orientation="vertical" flexItem />
      <IconButton
        className={'menu-icon'}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <FormatAlignLeft />
      </IconButton>
      <IconButton
        className={'menu-icon'}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <FormatAlignCenter />
      </IconButton>
      <IconButton
        className={'menu-icon'}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <FormatAlignRight />
      </IconButton>
      <IconButton
        className={'menu-icon'}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
        <FormatAlignJustify />
      </IconButton>
      <Divider orientation="vertical" flexItem />
      <ColorPicker color={color} onChange={setColor} />
      <Divider orientation="vertical" flexItem />
      <IconButton
        className={'menu-icon'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FormatListBulleted />
      </IconButton>
      <IconButton
        className={'menu-icon'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <FormatListNumbered />
      </IconButton>
    </Paper>
  );
};
