import { Button, Group, Pagination, Stack, Text } from '@mantine/core';
import EmptyState from './EmptyState';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQuery, NetworkStatus } from '@apollo/client';
import { BOOKS_QUERY } from '@features/books/api/queries';
import { DELETE_BOOK } from '@features/books/api/mutations';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookRow from './BookRow';
import ListToolbar from './ListToolbar';

/**
 * BooksList
 *
 * List view with search, sort and pagination. Uses `BOOKS_QUERY` to fetch
 * paginated results and renders `BookRow` for each item. The component keeps
 * data concerns (fetching, pagination, delete) at the list level and leaves
 * presentation to `BookRow`.
 *
 * @example
 * <BooksList />
 */

type Book = { id: number; title: string; author: string; rating: number };

type BooksVars = {
  limit: number;
  skip?: number;
  search?: string;
  sort?: { field?: 'RATING' | 'TITLE'; order?: 'ASC' | 'DESC' };
};

type BooksPage = {
  items: Book[];
  total: number;
  skip: number;
  limit: number;
};

type BooksData = { books: BooksPage };

type DeleteBookData = { deleteBook: boolean };
type DeleteBookVars = { id: string | number };

const PAGE_SIZE = 10;

export function BooksList() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const navigate = useNavigate();

  const [page, setPage] = useState(1); // default to page 1;
  const [sortField, setSortField] = useState<'RATING' | 'TITLE'>('RATING');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const vars: BooksVars = {
    limit: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    search: debouncedSearch || undefined,
    sort: { field: sortField, order: sortOrder },
  };
  const { data, loading, error, refetch, networkStatus } = useQuery<BooksData, BooksVars>(
    BOOKS_QUERY,
    {
      variables: vars,
      fetchPolicy: 'cache-and-network',
      returnPartialData: true,
      notifyOnNetworkStatusChange: true,
    },
  );

  const total = data?.books?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Reset to page 1 when search/sort changes
  // (so we don’t land on an empty page after filtering)
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortField, sortOrder]);

  // If we're beyond the last page (e.g., after a new search), clamp it
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (loading || error) return;

    const itemsLen = data?.books?.items?.length ?? 0;
    const last = Math.max(1, Math.ceil((data?.books?.total ?? 0) / PAGE_SIZE));

    // If we’re on a later page that renders empty results, jump to the last page
    // that *should* still have items (defensive against API off-by-one issues).
    if (page > 1 && itemsLen === 0 && (data?.books?.total ?? 0) > 0) {
      if (page > last) setPage(last);
      // If page <= last but still empty (rare), step back one page as a safety net:
      else setPage((p) => Math.max(1, p - 1));
    }
  }, [loading, error, page, data?.books?.items?.length, data?.books?.total]);

  const isSearching =
    networkStatus === NetworkStatus.setVariables || networkStatus === NetworkStatus.refetch;

  // Delete with cache update
  const [deleteBook, { loading: deleting }] = useMutation<DeleteBookData, DeleteBookVars>(
    DELETE_BOOK,
    {
      update(cache, _result, { variables }) {
        const id = variables?.id;
        if (!id) return;

        const existing = cache.readQuery<BooksData, BooksVars>({
          query: BOOKS_QUERY,
          variables: vars,
        });
        if (!existing?.books) return;

        const filtered = existing.books.items.filter((b) => String(b.id) !== String(id));
        cache.writeQuery<BooksData, BooksVars>({
          query: BOOKS_QUERY,
          variables: vars,
          data: {
            books: {
              ...existing.books,
              items: filtered,
              total: Math.max(0, existing.books.total - 1),
            },
          },
        });
      },
    },
  );

  return (
    <div style={{ padding: 16 }}>
      <ListToolbar
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        sortField={sortField}
        onSortFieldChange={(v) => {
          setPage(1);
          setSortField(v);
        }}
        sortOrder={sortOrder}
        onSortOrderChange={(v) => {
          setPage(1);
          setSortOrder(v);
        }}
      />

      {isSearching && <Text c="cream.2">Searching…</Text>}

      {error && (
        <Group gap="xs">
          <Text c="red">
            Error loading books:{' '}
            {error.message.includes('Network') ? 'Network error' : error.message}
          </Text>
          <Button size="xs" variant="light" onClick={() => refetch()}>
            Retry
          </Button>
        </Group>
      )}

      {!loading && !error && total === 0 && (
        <EmptyState
          title={debouncedSearch ? 'No search results' : 'No books yet'}
          description={
            debouncedSearch
              ? 'No books match your query. Try a different search or clear the query.'
              : "You don't have any books yet. Create one to get started."
          }
          action={
            <div>
              {debouncedSearch ? (
                <Button variant="subtle" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              ) : null}
              <Button component={Link} to="/books/new" ml="sm">
                Create book
              </Button>
            </div>
          }
        />
      )}

      <Stack gap="xs" mt="sm">
        {data?.books?.items?.map((b) => (
          <BookRow
            key={b.id}
            book={b}
            onDelete={(id) => deleteBook({ variables: { id } })}
            onDetails={(id) => navigate(`/books/${id}`)}
            disabled={deleting}
          />
        ))}
      </Stack>

      {/* Pagination */}
      {totalPages > 1 && (data?.books?.items?.length ?? 0) > 0 && (
        <Group justify="center" mt="md">
          <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
        </Group>
      )}
    </div>
  );
}

export default BooksList;
