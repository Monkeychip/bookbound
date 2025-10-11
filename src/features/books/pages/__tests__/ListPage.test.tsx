import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { ListPage } from '../ListPage';
import { booksVar } from '@/shared/lib/data/booksStore';
import { DELETE_BOOK } from '../../api/mutations';

describe('ListPage', () => {
  beforeEach(() => {
    // reset store
    booksVar({ items: [], total: 0, initialized: true });
  });

  it('shows empty state when no books', () => {
    renderWithProviders(<ListPage />);
    // The EmptyState comp renders a title and a longer description; assert both
    expect(screen.getByText(/No books yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Create one to get started/i)).toBeInTheDocument();
  });

  it('renders list rows when books exist', () => {
    booksVar({
      items: [
        { id: 1, title: 'A Book', author: 'Author A' },
        { id: 2, title: 'B Book', author: 'Author B' },
      ],
      total: 2,
      initialized: true,
    });

    renderWithProviders(<ListPage />);

    expect(screen.getByText('A Book')).toBeInTheDocument();
    expect(screen.getByText('B Book')).toBeInTheDocument();
    // authors are rendered in meta area
    expect(screen.getByText('Author A')).toBeInTheDocument();
  });

  it('reverts optimistic removal when delete mutation fails', async () => {
    const user = userEvent.setup();

    booksVar({
      items: [{ id: 'd1', title: 'Delete Me', author: 'X' }],
      total: 1,
      initialized: true,
    });

    const mocks = [
      {
        request: { query: DELETE_BOOK, variables: { id: 'd1' } },
        error: new Error('network error'),
      },
    ];

    // clear any previous notifications and ensure test store exists
    (
      globalThis as unknown as { __TEST_NOTIFICATIONS__?: { clear?: () => void } }
    ).__TEST_NOTIFICATIONS__?.clear?.();

    renderWithProviders(<ListPage />, { apolloMocks: mocks });

    const more = screen.getByLabelText(/More actions for Delete Me/);
    await user.click(more);

    const del = await screen.findByLabelText(/Delete Delete Me/);
    await user.click(del);

    // After a failing delete, the book should still be in the DOM (optimistic revert)
    expect(await screen.findByText('Delete Me')).toBeInTheDocument();

    // verify an error notification was shown
    const calls =
      (globalThis as unknown as { __TEST_NOTIFICATIONS__?: { calls?: unknown[] } })
        .__TEST_NOTIFICATIONS__?.calls ?? [];
    expect(
      calls.some((c: unknown) =>
        String((c as unknown as Record<string, unknown>)?.title).includes('Delete failed'),
      ),
    ).toBe(true);
  });

  it('removes item from the list when delete mutation succeeds', async () => {
    const user = userEvent.setup();

    booksVar({ items: [{ id: 'd2', title: 'Keep Me', author: 'Y' }], total: 1, initialized: true });

    const mocks = [
      {
        request: { query: DELETE_BOOK, variables: { id: 'd2' } },
        result: { data: { deleteBook: true } },
      },
    ];

    renderWithProviders(<ListPage />, { apolloMocks: mocks });

    const more = screen.getByLabelText(/More actions for Keep Me/);
    await user.click(more);

    const del = await screen.findByLabelText(/Delete Keep Me/);
    await user.click(del);

    // Wait for the UI to settle and ensure the item is removed
    await waitFor(() => {
      expect(screen.queryByText('Keep Me')).not.toBeInTheDocument();
    });

    // verify a success notification was shown
    const calls =
      (globalThis as unknown as { __TEST_NOTIFICATIONS__?: { calls?: unknown[] } })
        .__TEST_NOTIFICATIONS__?.calls ?? [];
    expect(
      calls.some((c: unknown) =>
        String((c as unknown as Record<string, unknown>)?.title).includes('Deleted'),
      ),
    ).toBe(true);
  });
});
