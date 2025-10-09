# 📚 Next Chapter - Example Inc.

A frontend rewrite starting with a clean React + Typescript foundation.

## Background

**Next Chapter** began as a scrappy experiment — a small web app where friends could rate what they’re reading and discover new books.

The MVP took off quickly: people loved logging their books, rating them, and trading recommendations.

But the prototype was built for speed, not scale.

As Next Chapter’s user base grew, it became harder to maintain and nearly impossible to add new features like _Authors_, or _Reviews_ without breaking something.

Now the team is making a **clean break from the past** to establish a strong, scalable foundation — one that future engineers can confidently build on.

The goals for this rewrite:

- Define consistent **routing and navigation patterns**.
- Establish a reusable **data-access and caching layer** with Apollo Client.
- Demonstrate **CRUD flows** (create, edit, delete) for the Books feature.
- Apply a **modern UI library (Mantine)** that can evolve into a design system.
- Provide **unit/integration tests** to set expectations for future contributors.

The result will serve as the blueprint for Next Chapter’s new frontend architecture — a maintainable, extensible codebase ready for future growth.

## Quick Start

1. npm i
2. Run the server: `npm run dev:server`
   _Allows you to pretest query functions_
3. Run the client: `npm run dev` → http://localhost:5173

### Use of GenAI

Parts of this project (documentation formatting, initial TypeScript scaffolding, and comments)
were augmented using GenAI tools. All code, logic, and architectural decisions were reviewed
and refined manually to ensure correctness and maintainability.

### Dummy data & caching behavior

This demo uses DummyJSON’s `/products` endpoints as a stand-in for “books”.
DummyJSON **does not persist** newly created items, so fetching a newly created
book by id will not succeed on the backend.

To provide a seamless UX and to demonstrate scalable caching patterns, the app:

- Uses an **Apollo cache redirect** for `Query.book` to resolve book detail
  pages from the normalized cache (by `id`) immediately after creation.
- Sets `fetchPolicy: 'cache-first'` on the detail query so a cache hit is
  sufficient and we avoid a failing network request.
- If the page is hard-refreshed, the in-memory cache is empty; the backend will
  not find the non-persisted item.

<!-- appended by automated edit: Import aliases -->

## Import aliases

The project defines path aliases to keep imports concise and consistent. Prefer using these when importing shared modules:

- `@components/*` — shared UI components (buttons, lists, rows, empty states, etc.)
- `@features/*` — feature-level pages and logic (books, authors, etc.)
- `@assets/*` — static assets

Example:

```ts
import BreadcrumbsBar from '@components/BreadcrumbsBar';
import { BookDetail } from '@features/books';
```

## Project structure

This repository follows a feature-first layout with a small `app` area for
application wiring and a `shared` area for UI primitives and libraries.

Top-level folders you’ll use most:

- `src/app/` — App composition and routing (providers, ThemeProvider, AppRoutes, Layout).
- `src/features/<feature>/` — Feature-local code (pages, components, hooks, api). Example: `src/features/books/`.
- `src/shared/` — Shared utilities and UI primitives used across features. We keep shared UI under `src/shared/ui/components`.
- `src/assets/` — Static images and svg assets.
- `src/theme/` — Design tokens and theme utilities.

Alias recap (matches tsconfig + vite):

- `@components/*` → `src/shared/ui/components/*`
- `@features/*` → `src/features/*`
- `@assets/*` → `src/assets/*`

If you reorganize files, prefer updating your import aliases or the feature barrel to minimize changes across the codebase.

## TODO

Small follow-ups to finalize the recent refactors and developer docs:

- [ ] Add a11y linting for tests (configure eslint-plugin-jsx-a11y for test environments)
- [ ] Add CONTRIBUTING.md / contributors guidelines
- [ ] Build out mass-delete operations — see routing and batch API design
