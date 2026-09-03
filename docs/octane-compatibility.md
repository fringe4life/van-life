# OctaneJS compatibility with van-life

**Date:** 2026-09-02

**Question:** Does this project still have any remaining **hard block** on adopting [OctaneJS](https://octanejs.dev/)? Distinguish hard block (documented unsupported / throwing stubs / explicit non-goal), soft friction (alpha/beta, missing adapter, extra work, islands-only), and unblocked / officially supported. Cover two adoption paths: (1) full Octane rewrite that drops React Router framework mode; (2) Octane islands / `OctaneCompat` while keeping the current host stack. Re-verify GitHub issue [#115](https://github.com/fringe4life/van-life/issues/115) against current primary sources.

**Method:** Primary sources only: [octanejs.dev](https://octanejs.dev/) official docs and [llms.txt](https://octanejs.dev/llms.txt); [octanejs/octane](https://github.com/octanejs/octane) (`docs/bindings-status.md`, package READMEs, adapter/remix-router source, PR #199); [nuqs docs](https://nuqs.47ng.com/) and [47ng/nuqs](https://github.com/47ng/nuqs); [TanStack Charts docs](https://tanstack.com/charts/latest) and [TanStack/charts](https://github.com/TanStack/charts); React Router docs for what framework mode actually requires. No blogs, tweets, or SEO roundups. Gaps labeled **inference, not specified**.

**Van Life (this repo)** — facts from source, not from Octane:

- React Router **8.3.1 framework mode**: `@react-router/dev`, `app/routes.ts`, loaders/actions, `reactRouter()` Vite plugin, Worker `createRequestHandler` over `virtual:react-router/server-build` (`workers/app.ts`).
- Root `Layout` renders `<Links />` and `<Scripts />` (`app/root.tsx`).
- Cloudflare Workers: `@cloudflare/vite-plugin` via `@varlock/cloudflare-integration`, `wrangler.jsonc` with D1, `assets.not_found_handling: "single-page-application"`.
- Vite 8.2.2 (rolldown), `@rolldown/plugin-babel` + `babel-plugin-react-compiler` / `reactCompilerPreset`.
- React `19.3.0-canary-eb8feb71-20260814`.
- nuqs 2.10.1 with `NuqsAdapter` from `nuqs/adapters/react-router/v8`, client `useQueryStates`, `nuqs/server` serializers/loaders.
- `@tanstack/charts` 0.16.0 via `@tanstack/charts/react` (not recharts).
- Panda CSS 2.0.0-beta (`css()` / `cx()` class strings; no `@base-ui/react`, no Radix).
- better-auth 1.7.2 (`better-auth/minimal` + `auth.handler(request)` + drizzle D1 adapter). No `better-auth/react` client in this tree.
- Bun, varlock.

Status labels used below:

| Label | Meaning |
|-------|---------|
| **Hard block** | Documented unsupported, throwing stub, or explicit non-goal |
| **Soft friction** | Alpha/beta, missing adapter, extra work, islands-only, version pin, unspecified combo |
| **Unblocked** | Officially documented supported path |

---

## 1. Verdict

**One remaining hard block, and it is still React Router v8 framework mode as the Octane host.** `@octanejs/remix-router` permanently out-of-scopes framework mode. `Meta`, `Links`, `Scripts`, `PrefetchPageLinks`, `ServerRouter`, and `createRequestHandler` are throwing stubs. That is an explicit non-goal, not a missing adapter. This app's Worker and root document **are** that surface (`workers/app.ts`, `app/root.tsx`). Keeping framework mode **and** making Octane own routing/SSR is still impossible.

**Islands (`OctaneCompat`, keep current host):** no documented hard block. Official React 19 host path. Soft: mixed toolchain example uses `@vitejs/plugin-react`'s `react()`, not `reactRouter()`; TypeScript 7 editor plugin gap; dual compilers; Octane islands cannot hoist `<title>`/`<meta>`/`<link>` during React SSR.

**Data-mode / Octane-native cutover (drop `@react-router/dev`):** no remaining hard block of the stub/non-goal kind. Cloudflare Workers + Vite + Static Assets are documented for **Octane-native** apps via `@octanejs/adapter-cloudflare`. TanStack Charts has an official Octane adapter at the same 0.16.0 line this repo already uses. nuqs, Panda, better-auth server, Drizzle D1, and React Compiler are not hard blocks. Remaining work is a rewrite plus missing Octane nuqs react-router adapters, a different Cloudflare Vite pipeline than varlock's, and a required wrangler `not_found_handling` change.

Owner notes after issue 115 (nuqs compiler, Cloudflare, TanStack Charts): Cloudflare and TanStack Charts **are** now first-party supported on the Octane-native path. A product named “nuqs compiler” was **not found** in nuqs docs or the 47ng/nuqs tree. Closest specified items: nuqs 2.10 SPA `serverSearch` islands, and Octane's own compiler-slotted `@octanejs/nuqs` port of nuqs 2.9.1.

---

## 2. Dependency × path × status

| Dependency | Islands (keep RR framework) | Full rewrite / data-mode | Evidence |
|------------|----------------------------|--------------------------|----------|
| React Router v8 **framework** (`@react-router/dev`, `createRequestHandler`, `Meta`/`Links`/`Scripts`) | Host stays React. Octane is a child island. **Unblocked** as host. | **Hard block** if you try to keep framework mode. Drop it, then data-mode is **Unblocked** (pinned 8.2.0). | [framework-stubs.ts](https://github.com/octanejs/octane/blob/main/packages/remix-router/src/lib/framework-stubs.ts), [remix-router README](https://github.com/octanejs/octane/blob/main/packages/remix-router/README.md), [port plan §1](https://github.com/octanejs/octane/blob/main/docs/remix-router-port-plan.md), [bindings-status](https://github.com/octanejs/octane/blob/main/docs/bindings-status.md) |
| React Router v8 **data/library** (`createBrowserRouter`, loaders/actions, `Form`, static SSR) | N/A (host is framework). | **Unblocked** via `@octanejs/remix-router` (soft: pin 8.2.0 vs this repo 8.3.1; bounded tests). | [remix-router README](https://github.com/octanejs/octane/blob/main/packages/remix-router/README.md), [RR data mode install](https://reactrouter.com/start/data/installation) |
| Octane Vite plugin | **Soft friction**: official mixed example is `octane({ requireDirective: true })` + `react()`, **not** `reactRouter()`. Combo unspecified. | **Unblocked**. Peer `vite: ^8.0.16`. | [react-compat toolchain](https://octanejs.dev/docs/react-compat), [build tools](https://octanejs.dev/docs/build-tools), [vite-plugin package.json](https://github.com/octanejs/octane/blob/main/packages/vite-plugin-octane/package.json) |
| Cloudflare Workers + Static Assets | Keep current `@cloudflare/vite-plugin` / varlock. **Unblocked** for the React host. | **Unblocked** for Octane-native apps via `@octanejs/adapter-cloudflare`. **Soft**: not documented with varlock / `@cloudflare/vite-plugin`. Must **not** use SPA `not_found_handling`. | [adapter README](https://github.com/octanejs/octane/blob/main/packages/adapter-cloudflare/README.md), [PR #199](https://github.com/octanejs/octane/pull/199), [build tools Cloudflare](https://octanejs.dev/docs/build-tools), [docs/ssr.md](https://github.com/octanejs/octane/blob/main/docs/ssr.md) |
| D1 | Unchanged (Worker `env.DB`). **Unblocked**. | **Unblocked** as a wrangler binding on `context.platform.env`. D1 not named in Octane docs. **Inference:** any `env` binding, including D1, is in scope of the platform object. | [adapter README `CloudflarePlatform`](https://github.com/octanejs/octane/blob/main/packages/adapter-cloudflare/README.md) |
| Vite 8 / rolldown | Same as host. | **Unblocked** (`vite ^8.0.16` peer). Rolldown-specific incompatibility **not specified**. | [vite-plugin package.json](https://github.com/octanejs/octane/blob/main/packages/vite-plugin-octane/package.json), [browser support / Vite 8 target](https://octanejs.dev/llms.txt) |
| React 19 canary | `OctaneCompat` supports React 19. **Soft**: canary vs “19.2+” for `ReactCompat` not specified. | Same. Native Octane does not run React. | [react-compat](https://octanejs.dev/docs/react-compat) |
| React Compiler | Stays on React files. Octane files use Octane compiler. **Unblocked** coexistence at ownership split. | Octane replaces that model for Octane components. Not a block. | [build tools mixed toolchains](https://octanejs.dev/docs/build-tools), [differences from React / Strong](https://octanejs.dev/docs/differences-from-react) |
| nuqs runtime adapters | Keep `nuqs/adapters/react-router/v8`. **Unblocked**. | Octane binding ships **react / custom / testing only**. **Soft friction**, not a stub-throw hard block. Workarounds specified. | [nuqs adapters](https://nuqs.47ng.com/docs/adapters), [@octanejs/nuqs README](https://github.com/octanejs/octane/blob/main/packages/nuqs/README.md), [bindings-status nuqs](https://github.com/octanejs/octane/blob/main/docs/bindings-status.md) |
| “nuqs compiler” | **Not found** as a nuqs product. | Same. | Search of [nuqs docs](https://nuqs.47ng.com/docs), README, v2.10.0/v2.10.1 releases; GitHub code search on 47ng/nuqs for `compiler` returned no matching source |
| TanStack Charts 0.16.0 | Keep `@tanstack/charts/react`. **Unblocked**. | **Unblocked**: `@tanstack/charts/octane` / `@tanstack/octane-charts@0.16.0`, SSR documented. | [Octane adapter](https://tanstack.com/charts/latest/docs/framework/octane/adapter), [SSR guide](https://tanstack.com/charts/latest/docs/guides/ssr-and-hydration) |
| Panda CSS | Class-string CSS. **Unblocked** / orthogonal. No Octane binding. | Same. | [bindings directory](https://octanejs.dev/docs/bindings) (no Panda package), this repo `panda.config.ts` + `styled-system/css` |
| better-auth + Drizzle D1 | Server Fetch handler already. **Unblocked**. | Client binding exists (`@octanejs/better-auth`); server stays `auth.handler(request)`. **Soft**: binding pins better-auth 1.6.29 vs this repo 1.7.2. This app has no `better-auth/react` client. | [better-auth README](https://github.com/octanejs/octane/blob/main/packages/better-auth/README.md), [bindings-status](https://github.com/octanejs/octane/blob/main/docs/bindings-status.md), `app/lib/auth.server.ts` |
| Base UI / current UI kit | This repo does **not** depend on `@base-ui/react`. Native HTML + Panda variants. **Unblocked**. | `@octanejs/base-ui` exists (alpha, 35/43 subpaths) if needed later. **Soft**, not required today. | this repo `package.json` / `app/components/ui`; [base-ui README](https://github.com/octanejs/octane/blob/main/packages/base-ui/README.md) |
| Octane maturity | Alpha/beta. **Soft**. | Same. | [llms.txt “alpha”](https://octanejs.dev/llms.txt) vs [bindings “beta”](https://octanejs.dev/docs/bindings) |
| TypeScript 7 | **Soft**: Octane `.tsrx` editor plugin “unavailable in TS 7 previews”. This repo uses TypeScript 7.0.2. | Same. | [react-compat editor](https://octanejs.dev/docs/react-compat) |
| Bun / varlock | Keep current. Unspecified vs Octane. **Soft** / orthogonal. | Octane docs show pnpm + wrangler after `vite build`. varlock composition **not specified**. | [adapter README](https://github.com/octanejs/octane/blob/main/packages/adapter-cloudflare/README.md) |

---

## 3. React Router v8 framework mode — still a hard block for full Octane?

**Yes.** Unchanged since issue 115.

`@octanejs/remix-router` ports `react-router@8.2.0`. The port plan states, as policy:

> Out of scope permanently: framework mode (`lib/dom/ssr/*` — needs `@react-router/dev`), RSC (`lib/rsc/*`). Final-phase policy: framework client APIs (Meta/Links/Scripts/…) become throwing stubs so export parity can reach empty honestly; the server runtime (cookies/sessions/createRequestHandler — pure Node code) is re-exported from a vendored tree in its own phase.

Later the same document **corrects** `createRequestHandler`: it is **not** vendored, because it is framework-mode (consumes a `@react-router/dev` `ServerBuild` and the single-fetch / turbo-stream / entry graph). It ships as a throwing stub with Meta/Links/Scripts/PrefetchPageLinks/ServerRouter/createRoutesStub.

Source: [docs/remix-router-port-plan.md](https://github.com/octanejs/octane/blob/main/docs/remix-router-port-plan.md) §1 and “Final phase”.

Current stub module ([`packages/remix-router/src/lib/framework-stubs.ts`](https://github.com/octanejs/octane/blob/main/packages/remix-router/src/lib/framework-stubs.ts), fetched 2026-09-02):

```ts
function frameworkStub(name: string): never {
  throw new Error(
    `${name} is part of react-router's FRAMEWORK mode (it requires the ` +
      `@react-router/dev compiler/runtime), which @octanejs/remix-router does ` +
      `not support. Library mode (data routers, declarative routers, Form/` +
      `fetchers, static SSR) is fully supported — see ` +
      `docs/remix-router-port-plan.md for the scope policy.`,
  );
}

export function Meta(): never { frameworkStub(' '); }
export function Links(): never { frameworkStub(' '); }
export function Scripts(): never { frameworkStub(' '); }
export function createRequestHandler(): never { frameworkStub('createRequestHandler'); }
```

Package README repeats: “Framework mode (`Meta`/`Links`/`Scripts`, `createRequestHandler`) and RSC are permanently out of scope.” [remix-router README](https://github.com/octanejs/octane/blob/main/packages/remix-router/README.md)

`bindings-status.md` (generated, last checked 2026-08-02 for this row): “Framework-mode and RSC names remain throwing scope stubs.” [bindings-status `#octanejsremix-router`](https://github.com/octanejs/octane/blob/main/docs/bindings-status.md)

### What framework mode actually requires (React Router docs)

This app uses those APIs:

- Route modules from `routes.ts` (`@react-router/dev/routes`) with loaders/actions, `links`, `meta`, ErrorBoundary. [Route Module](https://reactrouter.com/start/framework/route-module)
- Aggregated `<Links />` in the document head; `<Scripts />` in the body. Same page.
- Cloudflare Worker entry calls `createRequestHandler(() => import("virtual:react-router/server-build"), …)` (`workers/app.ts`). Framework server rendering uses `ServerRouter` in `entry.server.tsx`. [entry.server.tsx](https://reactrouter.com/api/framework-conventions/entry.server.tsx)
- Vite plugin `reactRouter()` from `@react-router/dev/vite` (`vite.config.ts`).

Those are the exact names the Octane port stubs. **Hard block for path (c): keep framework mode as Octane's router/SSR.**

Framework integrations listed on octanejs.dev are only Astro, Docusaurus, and TanStack Start. React Router is a **library binding**, not a framework integration. [framework-integrations](https://octanejs.dev/docs/framework-integrations), [bindings](https://octanejs.dev/docs/bindings)

---

## 4. If the project moved to RR data mode + remix-router + adapter-cloudflare, what is still unsupported?

Dropping `@react-router/dev` / framework mode is the **documented** cutover. Data mode on React Router is `createBrowserRouter` + `RouterProvider`, no `@react-router/dev` compiler. [Data mode installation](https://reactrouter.com/start/data/installation)

`@octanejs/remix-router` ships that surface: data/declarative/DOM/mutations/guards/scroll/static SSR/cookies/sessions. README: “The port is complete — full export parity” for library mode. [remix-router README](https://github.com/octanejs/octane/blob/main/packages/remix-router/README.md)

Still unsupported or extra work on that path:

| Item | Kind | Specified? |
|------|------|------------|
| Framework document APIs (`Meta`/`Links`/`Scripts`), `createRequestHandler`, fog-of-war, turbo-stream single fetch, RSC | **Hard** (out of scope) | Yes — stubs + port plan |
| `@react-router/dev` `routes.ts` / `+types` / `reactRouter()` Vite plugin | Goes away with the cutover | RR framework docs |
| remix-router pin **8.2.0** vs this repo **8.3.1** | **Soft** version drift | [bindings-status](https://github.com/octanejs/octane/blob/main/docs/bindings-status.md) |
| Bounded evidence (nine client + five SSR differential cases), not exhaustive React parity | **Soft** | bindings-status |
| Block-children `<Routes>` SSR (collector is client-only); use route objects | **Soft** documented divergence | bindings-status SSR note |
| nuqs `adapters/react-router` on Octane | **Soft** missing; custom or SPA adapter specified | [@octanejs/nuqs](https://github.com/octanejs/octane/blob/main/packages/nuqs/README.md) |
| Cloudflare via **Octane's** Vite plugin + `adapter: cloudflare()`, not `@cloudflare/vite-plugin` / varlock | **Soft** pipeline swap; composition **not specified** | [adapter README](https://github.com/octanejs/octane/blob/main/packages/adapter-cloudflare/README.md) |
| `assets.not_found_handling: "single-page-application"` | **Must change** for Octane SSR (this repo currently sets it) | adapter README / [build tools](https://octanejs.dev/docs/build-tools) |
| Octane-native alternative: drop RR entirely, use `RenderRoute` / `ServerRoute` in `octane.config.ts` | **Unblocked** Octane-native routing | [build tools full app config](https://octanejs.dev/docs/build-tools) |

**Inference, not specified:** whether remix-router data-mode + adapter-cloudflare in one app is a tested combo. Docs describe (a) remix-router as an Octane library binding and (b) adapter-cloudflare as the deploy adapter for Octane full-app Vite/Rsbuild builds. Wiring `createBrowserRouter` loaders to `context.platform.env.DB` is application work, not a documented template.

---

## 5. nuqs: compiler vs runtime adapter

### Runtime adapters (specified)

Upstream nuqs 2 documents React adapters, including **React Router v8**: `nuqs/adapters/react-router/v8`. This app already uses that in `app/root.tsx`. [nuqs adapters](https://nuqs.47ng.com/docs/adapters)

`@octanejs/nuqs` (0.1.41) ports **nuqs@2.9.1** (this repo is on **2.10.1**). Shipped adapters:

- `@octanejs/nuqs/adapters/react`
- `@octanejs/nuqs/adapters/custom` (`unstable_createAdapterProvider`)
- `@octanejs/nuqs/adapters/testing`

Explicit divergence:

> Router adapters for other React routers are not shipped: `nuqs/adapters/next`, `/adapters/remix`, `/adapters/react-router`, and `/adapters/tanstack-router` each bind a React router that would need its own octane port. Use `/adapters/react`, or `/adapters/custom` to wire your router.

[packages/nuqs/README.md](https://github.com/octanejs/octane/blob/main/packages/nuqs/README.md), [bindings-status](https://github.com/octanejs/octane/blob/main/docs/bindings-status.md)

`createSearchParamsCache` is also unported (needs React `cache()` / RSC). This app uses `createLoader` / `createSerializer` from `nuqs/server`, which **are** on the Octane server entry.

Does the Octane nuqs binding cover the react-router adapter? **No.** Specified workaround: SPA adapter or custom adapter over remix-router's `useNavigate` / history.

Islands path: keep upstream `nuqs` + v8 adapter on the React host. Octane islands that call `@octanejs/nuqs` would not see the React Router adapter unless a custom Octane adapter is written. **Inference:** leave URL state on the React side for islands.

### “nuqs compiler”

**Not found** in:

- [nuqs.47ng.com/docs](https://nuqs.47ng.com/docs) and adapters page
- 47ng/nuqs README (fetched)
- [v2.10.0](https://github.com/47ng/nuqs/releases/tag/v2.10.0) (`serverSearch` on the React SPA adapter for SSR islands)
- [v2.10.1](https://github.com/47ng/nuqs/releases/tag/v2.10.1)
- GitHub code search on 47ng/nuqs for `compiler` (no matching source files)

Closest specified features that might have been meant:

1. **nuqs 2.10 SPA islands:** `NuqsAdapter` `serverSearch` for Astro / Fastify / Hono-style SSR islands. Docs: “Supported only in React SPA. Not supported in … React Router (v8)”. [adapters](https://nuqs.47ng.com/docs/adapters)
2. **Octane compiler slotting** of `@octanejs/nuqs` hooks (compiler-injected call-site Symbols). That is Octane's compiler, not a nuqs compiler. [nuqs README “How it works”](https://github.com/octanejs/octane/blob/main/packages/nuqs/README.md)
3. **React Compiler** used *inside* the nuqs repo's own Next.js e2e (historical PRs). That does not add an Octane adapter.

**Inference, not specified:** owner note “nuqs now has a compiler” does not match a published nuqs compiler product as of this fetch. It does **not** add `adapters/react-router` to `@octanejs/nuqs`.

---

## 6. TanStack Charts: official Octane support?

**Yes.** First-party adapter, not an Octane org binding.

- Docs: [`@tanstack/charts/octane`](https://tanstack.com/charts/latest/docs/framework/octane/adapter) — “native TSRX lifecycle and SSR adapter around `@tanstack/charts`”.
- Package: `@tanstack/octane-charts` **0.16.0** (same major/minor/patch as this repo's `@tanstack/charts` 0.16.0). Peer `octane: ^0.1.13`. [package.json](https://github.com/TanStack/charts/blob/main/packages/octane-charts/package.json)
- Also listed under rendering exports: `Chart` from `@tanstack/charts/octane`, canvas at `/octane/canvas`. [Rendering and export](https://tanstack.com/charts/latest/docs/reference/rendering-and-export)

**SSR:** Octane row in the official SSR table: server output “SVG, Canvas, or mixed shell”; browser “Hydrates and adopts the existing surface”. Canvas Octane entry renders a deterministic shell, no server pixels. [SSR and Hydration](https://tanstack.com/charts/latest/docs/guides/ssr-and-hydration)

This app currently imports `Chart` from `@tanstack/charts/react` (`app/features/host/components/bar-chart/bar-chart.tsx`). Full rewrite would switch the import to `/octane`. Islands can keep the React adapter inside React, or wrap an Octane `Chart` in `OctaneCompat`.

Issue 115's recharts row is **stale**: this repo no longer uses recharts. `@octanejs/recharts` still exists and still records SSR as “Untested; text measurement returns 0×0”. Irrelevant to current charts code.

---

## 7. Cloudflare Workers + Vite + D1 + Static Assets

### Octane-native apps — documented

`@octanejs/adapter-cloudflare` (inventory version `0.0.42`) is the official deploy adapter. Merged [PR #199](https://github.com/octanejs/octane/pull/199) (2026-07-20). Configure `adapter: cloudflare()` in `octane.config.ts`. Build emits `dist/server/worker.js`. User-owned `wrangler.jsonc` points `main` at that file and `assets.directory` at `./dist/client`. [adapter README](https://github.com/octanejs/octane/blob/main/packages/adapter-cloudflare/README.md), [build tools](https://octanejs.dev/docs/build-tools), [docs/ssr.md](https://github.com/octanejs/octane/blob/main/docs/ssr.md)

Specified wrangler constraints:

- `compatibility_flags: ["nodejs_compat"]` required (SHA-256 + `AsyncLocalStorage`).
- Leave `assets.not_found_handling` unset or `"none"`. Both `"single-page-application"` and `"404-page"` “can prevent navigation misses from reaching Octane SSR”.
- Cloudflare `{ env, ctx }` forwarded as `context.platform` to middleware and `ServerRoute` handlers.

This repo's `wrangler.jsonc` currently sets `"not_found_handling": "single-page-application"` and `main: "./workers/app.ts"`. Full Octane SSR would need those changed. That is a **config conflict**, not a missing adapter.

**D1:** not named in the adapter README. Bindings are generic `platform.env`. **Inference, not specified:** a `d1_databases` binding in wrangler is available as `env.DB` the same way KV is in the README example (`platform.env.MY_KV`). Drizzle talking to D1 is application code, orthogonal to Octane.

### varlock / `@cloudflare/vite-plugin`

Octane docs describe **Octane's** Vite plugin (`@octanejs/vite-plugin`, peer `vite ^8.0.16`) plus the Cloudflare **deploy** adapter. They do not document composing `@cloudflare/vite-plugin` or `@varlock/cloudflare-integration`.

**Specified:** Octane-native production path is `vite build` then `wrangler dev` / `wrangler deploy` on Octane output.

**Not specified:** using `varlockCloudflareVitePlugin({ viteEnvironment: { name: "ssr" } })` together with `octane()`. Full rewrite should treat the current Cloudflare Vite integration as **replaced**, not reused. Islands keep it.

---

## 8. React Compiler + Octane coexistence

Octane is not React Compiler. It is a separate runtime that compiles `.tsrx` / opted-in `.tsx` to direct DOM writes (no virtual DOM). [octanejs.dev](https://octanejs.dev/), [llms.txt](https://octanejs.dev/llms.txt)

Official mixed toolchain: `requireDirective: true` so Octane owns `.tsrx` and pragma-marked files; everything else stays with the host compiler. Example plugins: `octane({ requireDirective: true })` and `react()` from `@vitejs/plugin-react`. [build tools — Mixed toolchains](https://octanejs.dev/docs/build-tools), [react-compat](https://octanejs.dev/docs/react-compat)

**Islands:** React Compiler can keep compiling React modules (`babel-plugin-react-compiler` as this repo already does). Octane modules use Octane's compiler. File-ownership split is the specified coexistence model. **Unblocked** at the docs level.

**Full rewrite:** Octane components do not go through React Compiler. Octane Strong mode is a different opt-in purity/memo contract. Docs mention React Compiler only as **comparison evidence**, not a control Octane honors. [differences from React](https://octanejs.dev/docs/differences-from-react)

**Soft / unspecified:** this repo uses `reactRouter()` for JSX/HMR, not `react()`. Official mixed example does not show `reactRouter()` + `octane()`. Whether `requireDirective` is enough to keep `@react-router/dev` from compiling `.tsrx` is **inference, not specified**.

---

## 9. Panda CSS, better-auth, Drizzle D1

**Panda CSS:** no `@octanejs/panda` (or similar) in the [bindings directory](https://octanejs.dev/docs/bindings) or [package inventory](https://github.com/octanejs/octane/blob/main/docs/packages.md). This app uses Panda as a **codegen** CSS pipeline (`css` / `cx` class strings on native DOM). That is renderer-agnostic class names.

**Inference, not specified:** generated CSS keeps working on Octane `class` / `className`. Not a hard block. Soft: Panda jsx/styled-runtime recipes, if introduced later, would need a binding; this repo does not use that.

**better-auth:** Octane binding `@octanejs/better-auth` reuses the vanilla client and maps Nanostores to Octane hooks. Server remains `auth.handler(request)` (Fetch). React-framework helpers such as `better-auth/tanstack-start` are not re-exported. [better-auth README](https://github.com/octanejs/octane/blob/main/packages/better-auth/README.md)

This app already uses the Fetch handler (`app/routes/api/auth.ts` → `auth.handler(request)`) and `better-auth/minimal` on the server. No `better-auth/react` client usage found. **Orthogonal** today. Binding version pin (upstream 1.6.29 vs repo 1.7.2) is soft if a client port is added later.

**Drizzle + D1:** no Octane UI binding required. Server ORM. **Orthogonal.** Worker must still expose the D1 binding (wrangler), which adapter-cloudflare's `env` forwarding covers at the platform level (**inference** that D1 is “just env”).

---

## 10. Base UI / current UI kit

Issue 115 listed `@base-ui/react` → `@octanejs/base-ui` (alpha). **This repo no longer depends on `@base-ui/react` or Radix.** UI is local `app/components/ui/*` on native elements + Panda variants (example: `app/components/ui/button.tsx`).

`@octanejs/base-ui` still exists: ports `@base-ui/react@1.6.0`, “Alpha, in progress: 35 of 43 upstream subpaths.” [bindings-status](https://github.com/octanejs/octane/blob/main/docs/bindings-status.md), [base-ui README](https://github.com/octanejs/octane/blob/main/packages/base-ui/README.md)

`@octanejs/shadcn` exists but targets Radix/Aria-nova + Tailwind-inlined flavors, not this Panda kit.

**Hard block? No.** Current UI is ordinary DOM + class strings. Islands and rewrite both can keep components as host-renderer buttons/inputs. Soft: porting to `@octanejs/base-ui` later is optional extra work.

---

## 11. React 19 canary + Vite 8 rolldown

**Vite 8:** `@octanejs/vite-plugin` peerDependencies: `"vite": "^8.0.16"`. This repo: 8.2.2. **Unblocked.** [vite-plugin-octane/package.json](https://github.com/octanejs/octane/blob/main/packages/vite-plugin-octane/package.json)

Octane llms.txt: playground runtime browsers “matching Vite 8's default build target.” No documented Vite 8 / rolldown incompatibility.

**React 19:** `OctaneCompat` supports React 19; `ReactCompat` requires **19.2 or newer** in the 19 series. [react-compat](https://octanejs.dev/docs/react-compat). This repo is `19.3.0-canary-…`. Satisfies “19.2+” numerically.

**Not specified:** official testing against React **canary** builds, or against `@rolldown/plugin-babel` + `reactCompilerPreset` sitting next to `octane()`. No documented incompatibility found.

**TypeScript 7 (related DX, not runtime):** “Use TypeScript 5.9/6.x in the editor; the plugin API is unavailable in TS 7 previews.” [react-compat](https://octanejs.dev/docs/react-compat). This repo: `typescript` 7.0.2. **Soft friction** for `.tsrx` editor types, not a documented runtime hard block.

**Node:** all Octane publishable packages `engines.node: ">=22.22.2"`. [packages.md](https://github.com/octanejs/octane/blob/main/docs/packages.md). This repo does not declare `engines`. Soft if CI/Node is older; Bun is unspecified vs that engine field.

---

## 12. Final verdict by adoption path

### (a) Islands — `OctaneCompat` while keeping RR framework + Cloudflare host

**No remaining hard block.** Official path: React 19 app hosts compiled Octane children; `requireDirective: true`; `.tsrx` by extension. [react-compat](https://octanejs.dev/docs/react-compat)

Specified limits (soft, not “cannot adopt”): extra `div[data-octane-compat]`; no RSC/`cache()` across the boundary; nested React→OctaneCompat→ReactCompat **server** rendering unsupported; island cannot hoist `title`/`meta`/`link` during React SSR (this app already emits those from RR `Layout`).

Unspecified (label **inference**): `reactRouter()` + `octane({ requireDirective: true })` + varlock Cloudflare Vite plugin in one `vite.config.ts`. Docs show `octane()` + `react()`, not `reactRouter()`.

### (b) Data-mode cutover — drop framework mode; remix-router + adapter-cloudflare (or Octane `RenderRoute`)

**No remaining hard block** of the throwing-stub / explicit-non-goal kind, **provided framework mode is actually dropped.**

Still a large rewrite: new Vite plugin graph, new Worker entry, wrangler assets mode, loader context via `platform.env`, nuqs adapter choice, route-module `+types` gone.

Soft: remix-router 8.2.0 pin, nuqs missing RR adapter, Cloudflare pipeline is Octane's not varlock's, Octane alpha/beta, TS 7 plugin.

### (c) Keep framework mode **and** make Octane own the app

**Hard block remains.** `createRequestHandler` / `Meta` / `Links` / `Scripts` / `ServerRouter` are throwing stubs and a permanent non-goal. This app's production request path **is** `createRequestHandler`. No Octane framework integration for React Router.

---

## 13. What changed since issue 115

Issue [#115](https://github.com/fringe4life/van-life/issues/115) research comment (2026-08-08) vs sources fetched 2026-09-02:

| Claim in #115 | Now |
|---------------|-----|
| Octane + Vite official plugin | **Still true.** `@octanejs/vite-plugin` 0.1.52, peer Vite `^8.0.16`. |
| Octane + Cloudflare `@octanejs/adapter-cloudflare` (PR #199) | **Still true, more documented.** PR merged 2026-07-20 (already before #115). README + build-tools + ssr.md now spell wrangler, `nodejs_compat`, `not_found_handling`, `context.platform`. Package inventory `0.0.42`. |
| remix-router ports react-router 8.2.0 data/library | **Still true.** README now says library-mode port complete; framework/RSC still stubs. |
| Framework `createRequestHandler` / Meta/Links/Scripts throwing stubs, explicit non-goal | **Unchanged hard block.** Source file still throws. |
| nuqs binding, **no** `adapters/react-router` | **Unchanged.** Still react/custom/testing only. Pin still nuqs 2.9.1. |
| recharts binding, SSR weak | **Stale for this repo.** App uses TanStack Charts 0.16.0. Official `@tanstack/charts/octane` with SSR. |
| `@base-ui/react` → `@octanejs/base-ui` alpha | **Stale for this repo.** No `@base-ui/react` dependency. Binding still alpha if needed. |
| React Compiler different model | **Still true.** Mixed ownership is now more documented (`requireDirective`). |
| better-auth / Drizzle / D1 survivable | **Still true.** `@octanejs/better-auth` now exists for the client; this app does not need it yet. |
| Octane “alpha”, silent misconfig | Docs disagree with themselves: [llms.txt](https://octanejs.dev/llms.txt) still says **alpha**; [bindings](https://octanejs.dev/docs/bindings) says **beta**. Soft either way. `octane doctor` still recommended in CLI docs. |

Owner later notes (prompt, not in the #115 thread fetch):

- “nuqs now has a compiler” — **not verified** against nuqs primary sources. See §5.
- “Cloudflare is supported to some extent” — **yes**, for Octane-native full apps; not as a drop-in on `@react-router/dev` + `@cloudflare/vite-plugin`.
- “TanStack Charts also seem supported” — **yes**, official adapter, SSR, version-aligned with 0.16.0.

---

## 14. Open questions (inference vs specified)

| Topic | Specified | Inference |
|-------|-----------|-----------|
| Framework mode + Octane as host | Hard block (stubs) | — |
| `OctaneCompat` in a React 19 app | Supported | — |
| `reactRouter()` Vite plugin + `octane({ requireDirective: true })` | Not documented | May work if ownership split is honored; untested in Octane docs |
| varlock / `@cloudflare/vite-plugin` + Octane vite plugin | Not documented | Full rewrite replaces that plugin; islands keep it |
| D1 through `context.platform.env` | `env` forwarded; KV shown | D1 is the same `env` object |
| remix-router 8.2.0 vs app 8.3.1 | Pin is 8.2.0 | 8.3.1 APIs this app uses may or may not exist in the vendored core |
| `@octanejs/nuqs` 2.9.1 vs app nuqs 2.10.1 (`serverSearch`, etc.) | Pins published | 2.10 island APIs are not in the Octane port |
| “nuqs compiler” | Not found | Owner may have meant SPA `serverSearch` or Octane hook slotting |
| React 19 canary vs 19.2 stable | 19 / 19.2+ stated | Canary not certified |
| Rolldown-specific Octane bugs | Vite 8 peer only | None disclosed |
| Panda `css()` on Octane `class` | No Panda binding | Class strings should work |
| Bun as Octane install/runtime | Docs show pnpm/npm | Unknown |
| TypeScript 7.0.2 + `.tsrx` | Plugin “unavailable in TS 7 previews” | Editor DX gap; `tsrx-tsc` still specified for typecheck |

---

## Sources (primary)

- https://octanejs.dev/ — product
- https://octanejs.dev/llms.txt — canonical machine docs
- https://octanejs.dev/docs/bindings
- https://octanejs.dev/docs/framework-integrations
- https://octanejs.dev/docs/build-tools
- https://octanejs.dev/docs/react-compat
- https://octanejs.dev/docs/differences-from-react
- https://github.com/octanejs/octane/blob/main/docs/bindings-status.md
- https://github.com/octanejs/octane/blob/main/docs/packages.md
- https://github.com/octanejs/octane/blob/main/docs/remix-router-port-plan.md
- https://github.com/octanejs/octane/blob/main/docs/ssr.md
- https://github.com/octanejs/octane/blob/main/packages/remix-router/src/lib/framework-stubs.ts
- https://github.com/octanejs/octane/blob/main/packages/remix-router/README.md
- https://github.com/octanejs/octane/blob/main/packages/adapter-cloudflare/README.md
- https://github.com/octanejs/octane/blob/main/packages/nuqs/README.md
- https://github.com/octanejs/octane/blob/main/packages/better-auth/README.md
- https://github.com/octanejs/octane/blob/main/packages/base-ui/README.md
- https://github.com/octanejs/octane/blob/main/packages/vite-plugin-octane/package.json
- https://github.com/octanejs/octane/pull/199
- https://nuqs.47ng.com/docs
- https://nuqs.47ng.com/docs/adapters
- https://github.com/47ng/nuqs/releases/tag/v2.10.0
- https://tanstack.com/charts/latest/docs/framework/octane/adapter
- https://tanstack.com/charts/latest/docs/guides/ssr-and-hydration
- https://tanstack.com/charts/latest/docs/reference/rendering-and-export
- https://github.com/TanStack/charts/blob/main/packages/octane-charts/package.json
- https://reactrouter.com/start/framework/route-module
- https://reactrouter.com/start/data/installation
- https://reactrouter.com/api/framework-conventions/entry.server.tsx
- https://github.com/fringe4life/van-life/issues/115
