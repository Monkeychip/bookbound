import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Stack, Title, Text } from '@mantine/core';
import { BookForm, BookFormValues } from './BookForm';

// -----------------------------------------------------------------------------
// CreateBookPage
//
// Uses the shared <BookForm /> to create a new book, then navigates to the
// new book’s detail page (/books/:id) on success.
// -----------------------------------------------------------------------------

type Book = { id: number; title: string; author: string; rating: number; description: string };

type CreateBookData = { createBook: Book };
type CreateBookVars = { input: BookFormValues };

const CREATE_BOOK = gql`
  mutation CreateBook($input: BookCreateInput!) {
    createBook(input: $input) {
      id
      title
      author
      rating
      description
    }
  }
`;

export function CreateBookPage() {
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
