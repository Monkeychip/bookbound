import { useQuery } from '@apollo/client';
import { BOOK_TITLE_QUERY } from '@features/books/api/queries';
import type { DocumentNode } from 'graphql';
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';

/**
 * ---------------------------------------------------------------------------
 * BreadcrumbsBar
 * ---------------------------------------------------------------------------
 * Generic breadcrumb trail component for CRUD-style resources (entities).
 *
 * Behavior:
 * - Renders a trail like: Collection / Resource Title (or action like "Create").
 * - Can be configured with `basePath` and `newLabel` to adapt to any entity
 *   collection (e.g. `/books`, `/projects`, `/users`).
 * - Optionally accepts a GraphQL query document (`fetchTitleQuery`) to fetch
 *   the entity title for detail/edit routes. The hook is called unconditionally
 *   but the query is skipped when not needed to follow React hook rules.
 *
 * @param basePath - Base collection path, e.g. '/books'.
 * @param newLabel - Label to show for the create/new action.
 * @param fetchTitleQuery - Optional GraphQL document to fetch the entity title.
 *
 * @example
 * ```tsx
 * <BreadcrumbsBar basePath="/projects" newLabel="Create Project" fetchTitleQuery={PROJECT_TITLE_QUERY} />
 * ```
 *
 * This component intentionally keeps routing and fetching configurable so it
 * can be reused across features without leaking book-specific assumptions.
 * ---------------------------------------------------------------------------
 */

export type EntityTitleFetcher = (id: string) => { title?: string } | Promise<{ title?: string }>;
type BookTitleData = {
  book?: {
    title?: string;
  };
};

type BookTitleVars = {
  id: string;
};

type BreadcrumbsBarProps = {
  basePath?: string; // e.g. '/books'
  newLabel?: string; // e.g. 'Create Book'
  fetchTitleQuery?: DocumentNode; // optional GraphQL query document used with useQuery
};

export function BreadcrumbsBar({
  basePath = '/books',
  newLabel = 'Create Book',
  fetchTitleQuery = BOOK_TITLE_QUERY,
}: BreadcrumbsBarProps) {
  const { bookId } = useParams<{ bookId?: string }>();
  const { pathname } = useLocation();

  // show on /books/* except the list; and never on /about
  const hideBreadcrumbs = pathname === '/books' || pathname === '/about';

  // call hook UNCONDITIONALLY, but skip when we don't need it
  const isCreate = pathname === '/books/new';
  const isEdit = pathname.endsWith('/edit');
  const isDetail = pathname.startsWith('/books/') && !isCreate && !isEdit;
  const shouldFetchTitle = !hideBreadcrumbs && !isCreate && !!bookId;

  const { data } = useQuery<BookTitleData, BookTitleVars>(fetchTitleQuery, {
    variables: { id: String(bookId) },
    skip: !shouldFetchTitle,
  });

  if (hideBreadcrumbs) return null;

  const title = data?.book?.title;

  const items: Array<{ label: string; to?: string }> = [{ label: 'Books', to: basePath }];
  if (isCreate) items.push({ label: newLabel });
  else if (isEdit) items.push({ label: title || 'Edit' });
  else if (isDetail) items.push({ label: title || 'Details' });

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
