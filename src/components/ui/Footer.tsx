import { useSyncExternalStore } from 'react';
import NextLink from 'next/link';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import { NAV_LINKS } from '@/utils/site';
import { ContactChannels } from './ContactChannels';
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
  const { site, contact, social } = useContent();
  const { t } = useT();
  const networks = social.filter((s) => s.url);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <div className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.logo} alt="" width={44} height={44} />
            <span>{site.name}</span>
          </div>
          <p className={styles.muted}>{site.fullName}</p>
          <p className={styles.muted}>{site.institution}</p>
          {networks.length > 0 && (
            <ul className={styles.social} aria-label={t.contact.social}>
              {networks.map(({ network, url }) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {network}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label={t.footer.navigation}>
          <h2 className={styles.heading}>{t.footer.navigation}</h2>
          <ul className={styles.list}>
            {NAV_LINKS.map(({ href, key }) => (
              <li key={href}>
                <NextLink href={href}>{t.nav[key]}</NextLink>
              </li>
            ))}
            {contact.gruplacUrl && (
              <li>
                <a href={contact.gruplacUrl} target="_blank" rel="noopener noreferrer">
                  GrupLAC
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div>
          <h2 className={styles.heading}>{t.footer.contact}</h2>
          <ul className={styles.list}>
            <ContactChannels iconSize="small" />
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className="container">{t.footer.rights(year, site.name)}</p>
      </div>
    </footer>
  );
};
