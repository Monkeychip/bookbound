import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { client as apolloClient } from '@/shared/lib/apollo/client';
import { ThemeProvider } from './ThemeProvider';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/global.css'; // if global styles live there
import { useEffect } from 'react';
import { initBooksStore } from '@/shared/lib/data/booksStore';

// TODO add docs

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    void initBooksStore();
  }, []);
  return (
    <ApolloProvider client={apolloClient}>
      <MantineProvider defaultColorScheme="light">
        <Notifications />
        <BrowserRouter>
          <ThemeProvider>{children}</ThemeProvider>
        </BrowserRouter>
      </MantineProvider>
    </ApolloProvider>
  );
}
