import { Anchor, AppShell, Container, Group, Image, Title } from '@mantine/core';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '@/assets/next-chapter-mark.svg';

// -----------------------------------------------------------------------------
// Shared layout for all routes
// -----------------------------------------------------------------------------

export function Layout() {
  const { pathname } = useLocation();
  const showNav = pathname === '/books' || pathname === '/about';

  return (
    <AppShell header={{ height: 64 }}>
      <AppShell.Header bg="tealBrand.9" c="cream.1" withBorder={false}>
        <Container size="lg" h="100%">
          <Group justify="space-between" align="center" h="100%">
            <Group align="center" gap="xs">
              <Image src={logo} alt="Next Chapter" h={28} fit="contain" />
              <Title order={3} m={0} c="cream.1">
                Next Chapter
              </Title>
            </Group>

            {showNav && (
              <Group gap="md">
                <Anchor component={Link} to="/books" c="cream.1" fw={500}>
                  Books
                </Anchor>
                <Anchor component={Link} to="/about" c="cream.1" fw={500}>
                  About
                </Anchor>
              </Group>
            )}
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main bg="transparent">
        <Container size="lg" py="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
