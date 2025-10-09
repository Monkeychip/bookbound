import { Anchor, AppShell, Container, Group, Image, Title } from '@mantine/core';
import { BreadcrumbsBar } from '../../shared/ui/components/BreadcrumbsBar';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '@/shared/assets/next-chapter-mark.svg';

/**
 * Layout
 *
 * Shared layout for all routes. Provides header navigation, skip-link, and a
 * content container for route rendering.
 */

export function Layout() {
  const { pathname } = useLocation();

  return (
    <AppShell header={{ height: 64 }}>
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        style={{
          position: 'absolute',
          left: -9999,
          top: 0,
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '8px';
          e.currentTarget.style.top = '8px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px';
        }}
      >
        Skip to content
      </a>

      <AppShell.Header bg="tealBrand.9" c="cream.1" withBorder={false}>
        <Container size="md" h="100%">
          <Group justify="space-between" align="center" h="100%">
            {/* Left section: logo + title */}
            <Group
              align="center"
              gap="sm"
              wrap="nowrap"
              style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              <Image
                src={logo}
                alt="Next Chapter logo"
                h={28}
                fit="contain"
                style={{ display: 'block' }}
              />
              <Title
                order={3}
                m={0}
                c="cream.1"
                style={{ fontWeight: 600, lineHeight: 1, textWrap: 'nowrap' }}
              >
                Next Chapter
              </Title>
            </Group>

            {/* Right section: navigation */}
            <nav aria-label="Primary">
              <Group gap="lg" align="center" wrap="nowrap">
                <Anchor
                  component={Link}
                  to="/books"
                  c="cream.1"
                  fw={500}
                  aria-current={pathname === '/books' ? 'page' : undefined}
                  underline="hover"
                  data-active={pathname === '/books' || undefined}
                >
                  Books
                </Anchor>
                <Anchor
                  component={Link}
                  to="/about"
                  c="cream.1"
                  fw={500}
                  aria-current={pathname === '/about' ? 'page' : undefined}
                  underline="hover"
                  data-active={pathname === '/about' || undefined}
                >
                  About
                </Anchor>
              </Group>
            </nav>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main id="main" bg="transparent">
        <Container size="lg" py="lg">
          <BreadcrumbsBar />
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
