import { FC, PropsWithChildren, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Footer } from '../ui/Footer';
import { Navbar } from '../ui/Navbar';
import { SideMenu } from '../ui/SideMenu';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import { SITE_URL } from '@/utils/site';
import styles from './LandingLayout.module.css';

interface Props extends PropsWithChildren {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const LandingLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl }) => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { asPath } = useRouter();
  const { site } = useContent();
  const { t, locale } = useT();
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  // asPath has no locale prefix; English is the unprefixed default.
  const path = asPath.split(/[?#]/)[0];
  const urlFor = (l: string) => SITE_URL + (l === 'es' ? `/es${path === '/' ? '' : path}` : path);
  const canonical = urlFor(locale);
  const image = imageFullUrl?.startsWith('http') ? imageFullUrl : `${SITE_URL}/hero/hero-poster.jpg`;

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
        <link rel="alternate" hrefLang="es" href={urlFor('es')} />
        <link rel="alternate" hrefLang="en" href={urlFor('en')} />
        <link rel="alternate" hrefLang="x-default" href={urlFor('en')} />
        <meta property="og:site_name" content={site.name} />
        <meta property="og:locale" content={locale === 'es' ? 'es_CO' : 'en_US'} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <a href="#main" className="skip-link">
        {t.nav.skipToContent}
      </a>
      <Navbar />
      <SideMenu />
      <main id="main" className={styles.main}>
        {children}
      </main>
      <Footer />
      <button
        type="button"
        aria-label={t.nav.backToTop}
        className={`${styles.topBtn} ${showTopBtn ? styles.visible : ''}`}
        tabIndex={showTopBtn ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <KeyboardArrowUpIcon />
      </button>
    </>
  );
};
