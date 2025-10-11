````markdown
# Tests

Tests in this repo are split between unit/integration tests (Vitest) and
end-to-end tests (Playwright). Below are the recommended commands and a few
notes to make running them locally and in CI reliable.

Unit / integration (Vitest)

- Run all tests:

```bash
npm test
# or
npx vitest
```

- Run only tests under `src/` (faster, avoids any third-party discovery):

```bash
npx vitest run src --reporter verbose
```

Notes:

- The project includes a global test setup at `src/setupTests.ts`. That file
  provides lightweight mocks for Mantine in the test environment so unit
  tests are fast and deterministic.
- If you run into cache/typename warnings from Apollo in tests, ensure your
  test mocks include `__typename` where appropriate rather than passing
  `addTypename` through `MockedProvider`.

End-to-end (Playwright)

- Run Playwright tests (local):

```bash
npm run e2e
```

- Run the CI-friendly Playwright script (starts the dev server and runs
  a single chromium project with CI flags):

```bash
npm run e2e:ci
```

Notes and troubleshooting:

- Playwright is configured in `playwright.config.ts` to start the dev server
  (via the `webServer` option) and wait for readiness. If you prefer to
  start the dev server yourself, run `npm run dev` then `npm run e2e`.
- If Playwright complains about missing browsers in CI, run:

```bash
npx playwright install --with-deps
```

- We use a low-overhead mocked e2e in `e2e/tests/books.mocked.spec.ts` that
  intercepts `/graphql` and returns deterministic fixtures so you can run a
  smoke test without a full backend.

Additions for CI

- The repository includes an `e2e:ci` script that sets `CI=true` and runs
  Playwright with a single project. This is intentionally conservative for
  CI environments.
````
