import React from 'react';
import { Center, Stack, Title, Text, Group, ThemeIcon } from '@mantine/core';
import { IconBookOff } from '@tabler/icons-react';

/**
 * EmptyState
 *
 * Reusable presentation component to show when a list or page has no data.
 * Props allow overriding the title, description, icon, and an optional action.
 * This component is intentionally UI-only and accepts React nodes for actions
 * so callers can provide buttons/links as appropriate.
 *
 * @param title - Headline to show in the empty state.
 * @param description - Supporting description text.
 * @param action - Optional action node (button/link).
 * @param icon - Optional icon node to show above the title.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No books"
 *   description="Add a book to get started"
 *   action={<Button component={Link} to="/books/new">Create</Button>}
 * />
 * ```
 */

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no items to show here yet. Try creating a new one.',
  action,
  icon,
}) => {
  return (
    <Center style={{ width: '100%', padding: 32 }}>
      <Stack style={{ alignItems: 'center', gap: 12, maxWidth: 640 }}>
        <ThemeIcon size={64} radius={64} variant="light" color="gray.3">
          {icon ?? <IconBookOff size={40} />}
        </ThemeIcon>
        <Title order={3}>{title}</Title>
        <Text c="dimmed" style={{ textAlign: 'center' }}>
          {description}
        </Text>
        {action ? <Group>{action}</Group> : null}
      </Stack>
    </Center>
  );
};

export default EmptyState;
