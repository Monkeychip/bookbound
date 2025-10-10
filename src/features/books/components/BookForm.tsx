import { useState } from 'react';
import { Button, Group, Input, Rating, Stack, Text, Textarea, TextInput } from '@mantine/core';

/**
 * BookForm
 *
 * Reusable form for creating or updating a book. Parent decides what mutation
 * to call and passes loading/disabled state. This keeps data-fetching concerns
 * outside the form and lets Detail/Edit share the same UI.
 *
 * The form exposes a typed `onSubmit` callback and ensures basic client-side
 * validation (title and author required). Accessibility features include
 * `aria-describedby` on the form and required indicators on inputs.
 *
 * @param {Partial<BookFormValues>} [initial] - Optional initial field values.
 * @param {boolean} [loading] - When true, the submit button shows a loading state.
 * @param {boolean} [disabled] - When true, form inputs and actions are disabled.
 * @param {string} [submitLabel] - Label for the submit button (e.g. 'Create'|'Save').
 * @param {(values: BookFormValues) => void|Promise<void>} onSubmit - Called when the form is submitted with validated values.
 * @param {() => void} [onCancel] - Optional cancel handler shown as a secondary button.
 *
 * @example
 * ```tsx
 * <BookForm
 *   initial={{ title: '', author: '', description: '', rating: 0 }}
 *   onSubmit={(values) => createBook({ variables: { input: values } })}
 * />
 * ```
 */

export type BookFormValues = {
  title: string;
  author: string;
  description: string;
  rating: number;
};

type Props = {
  initial?: Partial<BookFormValues>;
  loading?: boolean;
  disabled?: boolean;
  submitLabel?: string; // e.g., "Create" | "Save"
  onSubmit: (values: BookFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export function BookForm({
  initial,
  loading = false,
  disabled = false,
  submitLabel = 'Save',
  onSubmit,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [rating, setRating] = useState<number>(initial?.rating ?? 0);

  const canSubmit = title.trim().length > 0 && author.trim().length > 0 && !disabled;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      rating: typeof rating === 'number' ? rating : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} aria-describedby="form-help">
      <Stack gap="md" px="lg" py="md">
        <TextInput
          withAsterisk
          required
          aria-required="true"
          label="Title"
          placeholder="The Silent Pine"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          disabled={disabled}
          styles={{ input: { background: 'white', color: '#0c3736' } }}
        />

        <TextInput
          withAsterisk
          required
          aria-required="true"
          label="Author"
          placeholder="A. Garbarino"
          value={author}
          onChange={(e) => setAuthor(e.currentTarget.value)}
          disabled={disabled}
          styles={{ input: { background: 'white', color: '#0c3736' } }}
        />

        <Textarea
          label="Description"
          placeholder="Short blurb…"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          autosize
          minRows={2}
          maxRows={6}
          disabled={disabled}
        />

        {/* Rating (0–5, 0.1 steps) */}
        <Input.Wrapper
          id="rating"
          label="Rating"
          description="0 to 5 (use half/decimal stars)"
          aria-describedby="rating-desc"
        >
          <Stack gap={4}>
            <Rating
              name="rating"
              value={typeof rating === 'number' ? rating : 0}
              onChange={setRating}
              count={5}
              fractions={10} // 0.1 precision
              readOnly={disabled}
              color="orangeAccent"
              size="lg"
              getSymbolLabel={(value) => `${value} star${value === 1 ? '' : 's'}`}
              aria-label="Rating from 0 to 5 stars"
            />
            <Text id="rating-desc" c="cream.3" size="xs">
              Use arrow keys for keyboard control. Press Left/Right to adjust by 0.1.
            </Text>
          </Stack>
        </Input.Wrapper>

        <Group justify="flex-end" mt="sm">
          {onCancel && (
            <Button variant="default" onClick={onCancel} disabled={loading || disabled}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={loading} disabled={!canSubmit} aria-busy={loading}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
