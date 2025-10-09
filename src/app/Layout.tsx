import { Anchor, AppShell, Group, Title } from '@mantine/core';
import { Link, Outlet, useLocation } from 'react-router-dom';

// -----------------------------------------------------------------------------
// Shared layout for all routes
// -----------------------------------------------------------------------------

export function Layout() {
  const { pathname } = useLocation();
  const showNav = pathname === '/books' || pathname === '/about';

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group justify="space-between" align="center" px="md" h="100%">
          <Title order={3}>📚 Bookbound</Title>
          {showNav && (
            <Group>
              <Anchor component={Link} to="/books">
                Books
              </Anchor>
              <Anchor component={Link} to="/about">
                About
              </Anchor>
            </Group>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
