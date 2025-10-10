import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

// AppProvider uses initBooksStore on mount; mock it so the effect runs without network.
vi.mock('@/shared/lib/data/booksStore', () => ({
  initBooksStore: vi.fn(),
}));

import { AppProvider } from '../../providers/AppProvider';
import { initBooksStore } from '@/shared/lib/data/booksStore';

describe('AppProvider', () => {
  it('renders children and calls initBooksStore', () => {
    const { getByText } = render(
      <AppProvider>
        <div>child-content</div>
      </AppProvider>,
    );

    expect(getByText('child-content')).toBeInTheDocument();
    expect(initBooksStore).toHaveBeenCalled();
  });
});
