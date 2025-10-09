import { useParams, Link as RouterLink } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Title, Text, Group, Button, Stack, Breadcrumbs, Anchor } from '@mantine/core';

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
  if (!data?.book) return <Text c="dimmed">Book not found.</Text>;

  const b = data.book;
  const breadcrumbItems = [{ label: 'Book List', to: '/books' }, { label: b.title }];

  return (
    <Stack gap="xs">
      <Breadcrumbs>
        {breadcrumbItems.map((item, i) =>
          item.to ? (
            <Anchor key={i} component={RouterLink} to={item.to}>
              {item.label}
            </Anchor>
          ) : (
            <Text key={i}>{item.label}</Text>
          ),
        )}
      </Breadcrumbs>

      <Group justify="space-between" align="flex-start">
        <Title order={2}>{b.title}</Title>
        <Group>
          <Button component={RouterLink} to="/books" variant="subtle">
            Back
          </Button>
          <Button component={RouterLink} to={`/books/${b.id}/edit`} variant="light">
            Edit
          </Button>
        </Group>
      </Group>
      <Text fw={500}>Author: {b.author}</Text>
      <Text>Rating: {b.rating}</Text>
      <Text>{b.description || 'No description.'}</Text>
    </Stack>
  );
}
