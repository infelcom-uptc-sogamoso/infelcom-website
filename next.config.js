/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Default value of the GrupLAC link in src/content/siteContent.ts (editable from /admin).
  env: {
    GRUPLAC_URL: process.env.GRUPLAC_URL ?? '',
  },
  // English is the default (unprefixed URLs) and the fallback for any non-Spanish browser;
  // Spanish lives under /es. Detection happens in src/proxy.ts, not in Next's root-only detector.
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

module.exports = nextConfig;
