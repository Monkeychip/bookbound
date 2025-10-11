import React from 'react';
import { ApolloProvider as RawApolloProvider } from '@apollo/client';
import { client as defaultClient } from '@/shared/lib/apollo/client';
import type { ApolloClient as ApolloClientType } from '@apollo/client';

type ApolloProviderProps = {
  children: React.ReactNode;
  uri?: string;
  getAuthToken?: () => string | null;
  client?: ApolloClientType<unknown>;
};

export function ApolloProvider({ children, client }: ApolloProviderProps) {
  const apolloClient = client ?? defaultClient;
  return <RawApolloProvider client={apolloClient}>{children}</RawApolloProvider>;
}
