import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { Mail, Phone, Place } from '@mui/icons-material';
import { CONTACT, NAV_LINKS, SITE_FULL_NAME, SITE_NAME } from '@/utils/site';
import styles from './Footer.module.css';

const noop = () => () => {};

// Pages are prerendered at build time, so the year must come from the browser's clock,
// not the build's. The server snapshot (null) keeps hydration consistent; the client then
// re-renders with the current year.
const useCurrentYear = () =>
  useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );

export const Footer = () => {
  const year = useCurrentYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <div className={styles.brand}>
            <Image src="/logo.png" alt="" width={44} height={44} />
            <span>{SITE_NAME}</span>
          </div>
          <p className={styles.muted}>{SITE_FULL_NAME}</p>
          <p className={styles.muted}>UPTC · Facultad Seccional Sogamoso</p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className={styles.heading}>Navegación</h2>
          <ul className={styles.list}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <NextLink href={href}>{label}</NextLink>
              </li>
            ))}
            {CONTACT.gruplacUrl && (
              <li>
                <a href={CONTACT.gruplacUrl} target="_blank" rel="noopener noreferrer">
                  GrupLAC
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div>
          <h2 className={styles.heading}>Contacto</h2>
          <ul className={styles.list}>
            <li>
              <Place fontSize="small" aria-hidden />
              <span>{CONTACT.address}</span>
            </li>
            <li>
              <Mail fontSize="small" aria-hidden />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <Phone fontSize="small" aria-hidden />
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className="container">
          © {year} Todos los derechos reservados {SITE_NAME}
        </p>
      </div>
    </footer>
  );
};
