# SVG optimisation and delivery (van-life)

**Date:** 2026-11-03. Stack: React Router 8 + Vite 8.3.5 (Rolldown) + React 19 + Panda CSS 2.4, deployed to Cloudflare Workers static assets.
Tracks: [#412](https://github.com/fringe4life/van-life/issues/412) (custom SVG system) → [#413](https://github.com/fringe4life/van-life/issues/413) (foundation). This document is the evidence behind the research umbrella filed under #413.
Companion: [`docs/icon-packs.md`](../icon-packs.md) covers *which pack* to use (settled: none). This covers *how the glyphs we now own are optimised and delivered*.

## The question

The set is 33 hand-authored glyph components on `IconShell` with per-part Panda `css()` and CSS keyframes. Three things were open:

1. **Optimisation** — should the markup go through SVGO or another tool, and will the hover/focus/pressed transitions survive it?
2. **Delivery** — inline component vs `.svg` file vs sprite vs `<use>`. Where should they live, is Vite's static pipeline involved, and is there a way to "inline once, render many"?
3. **Other speed techniques** — anything else worth doing.

## TL;DR

| # | Finding | Consequence |
|---|---|---|
| 1 | Inline is not a size decision. A `<use>` sprite **cannot** be styled from the host document — SVG 2 puts the clone in a use-element shadow tree, and host selectors do not match inside it. | The 33-glyph system cannot move to a sprite or `<use>` without losing every per-part hover/focus/pressed animation. Not a trade-off worth pricing. |
| 2 | There is no "inline once, render many" for the DOM. Each instance clones its own nodes; the *module* is already shared (one component, many render sites). | Nothing to gain: `ChevronIcon` is imported once and rendered 3×. That is already the win. |
| 3 | **Total glyph JS is 38.9 kB minified / 6.5 kB gzip** for all 35 exports, React and Panda runtime excluded. | The entire icon set costs less than one font file. JS size is not the problem to solve. |
| 4 | **The real cost is the markup**: 19 inline SVGs on `/` are **26,445 of 58,725 HTML bytes (45%)**, of which **18,160 bytes are class attribute text** — Panda atomic names on every part of every instance. | That is the optimisation target, and it is not SVG-specific: it is the cost of expressing interactions as atomic class lists. |
| 5 | Path data is **1.5 kB total across 26 modules**, because most `d` values are computed at module load from geometry constants, not written as literals. | SVGO has almost nothing to bite on. A path-minification pass is worth a rounding pass at most, and it must not touch element structure. |
| 6 | **Panda's own config shortens those class names.** `hash: { className: true }` cuts the sampled class text by **69%** and the stylesheet by **22% raw**; renaming conditions to one character cuts a further **32%** of what remains. Both are one-file changes. | Do these before considering any structural rewrite. Note they are a raw-byte win with near-zero gzip win — see §3.1. |

**Direction: keep inline components. Spend the effort on markup weight, not on delivery — and start with Panda's own config, not with hand-written CSS.** Follow-ups are filed as children of #465.

### Post A–C ship (2026-11-06)

Levers A–C landed (`hash: true`, 3-char conditions, `IconShell` presentation attrs → CSS). Numbers vs the §1 baseline below; full write-up was posted on #466.

| Metric | Baseline (2026-11-03) | After A–C | Δ |
| --- | ---: | ---: | ---: |
| `app-*.css` raw | 114,440 | **88,585** | **−23%** |
| `app-*.css` gzip-9 | 21,772 | **24,762** | **+14%** (accepted hash trade-off) |
| `/` class-attr text | 18,160 | **7,060** | **−61%** |
| `/` SVG share of HTML | 45% | **36%** | — |
| Longest class attribute | 611 | **136** | −78% (under-100 / lever D skipped) |
| All 35 glyphs (React/Panda external) | 38,917 / 6,484 | **37,210 / 6,629** | raw −4% |

---

## 1. What shipped at the research baseline (measured)

Measured on `feat/custom-svg-icons` (2026-11-03) with `bun run build` and the running dev SSR server. Commands are in §9. Treat as the pre-A–C baseline; see the table above for post-change numbers.

### 1.1 Build output

| Artefact | Raw | Gzip |
|---|---:|---:|
| `app-*.css` (the whole atomic sheet) | 114,440 B | 21,772 B |
| `entry.client-*.js` | 224.69 kB | 70.61 kB |
| `chevron-icon-*.js` (chunk) | 3.76 kB | 1.39 kB |
| `status-button-*.js` (chunk, 3 glyphs) | 4.86 kB | 2.08 kB |
| `star-icon-*.js` (chunk) | 2.80 kB | 1.13 kB |
| `icon-*.js` (the shell) | 0.91 kB | 0.59 kB |

All 35 glyph exports bundled together, minified, with `react`, `react/*` and `styled-system/*` external: **38,917 B / 6,484 B gzip**. In the real build those bytes are split across the route chunks that import them, so no page pays for the full set.

### 1.2 The rendered markup (the finding that matters)

Server-rendered HTML fetched from the dev server:

| Route | HTML bytes | `<svg>` instances | SVG markup | Share of document | Class-attribute text |
|---|---:|---:|---:|---:|---:|
| `/` | 58,725 | 19 | 26,445 B | **45%** | 18,160 B across 69 attributes |
| `/vans` | 134,371 | 22 | 33,698 B | 25% | — |

On `/`, the average `class` attribute inside a glyph is **263 characters**, and there are 22 distinct class strings across 69 attributes — i.e. a handful of long strings repeated many times. A single ray group in the van glyph serialises as:

```
class="c_inherit op_0 groupCurrent:anim-dur_1.5s groupCurrent:anim-ic_infinite
groupCurrent:anim-n_van-ray-drift groupCurrent:anim-tmf_linear groupCurrent:c_primary
groupCurrent:op_1 groupFocusVisible:anim-dur_420ms groupFocusVisible:anim-fm_forwards
groupFocusVisible:anim-n_van-ray-out groupFocusVisible:anim-tmf_air groupFocusVisible:c_primary
groupHover:anim-dur_420ms groupHover:anim-fm_forwards groupHover:anim-n_van-ray-out
groupHover:anim-tmf_air groupHover:c_primary motionReduce:anim-n_none motionReduce:c_primary
motionReduce:op_1"
```

That is one `<g>`. It is correct, it is static-extractable, and it is what makes the glyph animate — but it is also ~450 bytes of attribute for a three-line decoration.

Compression rescue: the 26,445 bytes of SVG gzip to **1,977 B (7.5%)**. So the wire cost of this redundancy is small on a brotli/gzip connection, and the cost that remains is HTML parse, DOM construction and per-node class tokenisation.

### 1.3 Glyph CSS cost

| Metric | Value |
|---|---:|
| Rules in the sheet (rule terminators) | 1,752 |
| `@keyframes` total | 49 |
| Glyph keyframes (`icon-*`, `van-*`, `status-*`, `page-*`) | 34, totalling 3,125 B (2.7% of the sheet) |
| `prefers-reduced-motion` media blocks | 2, totalling 1,852 B |
| Animation declarations | 86, of which 62 reference a glyph keyframe |

The stylesheet is the cheap half of the system. 34 keyframes cost 3.1 kB raw and compress well.

### 1.4 Source

26 non-test `.tsx` files in `app/components/icons`, 35 named exports (33 glyph components plus `IconShell` and `BARB_LENGTH`), 77,778 B of TSX **including the design comments**, 130 SVG child nodes in source.

---

## 2. Why "inline vs sprite" is a capability question, not a size threshold

This is the part that answers "is Vite able to inline an SVG used in more than one place, and is inlining faster?"

**The module is already shared.** All 33 glyphs are React components; a glyph rendered in three places is imported once and instantiated three times. There is no duplicate source in the bundle. The duplication is in the DOM, and it is inherent to inline SVG.

**A sprite cannot keep the animations.** SVG 2 defines a shadow tree per resolved `<use>`, and states plainly:

> style rules defined in the outer document do not match the elements in the shadow tree
> — [SVG 2, Document Structure §5.5](https://www.w3.org/TR/SVG/struct.html)

MDN repeats the practical consequence:

> Since the cloned nodes are not exposed, care must be taken when using CSS to style a `<use>` element and its cloned descendants.
> — [MDN `<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use)

What crosses the boundary: **inherited** properties (`color`, so `currentColor` works) and custom properties. What does not: a selector like `.group:hover .barb` or even `.barb`, because it is evaluated against the instance tree, not the host's. `transform`, `rotate`, `scale` are not inherited, so per-part motion is exactly the case that breaks.

An **external** sprite (`<use href="sprite.svg#id">`) is worse: the referenced content belongs to another document, and `<use>` permits no cross-origin request, with no defined opt-in (`crossorigin` does not exist for `<use>`) — [SVG 2 §5.5](https://www.w3.org/TR/SVG/struct.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use). Firefox has a reported [Bugzilla 1999686](https://bugzilla.mozilla.org/show_bug.cgi?id=1999686) case of host selectors reaching into an external clone; Chrome and Safari differ. That is an implementation divergence, not a contract to build on.

**Instances are not free.** Every engine deep-clones the referenced subtree per `<use>`: Blink (`svg_use_element.cc`), WebKit [`SVGUseElement.cpp`](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/svg/SVGUseElement.cpp) ("It's expensive to re-clone the entire tree every time."), Gecko (`CloneWithChildren`). The savings would be in *authored markup*, not in rendered nodes. Chrome's own icon guidance reports only "a small performance advantage" for inline SVG in a stress test at thousands of icons — [Chrome for Developers: icons](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-atoms/icons).

Note that #412 already lists "no sprite pipeline" as a non-goal. This document does not overturn that; it gives the reason, and prices the alternative.

### Where `<img>` / CSS masks would be legitimate

`<img src>` or `mask-image` is a fine delivery for a **static silhouette with no per-part state**: it is one replaced element, its internals never enter the page DOM, and the file caches separately ([MDN: replaced elements](https://developer.mozilla.org/en-US/docs/Glossary/Replaced_elements)). That is exactly what `public/rvMask.min.svg` and `public/cloud-5.svg` are, and why they should stay as files.

It is not fine for an interactive glyph: `<img>` internals cannot be styled or animated from the page at all, and `currentColor` cannot reach them. Splitting the set — 10 static glyphs as images, 23 animated ones inline — would buy a few kilobytes and buy two systems, two a11y paths and two ways to be wrong. Not recommended.

---

## 3. Where the bytes actually are

Ranked by measured impact, not by how interesting the technique is:

| Lever | Measured effect | Verdict |
|---|---|---|
| `hash: { className: true }` in `panda.config.ts` | class text −69%, built CSS −22% raw, gzip roughly flat | **Do this first.** One line, site-wide, not icon-specific — see §3.1 |
| One-character condition names in `theme/conditions.ts` | class text −32% on `/` | Second. Mechanical rename, keeps the atomic model — see §3.1 |
| Per-part atomic class strings in HTML | 18,160 B on `/` (31% of the document) before either lever | The bigger hammer, only if the two above leave it too heavy. See §4.1 |
| Repeated root boilerplate on `IconShell` | ~225 B per instance, 19 instances ≈ 4.3 kB/page, of which `fill`/`stroke`/`stroke-width`/`stroke-linecap`/`stroke-linejoin` are all expressible in CSS | Worth a class; `viewBox` must stay an attribute |
| Whole-set JS | 6.5 kB gzip for all 35 glyphs; chunk raw bytes fall ~8–27% under `hash` | Already negligible; a budget guard, not a project |
| Path data | 1.5 kB of literals total; rounding to 1 dp changes 3.1% of that | Noise. Do not run SVGO over computed geometry for size |
| Glyph keyframes in CSS | 3,125 B raw / 34 keyframes | Already cheap; Panda already drops unreferenced ones |
| Delivery as files/sprite | ~2 kB gzip per page at most, and breaks §2 | Do not |

### 3.1 Panda's own levers (measured)

`Config extends CodegenOptions`, so `hash` is a **top-level** config key. `codegen: { hash: true }` is accepted silently and does nothing — `Config` has no `codegen` key, and the rendered markup came back byte-identical (verified, not assumed).

| Lever | Sample (9 glyphs) | Built CSS | gzip |
|---|---|---|---|
| baseline | 9,224 B class text, longest attribute 611 chars | 114,440 B | 21,772 B |
| `hash: { className: true }` | **2,815 B (−69%)**, longest attribute 250 chars; markup 14,053 → 7,644 B (−46%) | **89,170 B (−22%)** | 22,575 B (**+803 B, +3.7%**); sampled markup 2,401 → 2,382 (−19 B) |
| 1-char condition names | `/` projected: class text 18,160 → 12,339 (−32%), document 58,725 → 52,904 | flat | flat |
| 3-char condition names | `/` projected: class text 18,160 → 13,339 (−24%) | flat | flat |

Notes:

- `hash: { className: true }` leaves CSS variables readable. `hash: true` would hash `--colors-*` as well, and hand-written CSS in [`app/app.css`](../../app/app.css) and [`theme/global-styles.ts`](../../theme/global-styles.ts) references those names directly.
- JS chunks shrink because atom names live in the generated runtime: `chevron-icon` 2.85 → 2.37 kB (gzip 1.14 → 1.09), `star-icon` 2.80 → 2.13 (1.13 → 1.07), `layout` 31.06 → 23.13 (8.07 → 7.88), `host-layout` 20.99 → 15.27 (5.80 → 5.54). `entry.client` is unchanged.
- **The transfer cost barely moves.** gzip is good at long repetitive names and bad at random ones, so CSS gzip actually rises slightly while raw falls 25 kB. Treat `hash` as a parse-time, DOM-memory and raw-payload win, not a wire win; brotli will behave similarly.
- Cost: class names become opaque (`cIHxjC!` — the `!` marks important atoms and is escaped in CSS), so built CSS and devtools stop being greppable. Hand-written selectors (`.group`, `data-*`, `.rating-rail`) are untouched, and the one test that asserts a class (`theme-toggle.test.tsx` → `toHaveClass("group")`) still passes.
- Short condition names work because the condition key is embedded verbatim in the atom name: a probe condition `h: '.group:hover &'` compiled to `.group:hover .h\:c_primary{color:var(--colors-primary)}`. The rename reaches every `_groupHover` / `_groupFocusVisible` / `_motionReduce` use across the 25 glyph modules, plus `DESIGN.md`, and makes glyph source read as `_h`/`_f` — 3-character names keep most of the win at a much lower readability cost.

Two smaller observations from the same data:

- `flex-sh_0` appears **twice** in most rendered root class lists (`iconRoot` sets `flexShrink: 0`, and callers also pass a flex-shrink zero class). 19 instances × ~10 B — trivial, but it is a duplicated declaration and a sign the shell/consumer contract overlaps.
- The class strings are highly repetitive (22 distinct strings for 69 attributes). Deduplication is a compression problem already solved by gzip; the win is in emitting **shorter** strings, not fewer copies.

---

## 4. Optimisation options, judged

### 4.1 Move the interaction sets into stylesheet rules keyed on a short structural class

This is the largest structural change available and ranks **third**, behind the two config levers in §3.1 — reach for it only if those leave the markup too heavy.

Instead of every part carrying its full condition matrix inline, emit one short class per part (`ic-ray`, `ic-barb`, `ic-shaft`) plus one icon-level class, and declare the condition matrix once in the stylesheet against those selectors.

- Keeps CSS-only motion and SSR safety (nothing changes at runtime).
- Keeps Panda's static-extraction rule: the rules are literals in a global stylesheet, not `css()` calls built from arguments.
- Turns ~18 kB of per-page attribute text into ~1–2 kB of attribute text and a few hundred bytes of extra stylesheet, and removes the per-instance tokenisation of ~20 class names × 69 parts.
- Risk: selectors like `.group:hover .ic-ray` are host selectors, which is fine **inline** (that is the ordinary case) and is exactly what fails under `<use>` — another reason §2 holds.

### 4.2 Reveal the shell's presentation attributes as a class

`fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"` are all settable in CSS, and CSS wins over presentation attributes. Moving them to a single `.ic` class removes ~5 attributes per instance. `viewBox`, `width`, `height`, `aria-hidden` stay as attributes. Note the existing exception: `status-icon.tsx` overrides `strokeWidth={2}`, so the class must be a default the glyph can still override.

### 4.3 A rounding pass over computed geometry (the only safe "SVGO" work)

The `<path d>` values are produced by `buildChevron`, `layoutRows`, `buildRays`, `pointAt`, etc., each already rounding with `Math.round(v * 100) / 100`. SVGO's `convertPathData` default is `floatPrecision: 3` ([svgo docs](https://svgo.dev/docs/plugins/convertPathData/)); ours are effectively at 2 dp. Measured: 1 dp rounding would change 46 of 1,496 path bytes (3.1%). There is nothing here worth a build step.

The geometry helpers do have a real *readability* cost (chevron is the largest single glyph module at 3.8 kB min / 1.2 kB gzip, larger than its markup justifies) — but that is a source-structure question, not an SVG-delivery one.

### 4.4 SVGO over the sources: what it would break

SVGO cannot read TSX (it takes SVG markup strings; `--js2svg` is serialisation formatting, not JSX support) — [SVGO README](https://github.com/svg/svgo), [Node usage](https://svgo.dev/docs/usage/node/). So any use in this repo means running it over `.svg` files, which we do not have, or over extracted `d` strings, which loses the point.

If it were run, `preset-default` contains plugins that would silently break this set ([preset-default list](https://svgo.dev/docs/preset-default/)):

| Plugin | Effect | Safe here? |
|---|---|---|
| `mergePaths` | Merges adjacent sibling `<path>`s with matching attributes ([source](https://github.com/svg/svgo/blob/main/plugins/mergePaths.js)) | **No** — destroys per-part targeting (barbs, streaks, shaft) |
| `collapseGroups` | Unwraps/attribute-shifts `<g>` ([docs](https://svgo.dev/docs/plugins/collapseGroups/)) | **No** — `<g class={burst}>`, `signInArrow`, `chevronBody` are animation targets and `fill-box` reference boxes |
| `convertShapeToPath` / `convertEllipseToCircle` | Changes element type | **No** — `<rect>` bars and the spinner `<circle>` are selected/positioned as authored |
| `moveElemsAttrsToGroup` / `moveGroupAttrsToElems` | Moves attributes across the tree | **No** — same reason |
| `removeHiddenElems` | Removes `opacity: 0` elements | **No** — several glyphs *start* hidden and animate in (`streakPulse`, `shaftReveal`, van beams) |
| `removeUselessStrokeAndFill` | Drops "redundant" stroke/fill | **No** — attributes are the rest state that animation overrides |
| `inlineStyles` / `minifyStyles` | Operates on in-document `<style>` | Inert (we have none), but would break if CSS were moved into the SVG |
| `convertColors` | Shortens colours; `currentColor` option defaults `false` | Safe **only** with `currentColor` conversion left off ([docs](https://svgo.dev/docs/plugins/convertColors/)) |
| `cleanupIds` / `prefixIds` | Minifies/prefixes ids **and classes** | **No** — SVGR enables `prefixIds` implicitly, which would rename `class` values out from under the stylesheet ([SVGR options](https://react-svgr.com/docs/options/)) |
| `removeViewBox` | Removes `viewBox` | Never — "This plugin prevents SVGs from scaling" ([docs](https://svgo.dev/docs/plugins/removeViewBox/)) |

SVGO has no knowledge of external CSS, so it cannot know a class is targeted. There is no official claim for typical size reduction, and the savings it does advertise come from editor metadata that hand-authored TSX does not carry ([SVGO introduction](https://svgo.dev/docs/introduction/)).

**If a pass is ever wanted**, the conservative allowlist is: `convertPathData` (structure-preserving), `cleanupNumericValues`, `convertColors` with `currentColor: false`, `sortAttrs` (cosmetic), and nothing else — and it must be verified by rendering, not by diffing markup.

### 4.5 What Vite would do with `.svg` files, and why we are not using it

For completeness, since "use Vite's built-in static bundling" was part of the question:

| Mode | What happens | Fit |
|---|---|---|
| `import url from "./x.svg"` | Emitted as a hashed asset URL; below `assetsInlineLimit` (default **4096 B**) it becomes a base64 data URL — [Vite assets](https://vite.dev/guide/assets), [build options](https://vite.dev/config/build-options) | An `<img>`-grade delivery: no `currentColor`, no per-part CSS. Wrong tool for interactive glyphs |
| `?url` / `?raw` / `?inline` / `?no-inline` | Explicit control of the same pipelines ([Vite assets](https://vite.dev/guide/assets)) | Same limitation |
| `?react` via `vite-plugin-svgr` | Transforms the file into a component; plugin sets `enforce: "pre"` to pre-empt Vite's asset handling; **SVGO is not enabled by default**, you must add `@svgr/plugin-svgo` to `svgrOptions.plugins` ([README](https://github.com/pd4d10/vite-plugin-svgr)) | Would reintroduce a build step to author what we already author by hand, and the JSX would carry no per-part classes unless injected by a custom template |

Hashed asset names (`assets/[name]-[hash][extname]`) plus `_headers` `Cache-Control: public, max-age=31556952, immutable` is the correct pattern **for real static SVG files**; Cloudflare's default for static assets is `public, max-age=0, must-revalidate`, and `_headers` overrides it ([Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/), [Workers static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/)). Our glyphs ride inside hashed JS chunks already, so this changes nothing for them.

### 4.6 Techniques that are worth keeping, and are already in use

- **`pathLength={1}` + `strokeDasharray` in user units** — normalises draw-on strokes so the animation can be expressed once ([MDN `pathLength`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/pathLength)). Already done in `status-icon.tsx`.
- **`transform-box: fill-box` with a percentage origin** — survives a geometry edit; already the pattern in `chevron-icon.tsx`.
- **`currentColor` at rest** — one ink source for all states; the whole design already depends on it.
- **Panda `removeUnusedKeyframes`** — dead keyframes cost nothing at runtime ([panda.config.ts](../../panda.config.ts)).
- **`aria-hidden` unless `title`** — the documented baseline for decorative glyphs ([MDN `aria-hidden`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden)); the shell already does this.

### 4.7 Techniques that are not worth it here

- `shape-rendering="crispEdges"` / `geometricPrecision`: changes rasterisation of curves; the optical weight is the design.
- `will-change` on glyphs: nothing measured justifies a layer per icon; #412's own boundary rule says so.
- Base64-in-CSS icons: can't take `currentColor`, and can't be cached separately ([Chrome guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-atoms/icons)).
- Icon fonts: no per-part state, and ligature text is spoken by screen readers unless hidden.
- An extra `<symbol>` sprite "just for the static ones": see §2.

---

## 5. Recommendations

1. **Keep the inline component model.** It is the only delivery that supports the set's reason to exist, and its JS cost (6.5 kB gzip for everything) is already below any meaningful budget.
2. **Turn on `hash: { className: true }`** (§3.1). One line, no code change, −69% class text and −22% stylesheet raw. Decide it on raw-bytes and DOM-memory grounds, because gzip cancels most of it; do **not** also hash CSS variables without auditing the `var(--colors-*)` references in `app.css` and `theme/global-styles.ts`.
3. **Shorten the condition names** (§3.1) — 3 characters if readability matters, 1 if not. −24% to −32% of the remaining class text for a mechanical rename.
4. **Move `IconShell`'s presentation attributes into a root class** (§4.2): ~4.3 kB per page, `viewBox` stays an attribute.
5. **Only then consider the stylesheet-matrix rewrite** (§4.1). It is the biggest single reduction but it abandons atomic dedupe and lands rules in `@layer base`.
6. **Do not add SVGO or SVGR.** There is no `.svg` source to optimise, the geometry is already rounded to 2 dp, and the only plugin that would help is the one that would also rewrite our class names.
7. **Add a budget so this stays true.** A CI check on the built CSS size, glyph chunk sizes and the SVG share of a prerendered page would have caught nothing yet — which is exactly when it is cheap to add.
8. **Re-run these measurements after each lever**, because the ratio moves; the numbers in §1 and §3.1 are the 2026-11-03 baseline.

## 6. What would change this conclusion

- A glyph set where most icons are static decorations (then `<img>`/mask wins on DOM cost, and the split is worth it).
- A page rendering 200+ glyph instances (then per-instance class text dominates and the stylesheet-rule approach becomes mandatory rather than tidy).
- Host-document selectors becoming able to reach `<use>` instance trees, or a spec change to shared render data.
- Panda emitting content-addressed short class names (then the atomic-name cost disappears and this document is obsolete).

## 7. Reproduction

```bash
bun run build
# CSS + chunk sizes come from the build table above

# per-glyph JS: bundle all exports alone, React and Panda external
bun build /tmp/all-glyphs.ts --minify --target browser --format esm \
  --external react --external "react/*" --external "styled-system/*" \
  --outfile /tmp/out.js && gzip -9 -c /tmp/out.js | wc -c

# markup weight: SSR HTML from the dev server
curl -s http://localhost:5173/ -o /tmp/page.html
python3 - <<'EOF'
import re, gzip
html = open('/tmp/page.html').read()
svgs = re.findall(r'<svg\b.*?</svg>', html, re.S)
print(len(svgs), sum(map(len, svgs)), sum(len(c) for s in svgs
      for c in re.findall(r'class="([^"]*)"', s)))
print(len(gzip.compress(html.encode(), 9)))
EOF
```

The measurement script used for §1.1 and §1.4 lived in `/tmp` and is not committed; if the numbers are to be defended long-term they belong in a `scripts/measure-icons.ts`.

The §3.1 figures come from a throwing-away harness that server-renders nine glyphs (`renderToStaticMarkup`) and reports markup bytes, class text, token count, longest attribute and gzip of each — run it once on the tree as it stands, then again with the lever flipped:

```bash
bun run path/to/render-measure.tsx        # baseline
sed -i '12a\  hash: { className: true },'  panda.config.ts
bun x panda codegen && bun run build
bun run path/to/render-measure.tsx        # hashed
```

The projection columns for `/` scale the measured class-text ratio onto the page's 18,160 B; they are marked "projected" above because the dev server has to be restarted before it serves regenerated class names. Both probes in §3.1 were reverted afterwards, and the rebuilt stylesheet hash returning to `app-BADQd6b-.css` is the proof the tree was clean.

## 8. Sources

- SVG 2 Document Structure §5.5 (use-element shadow tree, style scoping, cross-origin) — <https://www.w3.org/TR/SVG/struct.html>
- MDN `<use>` — https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use
- WebKit `SVGUseElement.cpp`; Blink `svg_use_element.cc`; Gecko `SVGUseElement.cpp` (`CloneWithChildren`)
- Mozilla Bugzilla 1999686 (external `<use>` style leakage, engine divergence)
- Chrome for Developers, *Using and managing icons* (inline vs embedded, caching, small inline advantage at scale)
- MDN: replaced elements, `aria-hidden`, `pathLength`, `stroke-dasharray`, HTTP compression, `mask-image`
- web.dev: scope and complexity of style calculations; text compression
- React: `renderToString` (SVG markup ships in server HTML), `ReactFiberConfigDOM` (`createElementNS` for SVG)
- Vite: Static Asset Handling (`?url`/`?raw`/`?inline`/`?no-inline`), Build Options (`assetsInlineLimit` 4096), Plugin API (`enforce: 'pre'`)
- vite-plugin-svgr README (`?react`, SVGO not on by default); SVGR options (`prefixIds`, `dimensions`)
- SVGO: preset-default, `convertPathData` (`floatPrecision: 3`, `transformPrecision: 5`), `mergePaths`, `collapseGroups`, `removeHiddenElems`, `removeViewBox`, `convertColors`, `cleanupIds`
- Rollup `output.assetFileNames` default `assets/[name]-[hash][extname]`
- Cloudflare: Pages `_headers`; Workers static asset headers (default `public, max-age=0, must-revalidate`)
