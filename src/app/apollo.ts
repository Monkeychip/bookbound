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
// Added a cache redirect for Query.book so a just-created book can be read
// from the normalized cache (by id) even if the backend doesn't persist it.
// IRL, we'd want to ensure the backend returns the new book's id on create.
//
// The configured `typePolicies` include a basic merge strategy for `books`,
// which will later support pagination or search results.
// -----------------------------------------------------------------------------

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache({
    typePolicies: {
      Book: {
        keyFields: ['id'],
      },
      Query: {
        fields: {
          books: {
            keyArgs: ['search', ['sort', 'field'], ['sort', 'order']],
            merge(_existing, incoming) {
              return incoming;
            },
          },
          // Redirect: If a Book with this id is already in cache (e.g., from a create or list),
          // return a reference so BookDetail can render immediately without a network hit.
          book: {
            keyArgs: ['id'],
            read(existing, { args, toReference }) {
              if (existing) return existing;
              if (!args?.id) return existing;
              return toReference({ __typename: 'Book', id: String(args.id) });
            },
          },
        },
      },
    },
  }),
});
