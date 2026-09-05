# Temporal API (Drizzle → UI)

**Date:** 2026-09-04. Goal: `Temporal.Instant` as the app-level type for every stored unix-ms timestamp, from D1 through loaders to display. Drop `date-fns` if the one call can be native Temporal.

Not Baseline. Safari stable still missing. Cloudflare Workers has **no supported native Temporal**. Polyfill required on Worker + Safari clients.

## This repo today

| Layer | What happens |
|-------|----------------|
| D1 / SQLite | `INTEGER` unix ms. SQL default `cast(unixepoch('subsecond') * 1000 as integer)` |
| Drizzle 1.0.0-rc.4 | `integer(..., { mode: "timestamp_ms" })` → JS `Date` ([source](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/columns/integer.ts)) |
| `$onUpdate` | `() => new Date()` on auth + review |
| `date-fns` 5.0.0-alpha.0 | **one** import: `differenceInDays` in [`app/utils/get-elapsed-time.server.ts`](../app/utils/get-elapsed-time.server.ts) |
| Display | `Intl.DateTimeFormat` + `Date.toISOString()` / `toLocaleDateString()` |
| Loaders | `Date` crosses RR via turbo-stream 3.2.1 (this repo overrides it) |
| better-auth 1.7.2 | drizzle adapter writes `Date` into `timestamp_ms` columns |
| Tests / seed | Bun `bun test` + lots of `new Date("…Z")` |
| Types | `tsconfig` `"lib": ["DOM", "DOM.Iterable", "ES2023"]` — **no** `esnext.temporal` yet |
| Worker | `compatibility_date: "2026-06-31"`, `nodejs_compat`. Same polyfill rule as [`invokers-polyfill.md`](./invokers-polyfill.md): client-only APIs stay out of the SSR graph |

Every timestamp in this schema is an **instant** (createdAt, rentedAt, expiresAt), not a calendar date. Map to `Temporal.Instant`, not `PlainDate` / `PlainDateTime`.

---

## 1. Temporal itself

