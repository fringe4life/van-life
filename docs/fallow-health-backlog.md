# Fallow Health Backlog

Incremental cleanup tracker for [fallow](https://docs.fallow.tools) code-health findings. Re-run analysis with:

```bash
fallow --score
```

For complexity-only (no git churn / hotspot penalty):

```bash
fallow health --score
```

Last snapshot: **78.3** (grade **B**), fallow **2.101.0**.

## Score breakdown

| Penalty | Points | Status |
|---------|--------|--------|
| Hotspots (complex + frequently changed files) | −10.0 | Open |
| Unit size (large functions) | −10.0 | In progress |
| Coupling (high fan-out files) | −1.7 | Open |
| Dead code, complexity, maintainability, deps, cycles, duplication | 0.0 | Clean |

## What's healthy

- **0** dead-code issues (unused files, exports, dependencies)
- **0** circular dependencies
- Average cyclomatic complexity **2.0** (p90 **4**)
- Average maintainability index **93**
- **1%** code duplication (below penalty threshold)

## Priority backlog

| Priority | Area | Why | Suggested direction | Done |
|----------|------|-----|---------------------|------|
| P0 | Van filters | 177 LOC, unit_size penalty | Refactored into `van-filters/` subfolder + `useVanFilters` hook | [x] |
| P1 | `Host` in `app/routes/host/host.tsx` | 201 LOC, critical severity, hotspot, fan_out 23 | Extract wallet form, stats cards, van list sections; thin route component | [ ] |
| P1 | `VanForm` in `app/features/host/components/van-form.tsx` | cyclomatic 15, CRAP 240 | Split field groups / validation UI; consider react-hook-form field components | [ ] |
| P2 | `HostVans` in `app/routes/host/host-vans.tsx` | 119 LOC, hotspot, fan_out 17 | Extract list toolbar, optimistic list, empty state | [ ] |
| P2 | `getElapsedTime` in `app/utils/get-elapsed-time.ts` | cyclomatic 11, CRAP 132 | Table-driven intervals or `Intl.RelativeTimeFormat`; add unit tests | [ ] |
| P2 | `buildVanSearchParams` in `app/features/pagination/utils/build-search-params.ts` | cyclomatic 10, CRAP 110 | Extract param builders per filter key | [ ] |
| P3 | Hotspot routes | `vans.tsx`, `pagination.tsx`, `root.tsx` churn + complexity | Stabilize APIs before more edits; split loaders from UI where mixed | [ ] |
| P3 | Auth routes | `login.tsx`, `sign-up.tsx` (56–63 LOC) | Extract shared auth form shell | [ ] |
| P3 | `getVans` DAL | cyclomatic 7 in `app/features/vans/dal/van.server.ts` | Extract filter/sort/pagination query builders | [ ] |
| P4 | High render fan-in | `CustomLink`, `GenericComponent`, `Button` | Expected for shared UI; document as intentional; avoid risky API changes | [ ] |

## Hotspot files (top churn × complexity)

All trending **cooling** at last snapshot — score may improve as edit frequency drops.

| File | Hotspot score | Trend |
|------|---------------|-------|
| `app/routes/public/vans.tsx` | 41.9 | cooling |
| `app/features/pagination/components/pagination.tsx` | 40.9 | cooling |
| `app/routes/host/host-vans.tsx` | 38.5 | cooling |
| `app/routes/host/host.tsx` | 34.3 | cooling |
| `app/root.tsx` | 33.4 | cooling |

## High coupling (fan-out)

| File | fan_out |
|------|---------|
| `app/routes/host/host.tsx` | 23 |
| `app/routes/host/host-vans.tsx` | 17 |
| `app/features/vans/components/host detail/index.tsx` | 17 |
| `app/routes/public/vans.tsx` | 13 |
| `app/features/vans/components/van-detail.tsx` | 13 |

## Complexity findings (severity ≥ high)

| Severity | Location | Function | LOC | Cyclomatic | CRAP |
|----------|----------|----------|-----|------------|------|
| critical | `app/routes/host/host.tsx:89` | `Host` | 201 | 11 | 132 |
| critical | `app/features/host/components/van-form.tsx:16` | `VanForm` | 118 | 15 | 240 |
| critical | `app/features/pagination/utils/build-search-params.ts:23` | `buildVanSearchParams` | 49 | 10 | 110 |
| critical | `app/utils/get-elapsed-time.ts:14` | `getElapsedTime` | 47 | 11 | 132 |
| high | `app/features/vans/components/van-detail.tsx:36` | `VanDetail` | 98 | 7 | 56 |
| high | `app/routes/auth/sign-up.tsx:62` | `SignUp` | 63 | 7 | 56 |
| high | `app/routes/public/vans.tsx:33` | `Vans` | 62 | 7 | 56 |
| high | `app/features/vans/dal/van.server.ts:43` | `getVans` | 59 | 7 | 56 |

## CRAP caveat

Fallow uses `static_estimated` coverage when no Istanbul/Vitest coverage file is supplied. High CRAP scores flag complex code without a verified test path — they may overstate risk for logic that is tested but not wired into fallow.

Optional improvement: run Vitest with coverage and pass output to fallow:

```bash
fallow health --score --coverage coverage/coverage-final.json
```

## Van filters refactor (P0)

Addressed by grouping filter UI under `app/features/vans/components/van-filters/`:

- `useVanFilters` hook — URL state, optimistic updates, shared `commitChange`
- `FilterCheckboxRow` — reusable checkbox row
- `VanTypeFilterSection` / `VanStateFilterSection` — popover sections
- Utils moved to `van-filter-url.ts` (`toValidTypes`, `snapshotFilterState`)

Re-run `fallow health --score --hotspots` after merge to confirm `VanFilters` drops from moderate findings.
