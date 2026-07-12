# Fallow Health Backlog

Incremental cleanup tracker for [fallow](https://docs.fallow.tools) code-health findings. Re-run analysis with:

```bash
fallow --score
```

For complexity-only (no git churn / hotspot penalty):

```bash
fallow health --score
```

Last snapshot: **78.2** (grade **B**), fallow **3.3.0** (schema 7, formula v2).

`fallow health --score` alone (no hotspots): **88** (grade **A**) — only unit_size (−10) + coupling (−1.8).

## Score breakdown

| Penalty | Points | Status |
|---------|--------|--------|
| Hotspots (complex + frequently changed files) | −10.0 | Open |
| Unit size (functions over 60 LOC) | −10.0 | Open |
| Coupling (high fan-out files) | −1.8 | Open |
| Dead code, complexity, maintainability, deps, cycles, duplication | 0.0 | Clean |

## What's healthy

- **0** dead-code issues (unused files, exports, dependencies)
- **0** circular dependencies
- Average cyclomatic complexity **1.8** (p90 **4**)
- Average maintainability index **92.7**
- **1.6%** code duplication (below penalty threshold)
- **0** severity findings under default thresholds (cyclomatic 20 / cognitive 20 / CRAP 70) — score pain is unit size + hotspots + coupling, not flagged complexity

## Priority backlog

| Priority | Area | Why | Suggested direction | Done |
|----------|------|-----|---------------------|------|
| P0 | Van filters | Was 177 LOC unit_size penalty | Refactored into `van-filters/` + `useVanFilters` | [x] |
| P1 | `VanForm` in `app/features/host/components/van-form.tsx` | 120 LOC (largest app fn), crap_max 240 | Split field groups / validation UI; field components | [ ] |
| P1 | `useVanFilters` in `app/features/vans/hooks/use-van-filters.ts` | 102 LOC; filter refactor leftover | Split commit helpers / URL sync from UI-facing API | [ ] |
| P1 | `Host` route coupling | File down to 124 lines (sections extracted) but fan_out **19**, hotspot 38.5 | Trim imports; move loader/action helpers out of route module | [~] |
| P2 | `HostVans` in `app/routes/host/host-vans.tsx` | 90 LOC fn, fan_out 18, hotspot 31.7 | Extract list toolbar, optimistic list, empty state | [ ] |
| P2 | `VanDetail` / `VanDetailCardRoot` | 98 / 88 LOC; fan_out 14–19 | Split presentational chunks; keep route thin | [ ] |
| P2 | `Pagination` in `app/features/pagination/components/pagination.tsx` | 91 LOC, hotspot 33.0 cooling | Extract page-range / control subcomponents | [ ] |
| P2 | Auth routes | `login.tsx` / `sign-up.tsx` (65–74 LOC), shared shape | Extract shared auth form shell | [ ] |
| P2 | `van-filter-url.ts` | Top hotspot **46.7 accelerating** | Stabilize API; add tests (churn from P0 refactor) | [ ] |
| P3 | Hotspot routes | `host.tsx`, `root.tsx`, `host-vans.tsx`, `vans.tsx` | Stabilize APIs; keep loaders/UI split | [ ] |
| P3 | `getVans` DAL / `van.server.ts` | File cyclomatic 24, hotspot accelerating | Extract filter/sort/pagination query builders | [ ] |
| P3 | Other large fns | `HostTransfers` 74, `getNavItems` 66, `Image` 65, `getHostReviewsPaginated` 63 | Split when next touched | [ ] |
| P4 | High render fan-in | `CustomLink`, `GenericComponent`, `UnsuccesfulState`, `Button`, `PendingUI` | Expected for shared UI; avoid risky API churn | [ ] |

### Closed / no longer score drivers

| Area | Notes |
|------|-------|
| `getElapsedTime` | File 41 LOC, crap_max **4.9** (was CRAP 132). Still mild hotspot (cooling) — leave alone |
| `buildVanSearchParams` | crap_max **13.8** (was 110); not in large_functions list |
| Host UI sections | `HostWalletForm`, `HostIncomeSection`, `HostReviewSection`, `HostVansSection` extracted — unit_size on `Host` cleared; coupling remains |

## Hotspot files (top churn × complexity)

| File | Hotspot score | Trend |
|------|---------------|-------|
| `app/features/vans/utils/van-filter-url.ts` | 46.7 | accelerating |
| `app/routes/host/host.tsx` | 38.5 | cooling |
| `app/root.tsx` | 34.9 | stable |
| `app/features/pagination/components/pagination.tsx` | 33.0 | cooling |
| `app/routes/host/host-vans.tsx` | 31.7 | cooling |
| `app/utils/get-elapsed-time.ts` | 30.2 | cooling |
| `app/routes/public/vans.tsx` | 29.6 | cooling |
| `app/features/navigation/utils/nav-link-class-name.ts` | 29.5 | accelerating |
| `app/routes/host/transfers.tsx` | 28.4 | cooling |
| `app/features/vans/utils/pending-van-from-form-data.ts` | 26.4 | accelerating |
| `app/features/vans/dal/van.server.ts` | 25.0 | accelerating |

## High coupling (fan-out)

| File | fan_out |
|------|---------|
| `app/routes/host/host.tsx` | 19 |
| `app/features/vans/components/host detail/index.tsx` | 19 |
| `app/routes/host/host-vans.tsx` | 18 |
| `app/routes/public/vans.tsx` | 16 |
| `app/routes/host/rentals/rental-detail.tsx` | 15 |
| `app/routes/host/transfers.tsx` | 15 |
| `app/routes/host/income.tsx` | 15 |
| `app/features/vans/components/van-detail.tsx` | 14 |

## Large functions (unit_size drivers, app code)

Default threshold: **60 LOC**. Profile: 69% low / 17% medium / 10% high / 4% very-high risk. **38.3** functions-over-60 per 1k.

| LOC | Location | Function |
|-----|----------|----------|
| 120 | `app/features/host/components/van-form.tsx:24` | `VanForm` |
| 102 | `app/features/vans/hooks/use-van-filters.ts:20` | `useVanFilters` |
| 98 | `app/features/vans/components/van-detail.tsx:36` | `VanDetail` |
| 91 | `app/features/pagination/components/pagination.tsx:16` | `Pagination` |
| 90 | `app/routes/host/host-vans.tsx:135` | `HostVans` |
| 88 | `app/features/vans/components/host detail/index.tsx:48` | `VanDetailCardRoot` |
| 74 | `app/routes/auth/sign-up.tsx:62` | `SignUp` |
| 74 | `app/routes/host/transfers.tsx:50` | `HostTransfers` |
| 66 | `app/features/navigation/utils/get-nav-items.tsx:7` | `getNavItems` |
| 65 | `app/features/host/components/dashboard/host-wallet-form.tsx:16` | `HostWalletForm` |
| 65 | `app/features/image/component/image.tsx:62` | `Image` |
| 65 | `app/routes/auth/login.tsx:70` | `Login` |
| 64 | `app/routes/public/vans.tsx:37` | `Vans` |
| 63 | `app/features/host/dal/review.server.ts:22` | `getHostReviewsPaginated` |

Also flagged but lower priority: `app/db/seed.ts` `main` (181), test helpers, `app/db/relations.ts`.

## CRAP / coverage caveat

Fallow still uses `static_estimated` coverage when no Istanbul/Vitest coverage file is supplied. High `crap_max` on file scores (e.g. `VanForm` 240, `root.tsx` 90) can overstate risk for tested code not wired into fallow.

Optional:

```bash
fallow health --score --coverage coverage/coverage-final.json
```

## Van filters refactor (P0)

Done under `app/features/vans/components/van-filters/` + hook/utils:

- `useVanFilters` — URL state, optimistic updates, shared `commitChange` (**still 102 LOC** → P1)
- `FilterCheckboxRow`, type/state popover sections
- `van-filter-url.ts` — now top accelerating hotspot; prefer tests over more churn

## v3.3 notes vs prior backlog (2.101)

- Score ~flat (**78.3 → 78.2**); coupling penalty **−1.7 → −1.8**
- Severity-based complexity table gone under raised defaults — track **`large_functions`** + hotspots instead
- Host route UI extraction landed; remaining Host debt is **fan-out / hotspot**, not giant component LOC
- `getElapsedTime` + `buildVanSearchParams` no longer critical score drivers
