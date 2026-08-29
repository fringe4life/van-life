# Cursor pagination: page-size (`limit`) changes, URL parsers, and component split

**Question:** In cursor-based pagination (`cursor` + `direction` + `limit`, not offset/page numbers), when the user changes page size, should the UI keep the current cursor or reset to the first page? Do offset/page-number “reset to page 1” rules apply? Is splitting the UI into a limit-only control and a cursor-direction control (separate nuqs parser subsets) a good idea? Should an empty list be a separate unsuccessful-state component?

**Method:** First-party specs and API docs only (Relay, GraphQL.org, Apollo Client, Prisma, Stripe, Shopify, GitHub, nuqs, MDN where relevant). No blogs or SEO roundups. If a vendor does not specify UI behavior for “user changed page size,” that gap is labeled **inference, not specified**.

**Van Life (this repo)** — recommendations only; facts about the app are from source, not from external specs:

- `app/features/pagination/components/pagination.tsx` — one component; nuqs `paginationParsers` (`cursor`, `direction`, `limit`); `handleLimitChange` sets only `limit` (comment: keep cursor = position in dataset); `handlePageChange` sets `cursor` from first/last item id + `direction`.
- Empty list returns italic “No items found” instead of controls.
- Limit `<select>` is `disabled` when `!(hasNextPage || hasPreviousPage)`.
- Server: exclusive ID cursor (`lt`/`gt` on `id`), `take = limit + 1`, reverse order for `backward` (`get-cursor-metadata.server.ts`, `to-pagination.server.ts`).
- Filter/search/sort already reset cursor: `search-input.tsx`, `use-van-filters.ts`, `sortable.tsx`.

---

## 1. Verdict

**Keep the cursor when `limit` changes. Do not copy the offset “reset to page 1” rule.** Cursor is a bookmark in a stable order, not a page index. Specs treat page size (`first`/`last`/`limit`/`take`) and cursor (`after`/`before`/`starting_after`/`cursor`) as independent arguments. Changing window size at a fixed exclusive bookmark is well-defined and does not skip or duplicate the way `page × pageSize` arithmetic does.

Reset the cursor when the **ordered, filtered set** the cursor indexes is no longer the set you are querying (filters, search, sort), when the cursor is invalid/missing, or when an opaque continuation token encodes the old query (Stripe v2 page URLs). Resetting on mere `limit` change is a UX choice, not a correctness requirement.

**Component split:** optional. nuqs already supports subset writes and parser composition. Split only if the two controls truly never need an atomic multi-key update. Empty-state as a separate component is fine if it can still distinguish “empty connection” from “empty window after a cursor.”

---

## 2. Offset vs cursor: why page-1 reset exists

