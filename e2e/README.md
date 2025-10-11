E2E tests (Playwright)

These end-to-end tests exercise the running application in a browser and the
local GraphQL server. They are not installed by default. To run them locally:

1. Install Playwright and its browsers:

```bash
npm install -D @playwright/test
npx playwright install --with-deps
```

2. Start the dev servers in two terminals:

```bash
# terminal 1: app
npm run dev
# terminal 2: server
npm run dev:server
```

3. Run the tests:

```bash
npx playwright test --config=e2e/playwright.config.ts
```

4. View the HTML report (if tests created one):

```bash
npx playwright show-report
```

Notes:

- The tests assume the app is served at http://localhost:5173 and the GraphQL
  server at http://localhost:4000/graphql.
- The e2e tests use simple selectors and assume the app routes/forms are
  implemented as in the repository.
