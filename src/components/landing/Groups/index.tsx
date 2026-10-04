import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import styles from './Groups.module.css';

export const Groups = () => {
  const { groups } = useContent();
  const { t } = useT();

  return (
    <section id="groups" className={`section ${styles.section}`} aria-labelledby="groups-title">
      <div className="container">
        <SectionHeading id="groups-title" eyebrow={groups.eyebrow} title={groups.title} dark />
        <ul className={styles.grid}>
          {groups.items.map(({ name, description, logo }, i) => (
            <li key={i} className={styles.card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt={t.groups.logoAlt(name)} width={180} height={180} loading="lazy" />
              <h3>{name}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
