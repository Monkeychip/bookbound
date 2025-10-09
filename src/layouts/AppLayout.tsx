import { Container, Title } from '@mantine/core';
import { ReactNode } from 'react';

/**
 * AppLayout
 *
 * Provides a consistent page container and heading for the app.
 * Centers content, constrains width, and can later hold navigation or footer.
 *
 * TODO: a11y improvements, responsive design, theming, and branding.
 */
/**
 * AppLayout
 *
 * Application-level layout used by the router. Provides global chrome and a
 * content region for route rendering.
 */

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="md">
        📚 Next Chapter
      </Title>
      {children}
    </Container>
  );
}
