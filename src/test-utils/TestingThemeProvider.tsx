import type { PropsWithChildren } from 'react';
import React from 'react';

export function TestingThemeProvider({ children }: PropsWithChildren) {
  // During tests we must ensure `window.matchMedia` exists before any
  // Mantine code runs. Some environments import Mantine earlier than the
  // global setup, so defensively polyfill here before requiring Mantine.
  if (process.env.NODE_ENV === 'test') {
    if (typeof window !== 'undefined' && !('matchMedia' in window)) {
      // @ts-expect-error - test-only augmentation
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

    // In tests we avoid loading Mantine at all. Return children directly so
    // components render without Mantine wrappers and don't trigger
    // matchMedia or provider hooks.
    return <>{children}</>;
  }

  // Non-test branch: lazily require the app ThemeProvider which may import
  // real Mantine. Keeping the require here prevents Mantine from loading
  // during test setup where we want the mock to be used.
  // Lazy-require real ThemeProvider for non-test runtime.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ThemeProvider } = require('@/app/providers/ThemeProvider');
  return <ThemeProvider>{children}</ThemeProvider>;
}

export default TestingThemeProvider;
