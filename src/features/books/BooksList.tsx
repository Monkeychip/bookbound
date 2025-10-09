import { Button, Group, List, TextInput, Textarea, NumberInput, ThemeIcon } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { gql, useMutation, useQuery, NetworkStatus } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useState } from 'react';

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

type CreateBookData = { createBook: Book };
type CreateBookVars = {
  input: { title: string; author: string; description: string; rating?: number };
};

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

const CREATE_BOOK = gql`
  mutation CreateBook($input: BookCreateInput!) {
    createBook(input: $input) {
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
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<number | ''>('');

  // Safely handle Mantine NumberInput's string|number
  const handleRatingChange = (v: string | number) => {
    if (v === '' || typeof v === 'number') {
      setRating(v);
    } else {
      const n = Number(v);
      setRating(Number.isNaN(n) ? '' : n);
    }
  };

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

  // --- Create ---
  const [createBook, { loading: creating }] = useMutation<CreateBookData, CreateBookVars>(
    CREATE_BOOK,
    {
      update(cache, { data }) {
        const newBook = data?.createBook;
        if (!newBook) return;

        const existing = cache.readQuery<BooksData, BooksVars>({
          query: BOOKS_QUERY,
          variables: VARS,
        });

        if (existing?.books) {
          cache.writeQuery<BooksData, BooksVars>({
            query: BOOKS_QUERY,
            variables: VARS,
            data: { books: [newBook, ...existing.books] },
          });
        }
      },
    },
  );

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

  async function onCreate() {
    if (!title.trim() || !author.trim()) return;
    await createBook({
      variables: {
        input: {
          title: title.trim(),
          author: author.trim(),
          description: description.trim(),
          rating: typeof rating === 'number' ? rating : 0,
        },
      },
    });
    setTitle('');
    setAuthor('');
    setDescription('');
    setRating('');
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Books</h2>

      {/* Search */}
      <TextInput
        placeholder="Search books…"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="sm"
      />
      {isSearching && <p>Searching…</p>}

      {/* Create Form */}
      <Group align="flex-end" mb="md" wrap="wrap">
        <TextInput
          label="Title"
          placeholder="The Silent Pine"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <TextInput
          label="Author"
          placeholder="A. Garbarino"
          value={author}
          onChange={(e) => setAuthor(e.currentTarget.value)}
        />
        <Textarea
          label="Description"
          placeholder="Short blurb…"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          autosize
          minRows={1}
          maxRows={4}
          style={{ flex: 1, minWidth: 220 }}
        />
        <NumberInput
          label="Rating"
          placeholder="0–5"
          min={0}
          max={5}
          step={0.1}
          value={rating}
          onChange={handleRatingChange}
          clampBehavior="strict"
          maw={120}
        />
        <Button onClick={onCreate} loading={creating}>
          Add Book
        </Button>
      </Group>

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
