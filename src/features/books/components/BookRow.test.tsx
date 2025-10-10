// Integration-style test for BookRow that uses the app providers. This
// exercises the real `RowMenu` and `ListRow` behavior.
// Import the matchMedia polyfill first to guarantee it runs before any
// Mantine imports (which may call matchMedia during module init).
import '@/test-utils/matchMediaPolyfill';
import '../../../setupTests';
// Integration-style test for BookRow that uses the app providers. This
// exercises the real `RowMenu` and `ListRow` behavior.
// Import the matchMedia polyfill first to guarantee it runs before any
// Mantine imports (which may call matchMedia during module init).
import '../../../test-utils/matchMediaPolyfill';
import '../../../setupTests';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BookRow } from './BookRow';
import '../../../../src/test-utils/matchMediaPolyfill';
// Define Book type locally since '../../types' cannot be found
type Book = {
  id: string;
  title: string;
  author: string;
};

describe('BookRow', () => {
  const book: Book = { id: 'b1', title: 'The Rusty Vault', author: 'A. Engineer' } as Book;

  it('renders basic book info and link', () => {
    renderWithProviders(<BookRow book={book} onDelete={() => {}} />);

    expect(screen.getByText('The Rusty Vault')).toBeInTheDocument();
    expect(screen.getByText(/A\. Engineer/)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /The Rusty Vault/ });
    expect(link).toHaveAttribute('href', '/books/b1');
  });

  it('calls onDelete when Delete menu item is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    renderWithProviders(<BookRow book={book} onDelete={onDelete} />);

    const more = screen.getByLabelText(`More actions for ${book.title}`);
    await user.click(more);

    const deleteItem = await screen.findByLabelText(`Delete ${book.title}`);
    await user.click(deleteItem);

    expect(onDelete).toHaveBeenCalledWith('b1');
  });

  it('calls onDetails when the row opener is activated', async () => {
    const user = userEvent.setup();
    const onDetails = vi.fn();

    renderWithProviders(<BookRow book={book} onDelete={() => {}} onDetails={onDetails} />);

    const opener = screen.getByLabelText(`Open details for ${book.title}`);
    await user.click(opener);

    expect(onDetails).toHaveBeenCalledWith('b1');
  });
});
