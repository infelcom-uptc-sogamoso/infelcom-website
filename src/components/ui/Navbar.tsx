import { useContext } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import { UiContext } from '@/contexts';
import { NAV_LINKS, SITE_NAME } from '@/utils/site';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { isMenuOpen, toogleSideMenu } = useContext(UiContext);
  const { pathname } = useRouter();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <NextLink href="/" className={styles.brand} aria-label={`${SITE_NAME}, ir al inicio`}>
          <Image src="/logo.png" alt="" width={36} height={36} priority />
          <span>{SITE_NAME}</span>
        </NextLink>

        {!isAdmin && (
          <nav aria-label="Principal" className={styles.nav}>
            <ul>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <NextLink
                    href={href}
                    className={styles.link}
                    aria-current={pathname === href ? 'page' : undefined}>
                    {label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <button
          type="button"
          className={styles.menuBtn}
          onClick={toogleSideMenu}
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
          aria-controls="side-menu">
          <MenuIcon />
        </button>
      </div>
    </header>
  );
};
