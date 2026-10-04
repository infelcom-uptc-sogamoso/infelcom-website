/**
 * Editable site content: default values, shape and validation.
 *
 * `defaultContent` is the single source of truth for the content's SHAPE. The admin form is
 * generated from it, the API validates against it and the public pages fall back to it for
 * anything missing in the database. To add an editable field: add it here (with a label in
 * src/i18n/messages.ts → admin.fields) and read it from `useContent()`.
 *
 * `{ es, en }` objects are bilingual texts; plain strings are language-neutral.
 * Keep this file free of imports so it runs on the server, the browser and `npm test`.
 */

export type Locale = 'es' | 'en';
export type L = { es: string; en: string };

const l = (es: string, en: string): L => ({ es, en });

export const defaultContent = {
  site: {
    name: 'INFELCOM',
    fullName: l(
      'Grupo de Investigación en Informática, Electrónica y Telecomunicaciones',
      'Research Group in Informatics, Electronics and Telecommunications',
    ),
    institution: l('UPTC · Facultad Seccional Sogamoso', 'UPTC · Sogamoso Campus'),
    description: l(
      'Grupo de Investigación en Informática, Electrónica y Telecomunicaciones (INFELCOM) de la Universidad Pedagógica y Tecnológica de Colombia (UPTC), Facultad Seccional Sogamoso.',
      'Research Group in Informatics, Electronics and Telecommunications (INFELCOM) at the Universidad Pedagógica y Tecnológica de Colombia (UPTC), Sogamoso campus.',
    ),
    logo: '/logo.png',
  },
  hero: {
    lead: l('Investigamos para cambiar el mundo.', 'We do research to change the world.'),
    primaryCta: l('Ver proyectos', 'View projects'),
    primaryHref: '/projects',
    secondaryCta: l('Contáctanos', 'Contact us'),
    secondaryHref: '/#contact',
    poster: '/hero/hero-poster.jpg',
    video: '/hero/video.mp4',
  },
  about: {
    eyebrow: l('Nosotros', 'About us'),
    title: l('¿Por qué nuestro grupo de investigación?', 'Why our research group?'),
    stats: [
      { icon: '/icons/projects.webp', value: '+ 100', label: l('Proyectos', 'Projects'), href: '/projects' },
      { icon: '/icons/researches.webp', value: '+ 10', label: l('Investigadores', 'Researchers'), href: '/researchers' },
      { icon: '/icons/research.webp', value: '3', label: l('Líneas de investigación', 'Research lines'), href: '/#groups' },
    ],
  },
  areas: {
    eyebrow: l('Áreas de trabajo', 'Areas of work'),
    title: l('¿Qué hacemos?', 'What do we do?'),
    items: [
      {
        icon: '/icons/web_design.webp',
        title: l('Diseño web', 'Web design'),
        description: l(
          'El diseño web es un área enfocada a planificar, diseñar, mantener y crear interfaces digitales. Es decir, que se refiere al proceso del diseño de sitios y páginas web.',
          'Web design is the field focused on planning, designing, maintaining and building digital interfaces, that is, the process of designing websites and web pages.',
        ),
      },
      {
        icon: '/icons/data_transfer.webp',
        title: l('Técnicas de extracción de datos', 'Data extraction techniques'),
        description: l(
          'La extracción es un tipo de recuperación de la información cuyo objetivo es extraer automáticamente información estructurada o desestructurada.',
          'Data extraction is a kind of information retrieval that aims to automatically extract structured or unstructured information.',
        ),
      },
      {
        icon: '/icons/satelite.webp',
        title: l('Comunicación satelital', 'Satellite communication'),
        description: l(
          'Son tipos de comunicación que emplea como soporte un satélite, se localiza en la órbita terrestre, está diseñado para la recepción de señales de radiofrecuencia.',
          'Communication that relies on a satellite in Earth orbit, designed to receive and relay radio-frequency signals.',
        ),
      },
      {
        icon: '/icons/artificial_intelligence.webp',
        title: l('Inteligencia artificial', 'Artificial intelligence'),
        description: l(
          'La inteligencia artificial es la serie de tecnologías que sirven para emular características o capacidades exclusivas del intelecto humano, nos llevan a reflexionar hacia dónde va el mundo.',
          'Artificial intelligence is the set of technologies that emulate capabilities once exclusive to the human intellect, and it makes us reflect on where the world is heading.',
        ),
      },
      {
        icon: '/icons/data_mining.webp',
        title: l('Minería de datos', 'Data mining'),
        description: l(
          'Es un campo de la estadística y las ciencias de la computación referido al proceso que intenta descubrir patrones en grandes volúmenes de conjuntos de datos.',
          'A field of statistics and computer science concerned with discovering patterns in large volumes of data.',
        ),
      },
      {
        icon: '/icons/videogames.webp',
        title: l('Desarrollo de videojuegos', 'Video game development'),
        description: l(
          'Es crear un videojuego para diversas plataformas (videoconsola o computadora personal). Un videojuego es un software informático creado para el entretenimiento en general.',
          'Creating video games for different platforms (consoles or personal computers). A video game is software created for entertainment.',
        ),
      },
      {
        icon: '/icons/virtual_reality.webp',
        title: l('Realidad virtual', 'Virtual reality'),
        description: l(
          'Es la simulación de experiencias con entornos y objetos generados por ordenador, manipulable en tiempo real involucrando el uso de todos los sentidos.',
          'The simulation of experiences with computer-generated environments and objects that can be manipulated in real time, engaging all the senses.',
        ),
      },
    ],
  },
  groups: {
    eyebrow: l('Semilleros', 'Research groups'),
    title: l('Nuestros grupos de investigación', 'Our research groups'),
    // The groups themselves live in the `groups` collection (/admin → Research groups).
  },
  news: {
    eyebrow: l('Actualidad', 'Latest'),
    title: l('Noticias', 'News'),
  },
  contact: {
    eyebrow: l('Contacto', 'Contact'),
    title: l('Contáctanos', 'Contact us'),
    intro: l(
      '¿Te gustaría colaborar con nuestro semillero de investigación? Únete a nuestro equipo, desarrolla proyectos innovadores y comparte conocimientos.',
      'Would you like to collaborate with our research group? Join our team, build innovative projects and share knowledge.',
    ),
    email: 'infelcom@uptc.edu.co',
    phone: '+57 3005600943',
    whatsapp: '',
    address: 'Calle 4 Sur No. 15-134',
    city: 'Sogamoso, Boyacá',
    country: 'Colombia',
    hours: l('', ''),
    gruplacUrl: process.env.GRUPLAC_URL ?? '',
  },
  social: [
    { network: 'Facebook', url: '' },
    { network: 'Instagram', url: '' },
    { network: 'YouTube', url: '' },
    { network: 'LinkedIn', url: '' },
  ],
  pages: {
    researchers: {
      eyebrow: l('Nosotros', 'About us'),
      title: l('Investigadores', 'Researchers'),
      description: l(
        'Docentes y estudiantes investigadores del grupo INFELCOM.',
        'Faculty and student researchers of the INFELCOM group.',
      ),
    },
    projects: {
      eyebrow: l('Investigación', 'Research'),
      title: l('Nuestros proyectos', 'Our projects'),
      description: l(
        'Proyectos de investigación del grupo INFELCOM.',
        'Research projects of the INFELCOM group.',
      ),
    },
    stories: {
      eyebrow: l('Actualidad', 'Latest'),
      title: l('Últimas noticias', 'Latest news'),
      description: l(
        'Últimas noticias del grupo de investigación INFELCOM.',
        'Latest news from the INFELCOM research group.',
      ),
    },
  },
};

