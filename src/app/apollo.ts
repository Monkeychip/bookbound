import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// -----------------------------------------------------------------------------
// This file defines the shared ApolloClient instance used by the React app to
// query the local GraphQL server.
//
// Apollo Client acts as the **frontend data layer**, handling queries,
// mutations, and caching. The InMemoryCache normalizes entities by `id` and
// ensures changes (like updates or deletes) automatically reflect across
// components without manual state syncing.
//
// The configured `typePolicies` include a basic merge strategy for `books`,
// which will later support pagination or search results.
// -----------------------------------------------------------------------------

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache({
    typePolicies: {
      // default to id as key field for all types
      Query: {
        fields: {
          // define how we want to merge results when fetching books
          // todo: refine later for pagination
          books: {
            keyArgs: ['search'],
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
