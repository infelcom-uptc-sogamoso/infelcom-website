import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      sx={{
        alignItems: 'center',
        backgroundColor: '#222222',
        padding: '10px 30px',
        color: '#D5DBDB',
      }}>
      <Typography variant="caption" color={'primary'}>
        © 2025 Todos los derechos reservados INFELCOM
      </Typography>
    </Box>
  );
};
