import { FC, PropsWithChildren, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Footer } from '../ui/Footer';
import { Navbar } from '../ui/Navbar';
import { SideMenu } from '../ui/SideMenu';
import { SITE_NAME, SITE_URL } from '@/utils/site';
import styles from './LandingLayout.module.css';

interface Props extends PropsWithChildren {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const LandingLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl }) => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { asPath } = useRouter();
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = SITE_URL + asPath.split(/[?#]/)[0];
  const image = imageFullUrl || `${SITE_URL}/hero/hero-poster.jpg`;

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="es_CO" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />
      <SideMenu />
      <main id="main" className={styles.main}>
        {children}
      </main>
      <Footer />
      <button
        type="button"
        aria-label="Volver arriba"
        className={`${styles.topBtn} ${showTopBtn ? styles.visible : ''}`}
        tabIndex={showTopBtn ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <KeyboardArrowUpIcon />
      </button>
    </>
  );
};
