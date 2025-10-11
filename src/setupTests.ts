// Global test setup for Vitest + Testing Library
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import React, { type ReactNode } from 'react';

// Ensure DOM cleanup between tests
afterEach(() => {
  cleanup();
});

// Quiet a few well-known, noisy runtime warnings that originate from
// third-party libraries (Apollo Client diagnostics and Mantine DOM-prop
// warnings). These warnings are informative but make test output noisy
// in CI and locally. We filter only the specific message patterns so we
// don't accidentally swallow unrelated errors.
const _origConsoleError = console.error.bind(console);
const _origConsoleWarn = console.warn.bind(console);
console.error = (...args: unknown[]) => {
  try {
    const first = typeof args[0] === 'string' ? (args[0] as string) : '';
    if (
      first.includes('go.apollo.dev') ||
      first.includes('Please remove the `addTypename`') ||
      first.includes('canonizeResults') ||
      first.includes('React does not recognize the') ||
      first.includes('Received `true` for a non-boolean attribute')
    ) {
      return; // drop known noisy messages
    }
  } catch {
    // fallthrough to original
  }
  _origConsoleError(...args);
};
console.warn = (...args: unknown[]) => {
  try {
    const first = typeof args[0] === 'string' ? (args[0] as string) : '';
    if (
      first.includes('React does not recognize the') ||
      first.includes('Received `true` for a non-boolean attribute')
    ) {
      return;
    }
  } catch {
    // fallthrough
  }
  _origConsoleWarn(...args);
};

// Some Apollo diagnostics are printed directly to stderr (not via
// console.error). Wrap process.stderr.write to filter those messages in
// the test environment so expected network errors during tests don't
// overwhelm test logs.
try {
  const _origStderrWrite = process.stderr.write.bind(process.stderr);

  // @ts-ignore
  process.stderr.write = ((chunk: any, ...rest: any[]) => {
    try {
      const s = String(chunk);
      if (
        s.includes('go.apollo.dev') ||
        s.includes('An error occurred!') ||
        s.includes('Please remove the `addTypename`') ||
        s.includes('canonizeResults')
      ) {
        return true;
      }
    } catch {
      // fallthrough to original
    }
    return _origStderrWrite(chunk, ...rest);
  }) as typeof process.stderr.write;
} catch {
  // Not all environments allow modifying process.stderr — ignore if so.
}

// Minimal matchMedia polyfill for Mantine and other libs that call it.
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
  // @ts-expect-error test env augmentation
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

export {};

type Props = Record<string, unknown> & { children?: ReactNode };

// Remove Mantine-specific props that would otherwise be passed to DOM
// elements and cause React warnings in the test environment.
const filterProps = (props?: Props): Props => {
  if (!props) return {};
  const clean: Props = { ...(props as Props) };
  // Known Mantine props that are safe to drop in tests
  const drop = [
    'withinPortal',
    'withBorder',
    'rightSection',
    'rightSectionWidth',
    'variant',
    'color',
    'radius',
    'size',
    'fw',
    'lh',
    'styles',
    'defaultProps',
    'data',
    'to',
    'component',
    'gap',
    'mb',
    'wrap',
    'c',
    'p',
  ];
  for (const k of drop) {
    if (k in clean) delete (clean as any)[k];
  }
  return clean;
};

