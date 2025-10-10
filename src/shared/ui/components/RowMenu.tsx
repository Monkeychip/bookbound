import { ActionIcon, Menu } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';

/**
 * RowMenu
 *
 * Small contextual menu used by list rows. Exposes actions like Details and
 * Delete for an individual item. The trigger is keyboard-focusable and
 * includes ARIA attributes to improve accessibility.
 *
 * @remarks
 * The `label` prop is used to provide accessible labels and should be a
 * short human-readable string (e.g. the item's title).
 *
 * @param onDetails - Called when the Details item is selected.
 * @param onDelete - Called when the Delete item is selected.
 * @param label - Human-readable label used for ARIA attributes and titles.
 * @param disabled - Optional flag to disable menu actions.
 *
 * @example
 * ```tsx
 * <RowMenu
 *   label={item.title}
 *   onDetails={() => navigate(`/items/${item.id}`)}
 *   onDelete={() => removeItem(item.id)}
 * />
 * ```
 */

type RowMenuProps = {
  onDetails: () => void;
  onDelete: () => void;
  label: string;
  disabled?: boolean;
};

export function RowMenu({ onDetails, onDelete, label, disabled }: RowMenuProps) {
  return (
    <Menu withinPortal position="bottom-end" shadow="md">
      <Menu.Target>
        <ActionIcon
          variant="outline"
          color="orangeAccent"
          aria-label={`More actions for ${label}`}
          aria-haspopup="menu"
          title={`More actions for ${label}`}
          radius="md"
          size="sm"
          tabIndex={0}
          disabled={disabled}
        >
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={onDetails} aria-label={`View details for ${label}`}>
          Details
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" onClick={onDelete} aria-label={`Delete ${label}`}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
