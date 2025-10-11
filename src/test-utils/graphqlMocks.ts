import type { MockedResponse } from '@apollo/client/testing';
import type { DocumentNode } from 'graphql';

// Injects __typename recursively into objects where missing. Keeps arrays.
function injectTypename(obj: unknown, typename = 'Book'): unknown {
  if (obj == null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return (obj as unknown[]).map((v) => injectTypename(v, typename));
  const record = obj as Record<string, unknown>;
  if (!('__typename' in record)) record.__typename = typename as unknown;
  for (const k of Object.keys(record)) {
    const v = record[k];
    if (v && typeof v === 'object') {
      record[k] = injectTypename(v, typename);
    }
  }
  return record;
}

type MockArgs = {
  query: DocumentNode | unknown;
  variables?: unknown;
  data?: unknown;
  typename?: string;
};

export function buildMockedQuery({
  query,
  variables,
  data,
  typename,
}: MockArgs): MockedResponse<Record<string, unknown>, Record<string, unknown>> {
  const result = data
    ? { data: injectTypename(JSON.parse(JSON.stringify(data)), typename ?? 'Book') }
    : undefined;
  const mock: MockedResponse<Record<string, unknown>, Record<string, unknown>> = result
    ? {
        request: { query: query as DocumentNode, variables: variables as Record<string, unknown> },
        result: result as Record<string, unknown>,
      }
    : {
        request: { query: query as DocumentNode, variables: variables as Record<string, unknown> },
        error: new Error('mock network error'),
      };
  return mock;
}

export function buildMockedMutation({
  query,
  variables,
  data,
  typename,
}: MockArgs): MockedResponse<Record<string, unknown>, Record<string, unknown>> {
  return buildMockedQuery({ query, variables, data, typename });
}
