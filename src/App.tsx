import { Container } from '@mantine/core';
import { AppRoutes } from './app/routes/AppRoutes';

/**
 * App Component
 *
 * The root layout for the Next Chapter frontend. Menu items are defined in
 * Layout.tsx.
 */

export default function App() {
  return (
    <Container size="sm" py="xl">
      <AppRoutes />
    </Container>
  );
}
