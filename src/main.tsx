import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { apolloClient } from './app/apollo';
import App from './App';

// -----------------------------------------------------------------------------
// Entry point for the React application.
//
// ApolloProvider connects Apollo Client to React. The Apollo Client’s
// InMemoryCache stores data in memory; an ephemeral cache that improves
// performance and enables optimistic UI updates. It is cleared on refresh.
//
// MantineProvider supplies global UI theme settings. Notifications are added
// globally here so any feature can trigger toasts or alerts.
//
// App’s foundation:
// React → ApolloProvider → MantineProvider → App
// -----------------------------------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <MantineProvider defaultColorScheme="light">
        <Notifications />
        <App />
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
