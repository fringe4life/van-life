# Panda entry CSS: `?url` + `links()` vs side-effect import

**Date:** 2026-09-26

**Packages (this repo):** `react-router` / `@react-router/dev` **8.4.0**, Vite via RR framework plugin, `@pandacss/dev` **2.0.0-beta.18**, PostCSS entry via [`postcss.config.cjs`](../postcss.config.cjs).

## Question

Official Panda CSS React Router install docs recommend:

```tsx
import stylesheet from './app.css?url'
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet }
]
```

with `app/app.css` containing only:

```css
@layer reset, base, tokens, recipes, utilities;
```

This repo uses a side-effect import (`import "./app.css"`) and no `links` export for the stylesheet. A unit test stubs HTML as `<link rel="stylesheet" href="/app.css"/>`. Should this repo switch to `?url` + `links()`? What changes for Vite/RR CSS loading, cascade layers, FOUC/theme bootstrap, and atomic-CSS performance?

**Scope split (do not conflate):**

1. **Loading method** — how the browser gets the stylesheet (`?url` + `links()` vs side-effect import).
2. **Atomic CSS engine** — build-time atomic class generation (Panda / Tailwind / StyleX). Engine benefits exist regardless of how the resulting `.css` file is linked.

---

## Current repo behavior

| Piece | This app |
| --- | --- |
| Entry CSS | [`app/app.css`](../app/app.css) — layer-order line + Inter `@font-face` (not layer-order-only) |
| Root import | [`app/root.tsx`](../app/root.tsx) — `import stylesheet from "./app.css?url"` + `links()` stylesheet descriptor (also Inter font preload). `<Links />` in `Layout` |
| PostCSS | [`postcss.config.cjs`](../postcss.config.cjs) — `@pandacss/dev/postcss` only |
| Panda config | [`panda.config.ts`](../panda.config.ts) — `preflight: true`, `optimize.removeUnusedStyles` / tokens / `treeshakeDesignSystem` |
| Theme FOUC | [`docs/theme-toggle-ssr.md`](./theme-toggle-ssr.md) — cookie SSR class + `entry.server` inject of blocking script after `color-scheme` meta, before CSS |
| Bootstrap test fixture | [`app/theme/theme-bootstrap.server.test.ts`](../app/theme/theme-bootstrap.server.test.ts) — stub expects `<link rel="stylesheet" href="/app.css"/>` *after* the inject point |

Verified on a local production client asset: side-effect CSS from root lands in the React Router route manifest as `css: ["/assets/root-….css"]` (server build assets for the root route). That is how `<Links />` emits a real stylesheet `<link>` without a `links()` export.

---

## What `?url` + `links()` actually does (mechanism)

### Vite

