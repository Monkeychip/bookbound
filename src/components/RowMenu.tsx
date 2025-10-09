import { ActionIcon, Menu } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';

// TODO: add documentation

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
