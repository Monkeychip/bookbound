import { Container, Title } from '@mantine/core';
import { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Provides a consistent page container and heading for the app.
// Centers content, constrains width, and can later hold navigation or footer.
// TODO: a11y improvements.
// TODO: responsive design.
// TODO: theming (dark mode).
// TODO: icons and branding.
// -----------------------------------------------------------------------------
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="md">
        📚 Bookbound
      </Title>
      {children}
    </Container>
  );
}
