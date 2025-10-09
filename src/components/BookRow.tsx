import { Anchor, Group, Paper, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { RowMenu } from './RowMenu';
import { useState } from 'react';
// TODO documentation
export type Book = { id: number; title: string; author: string; rating: number };

type BookRowProps = {
  book: Book;
  onDelete: (id: string | number) => void;
  onDetails?: (id: string | number) => void;
  disabled?: boolean;
};

export function BookRow({ book, onDelete, onDetails, disabled }: BookRowProps) {
  const [focused, setFocused] = useState(false);

  const focusStyle: React.CSSProperties = focused
    ? { outline: '3px solid rgba(63,140,137,0.18)', borderRadius: 6 }
    : { outline: 'none' };

  return (
    <Paper
      key={book.id}
      withBorder
      radius="md"
      p="xs"
      style={{
        borderColor: 'var(--mantine-color-tealBrand-7)',
        backgroundColor: 'color-mix(in oklab, var(--mantine-color-tealBrand-9) 92%, black 8%)',
        transition: 'background-color 120ms ease',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = 'var(--mantine-color-tealBrand-8)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor =
          'color-mix(in oklab, var(--mantine-color-tealBrand-9) 92%, black 8%)')
      }
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <div
          role="button"
          tabIndex={0}
          aria-label={`Open details for ${book.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (onDetails) onDetails(book.id);
            }
          }}
          onClick={() => {
            if (onDetails) onDetails(book.id);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={focusStyle}
        >
          <Anchor component={Link} to={`/books/${book.id}`} c="cream.0" fw={700}>
            {book.title}
          </Anchor>
          <Text c="cream.2" size="sm" ml="xs" span>
            — {book.author} ({book.rating})
          </Text>
        </div>

        <RowMenu
          onDetails={() => (onDetails ? onDetails(book.id) : () => {})}
          onDelete={() => onDelete(book.id)}
          label={book.title}
          disabled={disabled}
        />
      </Group>
    </Paper>
  );
}

export default BookRow;
