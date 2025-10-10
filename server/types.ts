/**
 * Server resolver typing helpers
 *
 * Tiny helpers that make resolver function signatures explicit for the demo
 * GraphQL server. Use `ResolverFn<Args, Return>` to type resolver arguments
 * and return values in `server/schema.ts`.
 */
import type { GraphQLResolveInfo } from 'graphql';

/**
 * Resolver function shape.
 *
 * @template Args - argument object passed to the resolver (e.g. `{ id: ID! }`).
 * @template Return - resolver return type.
 */

export type ResolverFn<Args = Record<string, unknown>, Return = unknown> = (
  parent: ResolverParent,
  args: Args,
  context: ResolverContext,
  info: GraphQLResolveInfo,
) => Promise<Return> | Return;

/** Map of type->field->resolver helpers (convenience type). */
export type ResolversMap = Record<string, Record<string, ResolverFn>>;

/** Parent type for resolvers (intentionally generic). */
export type ResolverParent = unknown;

/** Context shape available to resolvers (kept open for simplicity). */
export type ResolverContext = Record<string, unknown>;