export type SiteContent = typeof defaultContent;

/** The content with every `{ es, en }` replaced by the string of one language. */
export type Localized<T> = T extends L
  ? string
  : T extends (infer U)[]
    ? Localized<U>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

export type LocalizedContent = Localized<SiteContent>;

export const MAX_TEXT = 2000;
export const MAX_IMAGE = 400_000; // ~300 KB file as a data: URL
export const MAX_ITEMS = 30;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const isL = (v: unknown): v is L =>
  isObject(v) && typeof v.es === 'string' && typeof v.en === 'string' && Object.keys(v).length === 2;

const str = (v: unknown, max = MAX_TEXT) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export type FieldKind = 'text' | 'longtext' | 'email' | 'phone' | 'url' | 'image' | 'media';

/** How a field is edited and validated, derived from its key. */
export const fieldKind = (key: string): FieldKind => {
  if (key === 'email') return 'email';
  if (key === 'phone' || key === 'whatsapp') return 'phone';
  if (['logo', 'poster', 'icon'].includes(key)) return 'image';
  if (key === 'video') return 'media';
  if (key === 'href' || key === 'url' || key.endsWith('Href') || key.endsWith('Url')) return 'url';
  if (['description', 'intro', 'lead'].includes(key)) return 'longtext';
  return 'text';
};

