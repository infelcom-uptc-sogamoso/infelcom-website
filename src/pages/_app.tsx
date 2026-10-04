import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider, UiProvider } from '@/contexts';
import { ContentContext } from '@/content/ContentContext';
import { theme } from '@/themes';
import { CssBaseline } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { SWRConfig } from 'swr';
import '@/styles/globals.css';

// Non-2xx responses become SWR errors instead of being handed to components as data.
const fetcher = async (resource: string, init?: RequestInit) => {
  const res = await fetch(resource, init);
  if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
  return res.json();
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <SWRConfig value={{ fetcher }}>
        <AuthProvider>
          <UiProvider>
            <ContentContext.Provider value={pageProps.content ?? null}>
              {/* defaultMode "system" follows the OS; the choice is kept in localStorage (mui-mode) */}
              <CssVarsProvider theme={theme} defaultMode="system">
                <CssBaseline enableColorScheme />
                <Component {...pageProps} />
              </CssVarsProvider>
            </ContentContext.Provider>
          </UiProvider>
        </AuthProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
