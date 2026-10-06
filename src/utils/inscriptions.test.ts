// Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toInscriptions } from './inscriptions.ts';

const header = [
  'Nombre',
  'Correo electrónico institucional',
  '¿Qué semillero de investigación es de su interés?',
  'Enlace CVLAC',
  'Fotografía (a fin de alimentar nuestra página WEB) ',
  'Autorizo el uso de los datos',
];

test('toInscriptions: splits names, dedupes by email, skips bad rows', () => {
  const cv =
    'scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0002377008';
  const out = toInscriptions([
    header,
    ['paola andrea hernandez villamil', 'Ana@uptc.edu.co', 'Realidad Virtual', 'x', '', 'Sí'],
    [
      'Paola Andrea Hernández Villamil',
      'ana@uptc.edu.co',
      'Telecomunicaciones',
      cv,
      'https://drive.google.com/open?id=Ab-1',
      'Sí',
    ],
    ['Samuel', 'samuel@uptc.edu.co', '', '', '', 'Sí'],
    ['Sin correo', 'no-email', 'Realidad Virtual', '', '', 'Sí'],
    ['Sin permiso', 'np@uptc.edu.co', 'Realidad Virtual', '', '', 'No'],
  ]);
  assert.equal(out.length, 2);
  assert.deepEqual(out[0], {
    name: 'Paola Andrea',
    lastName: 'Hernández Villamil',
    email: 'ana@uptc.edu.co',
    cvlacUrl: `https://${cv}`,
    imageUrl: 'https://drive.google.com/thumbnail?id=Ab-1&sz=w400',
    interests: ['Realidad Virtual', 'Telecomunicaciones'],
  });
  assert.equal(out[1].name, 'Samuel');
  assert.equal(out[1].lastName, '');
  assert.throws(() => toInscriptions([['otra cosa']]));
});
