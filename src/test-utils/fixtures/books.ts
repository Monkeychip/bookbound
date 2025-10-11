export type Book = {
  id: string | number;
  title: string;
  author?: string;
  description?: string;
  __typename?: 'Book';
};

let idCounter = 1000;

export function makeBook(overrides: Partial<Book> = {}): Book {
  const id = overrides.id ?? idCounter++;
  return {
    id,
    title: overrides.title ?? `Book ${id}`,
    author: overrides.author ?? 'Unknown Author',
    description: overrides.description ?? '',
    __typename: 'Book',
    ...overrides,
  };
}

export function makeBooks(n = 3, base?: Partial<Book>) {
  return Array.from({ length: n }, (_, i) => makeBook({ ...base, id: `${i + 1}` }));
}
