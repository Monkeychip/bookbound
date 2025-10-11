import { useEffect, useState } from 'react';
import { Button, Group, Pagination, Stack, Text, Anchor } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ListRow, ListToolbar, EmptyState } from '../../../shared/ui/components';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useReactiveVar } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { Link, useNavigate } from 'react-router-dom';
import { DELETE_BOOK } from '@features/books/api/mutations';
import { booksVar, removeBookById, type Book as StoreBook } from '@/shared/lib/data/booksStore';

const PAGE_SIZE = 10;

type Entity = { id: string | number; title?: string; subtitle?: string } & Record<string, unknown>;

type ListPageProps = {
  basePath?: string;
  deleteMutation?: DocumentNode;
  renderTitle?: (e: Entity) => React.ReactNode;
  renderMeta?: (e: Entity) => React.ReactNode;
};

export function ListPage({
  basePath = '/books',
  deleteMutation = DELETE_BOOK,
  renderTitle,
  renderMeta,
}: ListPageProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'RATING' | 'TITLE'>('TITLE');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const store = useReactiveVar(booksVar);
  const allItems: StoreBook[] = store.items ?? [];

  const filtered = allItems.filter((it) => {
    if (!debouncedSearch) return true;
    const s = debouncedSearch.toLowerCase();
    return (
      String(it.title ?? '')
        .toLowerCase()
        .includes(s) ||
      String(it.author ?? '')
        .toLowerCase()
        .includes(s)
    );
  });

  const sorted = filtered.slice().sort((a, b) => {
    const field = sortField === 'RATING' ? 'rating' : 'title';
    const va = (a as unknown as Record<string, unknown>)[field] as unknown;
    const vb = (b as unknown as Record<string, unknown>)[field] as unknown;
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (field === 'title') {
      return sortOrder === 'ASC'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    }
    return sortOrder === 'ASC' ? Number(va) - Number(vb) : Number(vb) - Number(va);
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [debouncedSearch, sortField, sortOrder]);

  useEffect(() => {
    const itemsLen = pageItems.length;
    const last = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > 1 && itemsLen === 0 && total > 0) {
      if (page > last) setPage(last);
      else setPage((p) => Math.max(1, p - 1));
    }
  }, [page, pageItems.length, total]);

  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteBook] = useMutation(deleteMutation as DocumentNode);

  const handleDelete = async (id: string | number) => {
    // Capture current item and index so we can restore on failure
    const cur = booksVar();
    const idx = cur.items.findIndex((b) => String(b.id) === String(id));
    const removed = idx >= 0 ? cur.items[idx] : undefined;

    try {
      setDeletingId(id);
      // optimistic remove
      removeBookById(id);

      await deleteBook({ variables: { id }, optimisticResponse: { deleteBook: true } });

      showNotification({ title: 'Deleted', message: 'Book removed successfully.', color: 'green' });
    } catch (err) {
      // Revert optimistic removal if we still have the original
      if (removed) {
        const now = booksVar();
        const items = [...now.items];
        const insertAt = Math.min(Math.max(0, idx), items.length);
        items.splice(insertAt, 0, removed);
        booksVar({ ...now, items, total: Math.max(0, now.total + 1) });
      }

      console.error('delete failed', err);
      showNotification({
        title: 'Delete failed',
        message: 'Network error or server rejected the delete. Please try again.',
        color: 'red',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <ListToolbar
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        sortField={sortField}
        onSortFieldChange={(v: string | ((prev: 'RATING' | 'TITLE') => 'RATING' | 'TITLE')) => {
          setPage(1);
          if (typeof v === 'function')
            setSortField(v as (prev: 'RATING' | 'TITLE') => 'RATING' | 'TITLE');
          else if (v === 'RATING' || v === 'TITLE') setSortField(v);
        }}
        sortOrder={sortOrder}
        onSortOrderChange={(v: string | ((prev: 'ASC' | 'DESC') => 'ASC' | 'DESC')) => {
          setPage(1);
          if (typeof v === 'function') setSortOrder(v as (prev: 'ASC' | 'DESC') => 'ASC' | 'DESC');
          else if (v === 'ASC' || v === 'DESC') setSortOrder(v);
        }}
      />

      {total === 0 ? (
        <EmptyState
          title={debouncedSearch ? 'No search results' : 'No books yet'}
          description={
            debouncedSearch
              ? 'No books match your query. Try a different search or clear the query.'
              : "You don't have any books yet. Create one to get started."
          }
          action={
            <div>
              {debouncedSearch ? (
                <Button variant="subtle" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              ) : null}
              <Button component={Link} to="/books/new" ml="sm">
                Create book
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <Stack gap="xs" mt="sm">
            {pageItems.map((b) => (
              <ListRow
                key={b.id}
                entity={b}
                onDelete={(id) => void handleDelete(id)}
                onDetails={(id) => navigate(`${basePath}/${id}`)}
                disabled={deletingId !== null && String(deletingId) === String(b.id)}
                renderTitle={
                  renderTitle ??
                  ((ent: Entity) => (
                    <Anchor component={Link} to={`${basePath}/${ent.id}`} c="cream.0" fw={700}>
                      {String(ent.title)}
                    </Anchor>
                  ))
                }
                renderMeta={
                  renderMeta ??
                  ((ent: Entity) => (
                    <Text c="cream.2" size="sm">
                      {String((ent as Entity & { author?: string }).author ?? '')}
                      {typeof (ent as Entity & { rating?: number }).rating === 'number'
                        ? ` — ${Math.round((ent as Entity & { rating?: number }).rating!)} `
                        : ''}
                    </Text>
                  ))
                }
              />
            ))}
          </Stack>

          {totalPages > 1 && pageItems.length > 0 && (
            <Group justify="center" mt="md">
              <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
            </Group>
          )}
        </>
      )}
    </div>
  );
}

export default ListPage;
