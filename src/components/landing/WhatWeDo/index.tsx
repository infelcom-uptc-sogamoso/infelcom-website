import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import styles from './WhatWeDo.module.css';

export const WhatWeDo = () => {
  const { areas } = useContent();
  const { t } = useT();

  return (
    <section className={`section ${styles.section}`} aria-labelledby="what-title">
      <div className="container">
        <SectionHeading id="what-title" eyebrow={areas.eyebrow} title={areas.title} />
      </div>
      {/* Swipeable row on phones (native scroll-snap), grid from tablets up */}
      <ul className={styles.track} tabIndex={0} aria-label={t.areas.scrollable(areas.eyebrow)}>
        {areas.items.map(({ icon, title, description }, i) => (
          <li key={i} className={styles.card}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icon} alt="" width={64} height={64} loading="lazy" />
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
