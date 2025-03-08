import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider, UiProvider } from '@/contexts';
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
              <CssBaseline>
                <Component {...pageProps} />
              </CssBaseline>
            </ThemeProvider>
          </UiProvider>
        </AuthProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
