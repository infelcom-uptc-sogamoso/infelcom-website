import { MouseEvent, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Popover, Box, TextField } from '@mui/material';

interface Props {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <div></div>
      <div
        onClick={handleClick}
        className={'picker-container'}
        style={{ backgroundColor: color }}></div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ p: 2 }}>
          <HexColorPicker color={color} onChange={onChange} />
          <TextField
            value={color}
            onChange={(e) => onChange(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mt: 2, width: '200px' }}
          />
        </Box>
      </Popover>
    </Box>
  );
};
