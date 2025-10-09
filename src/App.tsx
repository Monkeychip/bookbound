import { Group, Anchor, Container, Title, Divider } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { AppRoutes } from './app/AppRoutes';

// -----------------------------------------------------------------------------
// App Component
//
// The root layout for the Next Chapter frontend.
//
// Includes a minimal navigation bar with route links (`Books`, `About`)
// and a simple highlight for the active route.
//
// Mantine's Container + Group + Anchor provide structure and accessible
// styling without custom CSS. AppRoutes handles rendering of page-level
// content below the navigation.
// -----------------------------------------------------------------------------

export default function App() {
  const { pathname } = useLocation();
  const showNav = pathname === '/books' || pathname === '/about';

  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="md">
        Next Chapter
      </Title>

      {showNav && (
        <>
          <Group gap="md" mb="sm">
            <Anchor component={Link} to="/books" c={pathname === '/books' ? 'blue' : undefined}>
              Books
            </Anchor>
            <Anchor component={Link} to="/about" c={pathname === '/about' ? 'blue' : undefined}>
              About
            </Anchor>
          </Group>
          <Divider mb="lg" />
        </>
      )}

      <AppRoutes />
    </Container>
  );
}
