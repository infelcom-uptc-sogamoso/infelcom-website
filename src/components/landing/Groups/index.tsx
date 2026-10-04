import NextLink from 'next/link';
import useSWR from 'swr';
import { Skeleton } from '@mui/material';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import { inLocale } from '@/i18n/locale';
import type { IGroup } from '@/interfaces';
import styles from './Groups.module.css';

export const Groups = () => {
  const { groups: heading } = useContent();
  const { t, locale } = useT();
  const {
    data: groups,
    error,
    isLoading,
  } = useSWR<IGroup[]>('/api/groups', {
    revalidateOnFocus: false,
  });

  return (
    <section id="groups" className={`section ${styles.section}`} aria-labelledby="groups-title">
      <div className="container">
        <SectionHeading id="groups-title" eyebrow={heading.eyebrow} title={heading.title} dark />
        {error && <p role="alert">{t.common.loadError}</p>}
        {groups?.length === 0 && <p>{t.groups.empty}</p>}
        <ul className={styles.grid} aria-busy={isLoading}>
          {isLoading &&
            [...Array(4)].map((_, i) => (
              <li key={i}>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={260}
                  sx={{ bgcolor: 'rgba(255,255,255,.08)', borderRadius: 4 }}
                />
              </li>
            ))}
          {groups?.map((group) => {
            const name = inLocale(group, 'name', locale);
            return (
              <li key={group.code}>
                <NextLink
                  href={`/groups/${group.slug}`}
                  className={styles.card}
                  aria-label={t.groups.view(name)}>
                  {group.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={group.logo} alt="" width={180} height={180} loading="lazy" />
                  )}
                  <h3>{group.code}</h3>
                  <p>{name}</p>
                </NextLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
