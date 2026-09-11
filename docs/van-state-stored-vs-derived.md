# Van listing state: store vs derive (SQLite / Drizzle / UI)

**Date:** 2026-09-11

**Question:** For this catalog, when to persist occupancy / listing status in SQLite vs compute it at read time, and how first-party UI systems show more than one status on one card.

**Answer:** Store **host intent** (`van.state`). Treat **open `rent` rows** (`rentedTo IS NULL`) as occupancy source of truth. Keep `isRented` only as a write-path lock, or drop it once a unique partial index can enforce one open rent. Derive **`new`** at read time. Never put `datetime('now')` / `unixepoch('now')` in a generated column. Display is a **facet list**, not a second stored enum: one exclusive lifecycle badge from `state`, plus optional independent tags (`new`, rented) with `new` **lowest** priority if you still collapse to one badge.

---

## This repo today

| Piece | Fact |
| --- | --- |
| `van.state` | Stored TEXT enum `IN_REPAIR` \| `ON_SALE` \| `AVAILABLE`, default `AVAILABLE`. Drizzle `text({ enum })` infers TS unions; it does **not** emit a SQL `CHECK`. [`app/db/schema/van.ts`](../app/db/schema/van.ts), [Drizzle SQLite text](https://orm.drizzle.team/docs/column-types/sqlite) |
| `van.isRented` | Stored boolean (INTEGER 0/1). Default `false` on insert. [`app/db/schema/van.ts`](../app/db/schema/van.ts), [`app/features/vans/dal/van.server.ts`](../app/features/vans/dal/van.server.ts) |
| `rent` | `rentedAt` required; `rentedTo` optional. Null `rentedTo` = ongoing. Index `Rent_vanId_idx` is ordinary, not unique, not partial. [`app/db/schema/van.ts`](../app/db/schema/van.ts) |
| Claim protocol | `UPDATE van SET isRented=true WHERE isRented=false AND state <> IN_REPAIR`, then `INSERT rent`. D1 has no interactive transactions; rollback of the flag is guarded by `NOT EXISTS` open rent. Return sets `rentedTo` and `isRented=false` in one `batch`. [`app/features/host/dal/rental-transaction.server.ts`](../app/features/host/dal/rental-transaction.server.ts) |
| Display | `lowercaseVanState`: if created within 6 months → `"new"` **wins**, else map stored enum. `AVAILABLE` badge is hidden. [`app/features/vans/utils/van-state-helpers.ts`](../app/features/vans/utils/van-state-helpers.ts), [`app/features/vans/components/van-badge.tsx`](../app/features/vans/components/van-badge.tsx) |
| Rentability | `isVanAvailable` = `!isRented && state !== IN_REPAIR`. Sale listings can still be rented. [`van-state-helpers.ts`](../app/features/vans/utils/van-state-helpers.ts) |
| Engine | SQLite (D1). No Postgres features below unless marked. |

`AVAILABLE` is **not** “no open rent”. It is a listing-lifecycle value the host stores. Occupancy is a **separate** flag plus open rent rows. Those two can disagree.

---

## 1. Generated columns cannot depend on current time

SQLite generated-column expressions may only reference **constant literals and other columns in the same row**, and may only call **scalar deterministic functions**. No subqueries, aggregates, or other tables. [sqlite.org/gencol.html](https://sqlite.org/gencol.html) §2.3.

Non-deterministic functions are banned in generated columns, expression indexes, and partial-index `WHERE` clauses. Date/time functions that use `'now'`, `localtime`, or `utc` **are** non-deterministic and **throw** in those contexts. `datetime('now')` and no-arg `datetime()` (same as `'now'`) are both rejected as of 3.35.2. [sqlite.org/deterministic.html](https://www.sqlite.org/deterministic.html) §2–3.1.

`DEFAULT (datetime('now'))` / this schema’s `unixepoch('subsecond')` is a **different** rule: evaluated **once at INSERT**, then stored. That is allowed. [CREATE TABLE DEFAULT](https://sqlite.org/lang_createtable.html) §3.2.

**Consequence for `new`:** a generated `isNew` that compares `createdAt` to now is **illegal**. VIRTUAL would recompute on read but still cannot call `'now'`. STORED would freeze the value at last write and go stale. Drizzle `.generatedAlwaysAs()` is the same SQLite feature. [Drizzle SQLite generated columns](https://orm.drizzle.team/docs/sqlite/generated-columns).

`$defaultFn` / `$onUpdateFn` run in **JS at insert/update**. They do not live in the schema, do not recompute on SELECT, and cannot implement a time-window flag. [Drizzle SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite).

CHECK constraints: SQLite documents that non-deterministic functions **ought** to be banned but historically **are not enforced**. Do not put `'now'` in CHECK; behavior is undefined. CHECK runs on **write**, not read, so it cannot implement “still new”. [deterministic.html §2.1](https://www.sqlite.org/deterministic.html), [CREATE TABLE CHECK](https://sqlite.org/lang_createtable.html) §3.7.

---

## 2. Cost / shape of each derivation style

| Mechanism | What it can see | When it runs | Indexability | Fit here |
| --- | --- | --- | --- | --- |
| **Stored column** (`state`, `isRented`) | Only what writers put there | Write | Ordinary B-tree. Cheap `WHERE isRented=0` | Host intent; claim lock |
| **SELECT `CASE`** | Same row **or** joined rows; **may** call `unixepoch('now')` | Read | Planner uses indexes on **referenced** columns if the `WHERE` matches them, not the CASE result, unless you add an [expression index](https://sqlite.org/expridx.html) (deterministic only — **no `'now'`**) | `new`; display CASE; occupancy `CASE WHEN rent.id IS NULL` |
| **JOIN `rent` `rentedTo IS NULL`** | Open rents (other table) | Read | Current `Rent_vanId_idx` helps `vanId`. A **partial** index `ON rent(vanId) WHERE rentedTo IS NULL` is the documented pattern for sparse NULL-ish subsets. [partialindex.html](https://sqlite.org/partialindex.html) | Occupancy source of truth |
| **Generated VIRTUAL** | Same row, deterministic | Read | Expression index | Concat / tax / FTS helpers — **not** `new`, **not** occupancy |
| **Generated STORED** | Same row, deterministic | Write | Ordinary index. `ALTER TABLE ADD` STORED is **forbidden**; Kit recreates the table. [gencol.html](https://sqlite.org/gencol.html), [Drizzle Kit notes](https://orm.drizzle.team/docs/sqlite/generated-columns) | Same limits as VIRTUAL, plus disk |
| **VIEW** | Any SELECT: JOIN, CASE, `'now'` | Read (named query). SQLite views are **read-only**. [CREATE VIEW](https://sqlite.org/lang_createview.html) | No storage. Indexes are on **base tables**. Planner inlines the SELECT | Convenience for a display SELECT. Not a cache |

**Postgres-only (not available here):** `CREATE MATERIALIZED VIEW` — persisted query result. Drizzle documents materialized views for PostgreSQL / Cockroach, not SQLite. [Drizzle views](https://orm.drizzle.team/docs/views), [Drizzle SQLite views](https://orm.drizzle.team/docs/sqlite/views) (`sqliteView` → ordinary `CREATE VIEW`).

Expression indexes cannot reference other tables or non-deterministic functions. You **cannot** index `createdAt > unixepoch('now', '-6 months')`. Filter `new` with `createdAt > :cutoff` and bind the cutoff in the query (or compute it in JS, as `isVanNew` does now). [expridx.html §2](https://sqlite.org/expridx.html).

`CASE` is first-true-wins, short-circuit. Fine for a **display** priority list. It is a **single** result, so it cannot emit three simultaneous statuses. [lang_expr.html §7](https://www.sqlite.org/lang_expr.html).

---

## 3. Drift: `isRented` vs open rents

Two occupancy representations exist:

1. `van.isRented` (denormalized lock).
2. `rent` rows with `rentedTo IS NULL` (event log).

Nothing in the schema **constrains** them to match. SQLite will not. A **unique partial index** would enforce “at most one open rent per van”:

```sql
CREATE UNIQUE INDEX Rent_one_open_per_van ON rent(vanId) WHERE rentedTo IS NULL;
```

That is the documented unique-partial-index pattern. [partialindex.html §2.1](https://sqlite.org/partialindex.html). This repo does **not** have it.

Writers already know the flag can lie: claim rollback clears `isRented` **only** when no open rent exists, so a concurrent success is not undone. Return **unconditionally** sets `isRented=false` for that `vanId` while closing **one** rent id — a second open rent (possible without the unique partial index) would leave occupancy wrong. [`rental-transaction.server.ts`](../app/features/host/dal/rental-transaction.server.ts).

**Why the flag exists anyway:** D1 cannot branch inside a transaction on the first statement’s `RETURNING`. The `UPDATE … WHERE isRented=0` is the atomic mutex. That is a **concurrency** reason, not a reporting reason.

If you keep the flag: treat it as a lock; never let UI or filters trust it without the open-rent predicate (or a periodic reconcile). If you drop it: unique partial index + `UPDATE … WHERE NOT EXISTS (open rent)` as the claim predicate.

Generated occupancy on `van` **cannot** JOIN `rent` (same-row rule). A VIEW that LEFT JOINs open rents is the SQL-native derive.

---

## 4. `AVAILABLE` is listing lifecycle, not occupancy

The stored enum is mutually exclusive: a van is repair **or** sale **or** available-to-list. Default is `AVAILABLE`. Rentability is a **compound** of occupancy + not-in-repair. Sale is compatible with being rented.

That split is the right one:

| Concept | Who decides | Orthogonal to |
| --- | --- | --- |
| Listing lifecycle (`state`) | Host | Whether a renter currently holds the van |
| Occupancy | Rent rows / lock | Whether the host marked it on sale |
| Age (`new`) | Clock vs `createdAt` | Both of the above |

Do not collapse occupancy into `state` (`RENTED` as a fourth enum). That fights sale+rented and repair+not-rented, and makes `new` a fifth fake state — which is what `lowercaseVanState` does today.

---

## 5. UI: stacked tags vs one priority badge

**This app now:** one exclusive overlay badge. `new` replaces sale/repair. `available` renders nothing. [`van-badge.tsx`](../app/features/vans/components/van-badge.tsx).

First-party systems that own this problem:

**Stacked / multiple statuses**

- [GOV.UK Tag](https://design-system.service.gov.uk/components/tag/): use a tag when something **can have more than one status** and the user needs to know. Start with the **smallest** set; “the more you add, the harder it is for users to remember them.” Adjectives, not verbs. **Not** links or buttons. Colour is optional emphasis; **not** the only channel (WCAG 1.4.1). Examples are mostly **one tag per row** (Active/Inactive, or a status vocabulary), not three chips on one card — spec is **silent** on overflow/`+N`.
- [USWDS Tag](https://designsystem.digital.gov/components/tag/): “draws attention to new or categorized content.” Explicitly allows **one or more** tags to filter. “Don’t overdo it.” Don’t mix interactive and static. Users confuse tags with buttons — disable hover if static.
- [NN/G visual indicators](https://www.nngroup.com/articles/visual-indicators-differentiators/) (2016, ecommerce listings): a **family** of indicators for attributes that co-occur — they use **“new” and “on sale”** as the example. Color+icon beat text-only (~37% faster find). Color alone fails color-blind users. This is the closest first-party research to this catalog card.

**One primary + overflow**

- GOV.UK, USWDS, M3 chips/badges, Apple HIG: **silent** on `+2` overflow chips on a product card. Do not invent a pattern and claim a DS owns it.

**Priority-exclusive badge**

- Valid when statuses are **mutually exclusive** (GOV.UK Active vs Inactive; task-list Completed vs not). Matches stored `VanState`. Does **not** match `new` ∩ `ON_SALE` ∩ occupancy, which are independent.
- If the card keeps **one** slot: pick from host-intent first (`IN_REPAIR` > `ON_SALE` > none), then occupancy if you must, **`new` last**. That is the inverse of today’s helper.

**Icon + text**

- M3 / Android **chips**: compact **interactive** entity = icon + `label`. Four types (assist / filter / input / suggestion) are all **actions or filters**, not static listing state. [Android chips](https://developer.android.com/develop/ui/compose/components/chip).
- M3 / Android **badges**: overlay on another composable (nav icon, cart). Count or short status. Not a row of product attributes. [Android badges](https://developer.android.com/develop/ui/compose/components/badges). `m3.material.io` chip/badge guideline HTML was not fetchable here (HTTP 422); Android developer docs are the first-party stand-in.
- Apple HIG **badge**: one supplementary string/count on a **list row / tab / menu**. “Keep contents as short as possible.” [SwiftUI badge(_:)](https://developer.apple.com/documentation/swiftui/view/badge(_:)-84e43). Notification badges are **not** for arbitrary numbers. [HIG Notifications](https://developer.apple.com/design/human-interface-guidelines/notifications).
- Apple HIG **color**: do not rely on color alone; add text or glyph. [HIG Color](https://developer.apple.com/design/human-interface-guidelines/color).

**For this catalog:** treat `VanState` as GOV.UK-style **one status tag** (hide `AVAILABLE` if absence means “listed”). Treat `new` and rented as **extra independent indicators** (NN/G family), static (GOV.UK/USWDS: not buttons). Do not reuse M3 filter chips unless they actually filter.

---

## 6. Accessibility: multiple statuses

**Visible text is the status.** WCAG 2.1 SC **1.4.1 Use of Color** (A): color is not the only visual means. Sufficient technique G14 = same info in **text**. [Understanding 1.4.1](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html). GOV.UK repeats this for tags. USWDS Tag a11y tests include 1.4.1, 1.4.3, 1.4.11. Apple HIG Color same rule.

`role="status"` is a **live region** (“advisory information … often a status bar”), implicit `aria-live="polite"` and `aria-atomic="true"`. [WAI-ARIA 1.2 status](https://www.w3.org/TR/wai-aria-1.2/#status). It is for **updates**, not a static badge on every card. Putting it on listing chips will either announce nothing useful on first paint or spam polite live regions. APG: no keyboard pattern; “No ARIA is better than Bad ARIA.” [APG Alert example](https://www.w3.org/WAI/ARIA/apg/patterns/alert/examples/alert/) (related live-region warning). USWDS says use live regions only when tags mark **dynamically loaded** new content.

`role="complementary"` is a **page landmark** (side content that still means something if split off). [WAI-ARIA 1.2 complementary](https://www.w3.org/TR/wai-aria-1.2/#complementary). **Not** for badges on a card.

`role="list"` / `listitem`: “a section containing listitem elements.” [WAI-ARIA 1.2 list](https://www.w3.org/TR/wai-aria-1.2/#list). Prefer host-language `<ul>`/`<li>` if you actually have a list of tags. Two tags do not require a list. WHATWG HTML has no “status badge” element; `output` is the host mapping for `status` (form/result), which this is not.

Icon-only: WCAG **1.1.1** text alternative. NN/G still wants the icon **plus** color; text in the chip covers 1.4.1 for sighted users.

---

## 7. Recommendation

| Facet | Store vs derive | Why |
| --- | --- | --- |
| **`VanState` enum** | **Store** | Host intent. Exclusive. Filterable. Optional SQL `CHECK (state IN (…))` — SQLite supports it; Drizzle enum does not emit it. |
| **`isRented` / occupancy** | **Derive** from `rent.rentedTo IS NULL` for reads. **Store** the boolean only while the D1 claim mutex needs it. Add unique partial index on open rents either way. | Two sources drift. Generated column cannot see `rent`. |
| **`new` / age** | **Derive** at read (`createdAt` vs cutoff in JS or `CASE` / `WHERE createdAt > :cutoff`). | `'now'` illegal in generated columns, indexes, partial `WHERE`. `$defaultFn` will not age. |
| **Display facet** | **Derive in UI** (or a read-only VIEW/SELECT of booleans). Do not persist `"new"` as a state. | Independent flags cannot share one enum. `CASE` yields one label; stacked tags need multiple booleans. |

**Display default if changing the helper:** keep one lifecycle badge from `state` (`repair` > `sale` > omit available). Add `new` as a second, quieter tag. Add rented only if the audience needs occupancy on the public card. If forced back to one badge: `repair` > `sale` > rented > `new`.

---

## Sources

- SQLite generated columns: https://sqlite.org/gencol.html
- SQLite deterministic functions / `'now'`: https://www.sqlite.org/deterministic.html
- SQLite CREATE TABLE (DEFAULT, CHECK, GENERATED): https://sqlite.org/lang_createtable.html
- SQLite CASE: https://www.sqlite.org/lang_expr.html
- SQLite views: https://sqlite.org/lang_createview.html
- SQLite partial indexes: https://sqlite.org/partialindex.html
- SQLite indexes on expressions: https://sqlite.org/expridx.html
- SQLite date/time `'now'`: https://www.sqlite.org/lang_datefunc.html
- Drizzle SQLite generated columns: https://orm.drizzle.team/docs/sqlite/generated-columns
- Drizzle SQLite views: https://orm.drizzle.team/docs/sqlite/views
- Drizzle views (PG materialized vs ordinary): https://orm.drizzle.team/docs/views
- Drizzle SQLite types / `$defaultFn`: https://orm.drizzle.team/docs/column-types/sqlite
- WAI-ARIA 1.2 `status`, `complementary`, `list`: https://www.w3.org/TR/wai-aria-1.2/
- WCAG 1.4.1: https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html
- GOV.UK Tag: https://design-system.service.gov.uk/components/tag/
- USWDS Tag: https://designsystem.digital.gov/components/tag/
- Android / M3 chips: https://developer.android.com/develop/ui/compose/components/chip
- Android / M3 badges: https://developer.android.com/develop/ui/compose/components/badges
- Apple HIG Color: https://developer.apple.com/design/human-interface-guidelines/color
- Apple SwiftUI `badge(_:)`: https://developer.apple.com/documentation/swiftui/view/badge(_:)-84e43
- NN/G indicator families: https://www.nngroup.com/articles/visual-indicators-differentiators/
- This repo: [`app/db/schema/van.ts`](../app/db/schema/van.ts), [`app/features/vans/utils/van-state-helpers.ts`](../app/features/vans/utils/van-state-helpers.ts), [`app/features/host/dal/rental-transaction.server.ts`](../app/features/host/dal/rental-transaction.server.ts)

**Silent in primary sources:** overflow/`+N` chips on a catalog card; using `role="status"` for static listing badges; SQLite materialized views (do not exist in core).
