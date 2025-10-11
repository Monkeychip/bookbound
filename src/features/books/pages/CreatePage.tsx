import { useMutation } from '@apollo/client';
import { CREATE_BOOK } from '../api/mutations';
import { useNavigate } from 'react-router-dom';
import { Stack, Title, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { BookForm, type BookFormValues } from '@/features/books';
import { addBook, removeBookById } from '@/shared/lib/data/booksStore';

/**
 * CreatePage
 *
 * Uses the shared `BookForm` to create a new book, then navigates to the
 * new book's detail page (`/books/:id`) on success.
 *
 * @example
 * ```tsx
 * <Route path="/books/new" element={<CreatePage />} />
 * ```
 */

type Book = { id: number; title: string; author: string; rating: number; description: string };

type CreateBookData = { createBook: Book };
type CreateBookVars = { input: BookFormValues };

export function CreatePage() {
  const navigate = useNavigate();
  const [createBook, { loading }] = useMutation<CreateBookData, CreateBookVars>(CREATE_BOOK);

  async function handleSubmit(values: BookFormValues) {
    const optimistic = {
      __typename: 'Book' as const,
      id: Math.floor(Math.random() * 1000000),
      title: values.title,
      author: values.author,
      rating: values.rating ?? 0,
      description: values.description ?? '',
    };

    // Insert optimistically into the in-memory store so the list shows it
    addBook(optimistic);

    try {
      const { data } = await createBook({ variables: { input: values } });
      const newId = data?.createBook.id;
      if (newId != null) {
        showNotification({
          title: 'Created',
          message: 'Book created successfully.',
          color: 'green',
        });
        void navigate('/books');
        return;
      }
    } catch (err) {
      // Revert optimistic add
      try {
        // remove the optimistic id we inserted earlier
        removeBookById(optimistic.id);
      } catch {
        // ignore
      }
      console.error('create failed', err);
      showNotification({
        title: 'Create failed',
        message: 'Unable to create book. Please try again.',
        color: 'red',
      });
      // Let user remain on the form to retry
      return;
    }

    // Fallback: navigate back to list
    void navigate('/books');
  }

  return (
    <Stack>
      <Title order={2}>Create Book</Title>
      <Text id="form-help" c="cream.2" size="md" lh={1.6}>
        Fill the form and click Create to add a new book.
      </Text>
      <BookForm
        submitLabel="Create"
        loading={loading}
        initial={{ title: '', author: '', description: '', rating: 0 }}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}
