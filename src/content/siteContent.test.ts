// Run with `npm test` (Node's built-in test runner, no extra dependencies).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { conform, defaultContent, isL, localize, validateContent } from './siteContent.ts';
import { pickLocale } from '../i18n/locale.ts';
import { messages } from '../i18n/messages.ts';

test('pickLocale: Spanish → es, everything else → en', () => {
  for (const h of ['es-CO', 'es-ES,en;q=0.8', 'es']) assert.equal(pickLocale(h), 'es');
  for (const h of ['en-US', 'en-GB', 'fr-FR,es;q=0.9', '', null, 'estonian-xx']) {
    assert.equal(pickLocale(h), 'en');
  }
});

test('conform: empty DB → defaults; junk dropped; empty texts fall back', () => {
  assert.deepEqual(conform(null, defaultContent), defaultContent);
  const out = conform(
    {
      hacker: 'x',
      site: { name: '  ', fullName: { es: 'Nuevo', en: '' } },
      social: [{ network: 'X', url: 'https://x.com/a', extra: 1 }],
    },
    defaultContent,
  );
  assert.equal('hacker' in out, false);
  assert.equal(out.site.name, defaultContent.site.name);
  assert.deepEqual(out.site.fullName, { es: 'Nuevo', en: 'Nuevo' });
  assert.deepEqual(out.social, [{ network: 'X', url: 'https://x.com/a' }]);
});

test('validateContent rejects unsafe or malformed values', () => {
  assert.deepEqual(validateContent(defaultContent), []);
  const bad = {
    contact: { email: 'nope', phone: 'call me' },
    social: [{ url: 'javascript:alert(1)' }],
    site: { logo: '//evil.com/x.png' },
    hero: { primaryHref: '/projects', lead: { es: 1, en: 'ok' } },
  };
  assert.deepEqual(validateContent(bad).sort(), [
    'contact.email',
    'contact.phone',
    'hero.lead.es',
    'site.logo',
    'social.0.url',
  ]);
});

test('localize picks one language everywhere', () => {
  const es = localize(defaultContent, 'es');
  assert.equal(es.hero.lead, defaultContent.hero.lead.es);
  assert.equal(es.about.stats[0].label, 'Proyectos');
  assert.equal(JSON.stringify(es).includes('"en":'), false);
});

test('every editable field has an admin label in both languages; arrays have a template', () => {
  const walk = (node: unknown, key = ''): void => {
    if (key && !/^\d+$/.test(key)) {
      for (const lang of ['es', 'en'] as const) {
        assert.ok(messages[lang].admin.fields[key], `missing ${lang} label for "${key}"`);
      }
    }
    if (isL(node) || typeof node !== 'object' || node === null) return;
    if (Array.isArray(node)) assert.ok(node.length > 0, `array "${key}" needs a default item`);
    for (const [k, v] of Object.entries(node)) walk(v, Array.isArray(node) ? '0' : k);
  };
  walk(defaultContent);
});
