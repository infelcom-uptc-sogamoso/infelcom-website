import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider, UiProvider, ResearcherProvider } from '@/contexts';
import { lightTheme } from '@/themes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
        }}>
        <AuthProvider>
          <UiProvider>
            <ThemeProvider theme={lightTheme}>
              <ResearcherProvider>
                <CssBaseline>
                  <Component {...pageProps} />
                </CssBaseline>
              </ResearcherProvider>
            </ThemeProvider>
          </UiProvider>
        </AuthProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
