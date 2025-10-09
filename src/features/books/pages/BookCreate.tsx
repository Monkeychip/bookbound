import { useMutation } from '@apollo/client';
import { CREATE_BOOK } from '../api/mutations';
import { useNavigate } from 'react-router-dom';
import { Stack, Title, Text } from '@mantine/core';
import { BookForm, type BookFormValues } from '@/features/books';

/**
 * BookCreate
 *
 * Uses the shared <BookForm /> to create a new book, then navigates to the
 * new book's detail page (/books/:id) on success.
 *
 * Responsibilities:
 * - Render BookForm with empty initial values
 * - Call CREATE_BOOK mutation and navigate to the new detail page
 *
 * @example
 * <Route path="/books/new" element={<BookCreate />} />
 */

type Book = { id: number; title: string; author: string; rating: number; description: string };

type CreateBookData = { createBook: Book };
type CreateBookVars = { input: BookFormValues };

export function BookCreate() {
  const navigate = useNavigate();
  const [createBook, { loading }] = useMutation<CreateBookData, CreateBookVars>(CREATE_BOOK);

  async function handleSubmit(values: BookFormValues) {
    const { data } = await createBook({ variables: { input: values } });
    const newId = data?.createBook.id;
    if (newId != null) {
      navigate(`/books/${newId}`);
    } else {
      // fallback: go back to list if API didn’t return an
      // TODO maybe toast an error instead?
      navigate('/books');
    }
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
