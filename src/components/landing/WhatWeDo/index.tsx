import Image from 'next/image';
import { IWhatWeDo } from '@/interfaces';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './WhatWeDo.module.css';

const whatWeDoData: IWhatWeDo[] = [
  {
    imageUrl: '/icons/web_design.webp',
    title: 'Diseño web',
    description:
      'El diseño web es un área enfocada a planificar, diseñar, mantener y crear interfaces digitales. Es decir, que se refiere al proceso del diseño de sitios y páginas web.',
  },
  {
    imageUrl: '/icons/data_transfer.webp',
    title: 'Técnicas de extracción de datos',
    description:
      'La extracción es un tipo de recuperación de la información cuyo objetivo es extraer automáticamente información estructurada o desestructurada.',
  },
  {
    imageUrl: '/icons/satelite.webp',
    title: 'Comunicación satelital',
    description:
      'Son tipos de comunicación que emplea como soporte un satélite, se localiza en la órbita terrestre, está diseñado para la recepción de señales de radiofrecuencia.',
  },
  {
    imageUrl: '/icons/artificial_intelligence.webp',
    title: 'Inteligencia artificial',
    description:
      'La inteligencia artificial es la serie de tecnologías que sirven para emular características o capacidades exclusivas del intelecto humano, nos llevan a reflexionar hacia dónde va el mundo.',
  },
  {
    imageUrl: '/icons/data_mining.webp',
    title: 'Minería de datos',
    description:
      'Es un campo de la estadística y las ciencias de la computación referido al proceso que intenta descubrir patrones en grandes volúmenes de conjuntos de datos.',
  },
  {
    imageUrl: '/icons/videogames.webp',
    title: 'Desarrollo de videojuegos',
    description:
      'Es crear un videojuego para diversas plataformas (videoconsola o computadora personal). Un videojuego es un software informático creado para el entretenimiento en general.',
  },
  {
    imageUrl: '/icons/virtual_reality.webp',
    title: 'Realidad virtual',
    description:
      'Es la simulación de experiencias con entornos y objetos generados por ordenador, manipulable en tiempo real involucrando el uso de todos los sentidos.',
  },
];

export const WhatWeDo = () => {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="what-title">
      <div className="container">
        <SectionHeading id="what-title" eyebrow="Áreas de trabajo" title="¿Qué hacemos?" />
      </div>
      {/* Swipeable row on phones (native scroll-snap), grid from tablets up */}
      <ul className={styles.track} tabIndex={0} aria-label="Áreas de trabajo, desplazable">
        {whatWeDoData.map(({ imageUrl, title, description }) => (
          <li key={title} className={styles.card}>
            <Image src={imageUrl} alt="" width={64} height={64} unoptimized />
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
