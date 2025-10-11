/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
// This file is a test utility. We intentionally use runtime `require()` to
// lazily load CJS test helpers in environments where static ESM resolution
// could fail (Playwright, older Node setups). Keeping these disables local
// to this file avoids affecting the rest of the codebase.
// Ensure matchMedia exists early — some UI libs (Mantine) call it
// during render. Adding it here guarantees the polyfill runs when
// tests import this helper.
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
  // @ts-expect-error - test env augmentation
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

import React from 'react';
import type { PropsWithChildren } from 'react';
import type { MemoryRouterProps } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import type { MockedResponse } from '@apollo/client/testing';
// Prefer the CJS testing helper to avoid Playwright/Node ESM directory import
// issues when running in certain environments. Fall back to the ESM import
// shape when require isn't available.
// Lazy-resolve MockedProvider at runtime so tooling that statically checks
// imports doesn't attempt to resolve package directories as modules (which
// can fail in certain environments like Playwright / Node ESM). This keeps
// the helper robust in both test and e2e runs.
function getMockedProvider(): any {
  try {
    // prefer CJS test helper when present
    return require('@apollo/client/testing/testing.cjs').MockedProvider;
  } catch {
    // fallback to the regular testing export
    return require('@apollo/client/testing').MockedProvider;
  }
}
import { render } from '@testing-library/react';
import TestingThemeProvider from './TestingThemeProvider';

type Options = {
  route?: string;
  routerProps?: Omit<MemoryRouterProps, 'children'>;
  apolloMocks?: ReadonlyArray<MockedResponse>;
};

export function renderWithProviders(ui: React.ReactElement, options: Options = {}) {
  const { route = '/', routerProps, apolloMocks = [] } = options;

  // MemoryRouter default initial entry
  const routerInitialEntries = routerProps?.initialEntries ?? [route];

  /*
    Do not pass `addTypename` to MockedProvider here — the Apollo
    client instance in the app controls typename behavior. Passing
    `addTypename` can lead to cache/MockedProvider warnings during
    tests. Provide mocks with __typename fields when needed instead.
  */
  const Wrapper = ({ children }: PropsWithChildren) => {
    const C = getMockedProvider();
    const Provider = C ?? ((p: any) => p.children);
    return (
      <Provider mocks={apolloMocks}>
        <TestingThemeProvider>
          <MemoryRouter {...routerProps} initialEntries={routerInitialEntries}>
            {children}
          </MemoryRouter>
        </TestingThemeProvider>
      </Provider>
    );
  };

  return render(ui, { wrapper: Wrapper });
}

export default renderWithProviders;
