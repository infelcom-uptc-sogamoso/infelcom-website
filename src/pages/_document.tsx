import { Html, Head, Main, NextScript } from 'next/document';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

// <html lang> is set by Next from the active locale.
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#15181b" />
      </Head>
      <body>
        {/* Applies the saved/system theme before first paint (no light flash in dark mode) */}
        <InitColorSchemeScript defaultMode="system" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
