<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project

Next.js 16.2.7 + React 19.2.4 + TypeScript 5 + Tailwind CSS v4 + ESLint 9 (flat config).

## Commands

- `npm run dev` — dev server (Turbopack default, no `--turbopack` flag needed)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`)
- No test framework is configured.

## Next.js 16 hard requirements

- **Async Request APIs** — `cookies()`, `headers()`, `draftMode()`, `params`, `searchParams` must be `await`ed. Synchronous access is removed.
- **Turbopack default** — `next dev` / `next build` use Turbopack. Use `--webpack` flag to opt out.
- **`middleware.ts` renamed to `proxy.ts`** — the old `middleware.ts` convention is removed.
- **`revalidateTag` requires second argument** — a `cacheLife` profile (e.g. `'max'`).
- **`@/*` path alias** maps to project root (e.g. `@/app/layout`).

## Tailwind CSS v4

Uses `@import "tailwindcss"` in CSS (not `@tailwind` directives). Theme values via `@theme inline {}` blocks.

## Architecture

- `app/` — App Router pages and layouts (no `pages/` directory)
- `.specify/` — Speckit spec-first workflow tooling (spec → plan → tasks → implement)
- `.opencode/commands/` — custom speckit slash commands (`/speckit.specify`, `/speckit.plan`, etc.)
- The section between `<!-- SPECKIT START -->` and `<!-- SPECKIT END -->` below is managed by speckit's agent-context extension — do not edit manually.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the implementation plan:
`specs/001-expense-tracker/plan.md`
<!-- SPECKIT END -->
