import { Anchor, Group, Paper, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { RowMenu } from './RowMenu';
import { useState } from 'react';
import type { LooseObject } from '../../types';

/**
 * ListRow
 *
 * Generic presentational row for resource lists. It renders a title link,
 * optional subtitle/meta, and a contextual menu. Keep this component
 * presentational — pass callbacks for actions.
 *
 * @template T - entity shape (must include `id` and optionally `title`/`subtitle`).
 *
 * @remarks
 * Use the `renderTitle` and `renderMeta` callbacks to fully control how the
 * row content is rendered for a given entity type.
 *
 * @param entity - The resource/entity to render in the row.
 * @param onDelete - Callback when the Delete action is triggered.
 * @param onDetails - Optional callback to open details for the entity.
 * @param disabled - Disable row actions when true.
 * @param renderTitle - Optional custom renderer for the main title link.
 * @param renderMeta - Optional custom renderer for subtitle/meta information.
 *
 * @example
 * ```tsx
 * // Generic usage inside a list (typed entity)
 * type Item = { id: number; title: string; subtitle?: string };
 * <ListRow<Item>
 *   entity={{ id: 12, title: 'The Silent Pine', subtitle: 'A. Author' }}
 *   onDetails={(id) => navigate(`/items/${id}`)}
 *   onDelete={(id) => deleteItem(id)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Render custom title/meta with generics
 * <ListRow<Item>
 *   entity={project}
 *   renderTitle={(p) => <Anchor component={Link} to={`/projects/${p.id}`}>{p.title}</Anchor>}
 *   renderMeta={(p) => <Text size="sm">{p.owner}</Text>}
 *   onDelete={() => {}}
 * />
 * ```
 */

export type Row = { id: string | number; title?: string; subtitle?: string } & LooseObject;

type ListRowProps<T extends Row = Row> = {
  entity: T;
  onDelete: (id: string | number) => void;
  onDetails?: (id: string | number) => void;
  disabled?: boolean;
  // function to render the main title link (allows custom routes)
  renderTitle?: (entity: T) => React.ReactNode;
  // optional rendering of meta/subtitle
  renderMeta?: (entity: T) => React.ReactNode;
};

export function ListRow<T extends Row = Row>({
  entity,
  onDelete,
  onDetails,
  disabled,
  renderTitle,
  renderMeta,
}: ListRowProps<T>) {
  const [focused, setFocused] = useState(false);

  const focusStyle: React.CSSProperties = focused
    ? { outline: '3px solid rgba(63,140,137,0.18)', borderRadius: 6 }
    : { outline: 'none' };

  return (
    <Paper
      key={entity.id}
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
          aria-label={`Open details for ${entity.title ?? String(entity.id)}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (onDetails) onDetails(entity.id);
            }
          }}
          onClick={() => {
            if (onDetails) onDetails(entity.id);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={focusStyle}
        >
          {renderTitle ? (
            renderTitle(entity)
          ) : (
            <Anchor component={Link} to={`/${String(entity.id)}`} c="cream.0" fw={700}>
              {entity.title}
            </Anchor>
          )}

          {renderMeta ? (
            renderMeta(entity)
          ) : (
            <Text c="cream.2" size="sm" ml="xs" span>
              {entity.subtitle}
            </Text>
          )}
        </div>

        <RowMenu
          onDetails={() => (onDetails ? onDetails(entity.id) : () => {})}
          onDelete={() => onDelete(entity.id)}
          label={String(entity.title ?? entity.id)}
          disabled={disabled}
        />
      </Group>
    </Paper>
  );
}
