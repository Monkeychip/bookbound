import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { ListPage } from '../ListPage';
import { booksVar } from '@/shared/lib/data/booksStore';

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
});
