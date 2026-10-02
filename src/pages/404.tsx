import Image from 'next/image';
import NextLink from 'next/link';
import { Button, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { LandingLayout } from '@/components/layouts';
import NotFoundIcon from '../assets/notFound.svg';

const NotFound = () => {
  return (
    <LandingLayout title="Página no encontrada" pageDescription="Página no encontrada">
      <div
        className="section container"
        style={{
          display: 'flex',
          flexWrap: 'wrap-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
        }}>
        <div style={{ flex: '1 1 320px', maxWidth: 520 }}>
          <Typography variant="h1" sx={{ fontWeight: 300 }}>
            No encontramos ninguna página aquí
          </Typography>
          <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
            Es posible que la página que buscabas se haya eliminado o no esté disponible en el
            momento.
          </Typography>
          <Button component={NextLink} href="/" size="large" startIcon={<Home />}>
            Volver al inicio
          </Button>
        </div>
        <Image
          alt=""
          src={NotFoundIcon}
          style={{ flex: '1 1 280px', width: '100%', maxWidth: 480, height: 'auto' }}
          priority
        />
      </div>
    </LandingLayout>
  );
};

export default NotFound;
