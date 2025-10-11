import { test, expect } from '@playwright/test';

// Low-overhead deterministic e2e test that intercepts GraphQL requests and
// returns fixture data. This avoids needing a running backend and keeps the
// test fast and stable. Run with: `npm run e2e` (starts Playwright test runner).

const BOOKS_FIXTURE = {
  data: {
    books: {
      items: [
        { id: 'b1', title: 'Test Book 1', author: 'Alice', __typename: 'Book' },
        { id: 'b2', title: 'Test Book 2', author: 'Bob', __typename: 'Book' },
      ],
      total: 2,
    },
  },
};

// Intercepts POST /graphql and responds with a fixture for this test.
// Simpler and more deterministic than trying to parse operationName —
// the goal is a low-overhead smoke test that doesn't require the backend.
async function interceptGraphql(
  route: import('@playwright/test').Route,
  request: import('@playwright/test').Request,
) {
  // Only handle POSTs (GraphQL queries/mutations sent over POST)
  if (request.method().toUpperCase() === 'POST') {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(BOOKS_FIXTURE),
    });
    return;
  }
  await route.continue();
}

test('books list shows mocked rows', async ({ page }) => {
  // Intercept GraphQL requests to return deterministic fixtures
  await page.route('**/graphql', interceptGraphql);

  // Start the app (assumes dev server is running at http://localhost:5173)
  await page.goto('http://localhost:5173/books');

  // Wait for list to render and assert fixture rows are shown. The app
  // renders links and author paragraphs; use role/text selectors which are
  // more robust than testids for the mocked UI snapshot.
  await expect(page.getByRole('link', { name: 'Test Book 1' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Test Book 2' })).toBeVisible();

  // Check authors render
  await expect(page.getByText('Alice')).toBeVisible();
  await expect(page.getByText('Bob')).toBeVisible();
});
