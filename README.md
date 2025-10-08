# 📚 Bookbound - Example Inc.

A frontend rewrite starting with a clean React + Typescript foundation.

## Background

**Bookbound** began as a scrappy experiment — a small web app where friends could share what they’re reading and discover new books.

The MVP took off quickly: people loved logging their books, rating them, and trading recommendations.

But the prototype was built for speed, not scale.

As Bookbound’s user base grew, it became harder to maintain and nearly impossible to add new features like _Authors_, _Reviews_, or _Reading Lists_ without breaking something.

Now the team is making a **clean break from the past** to establish a strong, scalable foundation — one that future engineers can confidently build on.

The goals for this rewrite:

- Define consistent **routing and navigation patterns**.
- Establish a reusable **data-access and caching layer** with Apollo Client.
- Demonstrate **CRUD flows** (create, edit, delete) for the Books feature.
- Use **typed validation** with `react-hook-form` + `zod`.
- Apply a **modern UI library (Mantine)** that can evolve into a design system.
- Provide **unit/integration tests** to set expectations for future contributors.

The result will serve as the blueprint for Bookbound’s new frontend architecture — a maintainable, extensible codebase ready for future growth.

## Quick Start

1. npm i
2. npm run dev → http://localhost:5173

## Use of GenAI

Parts of this project (documentation formatting, initial TypeScript scaffolding, and comments)
were augmented using GenAI tools. All code, logic, and architectural decisions were reviewed
and refined manually to ensure correctness and maintainability.
