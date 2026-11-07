# Icon packs vs lucide-react (van-life)

**Date:** 2026-08-29. **Status:** historical — the comparison below is why the pack was dropped, not a recommendation. No icon package ships; see §6.
Stack: React Router 8 + Vite 8 (Rolldown) + React 19 SPA. Package examined: [`lucide-react`](https://www.npmjs.com/package/lucide-react) **1.34.0** (ISC). Official guide: [Lucide for React](https://lucide.dev/guide/packages/lucide-react).

**See also:** [`docs/research/svg-optimisation.md`](./research/svg-optimisation.md) — what the owned glyph set actually costs once it ships (45% of `/`'s HTML is inline SVG, and 18.2 kB of that is class text), why a `<use>` sprite cannot keep per-part animation, and what SVGO would and would not be safe on. This file covers *which pack*; that one covers *how the glyphs we now own are optimised and delivered*.

Question: named imports from a huge icon barrel — does Vite “go over all of them”? Should this app switch packs for tree-shaking or hamburger morph?

## This-repo usage

Named imports from `"lucide-react"` only:

| File | Icons |
|------|--------|
| [`app/features/vans/components/van-filters/van-filters.tsx`](../app/features/vans/components/van-filters/van-filters.tsx) | `FilterIcon` |
| [`app/features/navigation/utils/get-nav-items.tsx`](../app/features/navigation/utils/get-nav-items.tsx) | `Info`, `LogIn`, `LogOut`, `Truck`, `User` |
| [`app/features/host/components/review/rating-stars.tsx`](../app/features/host/components/review/rating-stars.tsx) | `StarIcon` |
| [`app/components/status-button.tsx`](../app/components/status-button.tsx) | `Check`, `Loader2`, `X` |
| [`app/features/host/constants/host-nav-items.tsx`](../app/features/host/constants/host-nav-items.tsx) | `ArrowRightLeft`, `Car`, `KeySquare`, `LayoutDashboard`, `SquarePlus`, `Star`, `Wallet` |

Pagination used to sit in that table (`ChevronLeftIcon` / `ChevronRightIcon`). It no longer imports from the pack: the pager arrows are [`chevron-icon.tsx`](../app/components/icons/chevron-icon.tsx) with `morph="arrow"` (#432 / #433). The barbs close and the shaft grows on hover and focus-visible; a press adds three thin speed lines out of the tail, 28ms apart, plus a 9% stretch along the travel. They run off `data-pulse`, which is the pending direction the pager already tracks — no timer, so the burst is as long as the page actually takes and no longer. The limit control's density marks are [`rows-icon.tsx`](../app/components/icons/rows-icon.tsx) (#434 – #437).

The transaction badges are vendored too: [`arrow-line-icon.tsx`](../app/components/icons/arrow-line-icon.tsx) for deposits and withdrawals (#439 / #442) and [`money-transfer-icon.tsx`](../app/components/icons/money-transfer-icon.tsx) for rental payments and returns (#440 / #441). Each glyph is tinted by direction through [`money-ink.ts`](../app/components/icons/money-ink.ts), which maps `chart.inflow` / `chart.outflow` to the two movements. Non-money accents use `glyph.amber` / `glyph.sky` from [`theme/semantic-tokens.ts`](../theme/semantic-tokens.ts) (#496). The rental mark is a single diagonal arrow; a banknote was drawn first and dropped because at 14px in the badge it read as a rectangle with a slash.

The status button was the last consumer. [`status-icon.tsx`](../app/components/icons/status-icon.tsx) holds all three marks (#429 – #431) at one optical box, because the button swaps them in an absolutely centred overlay and a size or weight difference between them reads as the button jumping: a spinning burst, a check that draws on and holds, a cross that snaps in and shakes once. The burst is a Catherine wheel — six rays, alternating long and short, around a solid spark. A 300° rim with a hub and four treads was drawn first and read as a dartboard at 20px, which is why there is no ring in it now. A closed ring plus radial marks is a target; the alternation of the rays is what makes a turn visible instead.

~15 names, ~14 unique glyphs (`Star` / `StarIcon` are aliases) — **all of them vendored as of #429 – #431**, so the table above is history rather than a current import list. The removal is complete: no file under `app/` imports the pack, `lucide-react` is out of `package.json` and `bun.lock`, out of `optimizeDepsInclude` in [`vite.config.ts`](../vite.config.ts), and out of the stack list in [`README.md`](../README.md). No `LucideProvider`, no `lucide-react/dynamic`.

**Not lucide:** [`app/navigation/components/hamburger-icon.tsx`](../app/navigation/components/hamburger-icon.tsx) — two `<line>`s, Tailwind `transform-view` (`transform-box: view-box`), `origin-center`, `group-has-open` translate+rotate to X. Lucide `Menu` / `X` cannot do independent bar morph without custom SVG (see below).

**Not icons:** [`public/rvMask.min.svg`](../public/rvMask.min.svg) (~22 KB SVGO’d mask, `md:mask-[url(/rvMask.min.svg)]` on home) and [`public/cloud-5.svg`](../public/cloud-5.svg) (<1 KB, `viewBox` + one minified path, about-page mask). Illustrations / masks, not 24×24 stroke UI icons. An icon pack will never replace them.

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

- **`rvMask.min.svg`:** ~22 KB in `public/` (was ~58 KB after the first SVGO pass; original editor export ~181 KB: `enable-background`, `xml:space="preserve"`, high-precision decimals). Home CSS mask fetches this file.
- **`cloud-5.svg`:** <1 KB in `public/` — `viewBox="0 0 1280 717"`, single transformed/minified `<path>` (no potrace `<metadata>`, no `preserveAspectRatio`, no `<g translate/scale>`). Tiny vs rvMask; still illustration, not a 24×24 icon.

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

## 6. What this repo does instead of a pack

**No icon package ships here.** Every glyph is a vendored inline SVG component in [`app/components/icons/`](../app/components/icons), 33 components across 25 modules, built on `IconShell` in [`icon.tsx`](../app/components/icons/icon.tsx). `lucide-react` is not a dependency; the whole set is 6,484 B gzip of client JS. The pack comparison above is kept as the record of *why* — not as a live recommendation.

The properties that decided it, in the order they mattered:

1. **Inner nodes have to carry classes.** A pack's `iconNode` produces paths with no `className`, so nothing inside a glyph can be targeted. Motion per part — barbs folding, streaks firing, wheels turning — needs elements we own. This is the requirement every candidate pack fails.
2. **One interaction model, not 33 one-offs.** `IconShell` fixes the contract: 24 grid, `fill="none"`, `stroke="currentColor"`, stroke 1.6, round caps and joins, `aria-hidden` unless a `title` is passed, sizing owned by the caller. Colour at rest is always inherited.
3. **Motion is CSS on ancestor state.** Glyphs read `:hover`, `:focus-visible`, `[aria-current='page']`, `[data-pulse]`, `[data-held]` from the owning element through the conditions in [`theme/conditions.ts`](../theme/conditions.ts), with keyframes in [`theme/keyframes.ts`](../theme/keyframes.ts). Nothing mounts, nothing hydrates, and `prefers-reduced-motion` collapses to colour-only in one media query.
4. **The literal rule.** Every `css()` carrying an `animationName`, delay, duration, `transformOrigin` or transition token is a top-level literal call. Panda extracts statically, so a factory that takes a keyframe name silently emits a class with no rule behind it — the bug #417 / #418 fixed for the sign-in barbs. Variant grids are fine; parameterised `css()` is not.

Still true, and still worth knowing:

- **Do not** add a sprite pipeline or `unplugin-icons`. A `<use>` reference puts its content in a shadow tree where host selectors do not match, which would kill every per-part animation here; see [`docs/research/svg-optimisation.md`](./research/svg-optimisation.md) §2 for the spec quotes and the measurements.
- **Do not** switch to Phosphor / Tabler / Heroicons for tree-shake or animation. Same static-path limitation, worse barrels.
- **Do not** replace `rvMask` / `cloud-5` with an icon pack. `rvMask.min.svg` is ~22 KB. `cloud-5.svg` is already <1 KB. They are masks, not 24×24 stroke UI glyphs.
- **Keep** [`hamburger-icon.tsx`](../app/navigation/components/hamburger-icon.tsx) inside the icon set's conventions even though it predates it: two `<line>`s, CSS transform, no pack can do that morph.
- **Do not** add SVGO or SVGR steps: the path data is generated from geometry constants at module load, and `preset-default` would merge paths, flatten animation groups and prefix the class names the stylesheet keys on. The conservative allowlist, if one is ever needed, is in the research doc §4.4.

The open questions left in this area — markup weight, geometry freezing and a CI budget — are tracked as #465 and its children under [#413](https://github.com/fringe4life/van-life/issues/413).

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
