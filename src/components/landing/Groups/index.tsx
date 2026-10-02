import Image from 'next/image';
import { IGroup } from '@/interfaces';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './Groups.module.css';

const groupsData: IGroup[] = [
  { title: 'SEMTEL', description: 'Semillero de Telecomunicaciones', image: '/semilleros/semtel.png' },
  { title: 'SCIECOM', description: 'Semillero de Ciencias computacionales', image: '/semilleros/sciecom.png' },
  { title: 'SEMVR', description: 'Semillero de Realidad Virtual', image: '/semilleros/semvr.png' },
  { title: 'SICTE', description: 'Semillero de Ciberseguridad', image: '/semilleros/sicte.png' },
];

export const Groups = () => {
  return (
    <section id="groups" className={`section ${styles.section}`} aria-labelledby="groups-title">
      <div className="container">
        <SectionHeading id="groups-title" eyebrow="Semilleros" title="Nuestros grupos de investigación" dark />
        <ul className={styles.grid}>
          {groupsData.map(({ title, description, image }) => (
            <li key={title} className={styles.card}>
              <Image src={image} alt={`Logo de ${title}`} width={180} height={180} sizes="180px" />
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
