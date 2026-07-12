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

---

## Per-file findings

### `app/features/vans/components/van-detail.tsx`

**[Funky] duplicate-jsx + lying-cast** — **fixed**

- Was: Rent CTA duplicated (desktop + mobile); mobile arm had a lying cast.
- Now: shared `rentLabel` / `rentTo` / `rentVariant` / `rentClassName` vars; both links reuse them. No new component (only 2 call sites).

---

### `app/features/host/components/van-form.tsx`

**[Funky] callback-naming + prop-specificity / cast soup** — **fixed**

- Was: `handleSubmit`; `formDataDefaults?: Record<string, unknown>` + `as string` casts; summary `errors` string.
- Now: `onSubmit`; `VanFormValues` / `VanFormFieldErrors` from `Pick`-style `VAN_FORM_FIELDS` on `VanModel`; action returns per-field issues via `arkErrorsToFieldErrors`; inline `FieldError` under inputs (ready to extract shared component).

---

### `app/features/host/hooks/use-host-wallet.ts`

**[Funky] props-in-state (state and data flow), lines 17–19**

- **Smell:** `initialTransactionType` only seeds `useState`; later changes to that argument do not update `isDepositing`.
- **Cost:** Looks like restore-from-action API, but seed is one-shot unless parent remounts with `key`.
- **Fix:** Drive radios from prop/`actionData` directly, or remount with `key` when restore identity changes; name prop `defaultTransactionType` if seed-only is intentional.
- **Source:** [React — Don't mirror props in state](https://react.dev/learn/choosing-the-state-structure#don-t-mirror-props-in-state).

**[Whiff] cast (TypeScript), line 35**

- **Smell:** `formData.get("type") as string`.
- **Cost:** `FormDataEntryValue | null` forced without narrowing.
- **Fix:** Narrow with `typeof … === "string"` or a small parser.
- **Source:** TypeScript handbook — type assertions.

---

### `app/features/vans/components/van-filters/van-state-filter-section.tsx`

**[Funky] enumerated-variants / prop-organization** — **fixed**

- Was: flat boolean pile (`onlyOnSale`, optimistic twins, two setters).
- Now: facet API — `facets: VanStateFilterFacet[]` + `onCheckedChange(key, checked)`. Config in `van-state-filter-config.ts`; hook builds facets. Add filter = one config row + optimistic wire.

---

### `app/components/pending-ui.tsx`

**[Funky] fragile dynamic Tailwind class (rendering / styling)** — **fixed**

- Was: runtime `opacity-${…}` via unused `pendingOpacity` prop.
- Now: hardcoded `opacity-75` (only value ever used at call sites).

---

### `app/features/image/component/image.tsx`

**[Whiff] default-values `||`** — **fixed / N/A**

- Progressive loader: `fullSrc` is `Maybe<string>` (`null` until load). `?? lowRes` is the right nullish fallback; empty string never a valid loaded src here.

---

### `app/features/vans/components/host detail/index.tsx`

**[Whiff] nested-ternary** — **fixed**

- Was: nested ternary + biome-ignore.
- Now: early returns in `hostVanDetailNavClassName`.

---

### `app/routes/host/host-vans.tsx`

**[Whiff] cast (TypeScript), ~line 144**

- **Smell:** `(vans ?? []) as HostVanListItem[]`.
- **Cost:** Masks loader typing gaps.
- **Fix:** Type loader return so `vans` is already `HostVanListItem[] | undefined` and drop the cast.
- **Source:** TypeScript handbook — type assertions.

---

### `app/components/custom-form.tsx`

**[Whiff] prop-organization (component API)**

- **Smell:** Same `className` applied to both `<Form>` and inner `<fieldset>`.
- **Cost:** Layout/opacity classes applied twice; confusing ownership.
- **Fix:** Split `className` / `fieldsetClassName`, or apply layout only on one element.
- **Source:** React Stinky catalog — prop-organization (category 5).

---

### `app/components/unsuccesful-state.tsx`

**[Whiff] component-naming (component API)**

- **Smell:** Typo in name: `Unsuccesful` → should be `Unsuccessful`.
- **Cost:** Search/autocomplete friction; looks unfinished.
- **Fix:** Rename component + exports + imports.
- **Source:** React Stinky catalog — component-naming (category 3).

---

### `app/features/vans/types.ts`

**[Whiff] prop-specificity (component API), ~line 34**

- **Smell:** `state?: Record<string, unknown>` on `VanCardProps`.
- **Cost:** Location state is opaque; consumers get no autocomplete.
- **Fix:** Tighten to known location-state shape used by the app.
- **Source:** React Stinky catalog — prop-specificity (category 4).

---

## Cross-file duplication

### **[Rancid] duplicate-implementation — empty-state copy** — **fixed**

- Was: listed-vans screens reused rental “not renting” copy (and drifted).
- Now: `HOST_VANS_EMPTY_MESSAGE` in `app/features/host/constants/constants.ts`; used by `host-vans.tsx` + `host-vans-section.tsx`. Rentals keep own renting copy.

---

### **[Funky] duplicate-implementation — auth pages**

- **Smell:** `app/routes/auth/login.tsx` (~L84–131) ≈ `app/routes/auth/sign-up.tsx` (~L75–132): Card + CustomForm + viewTransition names + footer swap.
- **Cost:** Auth UX changes must be applied twice.
- **Fix:** Shared `<AuthCard title footer>` (or similar) shell.
- **Source:** React Stinky duplication-pass (category 57).

---

### **[Funky] duplicate-implementation — CustomLink / CustomNavLink**

- **Smell:** `custom-link.tsx` and `custom-nav-link.tsx` both: `useIsPage`, `prefetch="intent"`, disable pointer events on current page, `viewTransition`.
- **Cost:** Behavior drift between Link and NavLink wrappers.
- **Fix:** Shared hook/helper for “disable when current” + shared base class constants if any.
- **Source:** React Stinky duplication-pass (category 57).

---

### **[Funky] duplicate-implementation — VanCard `renderProps` factories**

- **Smell:** Near-same map-to-`VanCardProps` pattern in `host-vans.tsx`, `host-vans-section.tsx`, `rentals.tsx`, `vans.tsx`.
- **Cost:** Card prop wiring drifts per screen (section already diverged: Edit text vs link).
- **Fix:** Small helpers `toHostVanCardProps` / `toCatalogVanCardProps` where shapes still match.
- **Source:** React Stinky duplication-pass (category 57).

---

### **[Funky] duplicate-implementation — collection empty/error gate**

- **Smell:** `generic-component.tsx` and `lazy-bar-chart.tsx` both: `getCollectionState` + `UnsuccesfulState` empty/error gate.
- **Cost:** Gate behavior can diverge.
- **Fix:** Shared `<CollectionGate>` or always route charts through `GenericComponent`.
- **Source:** React Stinky duplication-pass (category 57).

---

### **[Whiff] duplicate-implementation — generic error strings**

- **Smell:** `"Something went wrong"` repeated across routes.
- **Cost:** Low — framework-ish boilerplate.
- **Fix (optional):** `ERROR_GENERIC` constant.
- **Don't flag heavily:** intentional repeated shell copy is fine.

### Parallel hooks (not flagged)

`use-optimistic-boolean-filter.ts` / `use-optimistic-types-filter.ts` share a thin `useOptimistic` wrapper shape but stay typed twins — intentional, not true duplication.

---

## Summary

| Rating | Count |
|--------|------:|
| Rancid | 0 |
| Funky | 4 (PendingUI + van-detail + VanForm + state-filters fixed) |
| Whiff | 6 |

Across ~15 files with findings; rest of scanned surface smells relatively fresh for a React Router framework app this size.

### Priority fix order

1. **Funky:** Clarify `useHostWallet` seed vs live prop.
2. **Optional:** Auth card shell, link-wrapper helper, VanCard prop factories, rename `UnsuccesfulState`.

### Notes

- Image preload `useEffect` treated as legitimate external sync — not flagged.
- Index/`star-${n}` keys on static star list — allowed by catalog.
- `!!x &&` / `fillPercent > 0 &&` patterns — no zero-leak.
- Memoization density in filter hooks deferred to `react-compiler` skill.
