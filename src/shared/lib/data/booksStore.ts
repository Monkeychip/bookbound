import { makeVar } from '@apollo/client';
import { client } from '@/shared/lib/apollo/client';
import { BOOKS_QUERY } from '@/features/books/api/queries';

export type Book = {
  id: number | string;
  title: string;
  author?: string;
  rating?: number;
  description?: string;
  __typename?: 'Book';
};

type BooksStore = {
  items: Book[];
  total: number;
  initialized: boolean; // true after the initial network attempt (success or fail)
};

const initial: BooksStore = { items: [], total: 0, initialized: false };

export const booksVar = makeVar<BooksStore>(initial);

export async function initBooksStore() {
  // Avoid double-initializing
  if (booksVar().initialized) return;

  try {
    const vars = {
      category: 'beauty',
      limit: 10,
      skip: 0,
      search: undefined,
      sort: { field: 'TITLE', order: 'ASC' },
    } as const;

    const res = await client.query<{ books: { items: Book[]; total: number } }>({
      query: BOOKS_QUERY,
      variables: vars,
      fetchPolicy: 'network-only',
    });

    if (res?.data?.books) {
      booksVar({ items: res.data.books.items, total: res.data.books.total, initialized: true });
    } else {
      // mark initialized even if empty/invalid so we don't keep trying
      booksVar({ ...booksVar(), initialized: true });
    }
  } catch {
    // On error, mark as initialized to avoid retry loops. The UI can still
    // show an empty state and the user can hard-refresh to attempt again.
    booksVar({ ...booksVar(), initialized: true });
  }
}

export function addBook(book: Book) {
  const cur = booksVar();
  booksVar({ ...cur, items: [book, ...cur.items], total: cur.total + 1 });
}

export function removeBookById(id: string | number) {
  const cur = booksVar();
  const filtered = cur.items.filter((b) => String(b.id) !== String(id));
  booksVar({
    ...cur,
    items: filtered,
    total: Math.max(0, cur.total - (cur.items.length - filtered.length)),
  });
}

export function replaceBook(book: Book) {
  const cur = booksVar();
  const items = cur.items.map((b) => (String(b.id) === String(book.id) ? book : b));
  booksVar({ ...cur, items });
}
