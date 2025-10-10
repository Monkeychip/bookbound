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
> Think of it as the literary equivalent of a movie “based on a
> true story” — work with me, and enjoy the ride 📚✨

### Dummy data & caching behavior

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

Examples:

```ts
import BreadcrumbsBar from '@components/BreadcrumbsBar';
import { DetailPage } from '@features/books';
import cover from '@assets/next-chapter-mark.svg';
```

## TypeScript patterns

Small conventions we follow in this repo to keep runtime safety high and the
type surface pleasant for reviewers.

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
- [ ] Add CI (GitHub Actions) for npm run build && npm run lint
