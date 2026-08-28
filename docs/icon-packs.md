# Icon packs vs lucide-react (van-life)

**Date:** 2026-08-29. Stack: React Router 8 + Vite 8 (Rolldown) + React 19 SPA. Package: [`lucide-react`](https://www.npmjs.com/package/lucide-react) **1.34.0** (ISC). Official guide: [Lucide for React](https://lucide.dev/guide/packages/lucide-react).

Question: named imports from a huge icon barrel — does Vite “go over all of them”? Should this app switch packs for tree-shaking or hamburger morph?

Did **not** run `bun run analyze` / `react-router build` here. Architecture from npm tarball + official docs. Measure this repo with `VITE_ANALYZE=true` + `build/client/stats.html` before chasing build-time.

## This-repo usage

Named imports from `"lucide-react"` only:

| File | Icons |
|------|--------|
| [`app/features/vans/components/van-filters/van-filters.tsx`](../app/features/vans/components/van-filters/van-filters.tsx) | `FilterIcon` |
| [`app/features/navigation/utils/get-nav-items.tsx`](../app/features/navigation/utils/get-nav-items.tsx) | `Info`, `LogIn`, `LogOut`, `Truck`, `User` |
| [`app/features/host/components/review/rating-stars.tsx`](../app/features/host/components/review/rating-stars.tsx) | `StarIcon` |
| [`app/components/status-button.tsx`](../app/components/status-button.tsx) | `Check`, `Loader2`, `X` |
| [`app/features/pagination/components/pagination.tsx`](../app/features/pagination/components/pagination.tsx) | `ChevronLeftIcon`, `ChevronRightIcon` |
| [`app/features/host/constants/host-nav-items.tsx`](../app/features/host/constants/host-nav-items.tsx) | `ArrowRightLeft`, `Car`, `KeySquare`, `LayoutDashboard`, `SquarePlus`, `Star`, `Wallet` |

~19 names, ~18 unique glyphs (`Star` / `StarIcon` are aliases). No `LucideProvider`, no `lucide-react/dynamic`.

**Not lucide:** [`app/features/navigation/components/hamburger-icon.tsx`](../app/features/navigation/components/hamburger-icon.tsx) — two `<line>`s, Tailwind `transform-view` (`transform-box: view-box`), `origin-center`, `group-has-open` translate+rotate to X. Lucide `Menu` / `X` cannot do independent bar morph without custom SVG (see below).

**Not icons:** [`public/rvMask.min.svg`](../public/rvMask.min.svg) (~58 KB SVGO’d mask, `md:mask-[url(/rvMask.min.svg)]` on home) and [`public/cloud-5.svg`](../public/cloud-5.svg) (~1.5 KB, potrace metadata + filled path, about-page mask). Illustrations / masks, not 24×24 stroke UI icons. An icon pack will never replace them.

---

## 1. lucide-react 1.34 — how it ships

npm `1.34.0`: **no `exports` field**, `"sideEffects": false`, `"module": "dist/esm/lucide-react.mjs"`. Unpacked **~31 MB / 4110 files** ([registry metadata](https://registry.npmjs.org/lucide-react/1.34.0)).

Tarball layout:

- **Per-icon ESM files:** `dist/esm/icons/*.mjs` — **2035** modules (+ matching `.map`). Example `x.mjs`: `iconNode` array of `[tag, attrs]`, then `createLucideIcon("x", __iconNode)`, `export { __iconNode, X as default }`.
- **Barrel:** `dist/esm/lucide-react.mjs` (~233 KB, 1791 lines) re-exports every icon (plus aliases: `X`, `XIcon`, `LucideX`, …). Also `import * as index from './icons/index.mjs'; export { index as icons };`.
- **Second barrel:** `dist/esm/icons/index.mjs` (~1785 named re-exports).
- **CJS barrel:** `dist/cjs/lucide-react.js` (~957 KB) — `main`.
- **Types:** `dist/lucide-react.d.ts` (~2.2 MB).
- **Shared runtime:** `Icon.mjs`, `createLucideIcon.mjs`, `context.mjs` (`LucideProvider`), `defaultAttributes.mjs`, `mergeClasses`.

Official: ES modules, named import, **runtime** tree-shake — only imported icons in the final bundle ([getting started](https://lucide.dev/guide/react/getting-started)). `sideEffects: false` is the bundler hint that unused re-exports may be dropped.

### `import { X } from "lucide-react"` — graph vs browser

Two different costs:

| Layer | What happens | Ships to browser? |
|-------|----------------|-------------------|
| **Vite / Rolldown parse** | Barrel is a giant re-export list. Vite: importing one API from a barrel can still **fetch/transform every re-exported file** because of possible side effects ([Avoid barrel files](https://vite.dev/guide/performance)). Lucide maintainers agree: barrel parse slows builds even when tree-shake works ([lucide#3354](https://github.com/lucide-icons/lucide/issues/3354)). | No |
| **Production tree-shake** | With `sideEffects: false`, unused `export { default as Foo } from './icons/foo.mjs'` should not appear in client JS. Official claim: only imported icons. | Only used icons + shared `Icon` / `createLucideIcon` |
| **Typecheck** | `from "lucide-react"` pulls the fat `.d.ts`. Possible `tsc` cost; not measured here. | No |
| **`lucide-react/dynamic`** | **Not a font.** [`DynamicIcon`](https://lucide.dev/guide/react/advanced/dynamic-icon-component) + `dynamicIconImports` (lazy `import()` per icon). Official caveats: **all icons imported at build**, extra chunks/requests, flash, SSR care. `dynamic.js` exists because **`exports` was reverted** — broke Cloudflare/Vercel/Netlify workers ([PR #2814](https://github.com/lucide-icons/lucide/pull/2814), comment in `dynamic.js`). | If used: runtime loader + N chunks. **Do not use here.** |

**Icon fonts:** not `lucide-react`. [`lucide-static`](https://lucide.dev/guide/packages/lucide-static) ships SVG files, sprite, **icon font**, and SVG strings. Different package, larger unpack (~48 MB on latest).

**`lucide-react/icons/x` in 1.34:** files exist at `dist/esm/icons/x.mjs`, but **no `exports["./icons/*"]`**. Bare `lucide-react/icons/x` is unofficial. Maintainers: `exports` tried, reverted for edge workers ([#3354](https://github.com/lucide-icons/lucide/issues/3354) — ericfennis). Workaround they publish: Vite `resolve.alias` `"lucide-react/icons"` → `node_modules/lucide-react/dist/esm/icons`, then `import XIcon from "lucide-react/icons/x"`.

Official recommendation: **named imports** for static icons. Dynamic name-from-CMS → `DynamicIcon` (avoid). `lucide-static` is for non-React / strings / fonts. **unplugin-icons** is a third-party on-demand compiler (below), not a Lucide first-party path.

---

## 2. Animation / morph — packs vs this hamburger

**Honest baseline:** 24px stroke UI packs are **not** designed for path morph. Morph needs either:

1. **Same geometry, independent nodes you transform** (this hamburger: two `<line>`s, CSS `translate` + `rotate`), or
2. **Matching path command lists / node counts** for interpolating `d` ([SVG 1.1 animation](https://www.w3.org/TR/SVG11/animate.html) — SMIL `<animate>` / `animateTransform`), or libraries (flubber, GSAP MorphSVG — not in this repo).

CSS `d` interpolation is SVG 2 / CSS, not what Lucide ships.

### `transform-view` (this hamburger)

Tailwind `transform-view` maps to CSS **`transform-box: view-box`**. [CSS Transforms Module Level 1](https://www.w3.org/TR/css-transforms-1/#transform-box): `view-box` uses the nearest SVG viewport; if `viewBox` is set, the reference box origin is the `viewBox` origin and size is `viewBox` width/height. That is why `origin-center` + viewBox `24×24` keeps rotate about `(12,12)` in user units regardless of rendered `size`.

### Lucide React output (inspect 1.34)

[`createLucideIcon`](https://github.com/lucide-icons/lucide) → `forwardRef` → [`Icon`](https://github.com/lucide-icons/lucide): `createElement("svg", { className: mergeClasses("lucide", `lucide-${name}`, className), …defaultAttributes })` then **`iconNode.map(([tag, attrs]) => createElement(tag, attrs))`**. Inner paths get **no** `className`. You can still CSS-select `.lucide-menu path:nth-child(n)`, but:

- `Menu` = **three** `<path d="M4 5h16">` (etc.), not two `<line>`s.
- `X` = **two** diagonal paths. Different node count than `Menu`. Pack swap Menu↔X is a **component swap**, not a bar morph.

### Other stroke packs (same morph story)

| Pack | Inner SVG (typical) | Morph-friendly? |
|------|---------------------|-----------------|
| **Heroicons** outline | Official copy-paste: one `<path>` ([README](https://github.com/tailwindlabs/heroicons#readme)). `bars-3.svg` is **one path** with three `M…H` segments ([src](https://github.com/tailwindlabs/heroicons/blob/v2.2.0/src/24/outline/bars-3.svg)). Independent bar CSS = **no**. Outline vs solid are **separate imports** (`@heroicons/react/24/outline` vs `24/solid`), not a morph. MIT. |
| **Phosphor** | 256 viewBox, weights (`thin`…`duotone`) via **prop**, not CSS bar morph. README shows SMIL as **slotted children** (`<animate>`, `<animateTransform>`) — compositor, not first-class menu↔x. MIT. |
| **Tabler** | Stroke 24 grid, React wrapper (`size`/`color`/`stroke`). Same class of path icons. MIT. |
| **Radix Icons** | **15×15** crisp set ([README](https://github.com/radix-ui/icons#readme)). Smaller set, still path icons. MIT. |
| **Remix Icon** | 24 grid, outline + filled. npm package is primarily **webfont + CSS** (`import 'remixicon/fonts/remixicon.css'`, `<i class="ri-…">`) ([README](https://github.com/Remix-Design/RemixIcon#readme)). Apache-2.0. Font ≠ per-bar SVG. |
| **Iconoir** | 24 grid, `iconoir-react` components + `IconoirProvider`. MIT. |

**Material Symbols** ([Google Fonts guide](https://developers.google.com/fonts/docs/material_symbols)): **variable font** axes `FILL`, `wght`, `GRAD`, `opsz`. FILL 0↔1 is a **glyph fill** transition, not two SVG lines. Ligatures (`menu` text → glyph). Apache-2.0. Subset with `icon_names` or you load thousands of glyphs (their numbers: default ~295 KB vs subset ~1.7 KB; full variable axes can be **MB**).

**unplugin-icons:** compile-time `~icons/{collection}/{icon}` → framework component ([README](https://github.com/unplugin/unplugin-icons)). On-demand **which** icons, not morph. Can point at Lucide JSON (`@iconify-json/lucide`) and keep the look without the React barrel.

**@iconify/react:** **runtime** — `<Icon icon="mdi:home" />` fetches Iconify API unless you pass data / offline bundle ([docs](https://iconify.design/docs/icon-components/react/)). Network, FOUC, client-only caveats. Opposite of unplugin-icons. Official docs point SSR apps at unplugin / web component.

**vite-plugin-svgr:** local `import Icon from "./x.svg?react"` ([README](https://github.com/pd4d10/vite-plugin-svgr)). Only files you import. Optional SVGO via `@svgr/plugin-svgo`. Right tool for **custom** SVGs (hamburger already is a TSX file; no plugin required).

**svg-baker:** webpack-era SVG sprite compiler ([svg-baker](https://github.com/svg-baker/svg-baker)). Sprite ≠ React components; extra pipeline. Weak fit for RR+Vite with ~18 icons.

### Animated commercial sets / Lottie

**Lordicon, Nucleo, Streamline animated, AnimatedIcons:** license pages 403 from this environment — **read current terms before any install**. Assume commercial until proven otherwise. Not drop-in for 18 static nav glyphs.

**Lottie / dotLottie:** After Effects JSON + **player runtime** ([Lottie web](https://airbnb.io/lottie/#/web), npm `lottie-react` / `@lottiefiles/dotlottie-react`). Different cost: parser + rAF/renderer, not a 24px stroke. Overkill vs CSS transform on two lines. Use for marketed motion, not `Loader2`.

**CSS-only hamburger:** not a pack. Independent bars + `transform` / `:has()` / View Transitions. This app already does that. Keep it.

### SMIL status

SVG 1.1 defines SMIL-in-SVG ([animate](https://www.w3.org/TR/SVG11/animate.html)). Chrome **intended to deprecate**, then **suspended** (2016): use cases without high-fidelity replacements ([blink-dev](https://groups.google.com/a/chromium.org/g/blink-dev/c/5o0yiO440LM), [www-svg 2016-08-17](https://lists.w3.org/Archives/Public/www-svg/2016Aug/0037.html)). Still in Chromium; not the future (CSS / [Web Animations](https://www.w3.org/TR/web-animations-1/)). Phosphor README still demos `<animateTransform>`. Prefer CSS transforms for this hamburger.

---

## 3. Bundle size — architecture (not this-repo stats)

Typical **used-icon** payload: small SVG path data + one React wrapper (`createElement` per inner node). Lucide `X`: two paths. Wrapper is shared (`Icon` + `createLucideIcon` + `mergeClasses` + context read). N icons ≈ N path tables + 1 wrapper copy (deduped).

| Package (latest at research time) | Tree-shake story | Unpack (npm `dist`) | React wrapper |
|-----------------------------------|------------------|---------------------|---------------|
| **lucide-react 1.34.0** | `sideEffects: false`, per-file icons, **barrel entry**, **no exports** | ~31 MB / 4110 files / 2035 icon `.mjs` | Yes (`Icon` + context) |
| **@heroicons/react** | `exports` for `./24/outline/*` etc. Official: import from `@heroicons/react/24/solid` ([README](https://github.com/tailwindlabs/heroicons#readme)) | ~3.7 MB / 5183 files | Per-icon component |
| **@phosphor-icons/react** | Claims tree-shake; **docs warn** main import can **transpile 9000+ modules** in dev. Fix: `@phosphor-icons/react/dist/csr/BellSimple` or Next `optimizePackageImports` ([README](https://github.com/phosphor-icons/react#readme)). `exports` includes `./dist/icons/*`, `./ssr` | ~33 MB / 9089 files | Yes + `IconContext`; SSR build **drops** context |
| **@tabler/icons-react** | ESM, named import, **no exports** (same barrel class as Lucide) | ~66 MB / 12386 files | Yes |
| **@radix-ui/react-icons** | ESM `dist/react-icons.esm.js`, `sideEffects: false`, small set | ~3.4 MB / 332 files | Yes |
| **remixicon** | Font + CSS first; SVG files on the site | ~14 MB / 3245 files | Not the React-component model |
| **iconoir-react** | ESM barrels `./` `./regular` `./solid` | ~6.4 MB / 3363 files | Yes + `IconoirProvider` |
| **unplugin-icons** | **Build-time only used icons**; Iconify JSON as **devDep** ([README](https://github.com/unplugin/unplugin-icons)) | plugin ~64 KB; `@iconify/json` is large on disk, not in client | Compiler emits components |
| **@iconify/react** | Runtime API / offline data | ~211 KB / 16 files (component, not the icon corpus) | One `Icon` + fetch |
| **lucide-static** | SVG / font / strings; not React | ~48 MB | None |

**Icon font vs SVG:** one `.woff2` vs N components. Font: ligatures/`currentColor` via `color`; screen readers may **speak ligature text** (`menu`) unless `aria-hidden` / visually hidden text. Lucide React defaults `aria-hidden="true"` unless `aria-label` / `<title>` ([a11y](https://lucide.dev/guide/react/advanced/accessibility)). Material Symbols docs push `icon_names` subset and ligatures vs codepoints ([guide](https://developers.google.com/fonts/docs/material_symbols)).

**Switching Phosphor/Tabler/Heroicons does not clearly beat Lucide** for this app: Phosphor/Tabler barrels are as bad or **worse** for transform time; Heroicons has better `exports` but a different look and worse hamburger geometry. Animation story is not better.

---

## 4. Why `rvMask` / `cloud-5` are “big”

Different problem from icon-grid stroke icons.

- **`rvMask.min.svg`:** ~58 KB in `public/` (was ~181 KB editor export: `enable-background`, `xml:space="preserve"`, high-precision decimals). SVGO got it; home CSS mask fetches this file.
- **`cloud-5.svg`:** ~1.5 KB, `metadata` “Created by potrace 1.15”, `preserveAspectRatio`, filled `#000000` path, `translate`+`scale(0.100000,-0.100000)`. Tiny vs rvMask; still illustration, not a 24×24 icon.

Why SVG files bloat ([SVGO](https://github.com/svg/svgo) `preset-default`): editor metadata (`removeMetadata`, `removeEditorsNSData`, `removeDoctype`, `removeComments`), unused groups (`collapseGroups`, `removeEmptyContainers`), extra precision (`cleanupNumericValues`, `convertPathData`), unused IDs, hidden elems. Inkscape/Illustrator namespaces. Embedded rasters (`<image>`) if present. Path **count** and **decimal places** dominate.

Tools: [SVGO](https://svgo.dev/docs/preset-default/) (official Node CLI; default preset listed above). [svgcleaner](https://github.com/RazrFalcon/svgcleaner) (Rust, independent cleaner). SVGR can run SVGO when importing as components.

**Do not** replace masks with Lucide/Heroicons/Phosphor. `currentColor` + stroke is for UI glyphs; these masks are **filled silhouettes**. `rvMask` already SVGO’d; `cloud-5` still small enough to ignore.

---

## 5. Runtime utilities

**lucide-react 1.34 source** (`Icon.mjs`, `context.mjs`, `defaultAttributes.mjs`, `mergeClasses.mjs`):

- **`LucideProvider` / `useLucideContext`:** `size`, `color`, `strokeWidth`, `absoluteStrokeWidth`, `className`. This app **does not** use it.
- **Defaults:** size 24, `currentColor`, strokeWidth 2, `absoluteStrokeWidth` false, `viewBox="0 0 24 24"`, round cap/join, `fill="none"` ([getting started](https://lucide.dev/guide/react/getting-started), `defaultAttributes.mjs`).
- **`absoluteStrokeWidth`:** scales stroke so optical weight stays put when `size` changes ([stroke width](https://lucide.dev/guide/react/basics/stroke-width)); or CSS `vector-effect: non-scaling-stroke` on children ([global styling](https://lucide.dev/guide/react/advanced/global-styling)).
- **`className`:** `mergeClasses` concatenates unique non-empty strings — `"lucide"`, context class, `lucide-{kebab}` + `lucide-{name}`, then consumer `className`. Not `cn`/`tailwind-merge`.
- **`"use client"`** on `Icon` / context / `DynamicIcon` (RSC marker; this app is RR framework SSR, not Next RSC).

**Competitors:** Phosphor `IconContext.Provider` (color/size/weight/mirrored; **not** on `/ssr` icons). Iconoir `IconoirProvider` (`iconProps`). Tabler: per-icon props, no context in the README. Heroicons: `className` on the SVG, no size/stroke context. Remix: font CSS classes.

---

## 6. Recommendation for **this** repo

~18 Lucide glyphs + **one custom hamburger** + two **illustration masks**.

1. **Stay on `lucide-react` named imports** for UI icons. Runtime tree-shake is the supported path. Shared wrapper is small vs 18 path tables. Look already matches.
2. **If Vite/Rolldown transform time is a measured problem** (profile, don’t guess): alias deep imports per [lucide#3354](https://github.com/lucide-icons/lucide/issues/3354) (`lucide-react/icons/x` → `dist/esm/icons/x.mjs`). **Do not** add `lucide-react/dynamic`. **Do not** wait for official `exports` — they reverted it for **Cloudflare workers**, which this app deploys to.
3. **unplugin-icons + `@iconify-json/lucide`:** same artwork, skip the React barrel, compile only used icons. Extra Vite plugin + import syntax (`~icons/lucide/x`). Worth it **after** a slow-build measurement, not before.
4. **Copy ~18 SVGs into `app/assets` and drop the package:** smallest graph, you own the files, lose Lucide props/context/aliases. Hamburger already custom. Reasonable if you want zero `node_modules` icon barrels; busywork if build is already fine.
5. **Do not switch to Phosphor / Tabler / Heroicons** for tree-shake or animation. Phosphor documents the same (worse) transpile problem. Heroicons `bars-3` is one path. No pack gives this hamburger’s two-line morph.
6. **Do not** replace `rvMask` / `cloud-5` with an icon pack. `rvMask.min.svg` already ~58 KB. SVGO `cloud-5` only if it shows in the network panel.
7. **Keep** [`hamburger-icon.tsx`](../app/features/navigation/components/hamburger-icon.tsx). CSS-only. Not Lottie, not Lucide Menu/X, not Material FILL.

### Pack comparison (serious candidates)

| Pack | Tree-shake story | Animatability | License | React package |
|------|------------------|---------------|---------|---------------|
| Lucide | Per-icon files; **barrel** entry; `sideEffects: false`; no `exports` | Stroke 24; inner paths, no per-child classes; not morph-designed | ISC | `lucide-react` |
| Heroicons | **Subpath exports** (`24/outline/*`) | Outline/solid separate; hamburger = 1 path | MIT | `@heroicons/react` |
| Phosphor | Deep `/dist/csr/…` or pay barrel tax | Weights + optional SMIL children; 256 grid | MIT | `@phosphor-icons/react` |
| Tabler | Named ESM, **no exports**, huge unpack | Stroke 24, same as Lucide | MIT | `@tabler/icons-react` |
| Radix Icons | Small ESM bundle | 15×15 paths | MIT | `@radix-ui/react-icons` |
| Remix Icon | Font CSS (or raw SVG from site) | Font, not bar morph | Apache-2.0 | `remixicon` (font) |
| Iconoir | ESM barrels + provider | Stroke 24 | MIT | `iconoir-react` |
| Material Symbols | One font; **subset** or huge | Variable axes (FILL etc.), not SVG children | Apache-2.0 | font / SVG from Google |
| Iconify + unplugin-icons | **Used icons only** at compile | Whatever the SVG is | MIT (plugin) | `unplugin-icons` + `@iconify-json/*` |
| @iconify/react | Runtime API | Same | MIT | `@iconify/react` |
| Local SVG + SVGR | Only imported files | You control nodes | your files | `vite-plugin-svgr` |

---

## Sources

- Lucide React: [packages/lucide-react](https://lucide.dev/guide/packages/lucide-react), [getting started](https://lucide.dev/guide/react/getting-started), [dynamic icon](https://lucide.dev/guide/react/advanced/dynamic-icon-component), [global styling](https://lucide.dev/guide/react/advanced/global-styling), [accessibility](https://lucide.dev/guide/react/advanced/accessibility), [lucide-static](https://lucide.dev/guide/packages/lucide-static)
- lucide-react **1.34.0** npm tarball (`package.json`, `dist/esm/*`); [registry](https://registry.npmjs.org/lucide-react/1.34.0)
- [lucide#3354](https://github.com/lucide-icons/lucide/issues/3354) (barrel parse; Vite alias; no `exports`), [PR #2814](https://github.com/lucide-icons/lucide/pull/2814) (exports reverted for workers)
- Vite: [Avoid barrel files](https://vite.dev/guide/performance)
- [unplugin-icons](https://github.com/unplugin/unplugin-icons), [Iconify React](https://iconify.design/docs/icon-components/react/)
- Heroicons [README](https://github.com/tailwindlabs/heroicons#readme), [bars-3.svg](https://github.com/tailwindlabs/heroicons/blob/v2.2.0/src/24/outline/bars-3.svg)
- Phosphor [README](https://github.com/phosphor-icons/react#readme); Tabler [icons-react README](https://github.com/tabler/tabler-icons/blob/main/packages/icons-react/README.md); [Radix Icons](https://github.com/radix-ui/icons#readme); [Remix Icon](https://github.com/Remix-Design/RemixIcon#readme); [iconoir-react](https://github.com/iconoir-icons/iconoir/blob/main/packages/iconoir-react/README.md)
- [Material Symbols](https://developers.google.com/fonts/docs/material_symbols); [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr)
- [CSS Transforms `transform-box`](https://www.w3.org/TR/css-transforms-1/#transform-box); [SVG 1.1 animation](https://www.w3.org/TR/SVG11/animate.html); Chromium SMIL [blink-dev](https://groups.google.com/a/chromium.org/g/blink-dev/c/5o0yiO440LM), [www-svg](https://lists.w3.org/Archives/Public/www-svg/2016Aug/0037.html)
- [SVGO](https://github.com/svg/svgo), [preset-default](https://svgo.dev/docs/preset-default/), [svgcleaner](https://github.com/RazrFalcon/svgcleaner)
- [Lottie web](https://airbnb.io/lottie/#/web)
- npm dist metadata: `@heroicons/react`, `@phosphor-icons/react`, `@tabler/icons-react`, `@radix-ui/react-icons`, `remixicon`, `iconoir-react`, `@iconify/react`, `unplugin-icons`, `lucide-static`, `lottie-react`, `@lottiefiles/dotlottie-react`, `material-symbols`
