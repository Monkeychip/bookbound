/**
 * Books feature barrel
 *
 * Public runtime surface for the feature. Re-export only pages, feature-local
 * components and hooks. Keep server types and build-time modules out of this
 * barrel to avoid accidental bundling or circular re-exports.
 */

export { DetailPage, CreatePage, EditPage, ListPage } from './pages';
export { BookForm, type BookFormValues, BookRow, BookRowMenu } from './components';
export { useBookSearch } from './hooks/useBookSearch';
