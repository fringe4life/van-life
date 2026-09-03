# React Stinky report — repo sweep (`app/`)

Smell-check of Van Life against [React Stinky](https://saschb2b.com/ai/skills/react-stinky) (installed at `.agents/skills/react-stinky`). Catalog pillars 1–8 per file, then cross-file duplication (pillar 9).

**Scope:** `app/**/*.tsx`, hooks (`use-*.ts`), and feature modules. Skipped: `node_modules`, build output, generated `./+types/*`, `*.test.*`, `*.stories.*`.

**Deferred (sibling skills):** memoization (`useMemo` / `useCallback` / `React.memo`) → `react-compiler`; color literals → `theme-colors` (not installed — note only).

**Clean checks (no findings):**

- No `any` / `as any` / `@ts-ignore` / `@ts-expect-error` in `app/`
- No `dangerouslySetInnerHTML`
- No conditional hooks
- No `onClick` on non-interactive elements
- No array-index `key` on reorderable/editable lists
- No nontrivial component defined inside another component
- No leaked `{count && …}` rendering `0`
- Image preload `useEffect` gone; only remaining effect is `useAutoIdleStatus` (timer + cleanup — legitimate sync)

**Resolved since last sweep:**

| Old finding | Status |
|-------------|--------|
| `useHostWallet` props-in-state + `formData.get("type") as string` | **Gone.** Type derived: `typeOverride ?? formData.type ?? DEPOSIT`; `String(...)` on submit. |
| `host-vans.tsx` `(vans ?? []) as HostVanListItem[]` | **Gone.** |
| `UnsuccesfulState` typo | **Gone.** Replaced by `outcome-state/`. |
| Auth page Card shell | **Gone.** Shared `AuthCard`. |
| Auth form fetcher/status wiring | **Gone.** `useAuthForm` + `AuthForm`. |
| Public vans `VanCard` `renderProps` | **Gone from route.** `createVansListCardProps` in `vans-list-card.tsx`. |
| VanDetail rent CTA dup + lying cast | Still fixed. |
| VanForm callback/cast soup | Still fixed. |
| Van state-filter boolean pile | Still fixed (facet API). |
| PendingUI dynamic `opacity-${…}` | Still fixed. |
| Host van-detail nested ternary | Still fixed. |
| Listed-vans empty copy drift | Still fixed (`HOST_VANS_EMPTY_MESSAGE`). |
| `SearchInput` unlabeled + `handleKeyPress` | **Gone.** `aria-label="Search vans"`; handler `handleKeyDown`. |
| Van-detail broken `sizes` + `alt={description}` | **Gone.** Valid `sizes`; `alt={name}` on detail + card. |
| `VanCardProps.state` loose location state | **Gone.** Prop dropped (no call site used it). |
| Wallet form hook-shaped props + ungrouped radios | **Gone.** Behavior props; `<fieldset>` + visually-hidden legend. |
| `PendingUI` `Prettify` from `better-auth` | **Gone.** Import from `~/types`. |

---

## Per-file findings

### `app/components/search-input.tsx` — **fixed**

- Was: unlabeled search; `handleKeyPress` on `onKeyDown`.
- Now: `aria-label="Search vans"`; `handleKeyDown`. Rescan: no leftover a11y/naming smell.

---

### `app/features/vans/components/van-detail.tsx` — **fixed**

- Was: broken `sizes` paren; `alt={description}`.
- Now: `"(min-width: 1024px) 500px, (min-width: 768px) 400px, 300px"`; `alt={name}` (same on `van-card.tsx`). Rescan: no leftover sizes/alt smell.

---

### `app/components/custom-form.tsx`

**[Whiff] prop-organization (component API), lines 15–18**

- **Smell:** Same `className` applied to both `<Form>` and inner `<fieldset>`.
- **Cost:** Layout/opacity classes applied twice; confusing ownership.
- **Fix:** Split `className` / `fieldsetClassName`, or layout on Form only (`fieldset` unstyled / `display: contents`).
- **Source:** React Stinky catalog — prop-organization (category 5).

---

### `app/features/vans/types.ts` — **fixed**

- Was: unused `state?: Record<string, unknown>` (report had wrongly blamed `rentals.tsx` — that `state` sat on Return `CustomLink`, not `VanCard`).
- Now: prop removed from `VanCardProps` / `VanCard`. Rescan: no location-state on card.

---

### `app/components/outcome-state/types.ts`

**[Funky] discriminated-unions (component API), lines 9–21**

- **Smell:** `LinkedOutcomeAction.kind?` optional; `ReloadOutcomeAction.kind` required. `to` types differ (`CustomLinkProps["to"]` vs `string`) but `kind` does not force the arm.
- **Cost:** `"reload"` vs default-link arms ambiguous; exhaustiveness weaker.
- **Fix:** Required `kind: "link" | "reload"` on both arms; narrow `to` per arm.
- **Source:** [TypeScript — Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions).

---

### `app/features/host/components/dashboard/host-wallet-form.tsx` — **fixed**

- Was: `wallet: ReturnType<typeof useHostWallet>`; radios with no group.
- Now: `fetcher` / `isDepositing` / `isPending` / `onChangeType` / `onSubmit` / `optimisticBalance`. Radios in `<fieldset>` + visually-hidden `Transaction type` legend. Dashboard maps hook → those props. Rescan: no hook-shaped prop, no ungrouped radios.

---

### `app/components/pending-ui.tsx` — **fixed**

- Was: `Prettify` from `"better-auth"`.
- Now: `import type { Prettify } from "~/types"`. Rescan: no auth-package type coupling.

---

### `app/components/image/progressive-image.tsx` — **documented (accepted)**

- `loaded` still instance state (`loading === "eager"` seed). No auto-reset on `src`.
- **Contract (JSDoc):** remount when `src` changes — pass `key={src}` / `key={imageUrl}`. `VanCard` already does. Not a code change.

---


### `app/routes/host/host-vans.tsx`

**[Whiff] semantic-html, lines 174–175**

- **Smell:** Pending cards use `link: "#"`.
- **Cost:** Junk focus target if overlay still focusable.
- **Fix:** `linkCoversCard: false` and no href, or non-link pending chrome.

---

## Cross-file duplication

### **[Funky] duplicate-implementation — auth form wiring** — **fixed**

- Was: `login.tsx` ≈ `sign-up.tsx` after `AuthCard`: fetcher + transition + `readActionFormData` + status flash + fieldset grid.
- Now: `useAuthForm` + `<AuthForm>`. Routes keep field lists, echo defaults, titles, and submit labels.

---

### **[Funky] duplicate-implementation — CustomLink / CustomNavLink**

- **Smell:** Both: `useIsPage`, `prefetch="intent"`, disable pointer events on current page, `viewTransition`. Styling already drifted (`className` merge vs inline `style`).
- **Cost:** Behavior drift between Link and NavLink wrappers.
- **Fix:** Shared hook/helper for “disable when current” + shared prefetch/VT defaults.
- **Source:** React Stinky duplication-pass (category 57).

---

### **[Funky] duplicate-implementation — host VanCard `renderProps`**

- **Smell:** Near-same map-to-`VanCardProps` in `host-vans.tsx`, `host-vans-section.tsx`, `rentals.tsx`. Public catalog path extracted (`createVansListCardProps`).
- **Cost:** Dashboard “Edit” is inert `<p>` text; list page uses `CustomLink`. Already drifted.
- **Fix:** `toHostVanCardProps` / `toRentalVanCardProps` helpers; dashboard should use the link.
- **Source:** React Stinky duplication-pass (category 57).

---

### **[Funky] duplicate-implementation — collection empty/error gate**

- **Smell:** `generic-component.tsx` and `lazy-bar-chart.tsx` both: `getCollectionState` + `OutcomeState` / hidden placeholder.
- **Cost:** Gate behavior can diverge (already slightly: chart wraps view-transition).
- **Fix:** Shared `<CollectionGate>` (optional wrapper class) or always route charts through the same gate.
- **Source:** React Stinky duplication-pass (category 57).

---

### **[Funky] duplicate-implementation — rental vs wallet activity pages**

- **Smell:** `rental-activity.tsx` ≈ `wallet-activity.tsx`: same PendingUI grid, elapsed-days line, sum, `LazyBarChart`, `Sortable`, `DeferredPaginated`.
- **Cost:** Layout / defer / chart wiring changes twice.
- **Fix:** Shared `HostActivityPage` with slots/config (title, sum label, `Transaction`, empty copy).
- **Don't flag:** Different loaders / item types — that split is correct.
- **Source:** React Stinky duplication-pass (category 57).

---

### **[Funky] duplicate-implementation — public vs host 404**

- **Smell:** `routes/public/404.tsx` ≈ `routes/host/404.tsx`; only action targets differ. `NOT_FOUND_DESCRIPTION` copy-pasted.
- **Cost:** Copy/layout drift.
- **Fix:** Shared `NotFoundPage({ primaryAction, secondaryAction })` + thin route wrappers; one description constant.
- **Source:** React Stinky duplication-pass (category 57).

---

### **[Funky] GenericComponent on static lists**

- **Smell:** `GenericComponent` + `errorState={{ title: "Something went wrong" }}` used where items cannot fail or empty:
  - `nav.tsx`, `mobile-nav.tsx`, `host-layout.tsx` (nav items)
  - `sortable.tsx` (4 hardcoded sort buttons)
  - `host detail/index.tsx` (3 tabs)
- **Cost:** Fake empty/error/no-match paths; collection API on config arrays.
- **Fix:** Direct `.map` to `NavItem` / `Button` / `CustomNavLink`. Keep `GenericComponent` for fetched collections.
- **Bonus:** `mobile-nav.tsx` `renderMobileNavItemProps` `link` vs default arms are identical — delete the branch.
- **Source:** React Stinky catalog — children-pattern / duplicate-implementation (10, 57).

---

### **[Whiff] duplicate-implementation — generic error strings**

- **Smell:** `"Something went wrong"` (and close variants) across routes, `deferred/await.tsx`, `RouteErrorBoundary`, services.
- **Cost:** Low — framework-ish boilerplate.
- **Fix (optional):** `ERROR_GENERIC` / shared `errorState` constant.
- **Don't flag heavily:** intentional repeated shell copy is fine.

### Parallel hooks (not flagged)

`use-optimistic-boolean-filter.ts` / `use-optimistic-types-filter.ts` share a thin `useOptimistic` wrapper shape but stay typed twins — intentional, not true duplication.

---

## Summary

| Rating | Count |
|--------|------:|
| Rancid | 0 |
| Funky | 7 |
| Whiff | 3 |

Open leftovers: outcome-action union; CustomLink/NavLink; host VanCard factories; collection gate; activity pages; 404 shell; `GenericComponent` on static lists; `CustomForm` className; pending `link: "#"`; generic error strings.

### Priority fix order

1. **Funky:** CustomLink guard helper; host VanCard prop factories (dashboard Edit link); `HostActivityPage`; stop `GenericComponent` on static nav/sort.
2. **Optional:** Split `CustomForm` classNames; require `kind` on outcome actions; `ERROR_GENERIC`.

### Notes

- `useAutoIdleStatus` render-time `prevStatus` sync is the documented React pattern — not flagged.
- Index/`star-${n}` keys on static star list — allowed by catalog.
- `!!x &&` / `fillPercent > 0 &&` patterns — no zero-leak.
- Filter checkbox `onChange` — native HTML; not flagged.
- Memoization density in filter hooks deferred to `react-compiler` skill.
- `ProgressiveImage`: `key={src}` remount contract in JSDoc; `VanCard` uses `key={imageUrl}`.
