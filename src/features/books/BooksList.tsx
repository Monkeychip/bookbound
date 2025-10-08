import { gql, useQuery } from '@apollo/client';
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

type Book = {
  id: number;
  title: string;
  author: string;
  rating: number;
};

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

export function BooksList() {
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useQuery<BooksData, BooksVars>(BOOKS_QUERY, {
    variables: { limit: 10, skip: 0, search },
  });

  return (
    <div style={{ padding: 16 }}>
      <h2>Books</h2>
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 12, padding: 6 }} // todo use component library instead of inline styles
      />

      {loading && <p>Loading…</p>}
      {error && (
        <p>
          Error loading books. <button onClick={() => refetch()}>Retry</button>
        </p>
      )}

      {!loading && !error && data?.books?.length === 0 && <p>No books found.</p>}

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
