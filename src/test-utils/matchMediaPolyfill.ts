// Lightweight matchMedia polyfill to run as the first test setup file.
// This file should be imported before any UI libraries so they don't
// attempt to call window.matchMedia when it's undefined in jsdom.
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
  // @ts-expect-error - test-only augmentation
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
