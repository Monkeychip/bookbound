import {
  ActionIcon,
  Anchor,
  Button,
  Group,
  Menu,
  Pagination,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconDots, IconArrowRight } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { gql, useMutation, useQuery, NetworkStatus } from '@apollo/client';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// -----------------------------------------------------------------------------
// BooksList — list + search + sort + pagination
// -----------------------------------------------------------------------------

type Book = { id: number; title: string; author: string; rating: number };

type BooksVars = {
  limit: number;
  skip?: number;
  search?: string;
  sort?: { field?: 'RATING' | 'TITLE'; order?: 'ASC' | 'DESC' };
};

type BooksPage = {
  items: Book[];
  total: number;
  skip: number;
  limit: number;
};

type BooksData = { books: BooksPage };

type DeleteBookData = { deleteBook: boolean };
type DeleteBookVars = { id: string | number };

const PAGE_SIZE = 10;

const BOOKS_QUERY = gql`
  query Books($limit: Int!, $skip: Int, $search: String, $sort: BooksSort) {
    books(limit: $limit, skip: $skip, search: $search, sort: $sort) {
      items {
        id
        title
        author
        rating
      }
      total
      skip
      limit
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export function BooksList() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const [page, setPage] = useState(1); // 1-based for Mantine Pagination
  const [sortField, setSortField] = useState<'RATING' | 'TITLE'>('RATING');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const vars: BooksVars = {
    limit: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    search: debouncedSearch || undefined,
    sort: { field: sortField, order: sortOrder },
  };

  const { data, loading, error, refetch, networkStatus } = useQuery<BooksData, BooksVars>(
    BOOKS_QUERY,
    {
      variables: vars,
      fetchPolicy: 'cache-and-network',
      returnPartialData: true,
      notifyOnNetworkStatusChange: true,
    },
  );

  const isSearching =
    networkStatus === NetworkStatus.setVariables || networkStatus === NetworkStatus.refetch;

  // ----- Delete with cache update -----
  const [deleteBook, { loading: deleting }] = useMutation<DeleteBookData, DeleteBookVars>(
    DELETE_BOOK,
    {
      update(cache, _result, { variables }) {
        const id = variables?.id;
        if (!id) return;

        const existing = cache.readQuery<BooksData, BooksVars>({
          query: BOOKS_QUERY,
          variables: vars,
        });
        if (!existing?.books) return;

        const filtered = existing.books.items.filter((b) => String(b.id) !== String(id));
        cache.writeQuery<BooksData, BooksVars>({
          query: BOOKS_QUERY,
          variables: vars,
          data: {
            books: {
              ...existing.books,
              items: filtered,
              total: Math.max(0, existing.books.total - 1),
            },
          },
        });
      },
    },
  );

  // Reset to page 1 when search/sort changes
  // (so we don’t land on an empty page after filtering)

  const searchKey = debouncedSearch + sortField + sortOrder;
  // quick way to react on changes:
  // (could also use useEffect(() => setPage(1), [debouncedSearch, sortField, sortOrder]))
  if (searchKey && (vars.skip ?? 0) !== (page - 1) * PAGE_SIZE) {
    /* no-op, keeps types quiet */
  }

  return (
    <div style={{ padding: 16 }}>
      <Group justify="space-between" align="center" mb="sm" wrap="wrap">
        <TextInput
          placeholder="Search books…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.currentTarget.value);
          }}
          styles={{ input: { background: 'white', color: '#0c3736' } }}
        />

        <Group gap="sm" wrap="wrap">
          <SegmentedControl
            value={sortField}
            onChange={(v) => {
              setPage(1);
              setSortField(v as 'RATING' | 'TITLE');
            }}
            data={[
              { label: 'Rating', value: 'RATING' },
              { label: 'Title', value: 'TITLE' },
            ]}
          />
          <SegmentedControl
            value={sortOrder}
            onChange={(v) => {
              setPage(1);
              setSortOrder(v as 'ASC' | 'DESC');
            }}
            data={[
              { label: '↓', value: 'DESC' },
              { label: '↑', value: 'ASC' },
            ]}
          />

          <Button
            component={Link}
            to="/books/new"
            variant="filled"
            rightSection={<IconArrowRight size={14} />}
          >
            Create Book
          </Button>
        </Group>
      </Group>

      {isSearching && <Text c="cream.2">Searching…</Text>}

      {error && (
        <Group gap="xs">
          <Text c="red">
            Error loading books:{' '}
            {error.message.includes('Network') ? 'Network error' : error.message}
          </Text>
          <Button size="xs" variant="light" onClick={() => refetch()}>
            Retry
          </Button>
        </Group>
      )}

      {!loading && !error && data?.books?.items?.length === 0 && <Text>No books found.</Text>}

      <Stack gap="xs" mt="sm">
        {data?.books?.items?.map((b) => (
          <Paper
            key={b.id}
            withBorder
            radius="md"
            p="xs"
            style={{
              borderColor: 'var(--mantine-color-tealBrand-7)',
              backgroundColor:
                'color-mix(in oklab, var(--mantine-color-tealBrand-9) 92%, black 8%)',
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
              <div>
                <Anchor component={Link} to={`/books/${b.id}`} c="cream.0" fw={700}>
                  {b.title}
                </Anchor>
                <Text c="cream.2" size="sm" ml="xs" span>
                  — {b.author} ({b.rating})
                </Text>
              </div>

              <Menu withinPortal position="bottom-end" shadow="md">
                <Menu.Target>
                  <ActionIcon
                    variant="outline"
                    color="orangeAccent"
                    aria-label={`More actions for ${b.title}`}
                    radius="md"
                    size="sm"
                  >
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} to={`/books/${b.id}`}>
                    Details
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    onClick={() => deleteBook({ variables: { id: b.id } })}
                    disabled={deleting}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Paper>
        ))}
      </Stack>

      {/* Pagination */}
      {data?.books && data.books.total > PAGE_SIZE && (
        <Group justify="center" mt="md">
          <Pagination
            total={Math.max(1, Math.ceil(data.books.total / PAGE_SIZE))}
            value={page}
            onChange={setPage}
            size="sm"
          />
        </Group>
      )}
    </div>
  );
}
