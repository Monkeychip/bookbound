import { useState } from 'react';
import { Button, Group, NumberInput, Stack, TextInput, Textarea } from '@mantine/core';

// -----------------------------------------------------------------------------
// BookForm
//
// Reusable form for creating or updating a book. Parent decides what mutation
// to call and passes loading/disabled state. This keeps data-fetching concerns
// outside the form and lets Detail/Edit share the same UI.
// -----------------------------------------------------------------------------

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
  const [rating, setRating] = useState<number | ''>(initial?.rating ?? 0);

  const canSubmit = title.trim().length > 0 && author.trim().length > 0 && !disabled;

  const handleRatingChange = (v: string | number) => {
    if (v === '' || typeof v === 'number') setRating(v);
    else {
      const n = Number(v);
      setRating(Number.isNaN(n) ? '' : n);
    }
  };

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
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <TextInput
          label="Title"
          placeholder="The Silent Pine"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
          disabled={disabled}
          styles={{ input: { background: 'white', color: '#0c3736' } }}
        />
        <TextInput
          label="Author"
          placeholder="A. Garbarino"
          value={author}
          onChange={(e) => setAuthor(e.currentTarget.value)}
          required
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
        <NumberInput
          label="Rating"
          placeholder="0–5"
          min={0}
          max={5}
          step={0.1}
          value={rating}
          onChange={handleRatingChange}
          clampBehavior="strict"
          maw={160}
          disabled={disabled}
        />

        <Group justify="flex-end" mt="sm">
          {onCancel && (
            <Button variant="default" onClick={onCancel} disabled={loading || disabled}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={loading} disabled={!canSubmit}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
