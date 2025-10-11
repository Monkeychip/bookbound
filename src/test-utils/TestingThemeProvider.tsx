import type { PropsWithChildren } from 'react';
import React from 'react';

export function TestingThemeProvider({ children }: PropsWithChildren) {
  // In tests we avoid loading Mantine at all. Return children directly so
  // components render without Mantine wrappers and don't trigger
  // matchMedia or provider hooks. The global polyfill (matchMediaPolyfill)
  // is imported by test setup and by helpers that run before UI mounts.
  if (process.env.NODE_ENV === 'test') {
    return <>{children}</>;
  }

  // Non-test branch: lazily require the app ThemeProvider which may import
  // real Mantine. Keeping the require here prevents Mantine from loading
  // during test setup where we want the mock to be used.
  // Lazy-require real ThemeProvider for non-test runtime.
  // Lazily require the real ThemeProvider for non-test runtime. Cast to unknown
  // then to the expected module shape to avoid lint rules complaining about
  // require-style imports in TypeScript files used only at runtime.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ThemeProvider } = require('@/app/providers/ThemeProvider') as unknown as {
    ThemeProvider: React.FC<React.PropsWithChildren<unknown>>;
  };
  return <ThemeProvider>{children}</ThemeProvider>;
}

export default TestingThemeProvider;
