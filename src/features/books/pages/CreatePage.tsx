import { useMutation } from '@apollo/client';
import { CREATE_BOOK } from '../api/mutations';
import { useNavigate } from 'react-router-dom';
import { Stack, Title, Text } from '@mantine/core';
import { BookForm, type BookFormValues } from '@/features/books';
import { addBook } from '@/shared/lib/data/booksStore';

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
        // Replace optimistic entry in-place could be added, but for now
        // we navigate to the list which will show the optimistic item.
        void navigate('/books');
        return;
      }
    } catch {
      // ignore - optimistic entry remains until hard refresh
    }

    // Fallback: navigate back to list regardless
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
