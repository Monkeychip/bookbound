# 📚 Next Chapter - Example Inc.

A frontend rewrite starting with a clean React + Typescript foundation.

## Background

**Next Chapter** started as a small side project for friends to rate and share books. The MVP grew fast — but it was built for speed, not scale.

As Next Chapter’s user base grew, it became harder to maintain and nearly impossible to add new features like _Authors_, or _Reviews_ without breaking something.

Now the team is making a **clean break from the past** to establish a strong, scalable foundation — one that future engineers can confidently build on.

This rewrite focuses on creating a maintainable foundation. Goals include:

- Define consistent **routing and navigation patterns**.
- Establish a reusable **data-access and caching layer** with Apollo Client.
- Demonstrate **CRUD flows** (create, edit, delete) for the Books feature.
- Apply a **modern UI library (Mantine)** that can evolve into a design system.
- Establish **unit and end-to-end tests** to model maintainable QA patterns.

The result will serve as the blueprint for Next Chapter’s new frontend architecture — a maintainable, extensible codebase ready for future growth.

## Tech Stack

- **Framework:** React 19 + Vite + TypeScript
- **Data Layer:** Apollo Client v3 (GraphQL local schema + reactive vars)
- **UI:** Mantine 7 + custom theme utilities
- **Testing:** Vitest (unit) + Playwright (e2e)
- **Linting:** ESLint + Prettier + TypeScript strict mode

## Quick Start

```
npm install
npm run dev:server   # Starts the mock GraphQL backend
npm run dev          # Starts the Vite client → http://localhost:5173
```

Testing docs: see `docs/TESTING.md` for instructions on running unit tests (Vitest) and e2e tests (Playwright).

### Use of GenAI

Parts of this project (documentation formatting, initial TypeScript scaffolding, and comments)
were drafted with the aid of GenAI tools, then fully reviewed and refined manually to ensure correctness and maintainability.

Test-related contributions: GenAI helped draft the initial test scaffolding and examples used during this rewrite. Concretely, it assisted in:

- Designing the unit test bootstrap (a resilient `src/setupTests.ts`) that provides lightweight Mantine mocks and an Apollo-aware test setup.
- Proposing a hoist-safe CommonJS mock pattern for Mantine so vitest runs stay fast and deterministic without Mantine internals.
- Sketching a low-overhead Playwright e2e example that intercepts GraphQL requests and returns deterministic fixtures, which we used as a reliable smoke test template.

All generated suggestions were reviewed and adapted by the author to match repository conventions and to ensure they were safe, maintainable, and well-typed.

> ### ⚙️ About the Data
>
> This demo uses the public DummyJSON API as a lightweight stand-in for a real
> backend. Under the hood, Books are actually mapped from DummyJSON’s products
> endpoint — so each "book" is, technically, a product with a title, brand,
> description, and rating.
>
> It works surprisingly well for some entries (e.g., “Powder Canister” almost
> sounds like the sequel to Lonesome Dove), though others — “Amazon Echo Plus"
> — require an imagination.
>
> This mapping is intentional: it keeps the focus on demonstrating the data
> flow, pagination, and caching patterns you’d expect in a real GraphQL + React + Apollo app.
> Think of it as the literary equivalent of a movie “based on a true story” —
> work with me, and enjoy the ride. 📚✨

### Dummy data & caching behavior

DummyJSON **does not persist** newly created items, so fetching a newly created
book by id will not succeed on the backend.

To provide a seamless UX and to demonstrate scalable caching patterns, the app:

- Books list is seeded once into an application-level reactive var (`booksVar`) via `initBooksStore()` and used as the in-memory source-of-truth.
- Creates and deletes are applied optimistically to `booksVar` so the UI updates instantly; the GraphQL mutations are still sent to DummyJSON.
- Detail pages use an Apollo `cacheRedirect` and `fetchPolicy: 'cache-first'`, allowing newly created items to resolve from the normalized cache without triggering a failing backend call.

## TypeScript patterns

Type conventions that balance runtime safety with developer ergonomics.

- Use `unknown` for external/untyped inputs (network JSON, third-party data).
  Never access properties on `unknown` directly — narrow it first with a
  runtime guard.

- Runtime guards live in `src/shared/types/runtime.ts` (re-usable helpers
  like `isObject`, `hasPropOfType`). Prefer these helpers instead of ad-hoc
  `typeof` checks scattered across the codebase.

  Example:

  ```ts
  import { isObject, hasPropOfType } from '@/shared/types/runtime';

  function parseProduct(data: unknown) {
    if (!isObject(data) || !hasPropOfType(data, 'id', 'number')) {
      throw new Error('Invalid product');
    }
    // `data` is now narrowed and safe to use
    return data;
  }
  ```

- `LooseObject` is a small alias (`src/shared/types/index.ts`) for
  `Record<string, unknown>`; use it for open-shaped records when you need to
  attach unknown properties, but prefer specific types where possible.

- Avoid `any`. If you really need to opt-out of type-checking for a tight
  localized edge case, prefer `unknown` + narrow or add a small helper that
  documents why the exception is safe.

This short section is useful to paste into PR notes when you want a quick
explanation of the repository's runtime-typing approach.

## Project structure

This repository follows a feature-first layout: feature folders contain pages,
components, and hooks for a single domain (for example `books`), while the
`app/` area hosts application-level wiring (providers, routes, and the theme).

Top-level folders you'll use most:

- `src/app/` — App composition and routing (providers, ThemeProvider, AppRoutes, Layout).
- `src/features/<feature>/` — Feature-local code (pages, components, hooks, api). Example: `src/features/books/`.
- `src/shared/` — Shared utilities and UI primitives used across features (e.g. `src/shared/ui/components`).
- `src/assets/` — Static images and svg assets.
- `src/theme/` — Design tokens and theme utilities.

Quick visual (mini tree):

```text
├── public/
├── server/
│   ├── index.ts
│   └── schema.ts
├── src/
│   ├── app/
│   │   ├── apollo.ts
│   │   └── routes/
│   │       └── AppRoutes.tsx
│   ├── features/
│   │   └── books/
│   │       ├── BooksList.tsx
│   │       └── BookDetail.tsx
│   ├── shared/
│   │   └── ui/
│   │       └── components/
│   ├── assets/
│   │   └── next-chapter-mark.svg
│   └── theme/
└── package.json
```

Use feature barrels and the path aliases (see "Import aliases" below) to keep imports concise when moving or reorganizing files.

## Import aliases

The project defines path aliases (configured in `tsconfig.json` and `vite.config.ts`) to keep imports concise and consistent. Use these aliases when importing shared modules or feature barrels.

Primary aliases:

- `@/*` — app-root shorthand for `src/` (use for absolute imports within the src tree)
- `@features/*` — feature-level public barrels (e.g. `@features/books`)
- `@assets/*` — static assets under `src/assets`
- `@components/*` — shared UI primitives under `src/shared/ui/components`

Guidance:

- Prefer `@components/*` for truly shared UI primitives (buttons, lists, empty states, generic rows).
- Prefer feature barrels (e.g. `@features/books`) to import pages, feature-local components and hooks.
- Use `@/*` when you want an absolute path into the `src/` tree but there isn't a more specific alias.

## TODO

Small follow-ups to finalize the recent refactors and developer docs:

- [ ] Add CONTRIBUTING.md / contributors guidelines
- [ ] Improve Toast messaging for success/error messaging on transitions
- [ ] Build out mass-delete operations — see routing and batch API design
- [ ] Add CI (GitHub Actions) for npm run build && npm run lint