Offset/page-number UIs identify a window as **`skip = (page - 1) × pageSize`** (or `offset` + `limit`). Prisma documents this as “`skip` the number of pages multiplied by the number of results you show per page” ([Prisma Client pagination, offset](https://www.prisma.io/docs/orm/v6/prisma-client/queries/pagination)). GitHub REST uses `page` plus `per_page`; `link` URLs carry both, so changing `per_page` while keeping `page=N` is a different slice of the numbered list ([GitHub REST pagination](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)).

That arithmetic is why UIs reset to page 1 when page size changes:

| Old | New | Window |
|-----|-----|--------|
| page 3, size 10 | items 21–30 | |
| page 3, size 20 (keep page) | items 41–60 | **skips 31–40** |
| page 3, size 5 (keep page) | items 11–15 | **overlaps** old page 2 and **drops** 16–30 from this view without a stable bookmark |

GraphQL.org states the same instability for offset when the underlying list mutates: “if new records are added … offset calculations for subsequent pages may become ambiguous” ([GraphQL pagination](https://graphql.org/learn/pagination/)). Apollo’s offset `merge` example writes into `merged[offset + i]`; overlapping writes are a known hazard unless the merge is index-aware ([Apollo core pagination API](https://www.apollographql.com/docs/react/pagination/core-api)).

**Cursor pagination has no page index.** Prisma: “You cannot jump to a specific page using only a cursor. For example, you cannot accurately predict which cursor represents the start of page 400 (page size 20) without first requesting pages 1–399” ([Prisma cursor cons](https://www.prisma.io/docs/orm/v6/prisma-client/queries/pagination)). Relay’s algorithm applies cursors **first**, then slices by `first`/`last` ([Relay §4.4](https://relay.dev/graphql/connections.htm)). There is no `(page - 1) × size` to keep consistent, so the offset reason to reset **does not apply**.

nuqs’s `parseAsIndex` exists for **page-number** URLs (`page` stored 1-based, state 0-based), which is the offset family, not cursor bookmarks ([nuqs built-in parsers](https://nuqs.47ng.com/docs/parsers)).

---

## 3. What specs/APIs say about changing page size

**None of the required sources prescribe a UI rule** “when the user changes page size, reset the cursor” or “always keep it.” They define **independent arguments**. UI policy is **inference** from that model.

### Relay Cursor Connections Spec

Canonical: [relay.dev/graphql/connections.htm](https://relay.dev/graphql/connections.htm) (same text as [facebook.github.io/relay/graphql/connections.htm](https://facebook.github.io/relay/graphql/connections.htm)).

- Forward: `first` (non-negative integer) + `after` (cursor). Server returns edges **after** `after`, **at most** `first` ([§4.1](https://relay.dev/graphql/connections.htm)).
- Backward: `last` + `before` ([§4.2](https://relay.dev/graphql/connections.htm)).
- Algorithm: `ApplyCursorsToEdges` then slice by `first` (trim from the **end**) then `last` (trim from the **start**) ([§4.4](https://relay.dev/graphql/connections.htm)).
- Cursor on the edge is **opaque to the client** ([§3.1.2](https://relay.dev/graphql/connections.htm)).
- `startCursor` / `endCursor` may be **null if there are no results** ([§5.1](https://relay.dev/graphql/connections.htm)).
- Combining `first` and `last` in one request is **strongly discouraged** ([§4.4](https://relay.dev/graphql/connections.htm)).

Changing `first` while holding `after` is exactly “new window size at the same exclusive bookmark.” Relay does not mention resetting `after` when `first` changes.

### GraphQL.org pagination

[graphql.org/learn/pagination](https://graphql.org/learn/pagination/) describes `first` + `after` (ID or opaque cursor), prefers opaque (base64) cursors, and points at the Relay connection spec. `friendsConnection(first: Int, after: ID)` treats count and cursor as separate arguments. No UI page-size reset rule.

### Apollo Client

[Cursor-based pagination](https://www.apollographql.com/docs/react/pagination/cursor-based): ID-as-cursor + `limit`; cursor “identifies the item just before the beginning of the page”; `read` is `existing.slice(offset, offset + limit)` with `limit` defaulting independently of cursor. Relay-style example uses `comments(first: 10, after: $cursor)` and `fetchMore` only updates the cursor variable.

[Core pagination API](https://www.apollographql.com/docs/react/pagination/core-api): `fetchMore` **shallow-merges** variables; omitted keys (example: `limit`) **retain their original value**. That is the inverse of a limit-change (keep limit, change cursor) but the same independence. Apollo does not document a page-size control in a numbered-page UI.

### Prisma

[Current pagination overview](https://www.prisma.io/docs/orm/prisma-client/queries/pagination) and the fuller [v6 pagination page](https://www.prisma.io/docs/orm/v6/prisma-client/queries/pagination):

- Cursor query: `take` + `cursor` + usually `skip: 1` so the cursor row is **excluded**.
- Without `skip: 1`, the next page **includes** the cursor row (duplicate of last item of the previous page) — documented FAQ.
- Negative `take` pages backward.
- Nonexistent cursor: “Using a nonexistent cursor returns `null`. Prisma Client does not try to locate adjacent values.”
- Prisma 8 reading-data: non-unique sort keys need a **composite cursor** (e.g. `createdAt` + `id`) or pages can skip/repeat ties ([Prisma 8 reading data](https://www.prisma.io/docs/orm/fundamentals/reading-data)).

`take` (page size) is independent of `cursor`. Changing `take` at a fixed cursor is a valid Prisma query.

### Stripe

**v1** ([Pagination](https://docs.stripe.com/api/pagination)): `limit` (1–100, default 10), `starting_after` (object ID), `ending_before` (object ID), mutually exclusive. `starting_after` “defines your place in the list”; subsequent call after a page ending at `obj_foo` uses `starting_after=obj_foo`. `has_more` is end-of-list in the **forward** direction only (no `has_previous` in the v1 list object). Limit and cursor are separate parameters. No “reset cursor when limit changes.”

**v2** ([API v2 overview](https://docs.stripe.com/api-v2-overview)): opaque `page` token; `next_page_url` / `previous_page_url`. Example `next_page_url` **includes `limit=`** in the query string ([List accounts](https://docs.stripe.com/api/v2/core/accounts/list?api-version=2026-04-22.preview)). **“You can’t change list filters after the first request.”** Whether `limit` is a “filter” is **inference, not specified**; the continuation URL physically binds the previous `limit`. Do not assume you can swap `limit` on a v2 page token the way you swap `limit` on v1 `starting_after`.

### Shopify GraphQL (Admin + Storefront)

[Paginating results with GraphQL](https://shopify.dev/docs/api/usage/pagination-graphql) (Admin; Storefront `PageInfo` “in accordance with the Relay specification” — [Storefront PageInfo](https://shopify.dev/docs/api/storefront/latest/objects/PageInfo)):

- `first` / `after` and `last` / `before` are separate. Docs: “Typically, you should pass the `endCursor` of the previous page as `after`.”
- Example query variables: `$numProducts: Int!` and `$cursor: String` independently. “If the `$cursor` variable is omitted, then the `after` argument is ignored.”
- Cursors are opaque strings; decoded examples encode `last_id` and `last_value` (sort payload), not a page number.
- Storefront products: `first` and `after` as independent variables ([products query](https://shopify.dev/docs/api/storefront/latest/queries/products)).

Hydrogen keeps **pagination state in the URL** (shareable, back-button, crawlers) and uses `getPaginationVariables(request, { pageBy: 4 })` — `pageBy` is a **loader constant**, not a user-controlled `limit` query param in the documented example ([Hydrogen pagination](https://shopify.dev/docs/storefronts/headless/hydrogen/data-fetching/pagination)). Hydrogen does not document a page-size `<select>`.

### GitHub GraphQL

[Using pagination in the GraphQL API](https://docs.github.com/en/graphql/guides/using-pagination-in-the-graphql-api):

- Must supply `first` or `last` (1–100). “The cursor represents a specific position in the data set.”
- **Separate section “Changing the number of items per page”** — `first`/`last` control how many items are returned. Then a **separate** section for traversing with `after`/`before`.
- Worked example: first request `first: 100`; next request `first: 1, after: "<endCursor from previous>"`. That is a **new page size on the next hop**, not a reset to the start of the connection.

GitHub REST (offset-like `page` + `per_page`) is the contrast: `per_page` is copied into `link` URLs with `page` ([REST pagination](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)). GraphQL GitHub is cursor; REST GitHub is page numbers.

### Summary table (what is specified)

| Source | Page size arg | Cursor arg | Specified: reset cursor on size change? |
|--------|---------------|------------|------------------------------------------|
| Relay | `first` / `last` | `after` / `before` | No — independent; slice after cursor filter |
| GraphQL.org | `first` | `after` | No |
| Apollo | `limit` / `first` | `cursor` / `after` | No; `fetchMore` omits `limit` to keep it |
| Prisma | `take` | `cursor` | No |
| Stripe v1 | `limit` | `starting_after` / `ending_before` | No |
| Stripe v2 | `limit` on URL | opaque `page` | Continuation URL includes `limit`; filter change forbidden after first request |
| Shopify | `first` / `last` | `after` / `before` | No; variables independent |
| GitHub GraphQL | `first` / `last` | `after` / `before` | No; dedicated “change items per page” section |

---

## 4. Correctness: skip / duplicate / overlap when keeping the cursor

Assumptions matching Relay `after` / Stripe `starting_after` / Prisma `skip: 1` / Van Life `lt`/`gt` on id: **the cursor row is excluded**. Window = next (or previous) `limit` rows in a **fixed order**.

### Forward, exclusive cursor (the common case)

Ordered items `A B C D E F G H I J`. User clicked Next after seeing `A B C`, so `after = C`, `limit = 3` → `D E F`.

- **Increase limit to 5, keep `after = C`:** `D E F G H`. Previous window is a **prefix** of the new window. No skip. No duplicate of `A B C`. “Overlap” with the *old* current page is expected (same start, longer slice).
- **Decrease limit to 2, keep `after = C`:** `D E`. `F` is not in this window; it is still the next item after `E`. Not skipped from the dataset. Next still uses `endCursor` of the new window (`E`), not the stale `F`.

Relay slice-from-end after applying `after` is this behavior ([§4.4](https://relay.dev/graphql/connections.htm)).

### Inclusive cursor (if you forget `skip: 1`)

Prisma FAQ: without `skip: 1`, the new page **starts with the old last item** ([Prisma FAQ](https://www.prisma.io/docs/orm/v6/prisma-client/queries/pagination)). Changing `take` then duplicates that boundary item every time you refetch, independent of whether you reset. That is an implementation bug, not a reason to reset `limit`.

### Backward + reverse queries

Relay: `before` removes the cursor and everything after; `last` then keeps the tail of what remains; “the edge closest to `cursor` must come last” ([§4.3](https://relay.dev/graphql/connections.htm)). Prisma: negative `take`, `skip: 1`.

Van Life: `direction === "backward"` reverses SQL order, then `toPagination` reverses the page for display. Cursor is `items.at(0)` of the page you are leaving (first visible row), exclusive via `gt`/`lt`.

**Keep cursor + change limit while `direction` is `backward`:** the window still ends just before that bookmark and grows/shrinks toward the **start** of the list. That is correct per Relay `last`/`before`. UX: more items appear **above** the old first row, not below it. **Inference, not specified as UI copy.** Do not flip `direction` to `forward` as a side effect of changing `limit` unless you also change the cursor to match (otherwise you mix `last`/`before` semantics with `first`/`after`).

Relay discourages sending **both** `first` and `last` ([§4.4](https://relay.dev/graphql/connections.htm)). Van Life’s single `direction` plus `limit` matches one pair at a time.

### Opaque cursor vs ID-as-cursor

| Kind | Who | Implication for `limit` change |
|------|-----|--------------------------------|
| Opaque string | Relay, GraphQL.org (recommended), Shopify, GitHub GraphQL | Client must not parse it. Size is not stored in the cursor unless the **server** encoded it (Shopify encodes sort `last_id`/`last_value`, not page size — from example payloads in [Shopify pagination](https://shopify.dev/docs/api/usage/pagination-graphql)). Holding the same opaque cursor and sending a new `first` is the documented variable pattern. |
| Object ID | Stripe v1, Apollo ID-as-cursor, Prisma `cursor: { id }`, Van Life | Cursor is a row identity. Same exclusive semantics. Client *can* misuse the ID (guessing — Prisma: “you will page to an unknown location”). |
| Opaque page URL | Stripe v2 `next_page_url` | Token/URL may **embed** `limit`. Changing size may require a **new first request**, not a patched continuation. |

GraphQL.org: opaque cursors let the backend change pagination internals later ([graphql.org/learn/pagination](https://graphql.org/learn/pagination/)). Van Life’s URL exposes a UUID. That is allowed (Stripe v1 does it) but the client must not treat it as a page number.

### `hasNextPage` / `hasPreviousPage` vs empty pages

Relay ([§5.1](https://relay.dev/graphql/connections.htm)):

- `hasNextPage` with `first`: true iff remaining-after-cursors has **more than `first`** edges.
- `hasPreviousPage` with `last`: true iff remaining has more than `last`.
- With only `after` (forward): server **may** set `hasPreviousPage` true if it can cheaply see items before `after`; otherwise may return false.
- Empty `edges`: `startCursor`/`endCursor` **can be null**.

Shopify `PageInfo`: `hasPreviousPage` / `hasNextPage` describe results **before/after the current page** ([Shopify pagination](https://shopify.dev/docs/api/usage/pagination-graphql)). GitHub: same fields “indicate whether there is a page before and after the page that was returned” ([GitHub GraphQL pagination](https://docs.github.com/en/graphql/guides/using-pagination-in-the-graphql-api)). Stripe v1: only `has_more` after the set ([Stripe pagination](https://docs.stripe.com/api/pagination)).

**Empty first page** (no cursor, zero rows): connection is empty. `hasNext`/`hasPrevious` false. Limit control still meaningful if you want a different default for when data appears — **inference**.

**Empty after a cursor:** items deleted, filter no longer matches, or cursor past the end. Relay still allows `hasPreviousPage` true when `after` is set. Collapsing that into “No items found” with **no** prev control strands the user. Van Life `toPagination`: `items.length === 0` returns `PAGINATION_METADATA` (both flags false) even if `cursor` was set — **app behavior**, not Relay.

### Overlap with “load more” caches

Apollo `merge` that **appends** and a `read` that slices by cursor+limit can overwrite mid-list if the cursor falls in already-cached data ([Apollo cursor-based](https://www.apollographql.com/docs/react/pagination/cursor-based)). That is a **cache** concern for infinite scroll, not a reason to reset URL cursor when changing `limit` on a discrete page UI. Van Life re-fetches a single window from the server; it does not merge pages in an Apollo cache.

---

## 5. When you MUST reset the cursor

Correctness resets (cursor would index the wrong set or a missing row):

1. **Filter / search change** — cursor may not exist in the new subset. Prisma: missing cursor → `null`, no adjacent seek ([Prisma FAQ](https://www.prisma.io/docs/orm/v6/prisma-client/queries/pagination)). GraphQL.org: extra connection arguments change what the list is. Van Life already resets on search and van filters.
2. **Sort / order change** — Relay: “ordering must be consistent from page to page” ([§4.3](https://relay.dev/graphql/connections.htm)). Prisma: cursor pagination “requires you to sort by a sequential, unique column.” Shopify: slow/wrong results if search field ≠ `sortKey` ([Shopify pagination, search performance](https://shopify.dev/docs/api/usage/pagination-graphql)). Opaque Shopify-style cursors encode `last_value`; a new sort invalidates them. Van Life `Sortable` already sets `cursor` + `direction` to defaults.
3. **Opaque continuation that encodes the old query** — Stripe v2: cannot change filters after the first request; `next_page_url` includes `limit` ([API v2](https://docs.stripe.com/api-v2-overview), [List accounts](https://docs.stripe.com/api/v2/core/accounts/list?api-version=2026-04-22.preview)).
4. **Known-invalid cursor** — deleted ID, failed UUID parse (`parsePaginationCursor` in this app). Prisma does not snap to a neighbor.

Reset is **optional / UX**, not required by spec:

- User wants “start at the beginning with a bigger/smaller page.” Valid product choice; not what Relay/Stripe/GitHub GraphQL require.
- Offset muscle memory (“page size change → page 1”). That rule belongs to `page`/`offset`, not to exclusive cursors.

**Do not reset** on `limit` alone when sort, filters, and direction stay the same and the cursor is still a valid exclusive bookmark in that order.

---

## 6. nuqs: one `useQueryStates` vs split parsers

Sources: [useQueryStates / batching](https://nuqs.47ng.com/docs/batching), [server-side / shared parsers](https://nuqs.47ng.com/docs/server-side), [built-in parsers](https://nuqs.47ng.com/docs/parsers).

**Documented facts:**

- Multiple `useQueryState` updaters in the **same tick** are batched onto one URL write ([batching](https://nuqs.47ng.com/docs/batching)).
- `useQueryStates` is for keys that **should always move together**; setter accepts **all or a subset** of keys in one go ([useQueryStates](https://nuqs.47ng.com/docs/batching)).
- `setState(null)` clears **all keys managed by that hook**, other search params untouched ([useQueryStates](https://nuqs.47ng.com/docs/batching)).
- Parser objects are meant to be **reused** across `useQueryStates`, `createLoader`, `createSerializer` ([server-side](https://nuqs.47ng.com/docs/server-side)).
- Passing a **subset object** of a shared descriptor is the same composition pattern as `coordinatesParsers` reused on client and server — **inference** that `{ limit: paginationParsers.limit }` is supported; nuqs does not publish an anti-pattern named “don’t split pagination parsers.”
- `parseAsIndex` is for **page indexes**, not cursors ([parsers](https://nuqs.47ng.com/docs/parsers)).

**One hook with the full `paginationParsers` (current `Pagination`):** `const [{ limit }, setSearchParams] = useQueryStates(paginationParsers)` already **reads** the full set and **writes a subset** (`{ limit }` vs `{ cursor, direction }`). That is exactly the documented “subset of keys in one go” API. Cursor and direction stay coupled in `handlePageChange`.

**Two hooks with parser subsets:**

```ts
useQueryStates({ limit: paginationParsers.limit });
useQueryStates({
  cursor: paginationParsers.cursor,
  direction: paginationParsers.direction,
});
```

- Independent updates: fine; same-tick updates still batch ([batching](https://nuqs.47ng.com/docs/batching)).
- `null` on the limit hook would clear **only** `limit`, not cursor — good if that is intended; dangerous if someone thought `null` meant “reset pagination.”
- Atomic “reset cursor when X” **must** live on a setter that **includes** `cursor` (as `Sortable` and `SearchInput` already do). A limit-only hook **cannot** reset cursor without also taking those parsers or calling a sibling setter in the same tick.

nuqs does **not** require two components to use two hooks. Shared parser object + one hook + subset writes is the first-party happy path.

---

## 7. Component split: when it helps, when it doesn’t

**Not specified** by Relay, GraphQL, Stripe, Shopify, GitHub, or Apollo. Those are API/query models. Hydrogen’s `Pagination` is one component over a connection (`nodes`, `NextLink`, `PreviousLink`) with `pageBy` outside the URL ([Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen/data-fetching/pagination)).

**Helps (inference):**

- Limit control must remain usable when prev/next are hidden or disabled (single-page result). Coupling “no neighbors” to `disabled` on the `<select>` is a product bug (see §9), not a spec.
- Limit reused on screens that never paginate by cursor.
- Testing: limit vs navigation in isolation.

**Does not help:**

- Current `Pagination` is already small; two files for one toolbar add indirection without an extra atomic-update story.
- Split parsers that **omit** `cursor` make a future “reset on limit change” (if you ever want it) a cross-component coordination problem — the opposite of nuqs “keys that move together.”
- Empty state living only in the parent and controls in children still needs a shared “has items / has cursor” contract.

MDN: `<select disabled>` means the user cannot interact; disabled is inherited from ancestors ([MDN select](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)). No pagination semantics. Use `aria-label` (Van Life already has `aria-label="Pagination amount control"`). Prefer a visible `<label>` associated with the control for accessibility — **MDN usage notes**, not a pagination spec.

---

## 8. Empty-state split (`pagination-unsuccessful-state`)

**Specs:** empty `edges` + nullable cursors (Relay §5.1). GitHub/Shopify still return `pageInfo` on empty pages. Stripe list `data: []` with `has_more: false`. None define a React component named unsuccessful-state.

**Guidance (inference from PageInfo + this app’s `UnsuccesfulState`):**

| Situation | PageInfo-like flags | UI |
|-----------|---------------------|-----|
| No rows in the connection, no cursor | `hasNext`/`hasPrevious` false | True empty: “No items found.” Limit optional. No prev/next. |
| Zero rows **with** a cursor | Relay may still have `hasPreviousPage` if `after` is set | Not “empty dataset.” Offer Previous or a “Back to start” that clears cursor. |
| Error / failed load | Not pagination | Existing `UnsuccesfulState` / `isError` — different message than empty list. |

Splitting the empty copy into `pagination-unsuccessful-state` is **organizationally fine** if:

- It does not swallow prev/next when `cursor` is set and the window is empty.
- Error vs empty stay distinct (`UnsuccesfulState` already has `isError`).
- It does not disable limit solely because the list is empty (user may still want to change default page size for the next navigation) — **inference**.

Do not reuse a generic “error” layout for a successful empty page.

---

## 9. Recommendation for this app

1. **Keep `handleLimitChange` setting only `limit`.** Matches Relay slice-after-cursor, Stripe v1, Shopify/GitHub GraphQL variable split, Prisma `take` vs `cursor`, and the file’s own comment. Do **not** apply offset “reset to page 1.”
2. **Keep resetting cursor on search, filters, and sort** (already done). Those are the MUST-reset cases.
3. **Do not reset `direction` on limit change.** Backward window growth is toward the start of the list; flipping direction without a new cursor is a different query.
4. **Enable the limit `<select>` even when `!hasNextPage && !hasPreviousPage`.** Specs never tie page size to neighbor flags. On a single page of 12 items, the user must still be able to choose 5 vs 50. Disable only for true non-interactive states (loading/error), not “fits in one window.”
5. **Empty list:** distinguish no-cursor empty vs cursor-past-end. If you extract `pagination-unsuccessful-state`, pass `cursor` / `hasPreviousPage` (or keep prev enabled when `Boolean(cursor)` as `toPagination` already does for **non-empty** backward/forward). Fix `toPagination` empty-array path if you need `hasPreviousPage` when `cursor` is set and `items.length === 0` — today both flags are forced false.
6. **nuqs:** keep **one** `useQueryStates(paginationParsers)` (or `hostPaginationParsers` on host) in the pagination toolbar. Subset writes are enough. Split parser objects only if you extract a limit-only widget that must **never** clear cursor; even then, import `paginationParsers.limit` from the shared module — do not duplicate parser definitions.
7. **Component split** is optional polish, not a correctness fix. If split: `pagination-limit-control` owns `limit`; `pagination-cursor-control` owns `cursor`+`direction` **together** (nuqs “move together”). Do not split `cursor` from `direction`.
8. **ID-as-cursor:** Van Life matches Stripe v1, not Relay-opaque. Sorted host lists still `lt`/`gt` **id** while `orderBy` may use amount/date (`rental-activity.server.ts`). That can skip/repeat when the sort key is not unique with id — a **sort/cursor** issue (Prisma 8 composite-cursor warning), not introduced by keeping cursor on limit change. Limit change does not make that worse or better.

---

## 10. Sources

- Relay GraphQL Cursor Connections: [relay.dev/graphql/connections.htm](https://relay.dev/graphql/connections.htm), [facebook.github.io/relay/graphql/connections.htm](https://facebook.github.io/relay/graphql/connections.htm)
- GraphQL.org: [Pagination](https://graphql.org/learn/pagination/)
- Apollo Client: [Core pagination API](https://www.apollographql.com/docs/react/pagination/core-api), [Cursor-based pagination](https://www.apollographql.com/docs/react/pagination/cursor-based)
- Prisma: [Pagination (current)](https://www.prisma.io/docs/orm/prisma-client/queries/pagination), [Pagination (v6, cursor FAQ / skip: 1 / negative take)](https://www.prisma.io/docs/orm/v6/prisma-client/queries/pagination), [Reading data (Prisma 8 composite cursor)](https://www.prisma.io/docs/orm/fundamentals/reading-data)
- Stripe: [v1 Pagination](https://docs.stripe.com/api/pagination), [API v2 overview (list pagination)](https://docs.stripe.com/api-v2-overview), [v2 List accounts (`limit` on `next_page_url`)](https://docs.stripe.com/api/v2/core/accounts/list?api-version=2026-04-22.preview)
- Shopify: [Paginating results with GraphQL](https://shopify.dev/docs/api/usage/pagination-graphql), [Admin PageInfo](https://shopify.dev/docs/api/admin-graphql/unstable/objects/pageinfo), [Storefront PageInfo](https://shopify.dev/docs/api/storefront/latest/objects/PageInfo), [Storefront products](https://shopify.dev/docs/api/storefront/latest/queries/products), [Hydrogen pagination](https://shopify.dev/docs/storefronts/headless/hydrogen/data-fetching/pagination)
- GitHub: [GraphQL pagination](https://docs.github.com/en/graphql/guides/using-pagination-in-the-graphql-api), [REST pagination](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api) (offset/`page` contrast)
- nuqs: [useQueryStates and batching](https://nuqs.47ng.com/docs/batching), [Server-side / shared parsers](https://nuqs.47ng.com/docs/server-side), [Built-in parsers (`parseAsIndex`)](https://nuqs.47ng.com/docs/parsers)
- MDN: [HTML `select`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)
