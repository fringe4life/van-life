# React Router v7 Audit

Audit of the Van Life codebase against React Router v7 framework-mode docs (bundled at `node_modules/react-router/docs/`).

## Overview

This app uses React Router v7 framework mode with SSR, typed route modules (`./+types/*`), `href()` for URL generation, and the v8 middleware flag enabled in `react-router.config.ts`.

## What Is Already Strong

### Framework mode basics

- Central route config in `app/routes.ts`
- Generated route types via `react-router typegen` before `typecheck`
- Loaders and actions use `Route.LoaderArgs` / `Route.ActionArgs`
- Most UI routes use `Route.ComponentProps` instead of `useLoaderData()` hooks
- HTTP errors via `throw data(..., { status })` in loaders

### Middleware

- `v8_middleware: true` in `react-router.config.ts`
- Typed contexts via `createContext` from `react-router` (`authContext`, `hasAuthContext`)
- Post-`next()` cookie handling in auth middleware (`setCookieHeaders`)

### UX and navigation

- `PendingUI` + `useNavigation` for global pending styling
- `viewTransition` on `CustomLink` / `CustomNavLink`
- `prefetch="intent"` on navigation links
- Fetcher forms for wallet deposit/withdraw and optimistic van list updates
- `shouldRevalidate` on host vans after optimistic add
- Deferred-style UI: `vansPromise` + `<Suspense>` / `<Await>` on host dashboard

### Resource routes

- `sitemap.xml.ts`, `robots.txt.ts`, and `routes/api/auth.ts` export loaders/actions without default UI components

### SEO

- React 19 `<title>` and `<meta>` elements in route components (preferred over the route module `meta()` export per current docs)
- Public pages use `SeoHead` fed from loader SEO data

## Changes Applied (Host Auth Consolidation)

### Problem

`authMiddleware` was exported on `host-layout.tsx` **and** duplicated on every host leaf route, causing redundant session/user lookups per request.

### Solution

Middleware chain:

```
layout.tsx (hasAuthMiddleware)
  └── host-layout.tsx (authMiddleware + stub loader)
        └── host leaf routes (route-specific middleware only, e.g. return-rental)
```

1. **Keep** `authMiddleware` only on [`app/routes/layout/host-layout.tsx`](../app/routes/layout/host-layout.tsx)
2. **Add** a minimal layout loader (`return null`) so client navigations under `/host` trigger a `.data` request and run layout middleware reliably
3. **Remove** duplicate `authMiddleware` from all host leaf routes
4. **Keep** route-specific middleware where needed (e.g. `fetchSharedDataMiddleware` on return-rental)

Child loaders and actions continue using `context.get(authContext)` — no logic changes required.

### ErrorBoundary fixes

Framework mode passes `error` via `Route.ErrorBoundaryProps`. Updated:

- [`app/routes/host/host.tsx`](../app/routes/host/host.tsx) — removed `useParams()` hack; uses `isRouteErrorResponse` + `UnsuccesfulState`
- [`app/routes/auth/sign-out.tsx`](../app/routes/auth/sign-out.tsx) — typed boundary surfaces loader `throw data(...)` messages

## Recommended Follow-Ups (Not Yet Implemented)

| Area | Suggestion |
|------|------------|
| **Nav pending** | Use NavLink `className={({ isPending, isActive }) => ...}` in `CustomNavLink` for per-link pending states |
| **Login / signup forms** | Consider `useFetcher` + `fetcher.Form` so validation errors avoid full document navigation |
| **Global pending UI** | Optional `useNavigation()` spinner in `root.tsx` or main layout |
| **SEO consistency** | Pick one style: inline `<title>`/`<meta>` (host/auth) vs `SeoHead` component (public pages) |
| **Query in links** | Replace manual query strings (e.g. `returnTo` on host dashboard link) with typed search-param helpers |
| **Middleware typing** | Optional `Future` module augmentation with `v8_middleware: true` in a `react-router.d.ts` file |
| **Breadcrumbs** | Route `handle` + `useMatches` to avoid prop drilling for section titles |
| **Client middleware** | Optional `clientMiddleware` for client-only analytics or timing on every client navigation |
| **`entry.server.tsx`** | If adding custom `getLoadContext`, return `RouterContextProvider` + `createContext` instead of plain objects |

## Reference Docs

Key bundled guides:

- Route modules: `node_modules/react-router/docs/start/framework/route-module.md`
- Middleware: `node_modules/react-router/docs/how-to/middleware.md`
- Pending UI: `node_modules/react-router/docs/start/framework/pending-ui.md`
- Error boundaries: `node_modules/react-router/docs/how-to/error-boundary.md`
- View transitions: `node_modules/react-router/docs/how-to/view-transitions.md`
- Type safety: `node_modules/react-router/docs/how-to/route-module-type-safety.md`
