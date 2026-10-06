/**
 * Import of the Google Forms "Inscripción semillero" export (.xlsx) into researchers.
 * The .xlsx is read with platform APIs only (DecompressionStream works in browsers and Node).
 */

const u16 = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8);
const u32 = (b: Uint8Array, i: number) => (u16(b, i) | (u16(b, i + 2) << 16)) >>> 0;

/** Reads the files of a zip through its central directory (sizes in local headers may be 0). */
const unzip = async (buf: ArrayBuffer, wanted: (name: string) => boolean) => {
  const b = new Uint8Array(buf);
  let eocd = b.length - 22;
  while (eocd >= 0 && u32(b, eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('El archivo no es un .xlsx válido');
  const files: Record<string, string> = {};
  for (let i = 0, p = u32(b, eocd + 16); i < u16(b, eocd + 10); i++) {
    const nameLen = u16(b, p + 28);
    const name = new TextDecoder().decode(b.subarray(p + 46, p + 46 + nameLen));
    if (wanted(name)) {
      const local = u32(b, p + 42);
      const start = local + 30 + u16(b, local + 26) + u16(b, local + 28);
      const data = b.slice(start, start + u32(b, p + 20));
      const stream = new Blob([data]).stream();
      files[name] = await new Response(
        u16(b, p + 10) === 8 ? stream.pipeThrough(new DecompressionStream('deflate-raw')) : stream,
      ).text();
    }
    p += 46 + nameLen + u16(b, p + 30) + u16(b, p + 32);
  }
  return files;
};

const decode = (s: string) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, '&');

const texts = (xml: string) =>
  Array.from(xml.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g), (m) => decode(m[1])).join('');

const colIndex = (letters: string) =>
  Array.from(letters).reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;

/** First worksheet of an .xlsx as rows of strings. */
export const readSheet = async (buf: ArrayBuffer): Promise<string[][]> => {
  const files = await unzip(
    buf,
    (n) => n === 'xl/sharedStrings.xml' || n === 'xl/worksheets/sheet1.xml',
  );
  const sheet = files['xl/worksheets/sheet1.xml'];
  if (!sheet) throw new Error('El archivo no tiene hojas');
  const shared = Array.from(
    (files['xl/sharedStrings.xml'] ?? '').matchAll(/<si>([\s\S]*?)<\/si>/g),
    (m) => texts(m[1]),
  );
  const rows: string[][] = [];
  for (const [, row] of Array.from(sheet.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g))) {
    const cells: string[] = [];
    for (const [, attrs, body = ''] of Array.from(
      row.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g),
    )) {
      const ref = attrs.match(/\br="([A-Z]+)/)?.[1];
      const type = attrs.match(/\bt="(\w+)"/)?.[1];
      const v = decode(body.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? '');
      const value = type === 's' ? (shared[+v] ?? '') : type === 'inlineStr' ? texts(body) : v;
      cells[ref ? colIndex(ref) : cells.length] = value;
    }
    rows.push(Array.from(cells, (c) => c ?? ''));
  }
  return rows;
};

export const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export type Inscription = {
  name: string;
  lastName: string;
  email: string;
  cvlacUrl: string;
  imageUrl: string;
  /** "¿Qué semillero de investigación es de su interés?", split by comma. */
  interests: string[];
};

/** Maps the form rows (header first) to researchers; skips rows without email or consent. */
export const toInscriptions = (rows: string[][]): Inscription[] => {
  const header = (rows[0] ?? []).map(normalize);
  const col = (start: string) => header.findIndex((h) => h.startsWith(start));
  const [nameCol, emailCol, cvlacCol, photoCol, interestCol, consentCol] = [
    'nombre',
    'correo electronico institucional',
    'enlace cvlac',
    'fotografia',
    '¿que semillero',
    'autorizo',
  ].map(col);
  if (nameCol < 0 || emailCol < 0) throw new Error('Faltan las columnas "Nombre" o "Correo"');

  const byEmail = new Map<string, Inscription>();
  for (const r of rows.slice(1)) {
    const email = (r[emailCol] ?? '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) continue;
    if (consentCol >= 0 && !normalize(r[consentCol] ?? '').startsWith('si')) continue;

    const words = (r[nameCol] ?? '').trim().split(/\s+/).filter(Boolean);
    const cap = (ws: string[]) => ws.map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
    const split = Math.max(1, Math.floor(words.length / 2));
    const cvlac = (r[cvlacCol] ?? '').trim();
    const photoId = (r[photoCol] ?? '').match(/[?&]id=([\w-]+)/)?.[1];
    const interests = (r[interestCol] ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const previous = byEmail.get(email);

    // Several submissions per person: the latest wins, interests accumulate.
    byEmail.set(email, {
      name: cap(words.slice(0, split)),
      lastName: cap(words.slice(split)),
      email,
      cvlacUrl: /cvlac.*cod_rh=\d+/.test(cvlac)
        ? cvlac.replace(/^(?!https?:\/\/)/, 'https://')
        : '',
      imageUrl: photoId ? `https://drive.google.com/thumbnail?id=${photoId}&sz=w400` : '',
      interests: Array.from(new Set([...(previous?.interests ?? []), ...interests])),
    });
  }
  return Array.from(byEmail.values());
};
