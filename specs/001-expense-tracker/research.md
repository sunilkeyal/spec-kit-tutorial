# Research: Basic Expense Tracker

## Architecture Decisions

### Data Flow: Server Actions + Route Handlers + localStorage

- **Decision**: Server actions validate form data server-side and return typed results. Client components handle localStorage persistence after successful validation. Route handlers define the REST API contract.
- **Rationale**: Server actions provide progressive enhancement and server-side validation without a separate API call. Route handlers establish a clean API boundary for future backend migration. Since localStorage is client-only, persistence must happen on the client — server actions validate, client writes.
- **Alternatives considered**: Full server-side persistence with a database (overkill for single-user local app), direct client-only CRUD without server actions (misses progressive enhancement), route handlers as the sole API (adds unnecessary fetch overhead when server actions suffice for form submission).

### Route Handlers

- **Decision**: RESTful endpoints at `app/api/expenses/` with GET (list all), POST (create), and `app/api/expenses/[id]/` with PUT (update), DELETE.
- **Rationale**: Follows Next.js App Router conventions. Route handlers validate request body, return proper HTTP status codes, and define the canonical API contract. For v1, they validate and shape responses; actual storage is client-side but the contract supports swapping to real backend later.
- **Alternatives considered**: Single catch-all route (less RESTful), no route handlers (misses API contract documentation).

### Server Actions

- **Decision**: Server actions in `lib/actions.ts` as `"use server"` functions for form validation. Return `ValidationResult` type with either success payload or field-level errors.
- **Rationale**: Server actions are the idiomatic Next.js 16 way to handle form submissions with progressive enhancement. They run on the server, so validation logic can be centralized in `src/server/validation.ts`.
- **Alternatives considered**: Client-only validation (no progressive enhancement, less secure), route handlers for everything (server actions are simpler for form flows).

### Server Layer (`src/server/`)

- **Decision**: Extract validation logic, constants, and types into `src/server/`. Shared between server actions and route handlers.
- **Rationale**: Keeps business logic server-side and reusable. If a real backend is added later, `src/server/` becomes the shared core.
- **Alternatives considered**: Co-locate validation in each consumer (duplication), put everything in `lib/` (blurs server/client boundary).

### Expense ID Generation

- **Decision**: `crypto.randomUUID()` — native browser API, no dependencies. Generated client-side on create.
- **Rationale**: Available in all modern browsers, generates unique v4 UUIDs, no import needed.
- **Alternatives considered**: Incrementing integer (fragile with deletions), server-generated ID (adds round-trip).

### Date Picker

- **Decision**: Native HTML `<input type="date">`.
- **Rationale**: No library needed; supported in all target browsers; works with form validation.
- **Alternatives considered**: `react-datepicker` (adds bundle bloat), custom component (unnecessary complexity).

### Styling

- **Decision**: Tailwind utility classes exclusively.
- **Rationale**: Aligns with constitution (Tailwind v4). Consistent with project.
- **Alternatives considered**: CSS Modules (extra files), inline styles (no theming).

## Best Practices

- **localStorage**: Wrap in try/catch for `QuotaExceededError` and security-restricted contexts. Validate parsed JSON schema on read.
- **Form validation**: Validate on submit. Amount parsed as `Number` with explicit NaN/negative checks. Server action returns field-level error map.
- **Server actions**: Use `useActionState` hook for pending state and error handling on the client. Return `{ success: true, data }` or `{ success: false, errors }`.
- **Route handlers**: Use `NextRequest.json()` for body parsing. Return `NextResponse.json()` with appropriate status codes. Validate with shared `src/server/validation.ts`.
