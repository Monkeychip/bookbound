import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schema';

// -----------------------------------------------------------------------------
// Entry point for Bookbound's GraphQL server.
//
// This file launches an Apollo Server instance using the built-in standalone
// HTTP server helper. It imports schema + resolvers from
// `schema.ts`, starts the server on port 4000, and logs the running URL.
//
// Apollo Server acts as the backend for Bookbound — it receives GraphQL queries
// from the frontend, executes the corresponding resolvers, and returns structured
// JSON responses. This layer abstracts away the underlying data source (DummyJSON
// for now) so the frontend can work with a consistent, typed API.
//
// If Bookbound ever needs authentication middleware, custom
// routes, or rate limiting, we can easily migrate to Express or Fastify.
// -----------------------------------------------------------------------------

async function main() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 GraphQL ready at ${url}graphql`);
}
// Main entry function, with simple error handling for unhandled rejections.
// TODO: replace with more robust error handling as needed.
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
