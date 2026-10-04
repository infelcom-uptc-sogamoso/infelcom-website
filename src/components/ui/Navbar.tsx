import { useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import { UiContext } from '@/contexts';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import { NAV_LINKS } from '@/utils/site';
import { Preferences } from './Preferences';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { isMenuOpen, toogleSideMenu } = useContext(UiContext);
  const { site } = useContent();
  const { t } = useT();
  const { pathname } = useRouter();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <NextLink href="/" className={styles.brand} aria-label={t.nav.goHome(site.name)}>
          {/* Logo may be an admin-set external URL or data: URL */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} alt="" width={36} height={36} />
          <span>{site.name}</span>
        </NextLink>

        {!isAdmin && (
          <nav aria-label={t.nav.main} className={styles.nav}>
            <ul>
              {NAV_LINKS.map(({ href, key }) => (
                <li key={href}>
                  <NextLink
                    href={href}
                    className={styles.link}
                    aria-current={pathname === href ? 'page' : undefined}>
                    {t.nav[key]}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <Preferences />

        <button
          type="button"
          className={styles.menuBtn}
          onClick={toogleSideMenu}
          aria-label={t.nav.openMenu}
          aria-expanded={isMenuOpen}
          aria-controls="side-menu">
          <MenuIcon />
        </button>
      </div>
    </header>
  );
};
