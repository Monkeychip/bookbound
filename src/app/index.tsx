import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './providers/AppProvider';
import App from './App';

/**
 * Entry point for the React application.
 *
 * ApolloProvider connects Apollo Client to React. The Apollo Client’s
 * InMemoryCache stores data in memory; an ephemeral cache that improves
 * performance and enables optimistic UI updates. It is cleared on refresh.
 *
 * MantineProvider supplies global UI theme settings. Notifications are added
 * globally here so any feature can trigger toasts or alerts.
 *
 * App composition: React → ApolloProvider → MantineProvider → BrowserRouter → ThemeProvider → App
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
