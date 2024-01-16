import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import RootLayout from '../app/layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    const metadata = Component.metadata;
  
    return (
      <RootLayout>
        <Head>
          {metadata && (
            <>
              <title>{metadata.title}</title>
              <meta name="description" content={metadata.description} />
            </>
          )}
        </Head>
        <Component {...pageProps} />
      </RootLayout>
    );
  }
  
  export default MyApp;