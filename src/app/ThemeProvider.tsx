import { MantineProvider, createTheme } from '@mantine/core';
import { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Global theme provider for Bookbound
// -----------------------------------------------------------------------------
// Centralizes color scheme, fonts, radius, and spacing tokens.
// This ensures a consistent look & feel across all feature areas.
// -----------------------------------------------------------------------------

const theme = createTheme({
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: { fontFamily: 'Inter, system-ui, sans-serif' },
  primaryColor: 'violet',
  colors: {
    violet: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4',
    ],
  },
  defaultRadius: 'md',
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}
