import { test, expect } from '@playwright/test';

// E2E CRUD flow for books. These tests assume the dev server is running
// (vite) on http://localhost:5173 and the GraphQL server is running on
// http://localhost:4000/graphql (see server/index.ts). They also depend on
// the public UI routes (ListPage, CreatePage, EditPage, DetailPage) being
// wired in AppRoutes.

const NEW_BOOK = {
  title: `E2E Book ${Date.now()}`,
  author: 'E2E Author',
  description: 'Created by Playwright e2e test',
  rating: 4.2,
};

test.describe('Books CRUD (e2e)', () => {
  test('create → list → detail → update → delete', async ({ page }) => {
    // Navigate to the create page
    await page.goto('/books/new');

    // Fill the form
    await page.fill('input[placeholder="The Silent Pine"]', NEW_BOOK.title);
    await page.fill('input[placeholder="A. Garbarino"]', NEW_BOOK.author);
    await page.fill('textarea[placeholder="Short blurb…"]', NEW_BOOK.description);
    // submit
    await page.click('button:has-text("Create")');

    // After create we navigate back to the list; ensure the optimistic entry is visible
    await page.waitForURL('**/books');
    await expect(page.locator(`text=${NEW_BOOK.title}`)).toBeVisible();

    // Click into detail page
    await page.click(`a:has-text("${NEW_BOOK.title}")`);
    await page.waitForURL(/\/books\/\d+/);
    await expect(page.locator('h1, h2, h3').first()).toContainText(NEW_BOOK.title);

    // Edit the book: go to edit route and change title
    await page.click('a:has-text("Edit")');
    await page.waitForURL(/\/books\/\d+\/edit/);
    const UPDATED_TITLE = NEW_BOOK.title + ' (updated)';
    await page.fill('input[placeholder="The Silent Pine"]', UPDATED_TITLE);
    await page.click('button:has-text("Save")');

    // Back to detail, assert updated title
    await page.waitForURL(/\/books\/\d+/);
    await expect(page.locator(`text=${UPDATED_TITLE}`)).toBeVisible();

    // Delete the book via detail menu or delete button
    await page.click('button:has-text("Delete")');
    // Confirm (if a confirm dialog appears) — app handles optimistic delete, so
    // simply ensure the list no longer shows the title after returning
    await page.waitForURL('**/books');
    await expect(page.locator(`text=${UPDATED_TITLE}`)).not.toBeVisible();
  });
});
