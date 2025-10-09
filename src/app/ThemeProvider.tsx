import { MantineProvider, createTheme } from '@mantine/core';
import { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Centralizes color scheme, fonts, radius, and spacing tokens.
// This ensures a consistent look & feel across all feature areas.
// -----------------------------------------------------------------------------

const theme = createTheme({
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
  primaryColor: 'orangeAccent',
  primaryShade: 5,
  components: {
    Button: {
      styles: (theme, { color }) => ({
        root: {
          // default to dark text on orange
          color: color === 'danger' ? theme.white : theme.colors.tealBrand[9],
        },
      }),
    },
  },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
