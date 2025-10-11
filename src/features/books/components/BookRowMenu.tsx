import { RowMenu } from '@components/RowMenu';

// Local book shape for the wrapper (keeps wrapper self-contained).
type Book = { id: number | string; title?: string; author?: string; rating?: number };
import { useNavigate } from 'react-router-dom';

type Props = {
  book: Book;
  onDelete: (id: string | number) => void;
  disabled?: boolean;
};

/**
 * BookRowMenu
 *
 * Thin wrapper around the shared `RowMenu` that wires book-specific routes
 * and labels for the contextual menu used in book list rows.
 *
 * @param {Book} book - The book entity used to build labels and routes.
 * @param {(id: string|number) => void} onDelete - Callback when user confirms delete.
 * @param {boolean} [disabled] - Disable menu actions when true.
 *
 * @example
 * <BookRowMenu book={book} onDelete={removeBook} />
 */

export function BookRowMenu({ book, onDelete, disabled }: Props) {
  const navigate = useNavigate();

  return (
    <RowMenu
      label={String(book.title ?? book.id)}
      onDetails={() => navigate(`/books/${book.id}`)}
      onDelete={() => onDelete(book.id)}
      disabled={disabled}
    />
  );
}
