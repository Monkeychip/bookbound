import { useParams, useNavigate } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import { BOOK_QUERY } from './api/queries';
import { UPDATE_BOOK } from './api/mutations';
import { BookCore } from './api/fragments';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { BookForm, BookFormValues } from './BookForm';
import { Link as RouterLink } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';

/**
 * BookEditPage
 *
 * Loads a book, pre-fills <BookForm />, and updates via mutation. Uses
 * optimistic UI + cache write for instant feedback.
 *
 * Responsibilities:
 * - Fetch the book by id
 * - Provide initial values to BookForm
 * - Update cache on mutation so detail and list views reflect changes
 *
 * @example
 * <Route path="/books/:bookId/edit" element={<BookEditPage />} />
 */

type Book = { id: number; title: string; author: string; rating: number; description: string };
type BookData = { book: Book | null };
type BookVars = { id: string };

export function BookEditPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery<BookData, BookVars>(BOOK_QUERY, {
    variables: { id: String(bookId) },
    skip: !bookId,
    fetchPolicy: 'cache-first', // show cached book instantly if present
  });

  const [updateBook, { loading: saving }] = useMutation(UPDATE_BOOK, {
    // Write updated book into cache for detail + list screens
    update(cache, { data }) {
      const updated = data?.updateBook as Book | undefined;
      if (!updated) return;

      // 1) Update detail query
      cache.writeQuery<BookData, BookVars>({
        query: BOOK_QUERY,
        variables: { id: String(updated.id) },
        data: { book: updated },
      });

      // 2) Update list query (if present) by replacing the item
      // Adjust variables if your list uses different paging/search
      try {
        const LIST_QUERY = gql`
          query Books($limit: Int!, $skip: Int, $search: String) {
            books(limit: $limit, skip: $skip, search: $search) {
              items {
                ...BookCore
              }
            }
          }
          ${BookCore}
        `;
        const vars = { limit: 10, skip: 0, search: undefined as string | undefined };
        const existing = cache.readQuery<{ books: Book[] }>({ query: LIST_QUERY, variables: vars });
        if (existing?.books) {
          cache.writeQuery({
            query: LIST_QUERY,
            variables: vars,
            data: {
              books: existing.books.map((b) => (String(b.id) === String(updated.id) ? updated : b)),
            },
          });
        }
      } catch {
        // list may not be cached; safe to ignore
      }
    },
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
  if (!data?.book) {
    return (
      <EmptyState
        title="Can't edit"
        description="That book wasn't found. It may have been removed or never saved."
        action={
          <Button component={RouterLink} to="/books">
            Back to list
          </Button>
        }
      />
    );
  }

  const b = data.book;

  async function handleSubmit(values: BookFormValues) {
    await updateBook({
      variables: { input: { id: String(b.id), ...values } },
      optimisticResponse: {
        updateBook: {
          __typename: 'Book',
          id: b.id,
          title: values.title,
          author: values.author,
          rating: values.rating,
          description: values.description,
        },
      },
    });
    navigate(`/books/${b.id}`);
  }

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={2}>Edit Book</Title>
      </Group>

      <BookForm
        initial={{
          title: b.title,
          author: b.author,
          description: b.description,
          rating: b.rating,
        }}
        submitLabel="Save"
        loading={saving}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </Stack>
  );
}
