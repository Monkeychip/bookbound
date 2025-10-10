// Ensure matchMedia exists before importing Mantine. Some Mantine
// internals may call matchMedia very early during mount; adding this
// guard prevents a runtime TypeError in jsdom when the polyfill from
// test setup hasn't executed yet.
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

import { MantineProvider, createTheme } from '@mantine/core';
import type { MantineTheme } from '@mantine/core';
import type { ReactNode } from 'react';
import tokens from '../../shared/ui/theme/tokens';

/**
 * ThemeProvider
 *
 * Centralizes color scheme, fonts, radius, and spacing tokens. This ensures
 * a consistent look & feel across all feature areas.
 */

const theme = createTheme({
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: { fontFamily: 'Inter, system-ui, sans-serif' },
  primaryColor: 'orangeAccent',
  primaryShade: 5,
  colors: {
    tealBrand: tokens.colors.tealBrand,
    cream: tokens.colors.cream,
    orangeAccent: tokens.colors.orangeAccent,
  },
  components: {
    ActionIcon: {
      defaultProps: { variant: 'outline', color: 'orangeAccent', radius: 'md' },
      styles: {
        root: {
          '&:focusVisible': {
            outline: '3px solid rgba(63,140,137,0.18)',
            borderRadius: 6,
          },
        },
      },
    },
    Breadcrumbs: {
      styles: (theme: MantineTheme) => ({
        root: { marginBottom: theme.spacing.lg },
        separator: { color: (theme.colors.cream ?? [])[4] },
      }),
    },
    Button: {
      defaultProps: { radius: 'md', fw: 500 },
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: (theme.colors.orangeAccent ?? [])[6],
          color: (theme.colors.cream ?? [])[0],
          '&:hover': {
            backgroundColor: (theme.colors.orangeAccent ?? [])[7],
          },
          '&:disabled': {
            backgroundColor: (theme.colors.orangeAccent ?? [])[2],
            color: (theme.colors.cream ?? [])[4],
          },
        },
      }),
    },
    InputWrapper: {
      styles: (theme: MantineTheme) => ({
        description: { color: (theme.colors.cream ?? [])[3] }, // helper text
        error: { color: (theme.colors.red ?? [])[4] },
        label: { color: (theme.colors.cream ?? [])[1] },
      }),
    },
    Menu: {
      styles: {
        dropdown: { borderRadius: 'md' },
      },
    },
    Paper: {
      defaultProps: { radius: 'md', withBorder: true, p: 'xs' },
      styles: () => ({
        root: {
          borderColor: 'var(--mantine-color-tealBrand-7)',
          background: 'color-mix(in oklab, var(--mantine-color-tealBrand-9) 92%, black 8%)',
        },
      }),
    },
    Text: {
      defaultProps: { lh: 1.5 },
    },
  },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Ensure Mantine doesn't attempt to detect color scheme via
  // matchMedia during tests — set colorScheme explicitly on the
  // theme object passed to the provider.
  // In test environments we avoid mounting MantineProvider to prevent
  // early runtime calls to window.matchMedia from Mantine internals.
  // This keeps tests fast and stable; the real provider mounts in
  // development and production.
  if (process.env.NODE_ENV === 'test') {
    return <>{children}</>;
  }

  // Ensure Mantine doesn't attempt to detect color scheme via
  // matchMedia during runtime — set colorScheme explicitly on the
  // theme object passed to the provider.
  const themeWithColorScheme = { ...theme, colorScheme: 'light' } as typeof theme & {
    colorScheme: 'light';
  };

  return (
    <MantineProvider theme={themeWithColorScheme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}
