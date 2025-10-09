import { useParams, Link as RouterLink } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Button, Group, Rating, Stack, Text, Title } from '@mantine/core';
import EmptyState from '../../components/EmptyState';

// -----------------------------------------------------------------------------
// BookDetail
//
// Reads a single book by id and shows its fields. Serves as the "R" in CRUD.
// -----------------------------------------------------------------------------

type Book = { id: number; title: string; author: string; rating: number; description: string };
type BookData = { book: Book | null };
type BookVars = { id: string };

const BOOK_QUERY = gql`
  query Book($id: ID!) {
    book(id: $id) {
      id
      title
      author
      rating
      description
    }
  }
`;

export function BookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const { data, loading, error, refetch } = useQuery<BookData, BookVars>(BOOK_QUERY, {
    variables: { id: String(bookId) },
    skip: !bookId,
    fetchPolicy: 'cache-first', // Use cache first for better performance. Relevant for our redirect after edit.
  });

  if (loading) return <Text>Loading…</Text>;
  if (error)
    return (
      <Stack>
        <Text c="red">Error loading book.</Text>
        <Button variant="light" onClick={() => refetch()}>
          Retry
        </Button>
      </Stack>
    );
  // NOTE: Because DummyJSON doesn’t persist new records, hard-refreshing a detail page
  // for a recently created book will show this “Book not found” message.
  // This provides a gentle UX fallback with a link back to the book list.
  if (!data?.book) {
    return (
      <EmptyState
        title="Book not found"
        description="This book doesn't appear to exist (it may not have been saved). You can browse the list or create a new book."
        action={
          <div>
            <Button component={RouterLink} to="/books" variant="light">
              Back to list
            </Button>
            <Button component={RouterLink} to="/books/new" ml="sm">
              Create book
            </Button>
          </div>
        }
      />
    );
  }

  const b = data.book;

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="flex-start">
        <Title order={2}>{b.title}</Title>
        <Group>
          <Button component={RouterLink} to={`/books/${b.id}/edit`} variant="light">
            Edit
          </Button>
        </Group>
      </Group>
      <Text fw={500}>Author: {b.author}</Text>
      <Rating value={b.rating} readOnly />
      <Text>{b.description || 'No description.'}</Text>
    </Stack>
  );
}
