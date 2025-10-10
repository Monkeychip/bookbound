// Global test setup for Vitest + Testing Library
import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure DOM cleanup between tests
afterEach(() => {
  cleanup();
});

// Minimal matchMedia polyfill for Mantine and other libs that call it.
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
  // @ts-expect-error test env augmentation
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

export {};

// Mock @mantine/core with our lightweight test implementation so tests
// don't invoke Mantine internals (matchMedia, theme hooks) directly.
import { vi } from 'vitest';
// Hoist-safe mock for @mantine/core that re-uses the CommonJS mock file.
// Keep the factory synchronous and hoist-safe so Vitest can apply it at
// collection time. Using the `.cjs` file avoids JSX/transform problems.
vi.mock('@mantine/core', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mock = require('../test/mocks/mantineMock.cjs');
  return mock;
});

// Mock mantine notifications to avoid importing the real package which
// relies on Mantine's provider internals. Hoist-safe CJS mock.
vi.mock('@mantine/notifications', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mock = require('../test/mocks/notificationsMock.cjs');
  return mock;
});