// Only safe schemes: these values end up in href/src attributes.
const PATTERNS: Partial<Record<FieldKind, RegExp>> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+\d\s()-]{7,20}$/,
  url: /^(https?:\/\/\S+|\/(?!\/)\S*|#\S*|mailto:\S+|tel:[+\d\s()-]+)$/i,
  image: /^(https?:\/\/\S+|\/(?!\/)\S*|data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+)$/i,
  media: /^(https?:\/\/\S+|\/(?!\/)\S*)$/i,
};

/** True when `value` is acceptable for a field of this kind (empty is always acceptable). */
export const isValidField = (kind: FieldKind, value: string) => {
  if (!value) return true;
  if (value.length > (kind === 'image' ? MAX_IMAGE : MAX_TEXT)) return false;
  return PATTERNS[kind]?.test(value) ?? true;
};

/**
 * Coerces any input (a DB document, a request body, nothing) into the exact shape of `template`.
 * Unknown keys are dropped, wrong types replaced, and empty texts fall back:
 * `{ es, en }` → the other language → the default; plain string → the default.
 */
export function conform<T>(value: unknown, template: T): T {
  if (typeof template === 'string') return (str(value, MAX_IMAGE) || template) as T;
  if (isL(template)) {
    const v = isObject(value) ? value : {};
    const es = str(v.es);
    const en = str(v.en);
    return { es: es || en || template.es, en: en || es || template.en } as T;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return template;
    return value.slice(0, MAX_ITEMS).map((item) => conform(item, template[0])) as T;
  }
  const v = isObject(value) ? value : {};
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(template as object)) {
    out[key] = conform(v[key], (template as Record<string, unknown>)[key]);
  }
  return out as T;
}

/** Returns the dotted paths (e.g. `contact.email`) of fields with an invalid format. */
export function validateContent(value: unknown, template: unknown = defaultContent, path = ''): string[] {
  if (Array.isArray(template)) {
    if (value === undefined) return [];
    if (!Array.isArray(value) || value.length > MAX_ITEMS) return [path];
    return value.flatMap((item, i) => validateContent(item, template[0], `${path}.${i}`));
  }
  if (isObject(template) && !isL(template)) {
    if (value === undefined) return [];
    if (!isObject(value)) return [path];
    return Object.keys(template).flatMap((key) =>
      validateContent(value[key], template[key], path ? `${path}.${key}` : key),
    );
  }
  // Leaf: the kind comes from the field's own key (array indexes / es / en are skipped).
  const key = path.split('.').filter((p) => !/^\d+$/.test(p) && p !== 'es' && p !== 'en').pop() ?? '';
  const kind = fieldKind(key);
  if (isL(template)) {
    if (value === undefined) return [];
    if (!isObject(value)) return [path];
    return (['es', 'en'] as const)
      .filter((lang) => value[lang] !== undefined && (typeof value[lang] !== 'string' || !isValidField(kind, (value[lang] as string).trim())))
      .map((lang) => `${path}.${lang}`);
  }
  if (value === undefined) return [];
  return typeof value === 'string' && isValidField(kind, value.trim()) ? [] : [path];
}

export function localize<T>(value: T, locale: Locale): Localized<T> {
  if (isL(value)) return value[locale] as Localized<T>;
  if (Array.isArray(value)) return value.map((v) => localize(v, locale)) as Localized<T>;
  if (isObject(value)) {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value)) out[key] = localize(value[key], locale);
    return out as Localized<T>;
  }
  return value as Localized<T>;
}

/** Same shape as the first array item, with every text emptied: the template for "Add item". */
export function blankItem<T>(template: T): T {
  if (typeof template === 'string') return '' as T;
  if (isL(template)) return { es: '', en: '' } as T;
  if (Array.isArray(template)) return [] as T;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(template as object)) {
    out[key] = blankItem((template as Record<string, unknown>)[key]);
  }
  return out as T;
}