- Default CSS import: *“Importing `.css` files will inject its content to the page via a `<style>` tag with HMR support.”* ([Vite Features — CSS](https://vite.dev/guide/features.html#css))
- `?inline`: turns off injection; returns processed CSS as a string. ([same page](https://vite.dev/guide/features.html#css))
- `?url`: explicit URL import — *“Assets that are not included in the internal list … can be explicitly imported as a URL using the `?url` suffix.”* ([Vite Static Asset Handling](https://vite.dev/guide/assets.html#explicit-url-imports)). For CSS, Vite 5.1 fixed *“.css?url` now returns a URL to transformed CSS”* so PostCSS/Panda run in both dev and production ([Vite 5.1 announcement](https://vite.dev/blog/announcing-vite5-1); [vite#15259](https://github.com/vitejs/vite/pull/15259)). Before that fix, Remix reported production `?url` CSS skipping transforms ([remix#7786](https://github.com/remix-run/remix/issues/7786)); the documented workaround was side-effect `import`.

### React Router framework mode (current docs + installed source)

Official styling doc lists **three** patterns; side-effect is first and called *“often the simplest option”*:

1. Side-effect CSS import  
2. Route module `links` + `*.css?url`  
3. React 19 `<link>` in the route component  

Source: [reactrouter.com/explanation/styling](https://reactrouter.com/explanation/styling) (also shipped as `node_modules/react-router/docs/explanation/styling.md`).

`<Links />` renders descriptors from the route module `links` export ([Links component](https://reactrouter.com/api/components/Links)).

Installed runtime (`react-router@8.4.0`) builds those descriptors from **both** manifest CSS **and** `links()`:

```17:25:node_modules/react-router/dist/development/lib/dom/ssr/links.js
function getKeyedLinksForMatches(matches, routeModules, manifest) {
	return dedupeLinkDescriptors(matches.map((match) => {
		let module = routeModules[match.route.id];
		let route = manifest.routes[match.route.id];
		return [route && route.css ? route.css.map((href) => ({
			rel: "stylesheet",
			href
		})) : [], module?.links?.() || []];
	}).flat(2), getModuleLinkHrefs(matches, manifest));
}
```

Upstream equivalent: [`packages/react-router/lib/dom/ssr/links.ts`](https://github.com/remix-run/react-router/blob/react-router%408.4.0/packages/react-router/lib/dom/ssr/links.ts) (same logic; cite the tag matching the installed version).

The Vite plugin fills `route.css` from Vite chunk `css` arrays when CSS is imported as a side effect of a route module ([`@react-router/dev` `getReactRouterManifestBuildAssets` — `chunks.flatMap((e) => e.css ?? [])`](https://github.com/remix-run/react-router/blob/react-router%408.4.0/packages/react-router-dev/vite.ts)). So for SSR production HTML, side-effect root CSS already becomes `<link rel="stylesheet" href="…">` inside `<Links />`, not an orphaned client-only `<style>` injection.

### Panda

- **Layer-order file / PostCSS entry:** Install guides (PostCSS and React Router) tell you to put `@layer reset, base, tokens, recipes, utilities;` in the root CSS that PostCSS processes. That line is the entry that establishes layer priority; generated CSS is organized into those layers. ([Cascade Layers](https://panda-css.com/docs/concepts/cascade-layers): *“Adding this line to the top of your CSS file will determine the order in which the layers are applied.”*; [Using PostCSS](https://panda-css.com/docs/installation/postcss); [Using React Router](https://panda-css.com/docs/installation/react-router))
- **PostCSS plugin:** *“After static analysis, Panda uses a set of PostCSS plugins to convert the parsed data to atomic css at build time.”* ([Why Panda](https://panda-css.com/docs/why-panda))
- **`?url` in RR guide:** Panda’s only stated reason: *“Please note the `?url` query parameter in the `import` statement. This is required by Vite to generate the correct path to the CSS file.”* ([Using React Router](https://panda-css.com/docs/installation/react-router)) — not “required for layer order,” and not “side-effect import breaks layers.”

Segun (maintainer) on shipping layer-order inside generated CSS: *“The first declaration of layer order always wins. Otherwise, it'll be inferred from the css structure.”* ([chakra-ui/panda#1938](https://github.com/chakra-ui/panda/issues/1938))

Remix-era HMR thread used `links` + default CSS import (pre-`?url` Vite 5.1 era) as the “recommended PostCSS setup” ([chakra-ui/panda#1021](https://github.com/chakra-ui/panda/issues/1021)). That is historical preference for Remix’s `links` API, not a measured proof that side-effect fails under current RR Vite.

---

## Advantages of `?url` + `links()`

| Advantage | Source / note |
| --- | --- |
| Matches Panda’s published RR install snippet | [panda-css.com/docs/installation/react-router](https://panda-css.com/docs/installation/react-router) |
| Explicit stylesheet URL in route module; `links` is the RR-specific styling API when you *want* a real `<link>` you control in that export | [RR styling — `links` export](https://reactrouter.com/explanation/styling) |
| Same class of pattern Remix/Vite needed when frameworks own `<head>` link tags | Vite 5.1: improved `.css?url` was *“the last remaining hurdle in Remix's move to Vite”* ([Vite 5.1](https://vite.dev/blog/announcing-vite5-1)) |
| Avoids relying on Vite’s *dev* `<style>` injection path if you only ever load CSS via `links` | Vite default injects via `<style>` ([Vite CSS](https://vite.dev/guide/features.html#css)); RR still emits `<link>` from `links()` |

None of these are proven FOUC or payload wins for this repo’s SSR path (see below).

---

## Disadvantages / when side-effect import is fine

| Point | Source / note |
| --- | --- |
| RR docs treat side-effect import as a first-class, often simplest pattern | [RR styling](https://reactrouter.com/explanation/styling) |
| Framework mode already turns side-effect route CSS into `route.css` → `<link>` in `<Links />` | `getKeyedLinksForMatches` above; this repo’s server build lists `/assets/root-….css` on root |
| Layer order comes from the **CSS contents** (order declaration / layer blocks), not from `?url` vs side-effect | [Panda cascade layers](https://panda-css.com/docs/concepts/cascade-layers); [panda#1938](https://github.com/chakra-ui/panda/issues/1938) |
| Historical `?url` prod bugs made **side-effect the safer workaround** until Vite 5.1 | [remix#7786](https://github.com/remix-run/remix/issues/7786); fixed in Vite 5.1 ([vite#15259](https://github.com/vitejs/vite/pull/15259)) |
| This app’s `app.css` is not “layers only” — it also holds the Inter `@font-face`. [`DESIGN.md`](../DESIGN.md) reserves the same file for view-transition and scroll-driven rules; those rules are not in the file today. Both loading methods still PostCSS the same file | [`app/app.css`](../app/app.css); [`DESIGN.md`](../DESIGN.md) |
| Switching requires a `links` export and may change the literal `href` (hashed `/assets/…` vs stub `/app.css`); bootstrap **inject position** still keys off color-scheme meta, but the test fixture’s hardcoded `/app.css` string is illustrative | [`theme-bootstrap.server.ts`](../app/theme/theme-bootstrap.server.ts); test stub in [`theme-bootstrap.server.test.ts`](../app/theme/theme-bootstrap.server.test.ts) |

**When side-effect is fine:** single global stylesheet imported from `root.tsx`, RR framework + Vite, PostCSS/Panda already wired, no need for per-route stylesheet URLs in `links()`. That is this repo today.

---

## FOUC, render-blocking, critical CSS, theme flash

| Concern | Loading method impact |
| --- | --- |
| Theme flash | Driven by **class/`color-scheme` before paint**, not by `?url` vs side-effect. Cookie SSR + blocking script before CSS — see [theme-toggle-ssr.md](./theme-toggle-ssr.md). Script injects after `<meta name="color-scheme">`, before stylesheet links that appear later in `<head>`. |
| Render-blocking CSS | Both methods end as `<link rel="stylesheet">` in SSR HTML for this app’s root CSS (manifest `route.css` or `links()`). External stylesheets are render-blocking by default in browsers; neither pattern is “critical CSS extraction.” |
| Critical CSS | RR Vite plugin exposes optional `unstable_getCriticalCss` in **dev** only (virtual `@react-router/critical.css`). Not a production claim tied to `?url`. (`@react-router/dev` server entry generation in installed `vite.js`.) |
| Layer-order FOUC / wrong specificity | Requires wrong **layer order across stylesheets** or foreign CSS defining the same layer names (e.g. Tailwind `utilities` colliding with Panda — [panda#3337](https://github.com/chakra-ui/panda/issues/3337) blamed Next/Vercel + shared layer names, fixed by renaming Panda layers). Not fixed by switching to `?url` alone. |

**No primary source found** that measures less FOUC from `?url` + `links()` versus side-effect import under RR Vite once both emit an equivalent render-blocking `<link>`.

---

## Atomic CSS performance: measured vs marketing (separate from loading method)

### What primary docs claim (engine, not `?url`)

| Claim | Source | Controlled measurement? |
| --- | --- | --- |
| Panda: build-time atomic CSS via static analysis + PostCSS; runtime is lightweight class joining, *“doesn't generate styles in the browser nor inject styles in the `<style>`”* | [Why Panda](https://panda-css.com/docs/why-panda) | Qualitative / architecture. No app-vs-app byte benchmark on that page. |
| Tailwind: *“usually leads to CSS files that are less than 10kB”*; *“Netflix … Top 10 … only 6.5kB of CSS over the network”* | [Optimizing for Production](https://tailwindcss.com/docs/optimizing-for-production) | Vendor-stated example (Netflix Top 10). Not a reproducible lab shared with methodology here. |
| StyleX: local create+props can compile to **zero runtime**; cross-file composition has small runtime; prefers **one small upfront CSS file** over many lazy CSS files because lazy CSS forces full style recalc | [Thinking in StyleX](https://stylexjs.com/docs/learn/thinking-in-stylex/) | Compilation examples shown. No independent controlled A/B size study cited on that page. |
| StyleX PostCSS also uses layers (`useCSSLayers: true`) + a single entry marker | [StyleX installation](https://stylexjs.com/docs/learn/installation/) | Setup, not a load-method benchmark. |

### What is **not** evidenced

- No primary Panda/Chakra/Vite/RR source found that reports **bundle size, runtime, CSS payload, or specificity wins from using `?url` + `links()` instead of side-effect import** for the same generated atomic CSS.
- Historical Vite/Remix issues around `?url` were about **correct PostCSS processing / URL emission**, not atomic-class dedupe ([remix#7786](https://github.com/remix-run/remix/issues/7786), [vite#13416](https://github.com/vitejs/vite/issues/13416)).
- Local production asset size (~89 KB uncompressed for `root-….css` observed in `build/client/assets/`) is a **repo snapshot**, not a controlled comparison of loading methods. Atomic payload size is dominated by Panda codegen + `optimize.*` in [`panda.config.ts`](../panda.config.ts), not by `import` vs `?url`.

**Label clearly:** anecdotes about “HMR feels better with `links`” or “layers broke until we used `?url`” without a repro are anecdotes. Maintainer-confirmed HMR/layer bugs cited above were PostCSS/HMR/order-inference issues, not loading-method bake-offs.

---

## Recommendation for THIS repo

**Keep the side-effect `import "./app.css"`.** Do not change code for alignment alone.

Reasons:

1. React Router **documents** side-effect CSS as valid and simplest; framework mode already promotes it to `<link>` via `route.css` + `<Links />`.
2. Panda’s `?url` note is about **Vite URL resolution for the install recipe**, not a layer-correctness requirement. This repo already has the layer-order entry line and PostCSS plugin.
3. Theme / FOUC contract depends on **meta + bootstrap script before CSS links** and cookie SSR classes — unchanged by `?url` vs side-effect when both produce render-blocking links in `<Links />`.
4. Atomic CSS wins (unused-style removal, tokens, single atomic sheet) come from **Panda config / codegen**, already enabled — orthogonal to the import style.
5. Optional later switch to `?url` + `links()` is fine for **doc parity** or explicit `href` control; treat as cosmetic. If done, update any hardcoded stylesheet stub strings and confirm production `href` still sits after the theme bootstrap inject.

**Do not expect** measured CSS payload or runtime gains from the switch.

---

## Sources

**Panda CSS**

- https://panda-css.com/docs/installation/react-router
- https://panda-css.com/docs/installation/postcss
- https://panda-css.com/docs/concepts/cascade-layers
- https://panda-css.com/docs/why-panda
- https://github.com/chakra-ui/panda/issues/1938
- https://github.com/chakra-ui/panda/issues/1021
- https://github.com/chakra-ui/panda/issues/3337
- https://github.com/chakra-ui/panda/issues/1955

**Vite**

- https://vite.dev/guide/features.html#css
- https://vite.dev/guide/assets.html
- https://vite.dev/guide/assets.html#explicit-url-imports
- https://vite.dev/blog/announcing-vite5-1
- https://github.com/vitejs/vite/pull/15259
- https://github.com/vitejs/vite/issues/13416

**React Router**

- https://reactrouter.com/explanation/styling
- https://reactrouter.com/api/components/Links
- https://reactrouter.com/start/framework/route-module (links export)
- https://github.com/remix-run/react-router/blob/react-router%408.4.0/packages/react-router/lib/dom/ssr/links.ts
- Installed: `node_modules/react-router/dist/development/lib/dom/ssr/links.js` (`getKeyedLinksForMatches`)
- Installed docs: `node_modules/react-router/docs/explanation/styling.md`

**Remix / Vite history (why `?url` mattered)**

- https://github.com/remix-run/remix/issues/7786

**Atomic CSS (engine claims)**

- https://tailwindcss.com/docs/optimizing-for-production
- https://stylexjs.com/docs/learn/thinking-in-stylex/
- https://stylexjs.com/docs/learn/installation/

**MDN (cascade layers semantics)**

- https://developer.mozilla.org/en-US/docs/Web/CSS/@layer

**This repo**

- [`app/root.tsx`](../app/root.tsx)
- [`app/app.css`](../app/app.css)
- [`panda.config.ts`](../panda.config.ts)
- [`vite.config.ts`](../vite.config.ts)
- [`postcss.config.cjs`](../postcss.config.cjs)
- [`app/theme/theme-bootstrap.server.ts`](../app/theme/theme-bootstrap.server.ts)
- [`app/theme/theme-bootstrap.server.test.ts`](../app/theme/theme-bootstrap.server.test.ts)
- [`docs/theme-toggle-ssr.md`](./theme-toggle-ssr.md)
