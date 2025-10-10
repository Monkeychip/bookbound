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
import { MockedProvider } from '@apollo/client/testing';
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
  const Wrapper = ({ children }: PropsWithChildren) => (
    <MockedProvider mocks={apolloMocks}>
      <TestingThemeProvider>
        <MemoryRouter {...routerProps} initialEntries={routerInitialEntries}>
          {children}
        </MemoryRouter>
      </TestingThemeProvider>
    </MockedProvider>
  );

  return render(ui, { wrapper: Wrapper });
}

export default renderWithProviders;
