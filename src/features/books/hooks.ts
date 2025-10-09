/**
 * src/features/books/hooks.ts
 *
 * Central location for custom hooks related to the books feature. Keep
 * feature-local hooks here (e.g. useBookSearch, useBookForm, etc.) so they
 * can be shared by pages/components without importing unrelated modules.
 */

import { useState } from 'react';
// Placeholder hook: manages a simple search string state for book lists.
// Exported so feature components can import from a single location.
export function useBookSearch(initial: string = '') {
  const [query, setQuery] = useState(initial);
  return { query, setQuery } as const;
}

// Add additional hooks below when you extract them from components/pages.
