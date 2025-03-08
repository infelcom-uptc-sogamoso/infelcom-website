import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { LandingLayout } from '@/components/layouts';
import NotFoundIcon from '../assets/notFound.svg';

const NotFound = () => {
  return (
    <LandingLayout title="Pagina no encontrada" pageDescription="Pagina no encontrada">
      <Box
        display={'flex'}
        justifyContent="center"
        alignItems={'center'}
        height="calc(100vh - 124px)"
        sx={{ flexDirection: { xs: 'column', sm: 'row', backgroundColor: 'transparent' } }}>
        <Box
          display={'flex'}
          justifyContent="center"
          alignItems={'center'}
          width={'500px'}
          sx={{ flexDirection: 'column', backgroundColor: 'transparent' }}>
          <Typography variant="h1" component={'h1'} fontSize={50} fontWeight={100}>
            No encontramos ninguna página aqui
          </Typography>
          <Typography fontSize={20} mt={2}>
            Es posible que la pagina que buscabas se haya eliminado o no este disponible en el
            momento
          </Typography>
        </Box>
        <Box
          display={'flex'}
          justifyContent="center"
          alignItems={'center'}
          sx={{ flexDirection: 'column', backgroundColor: 'transparent' }}>
          <Image alt="notfound" src={NotFoundIcon} style={{ width: '500px' }} />
        </Box>
      </Box>
    </LandingLayout>
  );
};

export default NotFound;
