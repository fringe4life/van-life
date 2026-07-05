# React Router v8.1 Audit

Audit of the Van Life codebase against React Router v8.1 framework-mode docs (bundled at `node_modules/react-router/docs/`).

**Packages:** `react-router@8.1.0`, `@react-router/dev@8.1.0`

## Overview

This app uses React Router v8.1 framework mode with SSR on Cloudflare Workers, typed route modules (`./+types/*`), `href()` for URL generation, and middleware enabled by default (no `future.v8_middleware` flag needed).

URL search state is handled by **nuqs** via `NuqsAdapter` in `app/root.tsx` and shared parsers in `app/lib/parsers.ts`.

## What Is Already Strong

### Framework mode basics

- Central route config in `app/routes.ts`
- Generated route types via `react-router typegen` before `typecheck`
- Loaders and actions use `Route.LoaderArgs` / `Route.ActionArgs`
- Most UI routes use `Route.ComponentProps` instead of `useLoaderData()` hooks
- HTTP errors via `throw data(..., { status })` in loaders

### Middleware

- Middleware always enabled in v8 — `context` is `RouterContextProvider` (no `Future` module augmentation needed)
- Typed contexts via `createContext` from `react-router` (`authContext`, `hasAuthContext`, `cloudflareContext`)
- Post-`next()` cookie handling in auth middleware (`setCookieHeaders`)
- **Auth chain consolidated:**
  - `hasAuthMiddleware` on root `layout.tsx`
  - `authMiddleware` only on `host-layout.tsx` (not duplicated on host leaf routes)
  - Stub layout loader (`return null`) so client navigations under `/host` trigger a `.data` request and run layout middleware reliably
  - Route-specific middleware only where needed (e.g. `fetchSharedDataMiddleware` on return-rental)

### UX and navigation

- Per-route `PendingUI` + `useNavigation` for opacity-based pending styling (preferred over a global root spinner)
- `navLinkClassName` with `isPending` / `isActive` on host nav and van-detail tabs
- `viewTransition` on `CustomLink` / `CustomNavLink`
- `prefetch="intent"` on navigation links
- Fetcher forms for wallet deposit/withdraw and optimistic van list updates
- `shouldRevalidate` on host vans after optimistic add
- Deferred-style UI: `vansPromise` + `<Suspense>` / `<Await>` on host dashboard

### URL state (nuqs)

- `NuqsAdapter` from `nuqs/adapters/react-router/v8` in `root.tsx`
- Shared parsers in `app/lib/parsers.ts` (pagination, filters, sort)
- Server-side loaders use `createLoader` / `createSerializer` from `nuqs/server`
- Login redirect uses `redirectTo` search param via `getRedirectFromRequest` / `getLoginRedirectUrl`
- Host top-up flow uses `getHostRedirectUrl` + deposit action redirect back to return-rental (same `redirectTo` param, `getSafeRedirectPath` validation)

### Resource routes

- `sitemap.xml.ts`, `robots.txt.ts`, and `routes/api/auth.ts` export loaders/actions without default UI components

### SEO

- React 19 `<title>` and `<meta>` elements in route components (preferred over the route module `meta()` export per current docs)
- Public pages use `SeoHead` fed from loader SEO data; host/auth pages use inline meta (including `noindex` on host layout)

### Error boundaries

- Framework mode passes `error` via `Route.ErrorBoundaryProps` — used in `root.tsx`, host routes, auth sign-out, and public van pages
- Host dashboard boundary uses `isRouteErrorResponse` + `UnsuccesfulState` (no `useParams()` hack)

### Server entry

- `app/entry.server.tsx` accepts `RouterContextProvider` as load context (v8 default)
- `workers/app.ts` creates `RouterContextProvider`, sets `cloudflareContext`, and passes it to `createRequestHandler`

## Recommended Follow-Ups (Optional)

| Area | Suggestion |
|------|------------|
| **Login / signup forms** | Optional `useFetcher` + `fetcher.Form` for validation errors — avoids the navigation/revalidation cycle (`useNavigation` pending, loader re-run); does **not** fix full page reloads (regular `<Form>` is already client-side) |
| **SEO consistency** | Document or unify the split: inline `<title>`/`<meta>` on host/auth vs `SeoHead` on public pages |
| **Breadcrumbs** | Route `handle` + `useMatches` to avoid prop drilling for section titles |
| **Client middleware** | Optional `clientMiddleware` for client-only analytics or timing on every client navigation |

## Reference Docs

Key bundled guides:

- Route modules: `node_modules/react-router/docs/start/framework/route-module.md`
- Middleware: `node_modules/react-router/docs/how-to/middleware.md`
- Pending UI: `node_modules/react-router/docs/start/framework/pending-ui.md`
- Error boundaries: `node_modules/react-router/docs/how-to/error-boundary.md`
- View transitions: `node_modules/react-router/docs/how-to/view-transitions.md`
- Type safety: `node_modules/react-router/docs/how-to/route-module-type-safety.md`
