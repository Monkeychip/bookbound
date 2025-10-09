import { MantineProvider, createTheme } from '@mantine/core';
import { ReactNode } from 'react';

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
    tealBrand: [
      '#e7f3f2',
      '#cbe3e2',
      '#a9d0ce',
      '#84bbb8',
      '#5ca39f',
      '#3f8c89',
      '#2f7472',
      '#1f5c5a',
      '#134846',
      '#0c3736',
    ],
    cream: [
      '#fffdf8',
      '#fff7ea',
      '#fef0d7',
      '#fde7bf',
      '#f8ddb0',
      '#f1d3a3',
      '#eac998',
      '#e2bf8c',
      '#d9b581',
      '#d0ab77',
    ],
    orangeAccent: [
      '#fff2e8',
      '#ffd9bf',
      '#ffbf94',
      '#ffa56b',
      '#ff8b44',
      '#f87324',
      '#e45f17',
      '#c74e12',
      '#a9420f',
      '#8a370c',
    ],
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
      styles: (theme: { spacing: { lg: string }; colors: { cream: number[] } }) => ({
        root: { marginBottom: theme.spacing.lg },
        separator: { color: theme.colors.cream[4] },
      }),
    },
    Button: {
      defaultProps: { radius: 'md', fw: 500 },
      styles: (theme: { colors: { orangeAccent: number[]; cream: number[] } }) => ({
        root: {
          backgroundColor: theme.colors.orangeAccent[6],
          color: theme.colors.cream[0],
          '&:hover': {
            backgroundColor: theme.colors.orangeAccent[7],
          },
          '&:disabled': {
            backgroundColor: theme.colors.orangeAccent[2],
            color: theme.colors.cream[4],
          },
        },
      }),
    },
    InputWrapper: {
      styles: (theme: { colors: { cream: unknown[]; red: unknown[] } }) => ({
        description: { color: theme.colors.cream[3] }, // helper text
        error: { color: theme.colors.red[4] },
        label: { color: theme.colors.cream[1] },
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
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