// Mock @mantine/core with our lightweight test implementation so tests
// don't invoke Mantine internals (matchMedia, theme hooks) directly.
import { vi } from 'vitest';
// Prefer loading the hoist-safe CJS mocks under `test/mocks` if present.
// If they've been moved/removed (we keep backups in `.removed_tests/`),
// fall back to small inline mocks so tests remain runnable.
vi.mock('@mantine/core', () => {
  try {
    // Attempt to load the original hoist-safe mock (synchronous)
    // which may live at `test/mocks/mantineMock.cjs` during development.
    // This keeps the mock hoist-safe for Vitest collection.
    // NOTE: require may throw if file doesn't exist — fall through to fallback.

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mock = require('../test/mocks/mantineMock.cjs') as unknown as Record<string, unknown>;
    return mock;
  } catch {
    // Minimal inline mocks: return simple React elements for common components.
    // Keep the implementation tiny and free of Mantine internals.

    const passthrough = (tag: string) => (props: Props) => {
      const clean = filterProps(props);
      // casting here is ok for the tiny inline fallback mock used only in tests
      return React.createElement(tag as any, clean as any, (clean as any).children);
    };

    // Minimal Menu implementation with the commonly used subcomponents
    const Menu = (props: Props) => {
      const clean = filterProps(props);
      return React.createElement('div', clean as any, (clean as any).children);
    };
    Menu.Target = passthrough('div');
    Menu.Dropdown = (props: Props) => {
      const clean = filterProps(props);
      return React.createElement(
        'div',
        { role: 'menu', ...(clean as any) },
        (clean as any).children,
      );
    };
    Menu.Item = (props: Props) => {
      const clean = filterProps(props);
      return React.createElement(
        'div',
        { role: 'menuitem', ...(clean as any) },
        (clean as any).children,
      );
    };
    Menu.Divider = () => React.createElement('hr');

    // SegmentedControl is often used as a simple toggle; render a div.
    const SegmentedControl = passthrough('div');

    // Input wrapper and textarea/rating are used by BookForm; provide
    // small passthroughs so tests can render forms without Mantine internals.
    const Textarea = passthrough('textarea');
    const Rating = passthrough('div');
    const Input = { Wrapper: passthrough('div') };

    // A no-op createTheme that returns whatever is passed in. ThemeProvider
    // implementation in tests guards mounting of Mantine, but the import of
    // createTheme still happens at module load, so provide it here.
    const createTheme = <T>(t: T): T => t;

    return {
      Anchor: passthrough('a'),
      Group: passthrough('div'),
      Paper: passthrough('div'),
      Text: passthrough('span'),
      Title: passthrough('h3'),
      Button: passthrough('button'),
      Stack: passthrough('div'),
      Pagination: passthrough('div'),
      ActionIcon: passthrough('button'),
      TextInput: passthrough('input'),
      Textarea,
      Rating,
      Input,
      SegmentedControl,
      Center: passthrough('div'),
      Menu,
      ThemeIcon: passthrough('div'),
      // provide a ThemeProvider no-op so components using hooks don't crash
      MantineProvider: ({ children }: { children?: ReactNode }) =>
        React.createElement(React.Fragment, null, children),
      // a minimal hooks object in case code imports named hooks
      useMantineTheme: () => ({}),
      // createTheme is used by ThemeProvider at module scope
      createTheme,
    } as unknown as Record<string, unknown>;
  }
});

// Mock mantine notifications to avoid importing the real package which
// relies on Mantine's provider internals. Prefer loading hoisted CJS mock
// when available, otherwise fall back to a tiny no-op implementation.
vi.mock('@mantine/notifications', () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mock = require('../test/mocks/notificationsMock.cjs') as unknown as Record<
      string,
      unknown
    >;
    return mock;
  } catch {
    // Provide a tiny notifications mock that records calls to a global test store
    // so tests can assert on notification payloads. We attach to `globalThis` so
    // both ESM and CJS test environments can access it.
    if (!(globalThis as any).__TEST_NOTIFICATIONS__) {
      (globalThis as any).__TEST_NOTIFICATIONS__ = {
        calls: [] as any[],
        clear() {
          this.calls.length = 0;
        },
      };
    }

    return {
      Notifications: () => null,
      showNotification: (payload: unknown) => {
        try {
          (globalThis as any).__TEST_NOTIFICATIONS__.calls.push(payload);
        } catch {
          // swallow in case globalThis isn't writable in some envs
        }
      },
      // expose helpers in the mock to allow tests to clear the recorded notifications
      __testHelpers: {
        getCalls: () => (globalThis as any).__TEST_NOTIFICATIONS__.calls,
        clear: () => (globalThis as any).__TEST_NOTIFICATIONS__.clear(),
      },
    } as unknown as Record<string, unknown>;
  }
});
