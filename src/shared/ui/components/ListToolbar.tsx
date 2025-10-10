import { Button, Group, SegmentedControl, TextInput } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import React from 'react';

/**
 * ListToolbar
 *
 * Small toolbar used above lists to provide search, sort, and create actions.
 * Keeps list-related controls in one place so the list component focuses on
 * data fetching and rendering.
 *
 * @param search - Current search string.
 * @param onSearchChange - Called when the search text changes.
 * @param sortField - Currently selected sort field.
 * @param onSortFieldChange - Called when the sort field changes.
 * @param sortOrder - Current sort order.
 * @param onSortOrderChange - Called when the sort order changes.
 *
 * @example
 * ```tsx
 * <ListToolbar
 *   search={search}
 *   onSearchChange={setSearch}
 *   sortField={sortField}
 *   onSortFieldChange={setSortField}
 *   sortOrder={sortOrder}
 *   onSortOrderChange={setSortOrder}
 * />
 * ```
 */

type SortField = 'RATING' | 'TITLE';
type SortOrder = 'ASC' | 'DESC';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  sortField: SortField;
  onSortFieldChange: (v: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (v: SortOrder) => void;
};

export function ListToolbar({
  search,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
}: Props) {
  return (
    <Group justify="space-between" align="center" mb="sm" wrap="wrap">
      <TextInput
        placeholder="Search books…"
        value={search}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        styles={{ input: { background: 'white', color: '#0c3736' } }}
      />

      <Group gap="sm" wrap="wrap">
        <SegmentedControl
          value={sortField}
          onChange={(v) => onSortFieldChange(v as SortField)}
          data={[
            { label: 'Rating', value: 'RATING' },
            { label: 'Title', value: 'TITLE' },
          ]}
        />
        <SegmentedControl
          value={sortOrder}
          onChange={(v) => onSortOrderChange(v as SortOrder)}
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
  );
}
