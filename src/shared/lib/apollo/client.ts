import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

/**
 * -----------------------------------------------------------------------------
 * This file defines the shared ApolloClient instance used by the React app to
 * query the local GraphQL server.
 *
 * Apollo Client acts as the **frontend data layer**, handling queries,
 * mutations, and caching. The InMemoryCache normalizes entities by `id` and
 * ensures changes (like updates or deletes) automatically reflect across
 * components without manual state syncing.
 *
 * Added a cache redirect for Query.book so a just-created book can be read
 * from the normalized cache (by id) even if the backend doesn't persist it.
 * IRL, we'd want to ensure the backend returns the new book's id on create.
 *
 * The configured `typePolicies` include a basic merge strategy for `books`,
 * which will later support pagination or search results.
 **/

export const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.DEV ? 'http://localhost:4000/graphql' : '/graphql',
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Resolve detail views from list cache when possible
          book: {
            read(existing, { args, toReference }) {
              return (
                existing ??
                (args?.id ? toReference({ __typename: 'Book', id: args.id }) : undefined)
              );
            },
          },
          // Distinguish cache entries by search/sort; replace per page
          books: {
            keyArgs: ['search', ['sort', 'field'], ['sort', 'order']],
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      BooksPage: { keyFields: false }, // page container, not an entity
    },
  }),
});
