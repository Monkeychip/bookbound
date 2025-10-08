import { gql, useQuery } from '@apollo/client';

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
// TODO: Add pagination, search, styling, and sorting features.
// -----------------------------------------------------------------------------

type Book = {
  id: number;
  title: string;
  author: string;
  rating: number;
};

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

type BooksData = {
  books: Book[];
};

type BooksVars = {
  limit: number;
  skip?: number;
  search?: string;
};

export function BooksList() {
  const { data, loading, error, refetch } = useQuery<BooksData, BooksVars>(BOOKS_QUERY, {
    variables: { limit: 10, skip: 0 },
  });

  if (loading) return <div>Loading…</div>;
  if (error)
    return (
      <div>
        Error loading books.&nbsp;
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );

  return (
    <div style={{ padding: 16 }}>
      <h2>Books</h2>
      <ul>
        {data?.books?.map((b) => (
          <li key={b.id}>
            <strong>{b.title}</strong> — {b.author} ({b.rating})
          </li>
        ))}
      </ul>
    </div>
  );
}
