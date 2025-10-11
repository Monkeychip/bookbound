import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schema';

/**
 * GraphQL server entry point
 *
 * Launches a standalone Apollo Server using schema + resolvers from `schema.ts`.
 * Intended for local development; can be adapted to a production server later.
 */

async function main() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  if (process.env.NODE_ENV !== 'test' && !process.env.CI) {
    // helpful for local development but noisy in CI/test runs
    console.log(`🚀 GraphQL ready at ${url}graphql`);
  }
}
// Main entry function, with simple error handling for unhandled rejections.
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
