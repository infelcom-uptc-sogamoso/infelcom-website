import Image from 'next/image';
import NextLink from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './WhyUs.module.css';

const stats = [
  { icon: '/icons/projects.webp', value: '+ 100', label: 'Proyectos', href: '/projects' },
  { icon: '/icons/researches.webp', value: '+ 10', label: 'Investigadores', href: '/researchers' },
  { icon: '/icons/research.webp', value: '3', label: 'Líneas de investigación', href: '#groups' },
];

export const WhyUs = () => {
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container">
        <SectionHeading
          id="why-title"
          eyebrow="Nosotros"
          title="¿Por qué nuestro grupo de investigación?"
        />
        <ul className={styles.grid}>
          {stats.map(({ icon, value, label, href }) => (
            <li key={label}>
              <NextLink href={href} className={styles.card}>
                {/* Animated WebP: served as-is, Next can't optimize animations */}
                <Image src={icon} alt="" width={72} height={72} unoptimized />
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
