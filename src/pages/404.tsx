import Image from 'next/image';
import NextLink from 'next/link';
import { Button, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { LandingLayout } from '@/components/layouts';
import NotFoundIcon from '../assets/notFound.svg';
import { getContentProps } from '@/content/getContentProps';
import { useT } from '@/i18n/useT';

const NotFound = () => {
  const { t } = useT();
  return (
    <LandingLayout title={t.notFound.pageTitle} pageDescription={t.notFound.pageTitle}>
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
            {t.notFound.title}
          </Typography>
          <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
            {t.notFound.text}
          </Typography>
          <Button component={NextLink} href="/" size="large" startIcon={<Home />}>
            {t.notFound.home}
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

export const getStaticProps = getContentProps;

export default NotFound;