[TC39 proposal README](https://github.com/tc39/proposal-temporal/blob/main/README.md): **Stage 4**. Merge into ECMA-262 / ECMA-402 in progress ([ecma262#3759](https://github.com/tc39/ecma262/pull/3759)). MDN still marks [Limited availability](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) because Safari is the Baseline blocker ([web-features explorer](https://web-platform-dx.github.io/web-features-explorer/features/temporal/)).

### Types this app needs

From [MDN Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal):

| Type | Use here |
|------|----------|
| `Temporal.Instant` | Stored unix ms. Exact UTC instant, no TZ/calendar. [MDN Instant](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant) |
| `Temporal.Duration` | Day spans (`until` / `since`) |
| `Temporal.Now` | `$onUpdate`, “now” for rental cost |
| `Temporal.ZonedDateTime` | Display: `instant.toZonedDateTimeISO("UTC")` (or viewer TZ later) |
| `Temporal.PlainDate` | **Not** for DB columns. Only if a future “calendar date with no time” appears |

`Date` and `Instant` are both “one point in time”; Instant is ns-precise and has no hidden local TZ. Convert: `date.toTemporalInstant()` (preferred) or `Temporal.Instant.fromEpochMilliseconds(ms)`; back: `new Date(instant.epochMilliseconds)` ([MDN Instant](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant)).

### Native support (2026-09)

| Runtime | Status | Source |
|---------|--------|--------|
| Chrome / Edge | 144+ (2026-01) | [Can I Use](https://caniuse.com/temporal) |
| Firefox | 139+ (2025-05-27) | [TC39 README](https://github.com/tc39/proposal-temporal/blob/main/README.md) |
| Safari desktop / iOS | **No** in 26.x / 27. TP only | [Can I Use](https://caniuse.com/temporal), [WebKit 223166](https://bugs.webkit.org/show_bug.cgi?id=223166) |
| Node.js | 26+ default (2026-05-05) | [Node 26 release](https://nodejs.org/en/blog/release/v26.0.0#temporal-api) |
| Bun | Default on since [oven-sh/bun#32978](https://github.com/oven-sh/bun/pull/32978) merged 2026-08-05 (`BUN_JSC_useTemporal=0` opt-out) | PR |
| Cloudflare Workers | **Not supported.** Accidental V8 Temporal (2026-07-30 → 2026-08-04) had `Temporal.Now` stuck at epoch 0. Reverted. “We do plan to enable native Temporal, but I don't have a timeline.” | [workerd#6907](https://github.com/cloudflare/workerd/issues/6907), [status 238b69fw6l55](https://www.cloudflarestatus.com/incidents/238b69fw6l55), [workerd#6716](https://github.com/cloudflare/workerd/discussions/6716) |

**Workers rule:** never skip a polyfill because `typeof Temporal !== "undefined"`. That is exactly how the epoch-0 incident broke auth tokens. Force the JS implementation on the Worker.

### Serialization

- `JSON.stringify(instant)` → RFC 9557 string via `toJSON()` (same as `toString()`, e.g. `2021-08-01T12:34:56Z`). `JSON.parse` does **not** revive; use `Temporal.Instant.from(str)` ([MDN Instant.toJSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/toJSON)).
- turbo-stream 3.2.1 supports `Date`, not Temporal. List: Promises, Date, Map, Set, URL, RegExp, Error, … — no Instant ([turbo-stream README](https://github.com/jacob-ebey/turbo-stream)).
- React Router will not add turbo-stream plugins; transport is a stopgap toward RSC ([RR #12874](https://github.com/remix-run/react-router/discussions/12874), [#14649](https://github.com/remix-run/react-router/discussions/14649)).
- RSC also rejects Temporal: “Only plain objects… Temporal.Instant objects are not supported.” Workaround: `toString()` / `from()` ([facebook/react#34142](https://github.com/facebook/react/issues/34142)).
- `structuredClone` / `postMessage` reject Temporal (`DataCloneError`) — Bun PR 32978 documents this matching Node.

**Loader boundary:** keep sending `Date` (turbo-stream already works) **or** send ISO strings. Do not return `Instant` from loaders until a transport knows Temporal. Convert Instant ↔ Date at the DAL / loader edge.

### Display

`Instant.toLocaleString(locales, options)` delegates to `Intl.DateTimeFormat.format(instant)` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/toLocaleString)). Prefer a cached `DateTimeFormat` (same as [`transaction.tsx`](../app/features/host/components/transaction/transaction.tsx) today).

`ZonedDateTime` thrown into `DateTimeFormat.format()` is a `TypeError`; convert to Instant / PlainDateTime first ([MDN format()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format)).

`<time dateTime>`: `instant.toString()` is valid datetime (RFC 9557 / ISO 8601).

### TypeScript

This repo: TypeScript **7.0.2**, lib **ES2023**. Temporal types live in `esnext.temporal` (TS 6+: [microsoft/TypeScript#62628](https://github.com/microsoft/TypeScript/pull/62628), [lib.esnext.date.d.ts](https://github.com/microsoft/TypeScript/blob/main/src/lib/esnext.date.d.ts) adds `Date.prototype.toTemporalInstant`).

Add `"esnext.temporal"` (and `"esnext.date"` if using `toTemporalInstant`) to `compilerOptions.lib`. Do not jump the whole lib to `esnext` unless you want other unfinished APIs. Polyfill packages also ship types (`temporal-polyfill/types/global` for TS < 6).

---

## 2. Drizzle — no first-party SQLite Temporal

Confirmed:

- Docs: sqlite integer modes are `number` \| `boolean` \| `timestamp` \| `timestamp_ms`. Timestamp modes are **`Date`** ([column types](https://orm.drizzle.team/docs/sqlite/column-types), [timestamp-default-value](https://orm.drizzle.team/docs/sqlite/guides/timestamp-default-value)).
- Source `SQLiteTimestamp.mapFromDriverValue` / `mapToDriverValue`: `new Date(value)` and `value.getTime()` ([integer.ts](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/columns/integer.ts)).
- Feature request [drizzle-orm#1776](https://github.com/drizzle-team/drizzle-orm/issues/1776) still **open** (updated 2026-07-22). Proposed PG map: `date → PlainDate`, `timestamp → Instant`, `timestamptz → ZonedDateTime`, `interval → Duration`. Not in 1.0.0-rc.4.
- PG-only PRs: [#4475](https://github.com/drizzle-team/drizzle-orm/pull/4475), rebase [#5656](https://github.com/drizzle-team/drizzle-orm/pull/5656) — **open**, Postgres, not SQLite.
- `temporal-sql` (community) is **Postgres**, not D1/SQLite ([#1776 comment](https://github.com/drizzle-team/drizzle-orm/issues/1776#issuecomment-4964819306)).

**Do this:** `customType` from `drizzle-orm/sqlite-core`. Recipe from the issue (shishkin, 2026-03-02), adapted:

```ts
import { customType } from "drizzle-orm/sqlite-core";

export const instantMs = customType<{ data: Temporal.Instant; driverData: number }>({
  dataType() {
    return "integer";
  },
  fromDriver(value) {
    return Temporal.Instant.fromEpochMilliseconds(value);
  },
  toDriver(value) {
    return value.epochMilliseconds;
  },
});
```

SQL stays `INTEGER`. drizzle-kit generate: no column-type migration if already integer. `$defaultFn` / `$onUpdate(() => Temporal.Now.instant())` works because `toDriver` accepts Instant. Keep the SQL default `unixepoch('subsecond') * 1000` — driver still sees a number; `fromDriver` wraps it.

`$type<Temporal.Instant>()` on `timestamp_ms` is **not** enough: maps still go through `Date`. Must override `fromDriver`/`toDriver`.

SQLite bind: driverData **must** be `number` (or bigint). Binding Instant directly throws (“SQLite3 can only bind numbers, strings, bigints…”).

---

## 3. Storage (D1)

Keep INTEGER unix ms UTC. Temporal is JS-only. `Instant.epochMilliseconds` ↔ column.

`strftime('%Y-%m-%d', col / 1000, 'unixepoch')` in [`chart-period.server.ts`](../app/features/host/utils/chart-period.server.ts) stays valid — still dividing ms.

Do not store `PlainDateTime` for these columns: that type has no TZ and is the wrong model for “this event happened at instant X”.

---

## 4. date-fns 5 + Temporal

Official stance ([date-fns.org/you-dont-need-date-fns](https://date-fns.org/you-dont-need-date-fns)):

- Temporal does **not** make date-fns obsolete for every helper.
- “If you used date-fns only to add days, hours, or minutes… you probably can uninstall.”
- “Can I use Temporal objects with date-fns today? **Not yet, but soon.**” Goal: Temporal-first library; Date support stays.
- v5.0.0-alpha.0 changelog is **package-size / CDN split**, not a Temporal API ([release](https://github.com/date-fns/date-fns/releases/tag/v5.0.0-alpha.0)).
- Internal `toTpInstant` exists on main (`pkgs/core/src/_lib/tp/index.ts`) — Date → `Temporal.ZonedDateTime` for upcoming ports. **Not a public Temporal-friendly API in 5.0.0-alpha.0.**

This repo’s only call: `differenceInDays(lastAt, firstAt) + 1`. date-fns docs: “full day periods” in **local TZ**, DST-aware ([differenceInDays](https://date-fns.org/docs/differenceInDays)). Workers are UTC, so this is UTC calendar-ish days.

**Drop date-fns.** Calendar-day span in UTC:

```ts
const elapsedDaysFromRange = (
  firstAt: Temporal.Instant | null | undefined,
  lastAt: Temporal.Instant | null | undefined
) => {
  if (!(firstAt && lastAt)) return 0;
  const days = firstAt
    .toZonedDateTimeISO("UTC")
    .toPlainDate()
    .until(lastAt.toZonedDateTimeISO("UTC").toPlainDate()).days;
  return days + 1;
};
```

`Instant.until(..., { largestUnit: "day" })` is **exact 24h days**, not calendar days. Wrong substitute for `differenceInDays` if you care about local/UTC date boundaries.

If a later helper has no Temporal equivalent, wait for date-fns Temporal-first — do not invent a Date round-trip wrapper unless forced. Bridge if needed: `new Date(instant.epochMilliseconds)` into current date-fns (Date-only). Ugly; avoid.

---

## 5. Polyfills — ranked

TC39 lists three production polyfills and forbids the in-repo playground polyfill ([proposal README](https://github.com/tc39/proposal-temporal/blob/main/README.md)).

Downloads from npm pages fetched **2026-09-04**. Sizes: (A) first-party README claims, (B) [fabon-f/temporal-polyfill-comparison](https://github.com/fabon-f/temporal-polyfill-comparison) Vite 8 + oxc-minify gzip.

### By weekly downloads (use)

| Rank | Package | Weekly downloads | Status (TC39 table) | GitHub |
|------|---------|------------------|---------------------|--------|
| 1 | [`temporal-polyfill`](https://www.npmjs.com/package/temporal-polyfill) **1.0.4** | **3,538,103** | Stable | [fullcalendar/temporal-polyfill](https://github.com/fullcalendar/temporal-polyfill) ~766★ |
| 2 | [`@js-temporal/polyfill`](https://www.npmjs.com/package/@js-temporal/polyfill) **0.5.1** | **~2.4M** | Alpha | [js-temporal/temporal-polyfill](https://github.com/js-temporal/temporal-polyfill) ~785★ |
| 3 | [`temporal-polyfill-lite`](https://www.npmjs.com/package/temporal-polyfill-lite) **0.4.3** | **14,629** | RC | [fabon-f/temporal-polyfill-lite](https://github.com/fabon-f/temporal-polyfill-lite) ~108★ |

Do **not** use `tc39/proposal-temporal/polyfill` (docs playground). Do **not** use old names (`proposal-temporal` npm, etc.) — champions asked them deprecated.

### By bundle size (smallest first)

| Rank | Package | gzip (comparison B) | First-party claim (A) | Notes |
|------|---------|---------------------|------------------------|--------|
| 1 | `temporal-polyfill-lite` (iso/gregory) | **17.95 kB** | “~10% smaller than temporal-polyfill, ~60% vs @js-temporal” | RC. `install(true)` can overwrite native. ESM-only |
| 2 | `temporal-polyfill` (iso/gregory) | **20.39 kB** | **19.5 kB** (23.4 kB `/full`) | Stable 1.0. Spec snapshot Aug 2026. Tree-shake `fns/*` |
| 3 | `@js-temporal/polyfill` | **45.47 kB** | **52.1 kB** (polyfill README) | Alpha. Last npm 2025-03-31. JSBI. **No global install.** Spec snapshot Mar 2025 |

Timezone DB is inside these numbers for the class API; `/full` calendars add ~4 kB gzip on lite / ~4 kB on temporal-polyfill. This app is ISO/gregory only — skip `/full`.

### Pick for this repo: `temporal-polyfill` 1.x

Why not lite: 15k vs 3.5M weekly, RC vs stable, TC39 table still says RC. ~2 kB gzip savings not worth the risk on a Worker.

Why not `@js-temporal/polyfill`: 2×+ size, still alpha, stale spec (Mar 2025 vs Aug 2026), no `import '…/global'`, JSBI tax. Champions’ polyfill; size kills the client bundle.

### How to wire (matches invokers pattern + CF incident)

| Environment | Import | Why |
|-------------|--------|-----|
| Cloudflare Worker / SSR | `import { Temporal } from "temporal-polyfill/implementation"` | Forced JS impl. Ignores broken/native `globalThis.Temporal` ([entrypoint docs](https://github.com/fullcalendar/temporal-polyfill/blob/main/_autodocs/entrypoints.md)) |
| Browser (`entry.client.tsx`) | `import "temporal-polyfill/global"` | Native Chrome/Firefox; polyfill Safari. Side-effect import like invokers |
| Bun tests | Native after Bun 32978. Optional: same `/implementation` for identical Worker semantics | `structuredClone(Instant)` will throw — don’t clone loader objects that way |

Ponyfill `import { Temporal } from "temporal-polyfill"` **uses native if present** — unsafe on Workers until CF documents Temporal as supported.

Do **not** put the polyfill in `root.tsx` / layouts (SSR graph). Worker: import from a `.server.ts` module used by DAL/schema (always bundled into the Worker). Client: `entry.client.tsx` only.

`installImplementation()` from `temporal-polyfill/shim` if you need a runtime switch.

This app does not need the tree-shake `fns/*` API unless measuring proves the 20 kB class polyfill too fat — Instant + Duration + Now is most of the class graph anyway.

---

## 6. End-to-end for van-life

```
D1 INTEGER ms
    ↓ fromDriver
Temporal.Instant          ← schema customType, DAL, services, seed
    ↓ loader edge
Date  or  RFC 9557 string ← turbo-stream / future RSC
    ↓ component
Instant (client polyfill) or format in loader as string
    ↓
Intl.DateTimeFormat / <time dateTime={instant.toString()}>
```

| Step | Decision |
|------|----------|
| A. DB | Keep INTEGER ms UTC. No migration if already `timestamp_ms` integer |
| B. Drizzle | `instantMs` customType. Replace `integer({ mode: "timestamp_ms" })` on van/rent/review/transaction. **Auth tables:** leave `Date` until better-auth is proven Instant-safe |
| C. App types | `Instant` for instants; `Duration` for spans; never `PlainDate` for these columns |
| D. Loaders | Convert `Instant` → `Date` (`new Date(i.epochMilliseconds)`) so existing components keep working, **or** format in the loader and pass strings (reviews already do `toLocaleDateString()` — that belongs in one UTC formatter) |
| E. UI | Cached `Intl.DateTimeFormat` with `timeZone: "UTC"` (already in transaction card). `instant.toLocaleString("en-US", { timeZone: "UTC", … })` if Instant reaches the client |
| F. `$onUpdate` | `() => Temporal.Now.instant()` on Instant columns |
| G. better-auth | Adapter still `Date`. Keep auth schema on `timestamp_ms` → Date. Convert at the boundary if the app ever reads `user.createdAt` as Instant |
| H. Tests | Prefer `Temporal.Instant.from("2024-01-01T00:00:00Z")`. Bun native OK; Worker tests should use `/implementation` |
| I. Seed | `Temporal.Instant.from("…Z")`. `new Date(2017, 4, 4)` is **local TZ** — already a footgun; Instant.from ISO-UTC is the fix |
| J. `isVanNew` | `createdAt.since(Temporal.Now.instant().subtract({ months: 6 }))` or PlainDate in UTC — current `new Date(y, m-6, d)` is local-calendar |
| K. Footer year | `Temporal.Now.plainDateISO("UTC").year` |
| L. Sitemap lastmod | `instant.toZonedDateTimeISO("UTC").toPlainDate().toString()` |

Phased adoption (least risk):

1. Polyfill Worker (`/implementation`) + `entry.client` (`/global`). Add `esnext.temporal` to tsconfig.
2. `instantMs` helper + migrate **non-auth** tables. Keep loader `Date` via `new Date(instant.epochMilliseconds)`.
3. Replace `get-elapsed-time` with Instant/PlainDate; remove `date-fns`.
4. Display: Instant or formatted strings; drop `toLocaleDateString()` hydration mismatch (already TODO on reviews).
5. Auth columns later, if ever.

---

## 7. Recommendation

| Question | Answer |
|----------|--------|
| Adopt Instant as app type? | **Yes** for van/rent/review/transaction. Auth stays Date |
| First-party Drizzle Temporal? | **No** on SQLite/D1. customType now. Watch #1776 / #5656 (PG only) |
| Polyfill | **`temporal-polyfill` 1.x.** Rank 1 use, rank 2 size, only stable TC39 listing. Force `/implementation` on Worker |
| Native on Worker? | **No.** CF reverted broken Temporal. Do not feature-detect |
| Client polyfill? | **Yes until Safari ships.** Chrome/Firefox native via `/global` |
| date-fns? | **Drop.** One `differenceInDays`; replace with UTC `PlainDate.until` |
| Loader Instant? | **Not yet.** Date or ISO string. turbo-stream + RSC both refuse Temporal classes |
| Biggest risks | (1) CF native Temporal clock if they ship unfinished. (2) better-auth Date. (3) Safari forever-polyfill. (4) Mixing Instant.until 24h days with calendar days |

---

## Sources (primary)

- [TC39 proposal README](https://github.com/tc39/proposal-temporal/blob/main/README.md) — Stage 4, polyfill table, “do not use in-repo polyfill”
- [MDN Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal), [Instant](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant), [until](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/until), [toJSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/toJSON), [toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/toLocaleString), [DateTimeFormat.format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format)
- [Can I Use Temporal](https://caniuse.com/temporal)
- [Drizzle sqlite column types](https://orm.drizzle.team/docs/sqlite/column-types), [custom types](https://orm.drizzle.team/docs/sqlite/custom-types), [integer.ts source](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/columns/integer.ts), [#1776](https://github.com/drizzle-team/drizzle-orm/issues/1776), [#5656](https://github.com/drizzle-team/drizzle-orm/pull/5656)
- [date-fns you-don’t-need](https://date-fns.org/you-dont-need-date-fns), [differenceInDays](https://date-fns.org/docs/differenceInDays), [v5.0.0-alpha.0](https://github.com/date-fns/date-fns/releases/tag/v5.0.0-alpha.0)
- npm: [temporal-polyfill](https://www.npmjs.com/package/temporal-polyfill), [@js-temporal/polyfill](https://www.npmjs.com/package/@js-temporal/polyfill), [temporal-polyfill-lite](https://www.npmjs.com/package/temporal-polyfill-lite)
- [temporal-polyfill-comparison](https://github.com/fabon-f/temporal-polyfill-comparison), [temporal-polyfill entrypoints](https://github.com/fullcalendar/temporal-polyfill/blob/main/_autodocs/entrypoints.md)
- [turbo-stream](https://github.com/jacob-ebey/turbo-stream), [RR data loading](https://reactrouter.com/start/framework/data-loading), [react#34142](https://github.com/facebook/react/issues/34142)
- [workerd#6907](https://github.com/cloudflare/workerd/issues/6907), [CF status](https://www.cloudflarestatus.com/incidents/238b69fw6l55), [bun#32978](https://github.com/oven-sh/bun/pull/32978), [TS #62628](https://github.com/microsoft/TypeScript/pull/62628)
