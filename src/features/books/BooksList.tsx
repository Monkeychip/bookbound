import { Button, Group, List, TextInput, Textarea, NumberInput, ThemeIcon } from '@mantine/core';
import { gql, useMutation, useQuery } from '@apollo/client';
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

export function BooksList() {
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<number | ''>('');

  const handleRatingChange = (v: string | number) => {
    if (v === '' || typeof v === 'number') {
      setRating(v);
    } else {
      // if Mantine ever sends a string, coerce safely
      const n = Number(v);
      setRating(Number.isNaN(n) ? '' : n);
    }
  };

  const { data, loading, error, refetch } = useQuery<BooksData, BooksVars>(BOOKS_QUERY, {
    variables: { limit: 10, skip: 0, search },
  });

  const [createBook, { loading: creating }] = useMutation(CREATE_BOOK, {
    // Prepend new item into the current query’s list so the UI updates instantly
    update(cache, { data }) {
      const newBook = data?.createBook;
      if (!newBook) return;

      // read current result for the same variables
      const existing = cache.readQuery<BooksData, BooksVars>({
        query: BOOKS_QUERY,
        variables: { limit: 10, skip: 0, search },
      });

      if (existing?.books) {
        cache.writeQuery<BooksData, BooksVars>({
          query: BOOKS_QUERY,
          variables: { limit: 10, skip: 0, search },
          data: { books: [newBook, ...existing.books] },
        });
      }
    },
  });

  async function onCreate() {
    if (!title.trim() || !author.trim()) return; // ultra-basic validation
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
    // reset fields
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

      {/* Create form */}
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

      {loading && <p>Loading…</p>}
      {error && (
        <p>
          Error loading books. <button onClick={() => refetch()}>Retry</button>
        </p>
      )}
      {!loading && !error && data?.books?.length === 0 && <p>No books found.</p>}

      <List spacing="xs" withPadding>
        {data?.books?.map((b) => (
          <List.Item key={b.id} icon={<ThemeIcon size={10} radius="xl" />}>
            <strong>{b.title}</strong> — {b.author} ({b.rating})
          </List.Item>
        ))}
      </List>
    </div>
  );
}
