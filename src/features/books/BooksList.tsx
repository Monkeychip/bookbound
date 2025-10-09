import { Button, Group, List, TextInput, ThemeIcon } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { gql, useMutation, useQuery, NetworkStatus } from '@apollo/client';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// -----------------------------------------------------------------------------
// BooksList Component
//
// Displays a simple list of "books" fetched from the local GraphQL API
// (Apollo Server → DummyJSON).
//
// • The `BOOKS_QUERY` defines the GraphQL query for title, author, and rating.
// • `useQuery` runs automatically on mount and updates the component state.
// • If an error occurs, the component displays a retry button using `refetch`.
//
// TODO: Add pagination, styling, and sorting features.
// -----------------------------------------------------------------------------

type Book = { id: number; title: string; author: string; rating: number };
type BooksData = { books: Book[] };
type BooksVars = { limit: number; skip?: number; search?: string };
type DeleteBookData = { deleteBook: boolean };
type DeleteBookVars = { id: string | number };

const BOOKS_QUERY = gql`
  query Books($limit: Int!, $skip: Int, $search: String) {
    books(limit: $limit, skip: $skip, search: $search) {
      id
      title
      author
      rating
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export function BooksList() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const VARS: BooksVars = { limit: 10, skip: 0, search: debouncedSearch || undefined };

  const { data, loading, error, refetch, networkStatus } = useQuery<BooksData, BooksVars>(
    BOOKS_QUERY,
    {
      variables: VARS,
      fetchPolicy: 'cache-and-network',
      returnPartialData: true,
      notifyOnNetworkStatusChange: true,
    },
  );

  const isSearching =
    networkStatus === NetworkStatus.setVariables || networkStatus === NetworkStatus.refetch;

  // --- Delete ---
  const [deleteBook, { loading: deleting }] = useMutation<DeleteBookData, DeleteBookVars>(
    DELETE_BOOK,
    {
      update(cache, _result, { variables }) {
        const id = variables?.id;
        if (!id) return;

        const existing = cache.readQuery<BooksData, BooksVars>({
          query: BOOKS_QUERY,
          variables: VARS,
        });

        if (!existing?.books) return;

        cache.writeQuery<BooksData, BooksVars>({
          query: BOOKS_QUERY,
          variables: VARS,
          data: {
            books: existing.books.filter((b) => String(b.id) !== String(id)),
          },
        });
      },
    },
  );

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Books</h2>

      <Group justify="space-between" mb="sm">
        <h2 style={{ margin: 0 }}>Books</h2>
        <Button component={Link} to="/books/new">
          New Book
        </Button>
      </Group>

      {/* Search */}
      <TextInput
        placeholder="Search books…"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="sm"
      />
      {isSearching && <p>Searching…</p>}

      {/* States */}
      {loading && <p>Loading…</p>}
      {error && (
        <p>
          Error loading books. <button onClick={() => refetch()}>Retry</button>
        </p>
      )}
      {!loading && !error && data?.books?.length === 0 && <p>No books found.</p>}

      {/* List */}
      <List spacing="xs" withPadding>
        {data?.books?.map((b) => (
          <List.Item key={b.id} icon={<ThemeIcon size={10} radius="xl" />}>
            <strong>
              <Link to={`/books/${b.id}`}>{b.title}</Link>
            </strong>{' '}
            — {b.author} ({b.rating})
            <Button
              size="xs"
              variant="light"
              ml="sm"
              loading={deleting}
              onClick={() => deleteBook({ variables: { id: b.id } })}
            >
              Delete
            </Button>
          </List.Item>
        ))}
      </List>
    </div>
  );
}
