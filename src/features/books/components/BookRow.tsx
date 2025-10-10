import { ListRow } from '@components/ListRow';

type Book = { id: number | string; title?: string; author?: string; rating?: number };

/**
 * BookRow
 *
 * Feature-local thin wrapper around the shared `ListRow` primitive. Keeps
 * book-specific render logic (author in meta, book-specific link) close to
 * the feature while reusing shared UI.
 *
 * @param {Book} book - Book entity to render.
 * @param {(id: string|number) => void} onDelete - Called when the book should be deleted.
 * @param {(id: string|number) => void} [onDetails] - Optional callback to open details for the book.
 * @param {boolean} [disabled] - Disable actions when true.
 *
 * @example
 * <BookRow book={book} onDelete={deleteBook} onDetails={(id) => navigate(`/books/${id}`)} />
 */
type Props = {
  book: Book;
  onDelete: (id: string | number) => void;
  onDetails?: (id: string | number) => void;
  disabled?: boolean;
};

export function BookRow({ book, onDelete, onDetails, disabled }: Props) {
  return (
    <ListRow
      entity={book}
      onDelete={onDelete}
      onDetails={onDetails}
      disabled={disabled}
      renderMeta={(b) => <span>{(b as Book).author ?? ''}</span>}
      renderTitle={(b) => <a href={`/books/${b.id}`}>{b.title}</a>}
    />
  );
}
