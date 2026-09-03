# React Router framework mode → data mode (van-life)

**Date:** 2026-09-02

**Question:** This project's last hard Octane block is React Router **framework mode** ([`docs/octane-compatibility.md`](./octane-compatibility.md) §1 / §3 — remix-router stubs `Meta` / `Links` / `Scripts` / `createRequestHandler` / `ServerRouter`). What does **this repo** use from official **framework mode** that has **no counterpart** in official **data mode**? What has a counterpart with different wiring? What config / bootstrap must change for a framework → data cutover?

This note does **not** re-litigate Octane. Octane is why the question exists. Focus is official React Router framework vs data.

**Method:** Primary sources only: [reactrouter.com](https://reactrouter.com/) (`/start/modes`, `/start/framework/*`, `/start/data/*`, `/upgrading/*`, `/api/*`, `/how-to/*`, `/explanation/type-safety`); Context7 `/websites/reactrouter`; this repo (grep/read). **No** page named `/upgrading/framework-to-data` exists (search 2026-09-02). Official upgrade path is the reverse: [Framework Adoption from RouterProvider](https://reactrouter.com/upgrading/router-provider). No blogs, tweets, or SEO roundups. Gaps labeled **inference, not specified**.

React Router in this repo: `react-router` / `@react-router/dev` **8.3.1**.

Status labels:

| Label | Meaning |
|-------|---------|
| **Framework-only** | Official API table or page tagged `[MODES: framework]` with no data-mode twin |
| **Counterpart** | Same idea, different wiring (route **module export** vs route **object field**, or you assemble what the Vite plugin used to) |
| **Both** | Documented in framework **and** data |
| **Unused here** | In the framework surface area, not present in this tree |

---

## 1. Verdict

**Most product behavior this app cares about exists in data mode:** loaders, actions, `Form`, `useFetcher`, `ErrorBoundary`, `shouldRevalidate`, `data()`, `redirect` / `replace`, `Await`, `ScrollRestoration`, `createContext` / `RouterContextProvider`. Official model: Framework **wraps** Data with a Vite plugin. [Picking a Mode](https://reactrouter.com/start/modes)

**True framework-only (no official data-mode twin) that this app actually uses:**

1. **Compiler / CLI / virtual build** — `@react-router/dev`, `reactRouter()` Vite plugin, `react-router.config.ts`, `app/routes.ts` helpers (`route` / `index` / `layout` / `prefix`), `react-router dev|build|typegen`, `virtual:react-router/server-build`.
2. **Framework document + SSR runtime** — root `Layout` export, `<Links />`, `<Scripts />`, `HydratedRouter`, `ServerRouter`, `createRequestHandler(ServerBuild)`.
3. **Generated route types + type-safe `href`** — `./+types/*`, `Route.LoaderArgs` / `ComponentProps` / `ErrorBoundaryProps`, `href("/vans/:vanSlug", { vanSlug })`.
4. **Route-module `headers` export** — `forwardDataHeaders` on most pages. [HTTP Headers](https://reactrouter.com/how-to/headers) is `[MODES: framework]`.
5. **`Link` `prefetch` (and `discover`)** — `[modes: framework]` on [`Link`](https://reactrouter.com/api/components/Link). This app sets `prefetch="intent"` on `CustomLink` / `CustomNavLink`.
6. **Single-fetch / `.data` client navigations** — server `loader` + server `middleware` re-run on the Worker after hydration. No shipped data-mode protocol that keeps D1 loaders on the Worker for SPA navigations.

**Not a missing component — a missing runtime:** data-mode install is `createBrowserRouter` + `RouterProvider` with **your** bundler and **your** server. [Data installation](https://reactrouter.com/start/data/installation), [Custom Framework](https://reactrouter.com/start/data/custom). That is the official reason to pick data mode: control over bundling, data, and server abstractions. [start/modes](https://reactrouter.com/start/modes)

**Unused framework APIs (no cutover work):** `<Meta />`, `meta` / `links` / `handle` exports, `clientLoader` / `clientAction`, `HydrateFallback`, `PrefetchPageLinks`, `@react-router/cloudflare` package (this Worker uses `createRequestHandler` from `react-router` directly).

---

## 2. Official model

| Mode | Top-level API | What you get |
|------|----------------|--------------|
| Declarative | `<BrowserRouter>` | Matching, `<Link>`, `useNavigate` |
| Data | `createBrowserRouter` + `<RouterProvider>` | Loaders, actions, pending UI, fetchers |
| Framework | `@react-router/dev` Vite plugin + `routes.ts` | Data **plus** type-safe `href`, type-safe Route Module API, intelligent code splitting, SPA/SSR/SSG from config |

[start/modes](https://reactrouter.com/start/modes)

Data SSR (official custom guide): `createStaticHandler(routes)` → `query(request)` → `createStaticRouter` → `<StaticRouterProvider>` → client hydrates with `window.__staticRouterHydrationData`. Example uses `renderToString` and `` `<!DOCTYPE html>${html}` ``. [start/data/custom](https://reactrouter.com/start/data/custom), [createStaticHandler](https://reactrouter.com/api/data-routers/createStaticHandler), [StaticRouterProvider](https://reactrouter.com/api/data-routers/StaticRouterProvider)

Official migration docs go **data → framework**, not the reverse. [upgrading/router-provider](https://reactrouter.com/upgrading/router-provider)

---

## 3. Inventory: this repo's framework surfaces

### 3.1 Compiler / bootstrap (all framework-only)

| File | Usage |
|------|--------|
| `package.json` | `@react-router/dev@8.3.1`. Scripts: `react-router dev`, `react-router build`, `react-router typegen`. |
| `vite.config.ts` | `reactRouter()` from `@react-router/dev/vite`. Comment: RR owns JSX/HMR (import `reactCompilerPreset` only, not `react()`). |
| `react-router.config.ts` | `ssr: true`, `future.unstable_optimizeDeps: true`. `prerender` commented. Both flags are `[MODES: framework]`. [Rendering](https://reactrouter.com/start/framework/rendering), [Future flags](https://reactrouter.com/upgrading/future) |
| `app/routes.ts` | `route`, `index`, `layout`, `prefix` from `@react-router/dev/routes`. |
| `tsconfig.json` | `"rootDirs": [".", "./.react-router/types"]`, include `.react-router/types/**/*`. |
| `workers/app.ts` | `createRequestHandler(() => import("virtual:react-router/server-build"), MODE)`. Seeds `RouterContextProvider` with `cloudflareContext` + `dbContext`. Matches [Cloudflare adapter example](https://reactrouter.com/api/other-api/adapter). |
| `app/entry.client.tsx` | `HydratedRouter` from `react-router/dom`. [HydratedRouter](https://reactrouter.com/api/framework-routers/HydratedRouter) `[MODES: framework]` |
| `app/entry.server.tsx` | `ServerRouter` + `renderToReadableStream` + `isbot` / `routerContext.isSpaMode`. [entry.server.tsx](https://reactrouter.com/api/framework-conventions/entry.server.tsx) `[MODES: framework]`; required on Cloudflare (default Node entry is not used). |
| `wrangler.jsonc` | `main: "./workers/app.ts"`, `assets.directory: "./build/client"`, `not_found_handling: "single-page-application"`. |

This repo does **not** depend on `@react-router/cloudflare`. Worker follows the adapter-doc Cloudflare snippet: `createRequestHandler` + `virtual:react-router/server-build` + `RouterContextProvider`.

### 3.2 Document (`app/root.tsx`)

| Export / child | Classification |
|----------------|----------------|
| `export const Layout` wrapping `<html>` / `<head>` / `<body>` | **Framework-only** convention. [root.tsx](https://reactrouter.com/api/framework-conventions/root.tsx) |
| `<Links />` | **Framework-only**. [start/modes](https://reactrouter.com/start/modes) table |
| `<Scripts />` | **Framework-only**. Same table |
| `<ScrollRestoration />` | **Both** |
| `<Meta />` | **Framework-only**, **unused here** |
| Default `App`: `NuqsAdapter` + `<Outlet />` | Adapter is nuqs; `<Outlet />` is **both** |
| `ErrorBoundary` with `Route.ErrorBoundaryProps` | Boundary idea = **counterpart**; generated props = **framework-only** |

SEO already uses React 19 document tags in `SeoHead` (`<title>`, `<meta>`, `<link rel="canonical">`). Route-module docs recommend that over the `meta` export. [Route Module `meta`](https://reactrouter.com/start/framework/route-module)

### 3.3 Route module named exports (used)

Present across `app/routes/**` and `app/root.tsx`:

| Export | Used | Classification |
|--------|------|----------------|
| `loader` | Almost every route, including resource routes (`robots.txt`, `sitemap.xml`, `api/auth`) | **Counterpart** → route-object `loader` |
| `action` | login, sign-up, host, host-vans, rental-detail, return-rental, api/auth | **Counterpart** → route-object `action` |
| `headers` | Most UI routes via `forwardDataHeaders` | **Framework-only** export. Data SSR: merge `context.loaderHeaders` / `actionHeaders` yourself. [start/data/custom](https://reactrouter.com/start/data/custom) |
| `middleware` | `layout.tsx` (`hasAuthMiddleware`), `host-layout.tsx` (`authMiddleware`), login/sign-up (`hasAuthMiddleware`), return-rental (auth + shared fetch) | **Counterpart with different runtime** — see §6 |
| `ErrorBoundary` | root + several leaves | **Counterpart** → route-object `ErrorBoundary` |
| `shouldRevalidate` | `host-vans.tsx` only | **Counterpart**; **default differs** — see §7 |
| default component + `Route.ComponentProps` | Most pages (`loaderData`, `actionData`, `params`) | Props API = **framework-only** sugar. Data: `useLoaderData()` / `useActionData()` / `useParams()` |
| `import type { Route } from "./+types/…"` | Every route module | **Framework-only** typegen |

**Not found:** `meta`, `links`, `clientLoader`, `clientAction`, `HydrateFallback`, `handle`, `clientMiddleware`.

### 3.4 Other app APIs

| API | Where | Classification |
|-----|--------|----------------|
| `href(...)` | ~20 files (nav, SEO, sitemap, robots, auth redirects, 404s, tests) | **Framework-only**. [start/modes](https://reactrouter.com/start/modes), [href](https://reactrouter.com/api/utils/href) `[MODES: framework]` |
| `generatePath` | unused | **Both**. Encoding rules match `href`; **not** checked against `routes.ts`. [generatePath](https://reactrouter.com/api/utils/generatePath) |
| `prefetch="intent"` | `custom-link.tsx`, `custom-nav-link.tsx` | **Framework-only** on `Link`. [Link `prefetch`](https://reactrouter.com/api/components/Link) |
| `viewTransition` | same links | **Both** (`framework, data`) |
| `data()`, `redirect`, `replace` | errors, auth, host | **Both** |
| `Form`, `useFetcher`, `useNavigation`, `useLocation`, `NavLink`, `Link`, `Outlet`, `Await` | forms, pending UI, `deferred-await.tsx` | **Both** |
| `createContext` / `context.get` | middleware contexts (auth, hasAuth, db, cloudflare) | **Both**. [middleware](https://reactrouter.com/how-to/middleware) |
| `isRouteErrorResponse` | error helpers | **Both** |
| `nuqs/server` `createLoader` | `app/lib/search-params.server.ts` | nuqs, not RR. Works on any `Request` inside a loader. If loaders leave the Worker, server parsers still run only where you still have a `Request` on the server. |
| `NuqsAdapter` from `nuqs/adapters/react-router/v8` | `root.tsx` | **Inference, not specified:** adapter targets RR v8 data/framework; not separately certified vs `HydratedRouter` vs `RouterProvider`. |

### 3.5 Host-layout `.data` hammer

`host-layout.tsx` exports `loader = () => null` so client navigations under `/host` still issue a `.data` request and run `authMiddleware`. Comment cites official middleware behavior: client navigations run **server** middleware only when a `.data` request is made. [how-to/middleware — When Middleware Runs](https://reactrouter.com/how-to/middleware)

That pattern is **framework SSR single-fetch**, not a data-mode API.

---

## 4. Framework-only vs counterpart (full used-API table)

| This repo | Mode | Data-mode replacement |
|-----------|------|------------------------|
| `@react-router/dev`, `reactRouter()` | Framework-only | `@vitejs/plugin-react` `react()` (or other bundler). [data installation](https://reactrouter.com/start/data/installation) |
| `react-router.config.ts` (`ssr`, `prerender`, `future.unstable_optimizeDeps`) | Framework-only | Delete. SSR is your Worker. Deps: Vite `optimizeDeps`. |
| `app/routes.ts` `route()` / `index()` / `layout()` / `prefix()` | Framework-only | `RouteObject[]`: `path`, `index: true`, pathless parent = layout, path-only parent = prefix. [data routing](https://reactrouter.com/start/data/routing) |
| `virtual:react-router/server-build` | Framework-only | Import your `RouteObject[]` in the Worker |
| `createRequestHandler` | Framework runtime (consumes `ServerBuild`) | `createStaticHandler(routes).query(request)`. Adapters page never shows data-mode usage. [adapter](https://reactrouter.com/api/other-api/adapter), [custom](https://reactrouter.com/start/data/custom) |
| `ServerRouter` | Framework-only | `createStaticRouter` + `<StaticRouterProvider>` |
| `HydratedRouter` | Framework-only | `createBrowserRouter` + `<RouterProvider hydrationData>` |
| Root `Layout` export | Framework-only | Static `index.html` **or** you render `<html>` in the SSR string. Plugin today **moves** Vite entry from `index.html` to `root.tsx`. [upgrading/router-provider](https://reactrouter.com/upgrading/router-provider) |
| `<Links />` / `<Scripts />` | Framework-only | Own `<link>` / Vite module graph / script tags. `StaticRouterProvider` emits a hydration `<script>` (`nonce` prop). |
| `<Meta />` / `meta` / `links` exports | Framework-only, unused | Already using React 19 tags via `SeoHead` |
| `href()` | Framework-only | `generatePath` or string constants. No compile-time check that the path exists in the route tree. |
| `./+types/*`, `react-router typegen` | Framework-only | `LoaderFunctionArgs` / `ActionFunctionArgs` / hand-written param + loader-data types. [Type Safety](https://reactrouter.com/explanation/type-safety) is `[MODES: framework]` |
| `Route.ComponentProps` | Framework-only | `useLoaderData()` etc. |
| `headers` export / `forwardDataHeaders` | Framework-only | In the Worker, copy leaf `context.loaderHeaders` / `actionHeaders` onto the Response (official custom snippet). |
| `export const loader` / `action` | Counterpart | Same functions on the route object **if isomorphic**. These are not (D1). |
| `export const ErrorBoundary` | Counterpart | `ErrorBoundary` on the route object |
| `export function shouldRevalidate` | Counterpart | Same field; **defaults differ** (§7) |
| `export const middleware` (server, returns `Response`) | Counterpart, different runtime | Route-object `middleware` in data mode is documented as **client** middleware (no `Response`). Server `query()` can run middleware on the **document** request. [middleware](https://reactrouter.com/how-to/middleware) |
| `createContext` / `RouterContextProvider` | Both | Worker: `query(request, { requestContext })`. Client: `getContext` on `createBrowserRouter`. |
| `Link prefetch` / `discover` | Framework-only | No twin. Drop prefetch or build your own. Fog-of-war discovery in data mode is `patchRoutesOnNavigation`, not `discover`. [createBrowserRouter](https://reactrouter.com/api/data-routers/createBrowserRouter) |
| `.data` / single-fetch / `handleDataRequest` | Framework-only | You invent an HTTP API or custom `dataStrategy`. [entry.server `handleDataRequest`](https://reactrouter.com/api/framework-conventions/entry.server.tsx), [data-strategy](https://reactrouter.com/how-to/data-strategy) |
| Resource routes returning `Response` | Counterpart | Loader may return `Response`; `query()` returns that Response as-is. [custom](https://reactrouter.com/start/data/custom) |
| Automatic per-file code splitting | Framework-only (“intelligent code splitting”) | `route.lazy` (object or function). [custom](https://reactrouter.com/start/data/custom), [route-object](https://reactrouter.com/start/data/route-object) |
| `HydrateFallback` / `clientLoader` | Unused; counterpart exists | Data: `HydrateFallback` + `loader.hydrate` on the route object. [createBrowserRouter `hydrationData`](https://reactrouter.com/api/data-routers/createBrowserRouter) |

---

## 5. Type safety: what `+types` gave vs data mode

Framework typegen ([explanation/type-safety](https://reactrouter.com/explanation/type-safety)):

- Executes `app/routes.ts`, writes `.react-router/types/**/+types/*.d.ts`.
- `rootDirs` makes `import type { Route } from "./+types/vans"` resolve next to the module.
- Generated per route: `LoaderArgs`, `ClientLoaderArgs`, `ActionArgs`, `ClientActionArgs`, `HydrateFallbackProps`, `ComponentProps`, `ErrorBoundaryProps`.
- `href` is a separate generated path map: invalid path or param key is a type error. [changelog / href](https://reactrouter.com/start/modes)
- This repo: `typecheck` = `react-router typegen && tsc`.

Data mode:

- **No** `typegen`, **no** `+types`, **no** typed `href`.
- Loaders take `LoaderFunctionArgs` (`request`, `params`, `context`). `params` is not tied to the path string in `routes.ts`.
- `useLoaderData()` is untyped unless you add generics / wrappers.
- `generatePath("/vans/:vanSlug", { vanSlug })` interpolates; it does **not** prove `/vans/:vanSlug` is a registered route.

Cutover work: delete every `./+types` import; type `params` and loader data by hand (or a small local helper). `href("/host/vans/:vanSlug/:action?", { action, vanSlug })` call sites become `generatePath` or constants.

---

## 6. Middleware and context

Official docs distinguish **server** vs **client** middleware. [how-to/middleware](https://reactrouter.com/how-to/middleware)

| | Framework (this app) | Data mode |
|--|----------------------|-----------|
| Where you attach it | `export const middleware` on the route module | `middleware: [...]` on the route object |
| Server middleware | Runs on the server for **document** and **`.data`** requests. `next()` returns `HTTP Response`. Example labeled **“Framework mode only”**. | Not the default SPA path. `createStaticHandler.query` can run middleware on the **first** request if you pass `requestContext`. Subsequent client navigations do **not** hit the Worker unless you add a server. |
| Client middleware | `clientMiddleware` export (unused here) | Route-object `middleware` in the data quick start is this: no `Response` to bubble; `next()` yields `dataStrategy` results |
| Seeding context | Worker `new RouterContextProvider()` then `requestHandler(request, loadContext)` | Document: `query(request, { requestContext })`. Browser: `createBrowserRouter(routes, { getContext })` — docs say this **mirrors** framework `getLoadContext` **in the browser** |
| Auth that sets cookies on the Response after `next()` | `authMiddleware` / `hasAuthMiddleware` | **No twin** for that on SPA navigations. Re-home to a Worker API, or accept client-only middleware that cannot set `Set-Cookie` on a document you already have |

v8 in this repo: middleware is on; no `future.v8_middleware` in `react-router.config.ts`. Older docs still show `future.v8_middleware` on `createBrowserRouter`. **Inference, not specified for 8.3.1 data mode:** confirm whether data routers still need that flag; framework v8 does not.

`host-layout` empty loader exists **only** to force `.data` so server auth middleware runs on client navigations. That requirement disappears only if auth moves to client middleware (weaker: no HTTP `Response`) or every navigation hits a custom server.

---

## 7. `shouldRevalidate` default differs

Framework route-module docs:

> In framework mode with SSR, route loaders are automatically revalidated after all navigations and form submissions (**this is different from Data Mode**). This enables middleware and loaders to share a request context…

[Route Module `shouldRevalidate`](https://reactrouter.com/start/framework/route-module)

Data route-object docs: default is narrower (own params change, any search-param change, successful action). [Route Object `shouldRevalidate`](https://reactrouter.com/start/data/route-object) (“Please note the default behavior is different in Framework Mode.”)

This app is `ssr: true`. Only `host-vans` opts out (skip reload after optimistic create). After cutover, **do not assume** dashboard / lists stay fresh after mutations without explicit `shouldRevalidate` (or the reverse: more revalidation than you want).

Framework SPA mode (`ssr: false`): `shouldRevalidate` “behaves the same as it does in Data Mode.” Not this app.

---

## 8. SSR: document + streaming vs `entry.server`

### Framework (today)

1. Worker `fetch` → `createRequestHandler(serverBuild)` → loaders/actions/middleware → `entry.server` `handleRequest`.
2. You render `<ServerRouter context={routerContext} url={request.url} />` with `renderToReadableStream`.
3. Bots / `isSpaMode`: `await body.allReady`.
4. Client: `hydrateRoot(<HydratedRouter />)` — router + hydration payload are compiler-owned.
5. After hydration, navigations use **`.data`** (single-fetch). Optional `handleDataRequest` in `entry.server` (unused here).

Cloudflare **must** ship `entry.server.tsx`; Node can use the default. [entry.server.tsx](https://reactrouter.com/api/framework-conventions/entry.server.tsx)

### Data mode (official custom)

1. Worker `fetch` → `createStaticHandler(routes).query(request)` (redirects/`Response` from loaders returned raw).
2. `createStaticRouter(dataRoutes, context)` → `renderToString(<StaticRouterProvider router={router} context={context} />)`.
3. You concatenate `<!DOCTYPE html>` and merge leaf loader/action headers. [start/data/custom](https://reactrouter.com/start/data/custom)
4. `StaticRouterProvider` embeds `window.__staticRouterHydrationData` (optional `nonce`).
5. Client: `createBrowserRouter(routes, { hydrationData: window.__staticRouterHydrationData })` + `<RouterProvider>`.

**Streaming:** official custom guide uses `renderToString`, not `renderToReadableStream`. **Inference, not specified:** wrapping `<StaticRouterProvider>` in `renderToReadableStream` + an `isbot` `allReady` wait is application code; framework `entry.server.tsx` is not reused.

**Single-fetch after first paint:** **not specified** for data mode. Custom client example uses `loader: ({ request, params }) => fetch(\`/api/show/${params.showId}.json\`)` on the **browser** route object and `db.loadShow` on a **separate** server route object. [start/data/custom](https://reactrouter.com/start/data/custom)

**Inference, not specified:** a Worker that re-runs `query()` for every client navigation is you reimplementing framework `.data`, not a documented data-mode feature.

---

## 9. Config / bootstrap delta

| Area | Framework (today) | Data mode |
|------|-------------------|-----------|
| Dev | `varlock run -- react-router dev` | `vite` (plus Cloudflare Vite plugin). Plugin swap: drop `reactRouter()`, use `react()` + existing babel React Compiler preset |
| Build | `react-router build` → `build/client` + server graph | `vite build` client + SSR environments **you** define. `wrangler` `assets.directory` still points at the client out dir |
| Types | `react-router typegen` then `tsc` | Remove typegen; drop `.react-router/types` from `tsconfig` |
| Vite plugin | `reactRouter()` | `@vitejs/plugin-react`. JSX/HMR ownership moves. Combo with `@cloudflare/vite-plugin` / varlock **not specified** for data-mode RR (works today with `reactRouter()`) |
| `react-router.config.ts` | `ssr: true`, `unstable_optimizeDeps` | Delete |
| Client entry | `entry.client.tsx` + `HydratedRouter` | `index.html` → `main.tsx`: `createBrowserRouter` + `RouterProvider` + `hydrationData` |
| Server entry | `entry.server.tsx` + `ServerRouter` (called **by** the handler) | Worker **is** the renderer: `query` + `StaticRouterProvider` |
| Worker | `createRequestHandler(virtual:react-router/server-build)` | Import `RouteObject[]`, `createStaticHandler`, seed `RouterContextProvider`, call `query` |
| Document | `Layout` + `<Links/>` `<Scripts/>` | `index.html` + Vite client, **or** SSR HTML string. Move Panda CSS / fonts / favicon yourself (`Layout` currently owns those) |
| Routes | file refs in `routes.ts` | one `RouteObject[]` (or `lazy: { loader, Component, ErrorBoundary, … }`) |
| `.server.ts` modules | framework plugin keeps them off the client | You enforce the split (Vite `server-only` / import graph) or D1 leaks into the browser bundle |
| Wrangler | `main: workers/app.ts` | Same file, different `fetch` body. `not_found_handling: "single-page-application"` is a wrangler/assets choice, not an RR mode flag. Octane-native path wants that changed — see octane note, not this one |
| Cloudflare adapter package | unused | Still unused. Data mode has **no** official Cloudflare page beyond “write a `fetch` that uses web `Request`” |
| `href` call sites | generated | `generatePath` / constants |
| Scripts | drop `react-router` CLI | `vite`, `vite build`, `tsc` |

---

## 10. Mapping: high-touch files

| Path | Cutover |
|------|---------|
| `app/routes.ts` | Rewrite as `RouteObject[]` (`Component`, `loader`, `action`, `middleware`, `ErrorBoundary`, `shouldRevalidate`, `children`). Pathless parents = current `layout()`. Path-only parents = current `prefix()`. |
| Every `app/routes/**/*.tsx` | Drop `./+types`. Move named exports onto the route object (or `lazy`). Default export: `useLoaderData()` instead of `Route.ComponentProps`. |
| Resource routes (`robots.txt.ts`, `sitemap.xml.ts`, `api/auth.ts`) | Keep loaders that return `Response`. Register as routes without `Component`. Worker must not wrap those `query()` Results in HTML. |
| `app/root.tsx` | Split shell vs `NuqsAdapter`+`Outlet`. Drop `Layout` / `Links` / `Scripts`. Keep `ScrollRestoration` inside the tree. |
| `app/entry.client.tsx` / `entry.server.tsx` | Replace as §8. |
| `workers/app.ts` | Replace `createRequestHandler`. Keep `createDb` + context set. Decide: document-only SSR vs also handling a homemade data protocol. |
| `vite.config.ts` | Drop `reactRouter()`. |
| `react-router.config.ts` | Delete. |
| `tsconfig.json` | Remove `.react-router/types` `rootDirs` / include. |
| `package.json` | Drop `@react-router/dev`; scripts off the `react-router` CLI. |
| `app/features/middleware/**` | Keep `createContext` helpers. Re-home arrays onto route objects. Re-decide server vs client (auth-on-Worker vs client-only). |
| `app/constants/cache-headers.ts` `forwardDataHeaders` | Replace with Worker header merge from `StaticHandlerContext`. |
| All `href(` | `generatePath` or constants. |
| `CustomLink` `prefetch="intent"` | Remove or no-op; no framework prefetch. |
| `app/lib/search-params.server.ts` | Keep next to **server** loaders only. |

---

## 11. What data-mode docs say is different or unsupported

| Topic | Official statement | This app |
|-------|--------------------|----------|
| Single-fetch / `.data` | Framework `handleDataRequest` + middleware “`.data` requests”. Data custom: per-navigation `fetch` in browser loaders | Host auth + D1 loaders **depend** on Worker re-entry |
| Fog of war | Data: `patchRoutesOnNavigation` on `createBrowserRouter`. Framework `Link discover` is `[modes: framework]` | Unused (`discover` never set). Prefetch **is** used |
| Middleware location | Server middleware documented as framework document + `.data`. Data quick start is client middleware + optional `getContext` | Server middleware is load-bearing |
| Context typing | Both: `createContext` + `RouterContextProvider`. Framework also generates `Route.LoaderArgs` | Heavy `context.get(dbContext)` / auth |
| `shouldRevalidate` | Defaults differ framework-SSR vs data | One explicit function (`host-vans`) |
| `headers()` | Framework-only how-to | `forwardDataHeaders` everywhere public/host |
| Cloudflare | Adapter examples are `createRequestHandler` + `virtual:react-router/server-build` (**framework compiler**) | Same pattern, no `@react-router/cloudflare` package |
| SPA / prerender flags | `react-router.config.ts` only | `ssr: true`; prerender unused |
| Streaming HTML | Framework `entry.server` + `ServerRouter` | Custom data guide shows `renderToString` only |
| Type-safe `href` / Route modules | Framework-only | Pervasive |
| Official migrate **down** | **Not specified** | Invert [upgrading/router-provider](https://reactrouter.com/upgrading/router-provider) |

---

## 12. Open questions (inference vs specified)

| Topic | Specified | Inference, not specified |
|-------|-----------|--------------------------|
| Framework-only table (`Links` / `Scripts` / `ServerRouter` / `href`) | [start/modes](https://reactrouter.com/start/modes) | — |
| `Link prefetch` / `discover` | `[modes: framework]` | — |
| Data SSR handler | `createStaticHandler` + `StaticRouterProvider` + `renderToString` | Streaming + bot `allReady` copied from current `entry.server.tsx` by hand |
| Same file as SSR loader and client loader | Custom guide shows **fetch** on client, **db** on server | Split every D1 loader; `.server.ts` no longer compiler-enforced |
| Server middleware on SPA navigations | Framework `.data` | Data mode does not recreate that unless you add a server |
| `headers()` | Framework route module | Manual `loaderHeaders` merge is the documented stand-in |
| `createRequestHandler` mode tag | Adapters + virtual `ServerBuild` only | Treat as framework-only; data custom never names it |
| `reactRouter()` + React Compiler | This repo's pattern | Data: `react()` + same babel preset |
| nuqs v8 adapter + `RouterProvider` | Adapter exists | Not certified vs `HydratedRouter` |
| `future.v8_middleware` on data routers in 8.3.1 | v7-era snippets still show the flag; this app's framework v8 does not | Confirm against 8.3.1 `createBrowserRouter` types |
| Worker `query()` for every client nav | Not in data docs | That would be a private single-fetch |

---

## Sources (primary)

- https://reactrouter.com/start/modes
- https://reactrouter.com/start/data/installation
- https://reactrouter.com/start/data/custom
- https://reactrouter.com/start/data/routing
- https://reactrouter.com/start/data/route-object
- https://reactrouter.com/start/data/data-loading
- https://reactrouter.com/start/framework/route-module
- https://reactrouter.com/start/framework/rendering
- https://reactrouter.com/explanation/type-safety
- https://reactrouter.com/how-to/middleware
- https://reactrouter.com/how-to/headers
- https://reactrouter.com/how-to/data-strategy
- https://reactrouter.com/api/framework-conventions/root.tsx
- https://reactrouter.com/api/framework-conventions/entry.server.tsx
- https://reactrouter.com/api/framework-routers/HydratedRouter
- https://reactrouter.com/api/framework-routers/ServerRouter
- https://reactrouter.com/api/utils/href
- https://reactrouter.com/api/utils/generatePath
- https://reactrouter.com/api/components/Link
- https://reactrouter.com/api/data-routers/createBrowserRouter
- https://reactrouter.com/api/data-routers/createStaticHandler
- https://reactrouter.com/api/data-routers/StaticRouterProvider
- https://reactrouter.com/api/other-api/adapter
- https://reactrouter.com/upgrading/router-provider
- https://reactrouter.com/upgrading/future
- This repo: `app/root.tsx`, `app/routes.ts`, `app/entry.client.tsx`, `app/entry.server.tsx`, `workers/app.ts`, `vite.config.ts`, `react-router.config.ts`, `package.json`, `tsconfig.json`, `wrangler.jsonc`, `docs/octane-compatibility.md`, `docs/react-router-audit.md`
