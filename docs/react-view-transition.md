# React `<ViewTransition>` + React Router v8

**Date:** 2026-09-06

**Question:** People using **React Router v8** together with React's **`<ViewTransition>`** (from `"react"`, React 19+ Activity / View Transitions API — not only the CSS `view-transition-name` property, not only Remix v2). What pitfalls show up? What success patterns exist?

The consuming app is van-life:

- React `19.3.0-canary-eb8feb71-20260814` (same canary pin as current [react.dev `<ViewTransition>` examples](https://react.dev/reference/react/ViewTransition))
- `react-router` / `@react-router/dev` **8.3.1** (framework mode, Vite plugin, SSR)
- Mix of:
  - `<ViewTransition name="...">` from `"react"` wrapping cards, nav, footer, pagination, deferred Suspense content
  - `<Link viewTransition>` / `<NavLink viewTransition>` (this app: always-on via `CustomLink` / `CustomNavLink`)
  - raw CSS `viewTransitionName` on some elements
  - Panda `viewTransition("token")` classes for enter/exit (Panda owns `view-transition-class`; unique `view-transition-name` stays on the element)
  - Shared named anchors for list→detail (`van-image-${id}`, `card-${van.id}`, …)
  - Nested ViewTransitions (card wrapper + inner image/title/price/type)
  - `default="none"` plus `enter`/`exit` on deferred/pagination transitions
  - Suspense + Await + pending UI around some of these

**Method:** Primary sources only. Official docs: [react.dev ViewTransition](https://react.dev/reference/react/ViewTransition), [react.dev addTransitionType](https://react.dev/reference/react/addTransitionType), [react.dev Activity / View Transitions labs](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more), [reactrouter.com view transitions](https://reactrouter.com/how-to/view-transitions). Source: `facebook/react` (PR [#31975](https://github.com/facebook/react/pull/31975)), `remix-run/react-router` 8.3.1 (`packages/react-router/lib/components.tsx` `RouterProvider.setState`). Specs: [CSS View Transitions Module Level 1](https://www.w3.org/TR/css-view-transitions-1/), [Level 2](https://www.w3.org/TR/css-view-transitions-2/). First-party GitHub issues/PRs/discussions. Context7 `/websites/reactrouter` and `/websites/react_dev`. MDN for browser behavior. **No** blogs, tweets, SEO roundups, or Stack Overflow as evidence. Gaps labeled **inference, not specified**.

React Router version note: React Router 7 was the Remix merge. v8 is current. Many issues say “React Router 7”. Treat RR 7+ data/framework APIs as the same lineage unless a changelog shows v8 changed view-transition behavior. This note flags **RR7-reported, unconfirmed on 8.3** where that applies.

These are **two different layers**. Do not conflate them. Also distinguish raw CSS `view-transition-name`.

Status labels:

| Label | Meaning |
|-------|---------|
| **Docs** | Stated in react.dev or reactrouter.com |
| **Source** | Stated in React or React Router source / first-party PR |
| **Spec** | CSS View Transitions Module / MDN browser behavior |
| **Issue** | First-party GitHub issue/PR/discussion |
| **Inference** | Reasonable from those sources; not specified as this pairing |

---

## 1. Two layers (do not conflate)

Three things people call “view transitions”:

| Layer | API | Who starts `document.startViewTransition` | Who assigns `view-transition-name` |
|-------|-----|-------------------------------------------|--------------------------------------|
| **A. React `<ViewTransition>`** | `import { ViewTransition } from "react"` | **React**, during Transition / Suspense / `useDeferredValue` commits | React, **only when the boundary activates**. Auto-generated unless `name` is set. Reverted after `transition.ready`. |
| **B. RR `viewTransition`** | boolean on `Link` / `NavLink` / `Form` / `navigate` / `submit` | **React Router**, around the **final navigation state update** | You, via CSS / inline `viewTransitionName`, often gated by `useViewTransitionState` or NavLink `transitioning` |
| **C. Raw CSS `view-transition-name`** | `style={{ viewTransitionName }}` or Panda `css({ viewTransitionName })` | Whoever called `startViewTransition` (A or B or you) | Always on that element whenever the style is present — participates in **any** active document VT |

**Layer A — React.** [ViewTransition](https://react.dev/reference/react/ViewTransition):

> React automatically calls `startViewTransition` itself behind the scenes so you should never do that yourself. In fact, if you have something else on the page running a ViewTransition React will interrupt it. So it's recommended that you use React itself to coordinate these.

Names are not applied eagerly:

> React doesn't apply these eagerly but only at the time that boundary should participate in an animation.

**Layer B — React Router.** [how-to/view-transitions](https://reactrouter.com/how-to/view-transitions) `[MODES: framework, data]`:

> The simplest way to enable view transitions is by adding the `viewTransition` prop to your `Link`, `NavLink`, or `Form` components. This automatically wraps the navigation update in `document.startViewTransition()`.

`NavigateOptions.viewTransition` in [context.ts](https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/context.ts):

> Enables a View Transition for this navigation by wrapping the final state update in `document.startViewTransition()`. If you need to apply specific styles for this view transition, you will also need to leverage the `useViewTransitionState()` hook.

**Layer C — CSS.** [CSS VT L1 `view-transition-name`](https://www.w3.org/TR/css-view-transitions-1/#view-transition-name-prop): tags an element for independent capture. Names are **document-global**. Duplicate names: L1 **aborts the whole transition**. CSSWG L2 resolution 2026-04-02 ([csswg-drafts #13438](https://github.com/w3c/csswg-drafts/issues/13438)): skip only the duplicate name, rest continues. **Shipped browser behavior may still be L1 abort** until that lands.

**They interact because there is one document-scoped active view transition.** [CSS VT L1 `startViewTransition`](https://www.w3.org/TR/css-view-transitions-1/#dom-document-startviewtransition): starting a new one **cancels the document’s existing active view transition**.

---

## 2. Official contract

### 2.1 React `<ViewTransition>` props

Source: [react.dev/reference/react/ViewTransition](https://react.dev/reference/react/ViewTransition) (`version: canary`).

| Prop | Role |
|------|------|
| `name` | Shared-element pair key. Omit unless sharing across unmount/mount trees. React auto-names otherwise. |
| `enter` / `exit` / `share` / `update` | View Transition **Class**: `"auto"` \| `"none"` \| CSS class name \| `{ [transitionType]: class, default?: class }` |
| `default` | Fallback class for unspecified triggers. **`default="none"` turns off all other triggers unless they are listed.** |
| `onEnter` / `onExit` / `onShare` / `onUpdate` | JS Web Animations hooks. `onShare` wins over enter/exit. Return a cleanup. |
| `children` | Nearest DOM node(s) get the name when activated. Multiple sibling DOM nodes get a suffix. |

Activation triggers (React decides; you do not call `startViewTransition`):

- **enter** — first `ViewTransition` inserted in this Transition (top-level of the inserted tree; inner ones do not enter when the parent mounts).
- **exit** — first `ViewTransition` deleted (same “outside first DOM node” rule).
- **update** — DOM mutation inside the boundary **outside nested `ViewTransition`s**, or the boundary itself moves/resizes due to an **immediate sibling**.
- **share** — named `ViewTransition` in a deleted subtree **and** another with the **same `name`** in an inserted subtree, **same Transition**, **both in viewport**. Share beats enter/exit.

**When React starts a VT:** only for updates wrapped in a [Transition](https://react.dev/reference/react/useTransition), [`Suspense`](https://react.dev/reference/react/Suspense) fallback→content, or `useDeferredValue`. Plain `setState` does **not** activate `<ViewTransition>`. Sync `flushSync` in the middle of the VT sequence **skips** the animation ([docs](https://react.dev/reference/react/ViewTransition#how-does-viewtransition-work), [PR #32760](https://github.com/facebook/react/pull/32760)).

Lifecycle (docs): `getSnapshotBeforeUpdate` → assign some names → `startViewTransition` → mutate DOM / `useInsertionEffect` → wait for fonts (up to 500ms) → layout effects → **wait for any pending Navigation** → measure → `ready` → revert names → `onEnter`/`onExit`/`onUpdate`/`onShare` → `finished` → `useEffect`.

Concurrent React VTs: React waits for an in-flight React VT, then **batches** intervening updates (`A→B` then C then D becomes `B→D`).

### 2.2 React Router `viewTransition`

Sources: [how-to/view-transitions](https://reactrouter.com/how-to/view-transitions), [Link](https://reactrouter.com/api/components/Link), [useViewTransitionState](https://reactrouter.com/api/hooks/useViewTransitionState), [useNavigate](https://reactrouter.com/api/hooks/useNavigate), RR **8.3.1** [`packages/react-router/lib/components.tsx`](https://github.com/remix-run/react-router/blob/react-router@8.3.1/packages/react-router/lib/components.tsx) (`RouterProvider` `setState`).

Surfaces (`[modes: framework, data]` — **not** declarative `BrowserRouter`):

| Surface | How |
|---------|-----|
| `<Link viewTransition>` | Prop. Same as navigate option. |
| `<NavLink viewTransition>` | Same, plus `isTransitioning` render prop, `transitioning` class, `useViewTransitionState(to)` internally. |
| `<Form viewTransition>` | Same for submissions that navigate. |
| `navigate(to, { viewTransition: true })` | Same. |
| `submit(..., { viewTransition: true })` | Same. |

**When RR starts a VT:** after loaders/actions complete, on the **final** state update (`completeNavigation` → subscriber `viewTransitionOpts`). Not around the click. Async loaders are why RR owns this instead of wrapping `navigate()` at the call site ([#10696](https://github.com/remix-run/react-router/issues/10696) brophdawg11).

**8.3.1 `RouterProvider` paths** (`components.tsx`):

1. No `viewTransitionOpts` or no `document.startViewTransition` → `startTransition(() => setStateImpl)` (or `flushSync` if requested, or raw `setState` if `useTransitions === false`).
2. **`flushSync` + `viewTransition`:** `flushSync` to set `ViewTransitionContext` (`isTransitioning: true`), then `document.startViewTransition(() => flushSync(() => setStateImpl(newState)))`. Interrupts in-flight RR VT via `transition.skipTransition()`.
3. **Default `viewTransition` (no flushSync):** set pending state + `ViewTransitionContext`, `useEffect` creates a Deferred, then:

```js
document.startViewTransition(async () => {
  React.startTransition(() => setStateImpl(newState));
  await renderPromise; // resolved when committed location.key matches
});
```

POP: router remembers path pairs that used `viewTransition` and re-enables VT on back/forward ([`router.ts` `appliedViewTransitions`](https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/router/router.ts)).

Feature detect: `typeof document.startViewTransition === "function"`. Missing → warning + plain update. No animation, navigation still happens.

**`useViewTransitionState(to)`:** `true` while RR’s `ViewTransitionContext.isTransitioning` and `to` matches **current or next** pathname (so reverse list↔detail still styles). Requires the navigation to have opted into `viewTransition`. Must be under `react-router/dom`’s `RouterProvider` (framework: `HydratedRouter` uses that).

**NavLink `transitioning`:** applied when `viewTransition` is true **and** `useViewTransitionState(path)` is true. Official CSS pattern:

```css
a.transitioning img { view-transition-name: image-expand; }
```

### 2.3 When React starts a VT vs when RR starts one

| Event | RR `viewTransition` | React `<ViewTransition>` |
|-------|---------------------|--------------------------|
| `<Link viewTransition>` click, loaders done | Yes: `document.startViewTransition` around final `setState` | Maybe: that `setState` is inside `React.startTransition`, which **is** a React VT trigger |
| Same click, no RR `viewTransition` | No | Still maybe: RR **still** wraps updates in `startTransition` by default, so React VT **can** run without RR’s flag |
| Pagination via `startTransition` + nuqs (this app’s `PaginationControl`) | No (not a RR navigate with the flag) | Yes, if a `<ViewTransition>` activates |
| Suspense fallback → content | Only if a RR navigation’s final update is still in flight | Yes (Suspense is a documented trigger) |
| Sync `flushSync: true` navigation | RR starts VT **with** `flushSync` inside the callback | React **skips** its own VT (cannot complete synchronously) |
| Back button (popstate) | RR may start VT if the original PUSH opted in | React **skips** popstate animations unless the router uses the Navigation API |

**Inference, not specified as a combined recipe:** RR’s default `viewTransition` path is `startTransition` **inside** `document.startViewTransition`. React `<ViewTransition>` also wants to call `document.startViewTransition` for that same Transition. Spec: a second `startViewTransition` **cancels** the first. React docs: React **interrupts** a non-React VT. See pitfall 1.

### 2.4 SSR / hydration

- React `<ViewTransition>` names are applied **at activation time**, not eagerly → **inference:** they should not appear in SSR HTML from the React component itself.
- Raw CSS `viewTransitionName` **does** serialize into SSR HTML. Those names exist on first paint and on every later VT, including unrelated ones.
- React 19.2 changed `useId` prefix to `_r_` so generated IDs are valid `view-transition-name` / XML 1.0 names ([React 19.2 blog](https://react.dev/blog/2025/10/01/react-19-2)). This app is on canary, not 19.2 stable.
- Fizz nested enter/exit for streamed Suspense: [facebook/react #36917](https://github.com/facebook/react/issues/36917) (SSR `vt-parent-enter` / `vt-parent-exit` annotations). Not required to cite as shipping in this canary pin.
- Hydration: `HydratedRouter` comments that React 19 ignores server HTML on mismatch and can leave stale head tags. Not VT-specific. `view-transition-name` on server vs client (raw CSS always-on) is not a React hydration mismatch by itself if both render the same style.

### 2.5 Browser support / fallback

- React: `typeof ownerDocument.startViewTransition !== 'function'` → React’s `startViewTransition` helper returns `false`; update still commits, no animation ([PR #31975](https://github.com/facebook/react/pull/31975)).
- React VT styling uses **View Transitions Level 2** classes/types. [PR #31996](https://github.com/facebook/react/pull/31996): if the object form of `startViewTransition` throws (no v2), React **disables all** VT rather than animate with the wrong rules. Safari 18.0 / 18.1: no animate. Firefox at that PR: not shipped; MDN later: `Document.startViewTransition` **Baseline 2025**, newly available October 2025 ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition)).
- RR: same feature detect; navigation proceeds.
- Hidden document: MDN / spec skip the visual transition entirely.
- `prefers-reduced-motion`: **React does not disable animations.** Docs: always use `@media (prefers-reduced-motion)` yourself.

### 2.6 Canary vs stable React

| Channel | `<ViewTransition>` / `addTransitionType` |
|---------|------------------------------------------|
| 19.0 / 19.1 | Not present |
| 19.2 stable | **Activity** shipped. **ViewTransition did not.** 19.2 only prepared IDs / SSR batching “for supporting ViewTransition for Suspense during SSR”. |
| Canary / Experimental | Shipped to canary in [facebook/react #34712](https://github.com/facebook/react/issues/34712) (2025-10). Docs banner: **Canary and Experimental only**. Current export is `ViewTransition`, not `unstable_ViewTransition`. |
| This app | `19.3.0-canary-eb8feb71-20260814` — matches react.dev sandbox pins. |

### 2.7 Framework mode vs data mode

[how-to/view-transitions](https://reactrouter.com/how-to/view-transitions) is `[MODES: framework, data]`. Implementation lives on **data-router `RouterProvider`**. Framework `HydratedRouter` (8.3.1) imports `RouterProvider` from `./dom-router-provider` (flushSync-wired DOM provider). **No v8 changelog entry changes view-transition behavior** ([packages/react-router/CHANGELOG.md](https://github.com/remix-run/react-router/blob/main/packages/react-router/CHANGELOG.md) — last VT note is stabilize `unstable_viewTransition` in the 6.28 / 7.0 lineage, [#11989](https://github.com/remix-run/react-router/pull/11989) / [#11990](https://github.com/remix-run/react-router/pull/11990)).

**Does not work:** declarative `<BrowserRouter>`. [#10938](https://github.com/remix-run/react-router/issues/10938), [#12792](https://github.com/remix-run/react-router/issues/12792) (RR7 docs issue; still true: Link `viewTransition` is `[modes: framework, data]` only). This app uses framework `HydratedRouter` → **N/A**.

---

## 3. Pitfalls

### 1. Double `startViewTransition` (RR + React)

- **Symptom:** Flicker, aborted animation, default cross-fade of `:root` instead of named shares, `AbortError` on `transition.ready`, “partial” snapshots. Chrome: nothing clickable while `::view-transition` overlay is up ([sebmarkbage, #31975](https://github.com/facebook/react/pull/31975)).
- **Cause:** One document, one active VT. [L1 spec](https://www.w3.org/TR/css-view-transitions-1/#dom-document-startviewtransition): new `startViewTransition` **skips** the existing one. React docs: **never** call it yourself; React **interrupts** another page VT. RR docs: `viewTransition` **does** call `document.startViewTransition`. Default RR path then `startTransition`s the React update → React `<ViewTransition>` also wants to start a VT.
- **Who hit it:** No GitHub issue titled “RR + React `<ViewTransition>` double start” found. The clash is **docs vs docs**, not a filed bug. Related: [#10696](https://github.com/remix-run/react-router/issues/10696) (manual `startViewTransition` + RR navigate needed `flushSync`); React [#32760](https://github.com/facebook/react/pull/32760) (interrupt / skip when sync work lands mid-sequence).
- **Status:** **Docs-only conflict.** Unfixed as a combined API. RR7-era VT was designed **before** React `<ViewTransition>` existed (RR [#10916](https://github.com/remix-run/react-router/pull/10916), 2023; React [#31975](https://github.com/facebook/react/pull/31975), 2025).
- **Applies to this app?** **Yes.** `CustomLink` / `CustomNavLink` always set `viewTransition`. Same navigations also mount named React `<ViewTransition>` (van cards, nav, footer, pagination).

### 2. `flushSync` vs concurrent rendering / Suspense / React VT

- **Symptom:** React VT skipped (warning). Or RR VT snapshot taken before Suspense content exists. Or `flushSync` from `useEffect` warns (“cannot flush when React is already rendering”) — [discussion #12855](https://github.com/remix-run/react-router/discussions/12855).
- **Cause:** React VT is an async commit sequence; `flushSync` in the middle **skips** it ([ViewTransition docs](https://react.dev/reference/react/ViewTransition#how-does-viewtransition-work)). RR `flushSync: true` + `viewTransition` **intentionally** uses `flushSync` inside the VT callback (path 2 above). RR default `flushSync` option exists to opt **out** of `startTransition` ([#11003](https://github.com/remix-run/react-router/issues/11003)). brophdawg11: opting out of `startTransition` globally “may cause issues with … the future `<ViewTransition>` APIs” ([#12855](https://github.com/remix-run/react-router/discussions/12855), 2025-11-13). Stabilized `useTransitions` flag later (7.15 / 8.x `HydratedRouter.useTransitions`).
- **Who hit it:** [#11003](https://github.com/remix-run/react-router/issues/11003), [#12552](https://github.com/remix-run/react-router/issues/12552) (RR7 location vs render tearing), [#12855](https://github.com/remix-run/react-router/discussions/12855). React [#32760](https://github.com/facebook/react/pull/32760).
- **Status:** Closed/implemented for RR `flushSync` option. React skip-on-flushSync is **docs + source**.
- **Applies to this app?** **Unknown / unlikely on the default path.** App does not pass `flushSync` on links. Default RR VT path uses `startTransition` inside VT (compatible with React VT **triggers**, still conflicts on **who calls** `startViewTransition`). Pagination uses React `startTransition`, not RR `flushSync`.

### 3. Nested named transitions / duplicate `view-transition-name`

- **Symptom:** Dev error: *There are two `<ViewTransition>` components with the same name mounted at the same time.* Or whole CSS VT aborted (L1). Or only the duplicate name dropped (L2 resolution, not necessarily shipped).
- **Cause:** CSS names are document-global ([L1](https://www.w3.org/TR/css-view-transitions-1/#view-transition-name-prop)). React: only one `name` mounted in the **entire app** ([troubleshooting](https://react.dev/reference/react/ViewTransition#two-viewtransition-with-same-name)). Nested **unnamed** VTs are OK; nested **named** VTs must still be unique. Parent `card-${id}` + children `van-image-${id}` etc. are unique **per id**; two cards of the same van must not both mount.
- **Who hit it:** React docs troubleshooting. List-item `name="item"` is the official anti-pattern.
- **Status:** Docs. Spec L1 abort vs L2 skip-one ([#13438](https://github.com/w3c/csswg-drafts/issues/13438)).
- **Applies to this app?** **Partly yes.** List cards use `card-${van.id}` + `van-image-${id}` … — unique per id, good. **Raw CSS** names `van-header`, `income-amount`, `balance-amount`, `elapsed-days`, `host-chart` are **not** namespaced. `VanHeader` and host dashboard both use `van-header`. `host-chart` is on skeleton, chart, **and** empty-state wrapper — during a VT snapshot those can collide if more than one is in the tree. `income-amount` / `balance-amount` / `elapsed-days` reused across host income, rental-activity, wallet-activity — OK if those routes never share a snapshot; **not OK** if layout keeps one and Outlet swaps the other with the same name still painted.

### 4. Shared element (list→detail) name matching across routes

- **Symptom:** Cross-fade of the page instead of morph; or enter+exit instead of share; or element “flies in” from off-screen.
- **Cause:** Share requires: same `name`, unmount+mount **in the same Transition**, both in viewport. Docs: if Transition unmounts one side then shows a **Suspense fallback** before the new named node mounts, **no shared element**. Off-viewport side: no pair; nested unmount may still **exit** even if it should have been part of the parent ([known case](https://react.dev/reference/react/ViewTransition#animating-a-shared-element)). RR’s official gallery instead uses **CSS** names applied only while `isTransitioning` / `a.transitioning`, with the **same** name hardcoded on the detail page ([how-to](https://reactrouter.com/how-to/view-transitions)).
- **Who hit it:** React docs (Suspense gap). RR docs (conditional name to avoid duplicate names on a list of images — only the transitioning item gets `image-expand`).
- **Status:** Docs.
- **Applies to this app?** **Yes.** List and detail both use React `name={vanViewTransitionName.image(id)}` (always, not gated). That matches React’s shared-element recipe **if** the navigation is one Transition and detail is not behind a Suspense gap. Deferred `Await` on the detail page would **break share** (docs). Always-on names on a **list of many cards** means many `van-image-*` exist at once (unique per id — OK for React). RR `viewTransition` + React share in the same navigation is pitfall 1.

### 5. `default="none"` vs inherited / unspecified triggers

- **Symptom:** Unexpected cross-fades on updates; or **no** animation when you expected share/update.
- **Cause:** `default="none"` disables **all** triggers not explicitly listed ([class caveats](https://react.dev/reference/react/ViewTransition#view-transition-class-caveats)). Object class maps: unmatched types use `{ default }`; any matching type `"none"` wins and **does not assign a name** ([addTransitionType](https://react.dev/reference/react/addTransitionType)).
- **Who hit it:** Docs examples use `default="none"` + `enter`/`exit` for local animations so unrelated updates do not morph the subtree.
- **Status:** Docs.
- **Applies to this app?** **Yes.** `DeferredTransition`: `default="none"` + phase-gated `enter`/`exit` — matches docs. `PaginationOffsetTransition`: `enter`/`exit` maps with `forward`/`backward` **and** `default: "auto"`, **no** `default="none"` on the component — updates still use browser auto. Nav/footer: named, **no** `default="none"` / `update="none"` — child DOM updates (active link, year) can **update**-animate the whole chrome.

### 6. Link `viewTransition` without React `<ViewTransition>`, and vice versa

- **Symptom:** “I added `<ViewTransition>` but nothing animates” **or** “I added `viewTransition` but only a root cross-fade.”
- **Cause:** They are independent opt-ins.
  - RR flag **without** names/`<ViewTransition>`: browser default **root** cross-fade ([RR how-to](https://reactrouter.com/how-to/view-transitions)). Fine-grained morph needs CSS names + `useViewTransitionState` / `transitioning`.
  - React `<ViewTransition>` **without** RR flag: still activates if the update is a React Transition. RR **already** wraps navigations in `startTransition` by default — so React VT can run on navigations **without** `viewTransition`.
  - React `<ViewTransition>` **without** a Transition (sync setState): **does not activate** ([caveats](https://react.dev/reference/react/ViewTransition#caveats)).
- **Who hit it:** [#10938](https://github.com/remix-run/react-router/issues/10938) (`unstable_viewTransition` + `BrowserRouter` = nothing). React troubleshooting: VT as descendant of a DOM node does not enter/exit.
- **Status:** Docs + closed issue.
- **Applies to this app?** **Yes, both directions.** Always-on RR flag **and** React VT. Pagination is React-only (`startTransition` + `addTransitionType`, not RR `viewTransition`).

### 7. SSR: `view-transition-name` on server HTML, hydration

- **Symptom:** Names present on first paint; first client navigation morphs SSR-named elements that were never meant to participate. Hydration mismatch **if** client omits names React would only apply on activation (should not, if you only use `<ViewTransition>`). Mismatch **if** you gate CSS names on `useViewTransitionState` (false on server) vs always-on CSS names.
- **Cause:** React applies names only when activating (**client commit**). Raw CSS names are in HTML. RR’s `useViewTransitionState` is false until a client VT starts — official RR gallery puts **always-on** names on the **detail** page and **conditional** names on the **list** item so a full list does not duplicate `image-expand`.
- **Who hit it:** Not a dedicated RR issue. Follows from React “not eagerly” vs CSS always-on.
- **Status:** **Inference** from both contracts. `useId` 19.2 change is the only official SSR/VT-adjacent note.
- **Applies to this app?** **Yes for raw CSS names** (`host-chart`, `van-header`, `home-image`, `AUTH_VT.*`, …). React `<ViewTransition name>` should not hydrate-mismatch. Auth pages mix Panda `viewTransition("authTitle")` **and** inline `viewTransitionName` — class + name both in SSR HTML.

### 8. Same-route search-param / pagination vs cross-route

- **Symptom:** Pagination animates like a full page VT (root cross-fade, chrome morphs). Or pagination enter/exit never runs.
- **Cause:** RR `viewTransition` is per **navigation**, including search-param navigations, if the `Link`/`navigate` sets the flag. React enter/exit for a list page needs a **key** remount of the VT boundary (this app: `key={`pagination-page-${metadata.cursor}`}`) plus `addTransitionType('forward'|'backward')` inside `startTransition`. Types reset after each commit; a later Suspense reveal **does not** keep them ([addTransitionType caveats](https://react.dev/reference/react/addTransitionType#caveats)).
- **Who hit it:** Not a dedicated issue. Types caveat is docs.
- **Status:** Docs.
- **Applies to this app?** **Yes.** `PaginationControl` uses nuqs inside React `startTransition` + `addTransitionType` — **not** RR `viewTransition`. `PaginationOffsetTransition` keys on cursor — enter/exit. If any pagination UI still goes through `CustomLink viewTransition`, that navigation **also** starts RR VT (pitfall 1). Filter changes via `CustomLink` **are** RR VTs.

### 9. Outlet / layout persistence (nav/footer morphing)

- **Symptom:** Header/footer cross-fade or slide on every route change even though they “didn’t change.”
- **Cause:** Named or auto VT on persistent layout: **update** fires if children mutate outside nested VTs, or siblings resize ([#31975 heuristics](https://github.com/facebook/react/pull/31975)). Official opt-out: wrap children in `<ViewTransition update="none">` ([opting out](https://react.dev/reference/react/ViewTransition#opting-out-of-an-animation)). RR root cross-fade snapshots **the whole document** including layout unless you assign names / `view-transition-name: none` on chrome.
- **Who hit it:** sebmarkbage: naive VT “overly opts in every boundary… things floating around when unrelated updates happen.”
- **Status:** Docs + PR.
- **Applies to this app?** **Yes.** `<ViewTransition name="nav">` and `name="footer"` persist across `<Outlet />`. Footer copyright uses `new Date()` with `suppressHydrationWarning` — client year update can be an **update** trigger. Nav active-link DOM changes on every navigation.

### 10. `img` / `content-visibility` / stacking / snapshot skips

- **Symptom:** Blank snapshot, skipped element, wrong box, or VT abort.
- **Cause:**
  - React: image wrapped in `<ViewTransition>` **waits for the image to load** before animating ([Suspense section](https://react.dev/reference/react/ViewTransition#animating-from-suspense-content)).
  - Spec capture: if a flat-tree ancestor **skips its contents**, or element **is not rendered**, skip that element ([L1 capture](https://www.w3.org/TR/css-view-transitions-1/#capture-old-state)). `content-visibility: auto` skips off-screen contents.
  - During animation, captured elements are not painted / not hit-tested ([L1](https://www.w3.org/TR/css-view-transitions-1/)).
  - Default `:root { view-transition-name: root }` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using)) — unnamed page still has a root group.
- **Who hit it:** Spec. React image-wait is docs.
- **Status:** Spec + docs.
- **Applies to this app?** **Yes.** Van cards set `contentVisibility: "auto"` + `contain: "content"` on the named card wrapper. Off-screen cards: React share also skips off-viewport pairs. Progressive images inside `ViewTransition` may delay the whole React VT.

### 11. Reduced motion

- **Symptom:** Motion-sensitive users still get morphs.
- **Cause:** React explicitly does **not** honor `prefers-reduced-motion`. You must write the media query (or rely on your CSS library).
- **Who hit it:** [Always check prefers-reduced-motion](https://react.dev/reference/react/ViewTransition#always-check-prefers-reduced-motion).
- **Status:** Docs.
- **Applies to this app?** **Unknown** without auditing Panda `viewTransition` tokens / global CSS. Not specified in the React/RR pairing.

### 12. Firefox / Safari / Chrome differences

- **Symptom:** Animations in Chrome, none in Safari 18.0–18.1; older Firefox none; newer Firefox (MDN Baseline Oct 2025) yes. V2 class selectors ignored on v1-only engines.
- **Cause:** React **v2-only** ([#31996](https://github.com/facebook/react/pull/31996)). RR only checks `typeof startViewTransition === "function"` (v1 is enough for **root** cross-fade + `view-transition-name`). Panda/React **classes** (`::view-transition-old(.deferred)`) need v2.
- **Who hit it:** React PR #31996 (sebmarkbage). MDN Baseline note.
- **Status:** Source + MDN. Firefox “not shipped” in that PR is **stale relative to MDN 2025-10**.
- **Applies to this app?** **Yes** if you use enter/exit **classes** (deferred, pagination, auth Panda tokens). RR-only root fade would work on any v1 engine.

### 13. React canary vs 19.0 / 19.1 / 19.2

- **Symptom:** `ViewTransition` is not exported on stable 19.2. Types from `@types/react@19.2.x` may not match canary runtime (this repo pins `@types/react` **19.2.18** with `react` **canary**).
- **Cause:** [#34712](https://github.com/facebook/react/issues/34712); docs canary banner; 19.2 blog ships Activity only.
- **Who hit it:** React core.
- **Status:** Open as “not semver-stable yet.” Canary APIs may still change.
- **Applies to this app?** **Yes.** App is on canary **because** of this API.

### 14. Framework vs data mode

- **Symptom:** None expected for VT.
- **Cause:** Same `RouterProvider` implementation. Framework `HydratedRouter` wraps it.
- **Status:** Confirmed in 8.3.1 source. **No v8 VT changelog delta.**
- **Applies to this app?** No extra framework-only VT pitfall. (`prefetch` / `discover` on `Link` are framework-only but orthogonal.)

### 15. Concurrent navigations interrupting VT

- **Symptom:** Animation skipped; jumps to latest destination.
- **Cause:** RR: new navigation `abort()`s in-flight loaders; if a VT is running, `skipTransition()` then queues `interruption` and starts a new VT after cleanup (`components.tsx`). React: multiple updates while a VT runs → batch to last state (`B→D`). Spec: second `startViewTransition` aborts the first.
- **Who hit it:** RR source. React docs “How does ViewTransition work?”.
- **Status:** Implemented (RR) / documented (React).
- **Applies to this app?** **Yes** for rapid link clicks (always `viewTransition`) and overlapping deferred reveals.

### 16. `viewTransition: true` on `navigate()` vs Link prop

- **Symptom:** Programmatic nav has no animation; Links do (or the reverse).
- **Cause:** Same option, different call site. `useNavigate` must pass `{ viewTransition: true }`. Link prop does not affect `navigate()`. POP uses the stored pair from the **original** opted-in navigation.
- **Who hit it:** RR how-to programmatic section. `#10938` was Link + wrong router, not this.
- **Status:** Docs.
- **Applies to this app?** Pagination uses nuqs, not `navigate({ viewTransition: true })`. Auth `Form`s: check whether `viewTransition` is passed (CustomLink does; Form may not).

### 17. Keys / identity → enter+exit instead of share/update

- **Symptom:** Morph expected; fade-out + fade-in instead.
- **Cause:** Share is unmount/mount **same name**. Update is **same instance** moving. List reorder: use **keys**, not share — share skips off-viewport ([list reorder](https://react.dev/reference/react/ViewTransition#animating-reorder-of-items-in-a-list)). Wrapper `<div>` around keyed children blocks sibling reorder heuristics. `key` on `<ViewTransition>` (pagination cursor key) **forces** enter/exit — intended there, wrong for shared cards.
- **Who hit it:** React docs + [#31975](https://github.com/facebook/react/pull/31975) (“Managing instances and keys becomes extra important”).
- **Status:** Docs.
- **Applies to this app?** Pagination **wants** this. Van cards should **not** remount with a new key on list→detail. `ProgressiveImage key={imageUrl}` remounts the **img**, inside a named VT — that is an **update** (or inner enter) of the image subtree, not the card share name.

### 18. Multiple ViewTransition names colliding globally

- **Symptom:** Same as 3. Also: list of items all named `"nav"` / `"image-expand"`.
- **Cause:** React: namespace + id. RR gallery: **one** `image-expand` at a time via `isTransitioning`. CSS L1 abort on duplicates.
- **Numeric prefix:** `name` starting with a digit does not animate ([#33015](https://github.com/facebook/react/issues/33015), experimental, closed stale). UUID names fail ~10/16 times. **Community report on GitHub, not specified in docs.**
- **Status:** Docs (uniqueness). Issue #33015 stale/closed.
- **Applies to this app?** Van ids in `card-${van.id}` / `van-image-${id}` — **depends on id shape**. If ids are UUID/numeric-leading, **yes**. Auth/host raw names (`host-chart`, `van-header`) are global singletons by convention, not per-entity.

### 19. Suspense fallback swapping during an active VT (`DeferredTransition`)

- **Symptom:** Shared list→detail cancelled; fallback exit + content enter instead of morph; types from the navigation lost on reveal; extra `startViewTransition` (React Suspense trigger) while RR VT still running.
- **Cause:** Official two placements ([docs](https://react.dev/reference/react/ViewTransition#animating-from-suspense-content), [#31975](https://github.com/facebook/react/pull/31975)):
  - **Update / cross-fade:** `<ViewTransition><Suspense fallback={<A/>}><B/></Suspense></ViewTransition>` — same name, A→B is **update**.
  - **Enter/exit:** `<Suspense fallback={<ViewTransition><A/></ViewTransition>}><ViewTransition><B/></ViewTransition></Suspense>` — two instances.
  - Share **fails** if fallback appears between unmount and new named mount.
  - `addTransitionType` does **not** apply to the later reveal.
- **Who hit it:** React docs. RR [#12474](https://github.com/remix-run/react-router/issues/12474) (RR7): `startTransition` reuses Suspense so fallback may **not** show; maintainer suggested `useViewTransitionState` **in addition to** Suspense. **RR7-reported; same `startTransition` default in 8.3.**
- **Status:** Docs + closed RR7 issue.
- **Applies to this app?** **Yes.** `DeferredAwait` uses the **enter/exit** placement + `default="none"` + Panda `deferred` class — matches React’s second pattern. Do **not** put shared van names inside that deferred tree if you want list→detail share. A deferred reveal that happens **during** an RR `viewTransition` navigation is pitfall 1 + this.

### 20. React skip of popstate vs RR POP view transitions

- **Symptom:** Forward navigation animates; Back does not (or RR starts a VT that React then skips/interrupts).
- **Cause:** React: `startTransition` from legacy `popstate` must finish **synchronously** for scroll/form restoration → **React skips VT on back** unless the router uses the **Navigation API** ([Building View Transition enabled routers](https://react.dev/reference/react/ViewTransition#building-view-transition-enabled-routers)). RR: POP **does** re-enable `viewTransition` from `appliedViewTransitions`. RR does **not** document Navigation API usage for this.
- **Who hit it:** React docs (router authors). RR source for POP replay.
- **Status:** Docs vs RR implementation. **Inference:** pairing is hostile to Back animations for React `<ViewTransition>`.
- **Applies to this app?** **Yes** for list↔detail share on Back.

### 21. `useLayoutEffect` / Navigation wait deadlock

- **Symptom:** VT never starts; hung `ready`.
- **Cause:** React waits for pending Navigation. If Navigation is blocked on React, router must unblock in **`useLayoutEffect`**, not `useEffect` (deadlock) ([same section](https://react.dev/reference/react/ViewTransition#building-view-transition-enabled-routers)).
- **Who hit it:** React docs for router implementers. RR `RouterProvider` uses `useLayoutEffect` to subscribe and `useEffect` to kick `startViewTransition` — **not specified** whether that hits the deadlock with React’s Navigation wait.
- **Status:** Docs for custom routers. **Unknown** on RR 8.3 + React canary.
- **Applies to this app?** **Unknown.** You do not implement the router.

---

## 4. Success examples

### 4.1 Official react.dev — shared element (thumbnail ↔ fullscreen)

- **What:** Same `name={THUMBNAIL_NAME}` on thumbnail and fullscreen. `startTransition` around the state that swaps trees. No RR.
- **Versions:** Docs canary; sandbox `react@19.3.0-canary-eb8feb71-20260814`.
- **URL:** [Animating a shared element](https://react.dev/reference/react/ViewTransition#animating-a-shared-element)
- **Why it worked:** One coordinator (`startTransition`). Unique name. Both sides in the same Transition, no Suspense gap. Namespaced constant in a module (same idea as this app’s `van-view-transitions.ts`).

### 4.2 Official react.dev — enter/exit with `default="none"`

- **What:** `<ViewTransition enter="auto" exit="auto" default="none">` around inserted/deleted UI.
- **URL:** [Animating an element on enter/exit](https://react.dev/reference/react/ViewTransition#animating-an-element-on-enter)
- **Why it worked:** Local animation does not opt the rest of the page into updates.

### 4.3 Official react.dev — Suspense update vs enter/exit

- **What:** Wrap Suspense **or** wrap fallback and content separately.
- **URL:** [Animating from Suspense content](https://react.dev/reference/react/ViewTransition#animating-from-suspense-content); [PR #31975](https://github.com/facebook/react/pull/31975)
- **Why it worked:** Placement chooses update-crossfade vs two names enter/exit. This app’s `DeferredAwait` is the second pattern.

### 4.4 Official react.dev — opt out nested updates

- **What:** Parent VT for theme; children `<ViewTransition update="none">`.
- **URL:** [Opting-out of an animation](https://react.dev/reference/react/ViewTransition#opting-out-of-an-animation)
- **Why it worked:** Stops persistent chrome / page shells from morphing on every child update.

### 4.5 Official react.dev — Transition types for back/forward

- **What:** `addTransitionType('navigation-back'|'navigation-forward')` + `enter`/`exit` maps.
- **URL:** [addTransitionType](https://react.dev/reference/react/addTransitionType)
- **Why it worked:** Cause is on the Transition, not the DOM. This app’s pagination `addTransitionType(direction)` + `PaginationOffsetTransition` maps is this pattern (`forward` / `backward`).

### 4.6 Official RR — Link `viewTransition` + CSS names + `useViewTransitionState`

- **What:** Gallery list `NavLink viewTransition`; CSS `a.transitioning img { view-transition-name: image-expand }`; detail page **always** `view-transition-name: image-expand` on the img. Alternative: `useViewTransitionState(href)` to set inline `viewTransitionName` only while transitioning.
- **Versions:** Stabilized from `unstable_*` in [#11989](https://github.com/remix-run/react-router/pull/11989) (6.28 / 7 lineage). Unchanged in v8 changelogs. `[MODES: framework, data]`.
- **URL:** [reactrouter.com/how-to/view-transitions](https://reactrouter.com/how-to/view-transitions). Live demo cited by maintainers: [brophdawg11/react-router-records](https://github.com/brophdawg11/react-router-records) ([#10916](https://github.com/remix-run/react-router/pull/10916)).
- **Why it worked:** **RR owns `startViewTransition`.** Names applied **only for the active pair** on the list (avoids N duplicate `image-expand`). No React `<ViewTransition>`. `contain: layout` on images (RR snippet) — related to snapshot boxes.

### 4.7 RR `RouterProvider` from `react-router/dom`

- **What:** VT requires the DOM `RouterProvider` (flushSync implementation). Importing from `react-router` warns and cannot `flushSync`.
- **URL:** [RouterProvider](https://reactrouter.com/api/data-routers/RouterProvider); 8.3.1 `HydratedRouter` → `./dom-router-provider`.
- **Why it worked:** `startViewTransition` is a DOM API; RR wires `ReactDOM.flushSync` for the sync VT path.

### 4.8 Maintainer intent (Jacob Bailey / brophdawg11)

- **VT around the final update, not the click:** [#10696](https://github.com/remix-run/react-router/issues/10696) — async loaders/actions. Shipped in [#10916](https://github.com/remix-run/react-router/pull/10916).
- **Data router only:** [#10938](https://github.com/remix-run/react-router/issues/10938).
- **`startTransition` default vs future React VT:** [#12855](https://github.com/remix-run/react-router/discussions/12855) — do not globally disable `startTransition` if you want React `<ViewTransition>` to be able to trigger on navigations.

Ryan Florence: no first-party quote found in this pass that specifies React `<ViewTransition>` + RR `viewTransition` together.

### 4.9 Closed “working setup” issues

- [#10938](https://github.com/remix-run/react-router/issues/10938): VT works once you use `RouterProvider` (example tree historically `examples/view-transitions`; current docs inlined the gallery).
- [#11989](https://github.com/remix-run/react-router/pull/11989): `viewTransition` / `useViewTransitionState` stable names.

**No first-party closed issue documents “RR `viewTransition` + React `<ViewTransition>` together as the intended pairing.”** Closest React guidance: **migrate off** manual/`document.startViewTransition` to React. Closest RR guidance: RR **is** the thing that calls `document.startViewTransition`.

---

## 5. Recommended pairing for this stack

**Inference, not specified.** Neither docs site describes combining layer A and layer B. Recommendations follow from §1–§4.

**Pick one starter per navigation.** Two callers of `document.startViewTransition` is the documented footgun.

### Cross-route shared-element (van card → van detail)

**Prefer React as coordinator (this app already has the names):**

1. Keep shared `name`s in `van-view-transitions.ts` (React’s “module constant / namespace + id” recipe).
2. **Do not** set RR `viewTransition` on those list/detail links — **or** stop using React `<ViewTransition>` on those nodes and switch to the RR CSS recipe. Mixing both is pitfall 1.
3. RR still wraps the navigation in `startTransition` by default → React VT **can** activate without the RR flag (brophdawg11: keep `startTransition`; [#12855](https://github.com/remix-run/react-router/discussions/12855)).
4. Detail must **not** hide the named nodes behind a Suspense fallback (share dies). Load critical share targets in the same Transition as the route swap.
5. Both sides in viewport. `content-visibility: auto` on the card can skip capture (spec) and skip share (React viewport heuristic).
6. Back button: React skips popstate VT unless Navigation API — **do not expect** React share on Back until RR uses that API. **Inference.**

**If you prefer RR as coordinator (official gallery):**

1. Keep `<Link viewTransition>`.
2. Remove React `name`s from the morphing nodes (or you get duplicate names + double start).
3. Gate list-side CSS names with `useViewTransitionState` / `transitioning`; put matching names on detail.
4. Unique names per **active pair**, not per every visible card with the same token.

### Persistent chrome (nav, footer) that should **not** morph

Official React opt-out:

```tsx
<ViewTransition name="nav" default="none" update="none">
  …
</ViewTransition>
```

or wrap inner content in `<ViewTransition update="none">` ([docs](https://react.dev/reference/react/ViewTransition#opting-out-of-an-animation)).

Named persistent chrome **without** `update="none"` will still **update**-animate when children change. Raw CSS `viewTransitionName` on chrome participates in **RR root** VTs too — unset or `none` unless you intend a share.

**Inference:** if RR `viewTransition` stays always-on, also set `view-transition-name: none` on nav/footer during those VTs, or accept root+chrome in the snapshot.

### Same-route list pagination enter/exit

This app’s pattern already matches React docs:

- `startTransition` + `addTransitionType('forward'|'backward')`
- `<ViewTransition key={cursor} enter={{ forward, backward, default }} exit={…}>`
- **Not** RR `viewTransition` on those buttons

Keep it React-only. Add `default="none"` if updates (filter metadata, pending UI) should not auto-cross-fade. Types do not survive a later Suspense reveal.

### Suspense deferred content

Keep `DeferredAwait`’s enter/exit placement + `default="none"` — that **is** the official second pattern.

Do not put **shared** van names inside the deferred pair. A deferred reveal that races an RR `viewTransition` navigation will interrupt/batch (pitfalls 1, 15, 19).

If you want skeleton→content **cross-fade** instead of exit+enter, use the **outer** wrap: `<ViewTransition><Suspense fallback={skeleton}>{content}</Suspense></ViewTransition>` ([#31975](https://github.com/facebook/react/pull/31975)).

### Raw CSS `viewTransitionName` vs React `name` vs Panda class

| Use | Tool |
|-----|------|
| Share across routes (React-owned) | `<ViewTransition name={unique}>` only |
| Share across routes (RR-owned) | `viewTransition` + conditional CSS name |
| Enter/exit class animation | React `enter`/`exit` **class** (Panda `viewTransition("deferred")`) — v2 browsers |
| Always-on CSS name | Only when you want that node in **every** document VT (usually wrong) |

Replace global `host-chart` / `van-header` / `income-amount` always-on names with either React `<ViewTransition name>` (activated only when needed) or RR-gated names.

### Practical split for van-life (**inference**)

| Flow | Starter | Names |
|------|---------|-------|
| Van list ↔ detail | React `<ViewTransition name>` + RR **without** `viewTransition` on those links | `van-*` / `card-*` ids |
| Host/public chrome | React `default="none"` `update="none"` or no VT | none |
| Pagination | React only (`addTransitionType` + key) | auto / classes |
| Deferred Await | React enter/exit `default="none"` | auto / `deferred` class |
| Auth card morph | Pick **one**: CSS names + RR flag **or** React names, not both | `AUTH_VT.*` today is CSS always-on + Panda class |

---

## 6. Source index

- https://react.dev/reference/react/ViewTransition
- https://react.dev/reference/react/addTransitionType
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition
- https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more
- https://react.dev/blog/2025/10/01/react-19-2
- https://react.dev/community/versioning-policy
- https://reactrouter.com/how-to/view-transitions
- https://reactrouter.com/api/components/Link
- https://reactrouter.com/api/hooks/useViewTransitionState
- https://reactrouter.com/api/hooks/useNavigate
- https://reactrouter.com/api/framework-routers/HydratedRouter
- https://reactrouter.com/api/data-routers/RouterProvider
- https://www.w3.org/TR/css-view-transitions-1/
- https://www.w3.org/TR/css-view-transitions-2/
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
- https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
- https://github.com/facebook/react/pull/31975
- https://github.com/facebook/react/pull/31996
- https://github.com/facebook/react/pull/32105
- https://github.com/facebook/react/pull/32760
- https://github.com/facebook/react/issues/32764
- https://github.com/facebook/react/issues/33015
- https://github.com/facebook/react/issues/34712
- https://github.com/facebook/react/issues/36917
- https://github.com/remix-run/react-router/blob/react-router@8.3.1/packages/react-router/lib/components.tsx
- https://github.com/remix-run/react-router/blob/react-router@8.3.1/packages/react-router/lib/dom/lib.tsx
- https://github.com/remix-run/react-router/blob/react-router@8.3.1/packages/react-router/lib/dom-export/hydrated-router.tsx
- https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/context.ts
- https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/router/router.ts
- https://github.com/remix-run/react-router/blob/main/docs/how-to/view-transitions.md
- https://github.com/remix-run/react-router/blob/main/packages/react-router/CHANGELOG.md
- https://github.com/remix-run/react-router/pull/10916
- https://github.com/remix-run/react-router/pull/11989
- https://github.com/remix-run/react-router/pull/11990
- https://github.com/remix-run/react-router/issues/10696
- https://github.com/remix-run/react-router/issues/10938
- https://github.com/remix-run/react-router/issues/11003
- https://github.com/remix-run/react-router/issues/12474
- https://github.com/remix-run/react-router/issues/12552
- https://github.com/remix-run/react-router/issues/12792
- https://github.com/remix-run/react-router/discussions/12855
- https://github.com/w3c/csswg-drafts/issues/13438
- https://github.com/brophdawg11/react-router-records
- Context7 `/websites/react_dev` (ViewTransition props)
- Context7 `/websites/reactrouter` (viewTransition / useViewTransitionState)
- This repo: `app/components/deferred/transition.tsx`, `app/components/deferred/await.tsx`, `app/features/vans/components/van-view-transitions.ts`, `app/features/vans/components/van-card.tsx`, `app/features/pagination/components/pagination-offset-transition.tsx`, `app/features/pagination/components/pagination-control.tsx`, `app/components/links/custom-link.tsx`, `app/routes/layout/layout.tsx`, `panda.config.ts`
