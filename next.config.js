/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exposed to the browser at build time (used by the GrupLAC links).
  env: {
    GRUPLAC_URL: process.env.GRUPLAC_URL ?? '',
  },
};

module.exports = nextConfig;
