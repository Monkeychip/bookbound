import { gql, useQuery } from '@apollo/client';
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';

/**
 * ---------------------------------------------------------------------------
 * BookBreadcrumbs
 * ---------------------------------------------------------------------------
 * A reusable breadcrumb trail component for book-related pages.
 *
 * Behavior:
 * - Displays a breadcrumb trail for routes under `/books`.
 * - Hides itself on `/books` (the list view) and `/about`.
 * - For `/books/:id` and `/books/:id/edit`, fetches the book title dynamically.
 * - For `/books/new`, displays "Create Book".
 *
 * This ensures a consistent navigation pattern across BookDetail, BookEdit,
 * and BookCreate, while staying hidden on pages that don’t require context.
 *
 * Query strategy:
 * - Always calls `useQuery` to comply with React hook rules.
 * - Uses Apollo’s `skip` option to avoid unnecessary network requests.
 *
 * Example routes:
 *   /books            → (no breadcrumbs)
 *   /books/new        → Books / Create Book
 *   /books/12         → Books / The Silent Pine
 *   /books/12/edit    → Books / The Silent Pine
 *
 * ---------------------------------------------------------------------------
 */

const BOOK_TITLE_QUERY = gql`
  query BookTitle($id: ID!) {
    book(id: $id) {
      id
      title
    }
  }
`;

export function BookBreadcrumbs() {
  const { bookId } = useParams<{ bookId?: string }>();
  const { pathname } = useLocation();

  // route flags
  const isCreate = pathname.endsWith('/new');
  const isEdit = pathname.endsWith('/edit');
  const isDetail = pathname.startsWith('/books/') && !isCreate && !isEdit;

  // show on /books/* except the list; and never on /about
  const hideBreadcrumbs = pathname === '/books' || pathname === '/about';

  // call hook UNCONDITIONALLY, but skip when we don't need it
  const shouldFetchTitle = !hideBreadcrumbs && !isCreate && !!bookId;
  const { data } = useQuery(BOOK_TITLE_QUERY, {
    variables: { id: String(bookId) },
    skip: !shouldFetchTitle,
  });

  if (hideBreadcrumbs) return null;

  const title = data?.book?.title;

  const items: Array<{ label: string; to?: string }> = [{ label: 'Books', to: '/books' }];
  if (isCreate) items.push({ label: 'Create Book' });
  else if (isEdit) items.push({ label: title || 'Edit Book' });
  else if (isDetail) items.push({ label: title || 'Book Details' });

  return (
    <Breadcrumbs mb="md" aria-label="Breadcrumb navigation">
      {items.map((item, i) =>
        item.to ? (
          <Anchor key={i} component={RouterLink} to={item.to}>
            {item.label}
          </Anchor>
        ) : (
          <Text key={i} c="cream.2">
            {item.label}
          </Text>
        ),
      )}
    </Breadcrumbs>
  );
}
