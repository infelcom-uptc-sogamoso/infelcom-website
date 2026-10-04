import NextLink from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content/ContentContext';
import styles from './WhyUs.module.css';

export const WhyUs = () => {
  const { about } = useContent();

  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container">
        <SectionHeading id="why-title" eyebrow={about.eyebrow} title={about.title} />
        <ul className={styles.grid}>
          {about.stats.map(({ icon, value, label, href }, i) => (
            <li key={i}>
              <NextLink href={href} className={styles.card}>
                {/* Animated WebP or admin-set URL: plain <img>, Next can't optimize these */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon} alt="" width={72} height={72} />
                <span className={styles.value}>{value}</span>
                <span className={styles.label}>{label}</span>
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
