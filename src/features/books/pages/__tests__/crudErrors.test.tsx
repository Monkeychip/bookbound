import '@/test-utils/matchMediaPolyfill';
import '../../../../setupTests';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { booksVar } from '@/shared/lib/data/booksStore';
import { ListPage } from '../ListPage';
import { CreatePage } from '../CreatePage';
import { EditPage } from '../EditPage';
import { DELETE_BOOK, CREATE_BOOK, UPDATE_BOOK } from '../../api/mutations';
import { BOOK_QUERY } from '../../api/queries';
import { vi } from 'vitest';

describe('Books CRUD error flows', () => {
  beforeEach(() => {
    booksVar({ items: [], total: 0, initialized: true });
    vi.restoreAllMocks();
  });

  it('restores list item when delete mutation fails', async () => {
    const user = userEvent.setup();

    // seed store with a book
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

    renderWithProviders(<ListPage />, { apolloMocks: mocks });

    // open row menu and click delete
    const more = screen.getByLabelText(/More actions for Delete Me/);
    await user.click(more);

    const del = await screen.findByLabelText(/Delete Delete Me/);
    await user.click(del);

    // After a failing delete, the book should still be in the DOM (optimistic revert)
    expect(await screen.findByText('Delete Me')).toBeInTheDocument();
  });

  it('keeps user on Create form when create mutation fails', async () => {
    const user = userEvent.setup();

    const mocks = [
      {
        request: {
          query: CREATE_BOOK,
          variables: { input: { title: 'T', author: 'A', description: '', rating: 0 } },
        },
        error: new Error('create failed'),
      },
    ];

    renderWithProviders(<CreatePage />, { apolloMocks: mocks });

    // fill the form minimally using placeholders (our Mantine test mock renders inputs)
    await user.type(screen.getByPlaceholderText(/The Silent Pine/), 'T');
    await user.type(screen.getByPlaceholderText(/A. Garbarino/), 'A');

    const submit = screen.getByRole('button', { name: /Create/i });
    await user.click(submit);

    // On failure we expect to remain on the form (title still present)
    expect(await screen.findByText(/Create Book/)).toBeInTheDocument();
  });

  it('remains on Edit page when update mutation fails', async () => {
    const user = userEvent.setup();

    // Mock the BOOK_QUERY to return an existing book
    const book = { id: 'e1', title: 'Edit Me', author: 'B', rating: 4, description: 'd' };
    const queryMock = {
      request: { query: BOOK_QUERY, variables: { id: 'e1' } },
      result: { data: { book } },
    };

    // Mock update error
    const updateMock = {
      request: {
        query: UPDATE_BOOK,
        variables: {
          input: { id: 'e1', title: 'Edit Me 2', author: 'B', description: 'd', rating: 4 },
        },
      },
      error: new Error('update failed'),
    };

    // render EditPage via Routes so useParams picks up the :bookId param
    const { Routes, Route } = await import('react-router-dom');
    renderWithProviders(
      <Routes>
        <Route path="/books/:bookId/edit" element={<EditPage />} />
      </Routes>,
      { route: '/books/e1/edit', apolloMocks: [queryMock, updateMock] },
    );

    // ensure form is present (EditBook heading)
    expect(await screen.findByText(/Edit Book/)).toBeInTheDocument();

    // change title and submit (use placeholders since mantine mock renders inputs)
    await user.clear(screen.getByPlaceholderText(/The Silent Pine/));
    await user.type(screen.getByPlaceholderText(/The Silent Pine/), 'Edit Me 2');

    const save = screen.getByRole('button', { name: /Save/i });
    await user.click(save);

    // On failure we expect to remain on the edit page (title header still shows)
    expect(await screen.findByText(/Edit Book/)).toBeInTheDocument();
  });
});
