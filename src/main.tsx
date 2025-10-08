import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './app/apollo';
import App from './App';

// -----------------------------------------------------------------------------
// Entry point for the React application.
//
// ApolloProvider connects the Apollo Client to React, making GraphQL features
// (like useQuery, useMutation, and cache access) available throughout the app.
//
// The Apollo Client’s InMemoryCache stores data in RAM—an ephemeral state that
// improves performance and enables optimistic UI updates, but is lost on refresh.
// -----------------------------------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
