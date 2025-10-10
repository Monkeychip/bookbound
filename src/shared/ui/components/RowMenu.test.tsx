import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { RowMenu } from './RowMenu';

describe('RowMenu', () => {
  test('calls onDetails when Details item clicked', async () => {
    const onDetails = vi.fn();
    const onDelete = vi.fn();

    render(<RowMenu label="Book A" onDetails={onDetails} onDelete={onDelete} />);

    // Open the menu by clicking the trigger
    const trigger = screen.getByLabelText('More actions for Book A');
    await userEvent.click(trigger);

    const details = screen.getByRole('menuitem', { name: /details/i });
    await userEvent.click(details);

    expect(onDetails).toHaveBeenCalled();
  });

  test('calls onDelete when Delete item clicked', async () => {
    const onDetails = vi.fn();
    const onDelete = vi.fn();

    render(<RowMenu label="Book B" onDetails={onDetails} onDelete={onDelete} />);

    const trigger = screen.getByLabelText('More actions for Book B');
    await userEvent.click(trigger);

    const del = screen.getByRole('menuitem', { name: /delete/i });
    await userEvent.click(del);

    expect(onDelete).toHaveBeenCalled();
  });
});
