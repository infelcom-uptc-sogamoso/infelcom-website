import { Group } from '../models';

/** The groups the site shipped with; inserted once when the collection is empty. */
const DEFAULT_GROUPS = [
  {
    code: 'SEMTEL',
    slug: 'telecomunicaciones',
    name: 'Semillero de Telecomunicaciones',
    description: 'Sistemas de comunicación, procesamiento de señales y datos satelitales.',
    logo: '/semilleros/semtel.png',
    en: {
      name: 'Telecommunications research group',
      description: 'Communication systems, signal processing and satellite data.',
    },
  },
  {
    code: 'SCIECOM',
    slug: 'ciencias-computacionales',
    name: 'Semillero de Ciencias Computacionales',
    description: 'Algoritmos avanzados, inteligencia artificial y estructuras de datos.',
    logo: '/semilleros/sciecom.png',
    en: {
      name: 'Computer science research group',
      description: 'Advanced algorithms, artificial intelligence and data structures.',
    },
  },
  {
    code: 'SEMVR',
    slug: 'realidad-virtual',
    name: 'Semillero de Realidad Virtual',
    description: 'Entornos inmersivos, realidad aumentada y simulaciones interactivas.',
    logo: '/semilleros/semvr.png',
    en: {
      name: 'Virtual reality research group',
      description: 'Immersive environments, augmented reality and interactive simulations.',
    },
  },
  {
    code: 'SICTE',
    slug: 'ciberseguridad',
    name: 'Semillero de Ciberseguridad',
    description: 'Seguridad de la información, auditoría de sistemas y redes seguras.',
    logo: '/semilleros/sicte.png',
    en: {
      name: 'Cybersecurity research group',
      description: 'Information security, systems auditing and secure networks.',
    },
  },
];

/** Call after db.connect(). Seeds the defaults on an empty collection (safe to race: codes are unique). */
export const ensureSeeded = async () => {
  if ((await Group.estimatedDocumentCount()) > 0) return;
  await Group.insertMany(DEFAULT_GROUPS, { ordered: false }).catch(() => {});
};

export { slugify } from '../utils';
