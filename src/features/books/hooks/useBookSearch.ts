/**
 * useBookSearch
 *
 * Simple feature-local hook that manages a search query string for the
 * books list. Keep feature-specific hooks here so pages and components can
 * import them from the feature barrel.
 *
 * @param {string} [initial] - Optional initial query value.
 * @returns {{ query: string; setQuery: (q: string) => void }} - Current query and setter.
 *
 * @example
 * const { query, setQuery } = useBookSearch('initial term');
 */
import { useState } from 'react';
// Placeholder hook: manages a simple search string state for book lists.
// Exported so feature components can import from a single location.
export function useBookSearch(initial: string = '') {
  const [query, setQuery] = useState(initial);
  return { query, setQuery } as const;
}
