import { FC, PropsWithChildren, useEffect, useState } from 'react';
import Head from 'next/head';
import { Footer, Navbar, SideMenu } from '../ui';
import { Tooltip, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import styles from './LandingLayout.module.css';

interface Props extends PropsWithChildren {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const LandingLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl }) => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>
      <nav>
        <Navbar />
      </nav>
      <SideMenu />
      <main style={{ flexGrow: 1, paddingBottom: '64px' }}>
        {children}
        {showTopBtn && (
          <div style={{ position: 'fixed', bottom: '62px', right: '27px' }} onClick={goToTop}>
            <Tooltip title={'Top'}>
              <IconButton className={styles['floating-button']}>
                <KeyboardArrowUpIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};
