# Theme toggle without FOUC (React Router 8 + Cloudflare Workers SSR)

**Date:** 2026-09-09

**Question:** How does this app add a dark/light toggle that works with Cloudflare Workers SSR, respects `prefers-color-scheme` until the user overrides, and does **not** flicker or swap colors on hydrate? The author already uses `next-themes` on Next.js and wants the React Router v8 equivalent of that “no flash” contract.

**Answer:** Do **not** port `next-themes`. That library stores the choice in `localStorage`, so the Worker cannot put the right class on the first HTML. The proven RR equivalent is a **cookie on the document request** plus the class (or `data-theme`) on `<html>` in the **root `Layout` export**, so SSR HTML and the hydrate VDOM already match. React Router has **no** dedicated “dark mode” page; the mapping is the official **cookies + root `Layout` + `useRouteLoaderData("root")`** APIs. `remix-themes` is the maintained analogue of `next-themes` for RR, but this repo is better served by ~30 lines of `createCookie` + Layout class + a resource-route `action`. First visit with no cookie still cannot see OS preference on the Worker unless a Client Hint is present (not Baseline). Close that gap with either a **blocking `<head>` script** (what `next-themes` / `remix-themes` do) or a **Panda `_dark` condition that also matches `prefers-color-scheme` unless `.light` is set**. Do **not** apply the theme in `useEffect` on `document.documentElement` — that is the flash.

## Repo context

| Piece | This app |
| --- | --- |
| Router | `react-router` / `@react-router/dev` **8.3.1**, framework mode, `ssr: true` |
| React | **19.3** canary |
| Runtime | Cloudflare Workers (`workers/app.ts` → `createRequestHandler`) |
| Styles | Panda CSS **2.0.0-beta.16**; semantic tokens already use `_dark` |
| Document shell | [`app/root.tsx`](../app/root.tsx) `Layout` export renders `<html>` |
| HTML stream | [`app/entry.server.tsx`](../app/entry.server.tsx) `handleRequest` — injects the no-cookie theme script **outside** React |
| Chrome layout | [`app/routes/layout/layout.tsx`](../app/routes/layout/layout.tsx) is **Nav / main / footer**, not the document |
| Public HTML cache | [`app/constants/cache-headers.ts`](../app/constants/cache-headers.ts) `PUBLIC_SHORT_CACHE_HEADERS` = `public, max-age=…` + `Vary: Cookie` |

React Router 7 was the Remix merge. v8 is current. Cookie, `Layout`, and loader APIs cited below are the current docs at [reactrouter.com](https://reactrouter.com/). They do **not** mention “theme” or “dark mode” as a feature. Closest first-party hint: the root `Layout` example injects a CSS `--themeVar` from `useRouteLoaderData("root")`.

---

## 1. Why FOUC / hydration flash happens on SSR

Server HTML is a snapshot. Hydrate attaches React to that snapshot. React requires the client’s first render to match ([`hydrateRoot` caveats](https://react.dev/reference/react-dom/client/hydrateRoot#hydrateroot)): mismatches are bugs; attributes are **not** guaranteed to be patched.

Classic `next-themes` flash:

1. Worker/Node renders `<html>` **without** the user’s class (no `localStorage` on the server).
2. Browser paints that HTML + CSS → **light** (or whatever `:root` is).
3. JS loads. `ThemeProvider` / `useEffect` reads `localStorage` and sets `class="dark"` or `data-theme`.
4. Colors **jump**. If React’s VDOM still thinks there is no class, hydrate warns; `next-themes` tells you to put [`suppressHydrationWarning` on `<html>`](https://www.npmjs.com/package/next-themes) because it **mutates that node**.

`next-themes` README is explicit: *“we cannot know the `theme` on the server, so it will always be `undefined` until mounted on the client.”* Toggle UI that reads `useTheme().theme` during SSR is hydration-unsafe.

That is the problem this app must not copy onto Cloudflare SSR.

A second, unrelated FOUC: React Router’s root `Layout` exists so the document shell is **not** remounted when switching App / `HydrateFallback` / `ErrorBoundary`. Remounting `<html>` can drop and re-add `<link>` tags ([root.tsx `Layout`](https://reactrouter.com/api/framework-conventions/root.tsx)). Theme class belongs on **that** `Layout`, not only on the default `App` export.

---

## 2. Blocking script vs cookie on the document request

Two first-party patterns actually prevent the paint flash.

### A. Blocking script before first paint (`next-themes` / `remix-themes`)

`next-themes` injects a synchronous inline `<script>` that reads `localStorage` + `matchMedia('(prefers-color-scheme: dark)')` and writes `class` / `data-theme` / `color-scheme` on `document.documentElement` as the parser hits it ([npm README](https://www.npmjs.com/package/next-themes): `nonce`, `scriptProps`, Cloudflare Rocket Loader note).

`remix-themes` `PreventFlashOnWrongTheme` does the same when the **session theme is missing**: inline script in `<head>`, plus `<meta name="color-scheme">`. When the session **has** a theme, it does **not** inject the script ([remix-themes README](https://www.npmjs.com/package/remix-themes)).

Race if you only do this:

- Cloudflare SSR still emits a **default** theme in HTML (no class, or light tokens).
- Stylesheets in `<head>` are render-blocking. If the script runs **after** `<Links />`, CSS can paint light first, then the script flips to dark → still a flash.
- MDN: put [`<meta name="color-scheme">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme) in `<head>` **before CSS** to limit UA-chrome flashes (form controls, canvas). That does **not** restyle Panda `_dark` tokens by itself.
- Then React hydrates. If SSR VDOM has no class but the script already added `.dark`, that is a **mismatch**. `next-themes` silences it with `suppressHydrationWarning` on `<html>` (one level deep only — [React `suppressHydrationWarning`](https://react.dev/reference/react-dom/components/common#suppresshydrationwarning)).

Cloudflare Rocket Loader defers inline scripts and **breaks** this pattern. `next-themes` documents `scriptProps={{ 'data-cfasync': 'false' }}`. Same attribute if this app ever enables Rocket Loader.

This app does **not** put that `<script>` in `Layout`. React 19 logs `Encountered a script tag while rendering React component` and **does not execute** JSX `<script>` on the client ([facebook/react#34008](https://github.com/facebook/react/issues/34008)). The parser-run copy still has to be in the **SSR HTML**. [`app/entry.server.tsx`](../app/entry.server.tsx) races `readStoredTheme` with `renderToReadableStream` (`Promise.all`), then [`injectThemeBootstrapIntoStream`](../app/theme/theme-bootstrap.server.ts) splices the tag after `<meta name="color-scheme">` (still before `<Links />` CSS) only when the cookie is missing. Do **not** run this in [`app/entry.client.tsx`](../app/entry.client.tsx) — that module loads after first paint.

### B. Cookie on the document request (better on Workers)

The Worker **does** see `Cookie` on the incoming Fetch `Request` ([Workers Request](https://developers.cloudflare.com/workers/runtime-apis/request/), [RR reading headers](https://reactrouter.com/how-to/headers)). Root `loader` parses it and the `Layout` renders `<html className="dark">` (or `data-theme="dark"`). First HTML **already** has the class. CSS applies the right tokens. Hydrate sees the same class from serialized loader data. **No script, no mismatch, no flash** for returning visits.

This is the same shape as React Router’s own **user-prefs cookie** example ([sessions and cookies](https://reactrouter.com/explanation/sessions-and-cookies)) and **sidebar cookie + optimistic `fetcher.Form`** ([state management](https://reactrouter.com/explanation/state-management)).

**On Cloudflare Workers, B wins** for anyone who already has a cookie. A remains a **first-visit / cookie-missing** fallback because the Worker still cannot read `localStorage` or `matchMedia`.

---

## 3. Cookie vs `localStorage` (and the first-paint race)

| Storage | On the Worker request? | Survives SSR? | First paint |
| --- | --- | --- | --- |
| `Cookie` | Yes — `request.headers.get("Cookie")` | Yes — class in HTML | Correct once cookie exists |
| `localStorage` | **No** — browser only | No | Wrong until script/effect |

`HttpOnly` cookies are **not** readable from `document.cookie` ([MDN `HttpOnly`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)). A blocking script **cannot** use an HttpOnly theme cookie. That is fine: if the cookie exists, SSR already painted correctly; the script is only for the no-cookie case (`matchMedia`). `remix-themes` uses `httpOnly: true` on its session cookie.

Non-HttpOnly cookie lets client JS write `document.cookie`. **Do not.** `createCookie` values are JSON then base64 (`"dark"` → `ImRhcmsi`). A raw `theme=dark` string `parse`s as `{}`, not `"dark"` (verified against `react-router@8.3.1`). Prefer `action` + `Set-Cookie` from the same helper. React Router already revalidates after actions; `useRevalidator` is for **outside** normal mutations ([`useRevalidator`](https://reactrouter.com/api/hooks/useRevalidator)).

Unsigned `createCookie` is enough for `light` / `dark` / `system`. Theme is not a secret. Skip `createCookieSessionStorage` + `secrets` unless you want the `remix-themes` session wrapper. Do **not** use `createFileSessionStorage` (Node). `createWorkersKVSessionStorage` exists for sessions; overkill here.

---

## 4. React Router v8 APIs (no “theme” docs — map these)

**`createCookie(name, options)`** — [`/api/utils/createCookie`](https://reactrouter.com/api/utils/createCookie). Typical file: `app/cookies.server.ts` (docs example).

```ts
import { createCookie } from "react-router";

export const themeCookie = createCookie("theme", {
  maxAge: 31_536_000, // 1 year; docs example uses 604_800 for prefs
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: true, // omit / false on localhost; remix-themes README warns Safari drops cookies if `secure`/`domain` set in dev
});
```

**Parse in a loader** ([sessions and cookies](https://reactrouter.com/explanation/sessions-and-cookies)):

```ts
const cookieHeader = request.headers.get("Cookie");
const theme = (await themeCookie.parse(cookieHeader)) ?? null;
```

**Write in an action** — return `Set-Cookie` via `data()` or `redirect()`:

```ts
return data({ ok: true }, {
  headers: { "Set-Cookie": await themeCookie.serialize(nextTheme) },
});
```

`Set-Cookie` from loaders/actions is **automatically preserved** even if a child route’s `headers` export forgets to forward other loader headers ([HTTP headers](https://reactrouter.com/how-to/headers)). Other headers are **not** auto-sent; this app already documents that in `forwardDataHeaders`.

**Root `Layout`** — [`root.tsx`](https://reactrouter.com/api/framework-conventions/root.tsx):

- Renders the document. Takes `{ children }` only (App / `HydrateFallback` / `ErrorBoundary`).
- **`useLoaderData` is not legal here** (same restriction as `ErrorBoundary`: the loader may have thrown).
- Use **`useRouteLoaderData("root")`**, which may be `undefined`. Fork on that. Be defensive so `ErrorBoundary` can still render.
- Official example interpolates `data?.themeVar` into a `<style>` in `<head>`. Same hook for `className` / `data-theme` on `<html>`.

**`Scripts` / `nonce`** — render `<Scripts />` in the document ([`Scripts`](https://reactrouter.com/api/components/Scripts)). CSP with `unsafe-inline` needs a nonce on `ServerRouter` + the stream renderer; it flows to `Scripts` / `ScrollRestoration` ([security](https://reactrouter.com/how-to/security)). The theme bootstrap tag is injected in `entry.server`, not via React — if CSP lands, the **inject helper** must stamp the same nonce onto that `<script>`.

**Resource route** — module with `action`/`loader` and **no default component** ([resource routes](https://reactrouter.com/how-to/resource-routes)). POST from `fetcher.Form` / `<Form>`. Return `data()` for fetcher callers.

**Optimistic UI** — official sidebar example: `useFetcher()`, if `fetcher.formData` has the field, use that value immediately ([state management](https://reactrouter.com/explanation/state-management)). Theme toggle should do the same for the **class on `<html>`**, not wait for revalidation.

**`preventScrollReset`** — pass on the fetcher `Form` so a theme POST does not jump scroll (Form API; same family as `preventScrollReset` on navigations).

**`useRevalidator`** — not the primary toggle path.

---

## 5. Where to set the class on `<html>`

| Place | Verdict |
| --- | --- |
| [`app/root.tsx`](../app/root.tsx) **`Layout` export** | **Correct.** This is already the document. Add `className` / `data-theme` from `useRouteLoaderData("root")`. |
| Default `App` export rendering `<html>` | Works in the RR default-root example, but this repo **split** `Layout` vs `App`. Do not duplicate `<html>`. |
| [`app/routes/layout/layout.tsx`](../app/routes/layout/layout.tsx) | **Wrong node.** That file is chrome (`<Nav>`, `<main>`, `<footer>`). Class there does not drive Panda `_dark` (` .dark &` looks **up** for `.dark`). |
| `useEffect(() => { document.documentElement.classList.add("dark") })` | **Causes the flash.** Runs after paint + hydrate. Also a hydration mismatch if SSR omitted the class. |

Panda default `_dark` is **`.dark &`** ([conditional styles reference](https://panda-css.com/docs/concepts/conditional-styles)): the **ancestor** (typically `<html>`) needs class `dark`. Putting `dark` on `<body>` also works for descendants, but `<html>` is what `next-themes` / `remix-themes` / UA `color-scheme` expect.

This repo’s `Layout` today:

```tsx
<html className={css({ backgroundColor: "background" })} dir="ltr" lang="en">
```

`backgroundColor: "background"` already follows the `_dark` semantic token. Until `<html>` (or an ancestor — there is none) has `.dark`, **all those tokens stay on `base`**.

---

## 6. Toggle UX (after hydrate — not the FOUC problem)

FOUC is **first paint / hydrate**. A later click is a normal update.

| Pattern | Flash risk | Notes |
| --- | --- | --- |
| `<Form method="post">` / `fetcher.Form` → resource `action` → `Set-Cookie` | None on hydrate. Possible **one-frame** delay until revalidate unless optimistic. | Official. Progressive enhancement. `fetcher` + `formData` optimistic class on `<html>`. |
| Client `document.cookie = …` + `useRevalidator()` | Hydrate OK if SSR already matched. | Fights HttpOnly. RR: revalidator is the wrong tool for this mutation. |
| Optimistic `document.documentElement.classList` in the click handler **and** POST | None if the next loader returns the same theme. | Fine as a click-time paint. Do **not** do this in `useEffect` on mount. |
| Render toggle from `localStorage` / `useTheme()` before mount | **Hydration mismatch** (`next-themes` warning). | Cookie + loader data makes the toggle SSR-safe: the server knows the stored choice. |

Root `Layout` does not own the fetcher. Options:

1. Optimistic class in the click handler (imperative on `document.documentElement`) + `fetcher.submit`. Layout’s next render from loader data confirms it.
2. Lift theme into a tiny client wrapper **inside** `Layout` that reads `useFetcher` + loader data. Heavier.

Prefer 1 + `fetcher.Form` in nav. Keep the stored source of truth the cookie.

If cookie is `system` / missing, do not render “current theme is dark” from loader alone — that would be wrong on a light OS. Either leave the control as Light / Dark / System, or resolve “system” only in the blocking script / CSS (see §7).

---

## 7. System preference (`prefers-color-scheme`)

[MDN `prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme): OS/UA light or dark. **Not** on the Worker unless the client sends it.

[MDN `color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme): tells the UA which schemes the page can use (canvas, scrollbars, form controls). `:root { color-scheme: light dark; }` plus `<meta name="color-scheme" content="light dark" />` ([meta `color-scheme`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme)). When the user forces a theme, set `color-scheme: dark` or `light` on `:root` to match (Panda `css({ colorScheme: "dark" })` on `<html>`, or a small global).

**First visit, no cookie:**

- Worker should render **no** forced class (or `data-theme` empty).
- Then either:
  1. **CSS:** Panda `_osDark` / extended `_dark` that includes `@media (prefers-color-scheme: dark)` excluding `.light` (see §8). First paint is correct **without JS**. Hydrate matches (still no class). **Best if codegen is verified.**
  2. **Script:** `PreventFlashOnWrongTheme`-style blocking script spliced into the HTML stream from [`app/entry.server.tsx`](../app/entry.server.tsx) **after** `<meta name="color-scheme">` and **before** stylesheet `<link>`s. Sets `.dark` / `.light` from `matchMedia`. Needs `suppressHydrationWarning` on `<html>` because the script mutates the node React will hydrate. Do not render the tag from `Layout` (React 19 client warning + inert script).
  3. **Client hint:** `Sec-CH-Prefers-Color-Scheme` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Color-Scheme)). Experimental, **not Baseline**, needs `Accept-CH` + usually `Critical-CH` (retry) + `Vary`. Do not depend on this as the only path.

Cookie values: `light` | `dark` | omit (`system`). Omitting keeps CSS/script in charge. Setting `light` or `dark` is the user override.

---

## 8. Panda CSS (`_dark` / `_osDark` / `_light`)

Official table ([conditional styles](https://panda-css.com/docs/concepts/conditional-styles)):

| Condition | Selector |
| --- | --- |
| `_dark` | `.dark &` |
| `_light` | `.light &` |
| `_osDark` | `@media (prefers-color-scheme: dark)` |
| `_osLight` | `@media (prefers-color-scheme: light)` |

This repo’s [`theme/semantic-tokens.ts`](../theme/semantic-tokens.ts) is **class strategy**: `_dark` on almost every color. [`theme/conditions.ts`](../theme/conditions.ts) does **not** override `dark`. So **`<html class="dark">` is required** for those tokens. `_osDark` is a **different** condition; swapping tokens to `_osDark` would follow the OS **always** and ignore a user override.

Panda’s documented override ([customizing conditions](https://panda-css.com/docs/customization/conditions)):

```ts
conditions: {
  extend: {
    dark: '.dark &, [data-theme="dark"] &',
  },
}
```

That is **still class/attr**, not media. Multi-theme guide uses `data-color-mode` / `data-theme` on `<html>` ([multiple themes](https://panda-css.com/docs/guides/multiple-themes)).

**Class vs media:**

- **Media only (`_osDark`):** zero-JS first paint, no cookie, **no user override**.
- **Class only (`_dark`):** user override is trivial (`html.dark` / `html.light`); first visit is **light** until cookie or script.
- **Class + media (recommended combo, verify codegen):** keep using `_dark` in tokens; **extend** `dark` so it also applies under `@media (prefers-color-scheme: dark)` when `:root` is **not** `.light`. User override: cookie sets `.dark` or `.light` on `<html>`. Panda 2 **multi-block `@slot`** conditions emit two independent blocks ([conditions — Multi-block](https://panda-css.com/docs/customization/conditions)). Mixed **array** conditions **nest** (AND), they do not OR — do not use the array form for this.

Panda’s own `@slot` example is hover-vs-touch. Same shape for class-or-OS-dark. Put it in this repo’s [`theme/conditions.ts`](../theme/conditions.ts) `extend` (already how `_supportsBaseSelect` is added), not a second `conditions` key in `panda.config.ts`:

```ts
dark: {
  ".dark &": "@slot",
  "@media (prefers-color-scheme: dark)": {
    ":root:not(.light) &": "@slot",
  },
},
```

Expected CSS: one block `.dark .token`, plus `@media (prefers-color-scheme: dark) { :root:not(.light) .token }`. Run codegen and inspect before committing. If selector wrong, fall back to class-only + blocking script.

---

## 9. Libraries

| Library | What it is | RR v8 / Workers |
| --- | --- | --- |
| **`next-themes` 0.4.6** | React theme helper. Peer: `react` / `react-dom` only — **not** Next-only. Default store: **`localStorage`**. Blocking script + `suppressHydrationWarning` on `<html>`. | Runs in the browser. **Does not** put the class in Worker HTML. README: theme unknown on server. Rocket Loader caveat. **Do not install here.** Steal the **script-before-paint** idea only. |
| **`remix-themes` 2.0.4** | Cookie **session** + `ThemeProvider` + `PreventFlashOnWrongTheme` + `createThemeAction`. Peer: `react-router >= 7.0.0`. README: v2 is **RR v7**; Remix stays on ≤1.6.1. Last npm publish **2025-01-14**. | Semver includes 8.x. APIs it uses (`createCookieSessionStorage`, loaders, actions) still exist in current docs. Example puts `<html>` in the **default App** inside `ThemeProvider`, which **fights this repo’s `Layout` export**. HttpOnly session needs a `secrets` array (theme does not need signing). ~20 months without a release as of this note. |
| **RR official recipe** | **None** named “theme”. Use cookies + `Layout`. | This is the path. |

**Verdict for van-life:** skip both libraries. Cookie + root `Layout` class + resource `action` + no-cookie script from **`entry.server`** (or Panda media extend). `remix-themes` is acceptable if someone wants tab-sync and `PreventFlashOnWrongTheme` packaged, but wire `data-theme`/`class` in **`Layout`**, not a second `<html>`, and do not copy its in-React flash script.

---

## 10. Cloudflare-specific gotchas

- **Cookies on the Worker:** `request.headers.get("Cookie")`. Standard Fetch. No `document` on the server ([Workers Request](https://developers.cloudflare.com/workers/runtime-apis/request/)).
- **`Set-Cookie`:** Workers `Headers.append` keeps multiple `Set-Cookie` lines; `getAll("Set-Cookie")` is the Workers extension ([Workers Headers](https://developers.cloudflare.com/workers/runtime-apis/headers/)). Theme `action` should `append` if other middleware also sets cookies (this app already forwards Better Auth `Set-Cookie` in auth middleware).
- **Cache:** Workers Cache **will not** store responses that include `Set-Cookie` ([Workers Cache](https://developers.cloudflare.com/workers/runtime-apis/cache/)). Do **not** `Set-Cookie` from the **root GET loader** on every document request — that bypasses cache for public pages. Set the cookie only in the theme **action**.
- **Personalized HTML:** public catalog routes already send `Cache-Control: public` + **`Vary: Cookie`** (`PUBLIC_SHORT_CACHE_HEADERS`). A theme cookie is part of `Cookie`, so variants are separated **if** that header stays. If HTML is ever cached **without** `Vary: Cookie` (or `Vary: Sec-CH-Prefers-Color-Scheme` if you use hints), users get **someone else’s theme**. Host routes already use `private, no-store`.
- **Cache fragmentation:** more cookie values → more cache keys. Acceptable. Do not add a theme cookie to a URL that is cached as a single variant.
- **Rocket Loader:** disable on the theme inline script (`data-cfasync="false"`).
- **No Node APIs** in the cookie helper: `createCookie` from `react-router` is the right import.

---

## Recommended approach for this app

1. **`createCookie("theme")`** in a `*.server.ts` module. Values: `"light"` \| `"dark"`; missing = system. `httpOnly: true`, `path: "/"`, `sameSite: "lax"`, long `maxAge`. `secure` only in production.
2. **Root `loader` in `app/root.tsx`:** parse cookie, return `{ theme }`. No `Set-Cookie` on GET.
3. **Root `Layout`:** `useRouteLoaderData("root")`. If `theme === "dark"` → `class` includes `dark`. If `theme === "light"` → `class` includes `light`. Always keep the existing Panda `css({ backgroundColor: "background" })`. Set `<meta name="color-scheme" content={…} />` **before** `<Links />`. `color-scheme` CSS on `<html>` to match.
4. **Panda:** keep `_dark` tokens. Put `.dark` on `<html>` for overrides. For first visit, **either** extend `dark` with a verified media-query block **or** a blocking script injected from `entry.server` only when `theme` is missing ([`app/theme/theme-bootstrap.server.ts`](../app/theme/theme-bootstrap.server.ts)). Do not rewrite tokens to `_osDark`.
5. **Resource route** (e.g. `app/routes/theme.ts`, registered in [`app/routes.ts`](../app/routes.ts)): `action` only. Validate body. `serialize` cookie. Return `data()`.
6. **Nav toggle:** `fetcher.Form method="post" action="/theme"` with `preventScrollReset`. Optimistic: `html.classList` in the submit handler **and/or** `fetcher.formData`. Light / Dark / System. Not `useEffect` on mount.
7. **Cache:** leave `Vary: Cookie` on public HTML. Never cache themed HTML without it.

---

## Alternatives and tradeoffs

| Rank | Approach | When | Cost |
| --- | --- | --- | --- |
| 1 | Cookie + `Layout` class + no-cookie script from `entry.server` | This app | Small. Matches RR docs. SSR-safe. |
| 2 | `remix-themes` | Want packaged flash script + tab sync now | Session secrets, ThemeProvider vs `Layout`, stale v7 README, extra dep. |
| 3 | `next-themes` as-is | SPA / SSG only | **FOUC on this Worker SSR.** Hydration-unsafe toggle. |
| 4 | `_osDark` tokens only | No user override | First paint free. Toggle impossible. |
| 5 | Client hint only | Extra fast first paint in Chromium | Not Baseline. `Vary` + `Accept-CH`. First request still often missing. |
| 6 | `useEffect` + `localStorage` | Never on SSR | Classic flash. |

---

## Implementation sketch (not a PR)

Enough to implement later. APIs only.

```
app/theme/theme-cookie.server.ts       createCookie + parse/serialize helpers
app/theme/theme-bootstrap.server.ts     blocking script string + HTML/stream inject
app/entry.server.tsx                  Promise.all(cookie, render); inject if cookie missing
app/root.tsx                           loader + Layout class / meta (no <script>)
app/routes/theme.ts                    resource action (no default export)
app/routes.ts                          top-level route("theme", …) next to signout — not inside layout()
app/navigation/components/nav.tsx      fetcher.Form toggle (or a small ThemeToggle next to it)
theme/conditions.ts                    only if extending `dark` for system-without-cookie
```

[`app/routes.ts`](../app/routes.ts) already registers resource routes (`signout`, `robots.txt`, `sitemap.xml`) **outside** `layout("./routes/layout/layout.tsx")`. Theme POST belongs there so it is not wrapped in Nav/footer HTML. Local pattern: [`app/routes/auth/sign-out.ts`](../app/routes/auth/sign-out.ts).

**Root loader (sketch):**

```ts
export async function loader({ request }: Route.LoaderArgs) {
  const header = request.headers.get("Cookie");
  const theme = (await themeCookie.parse(header)) as "light" | "dark" | null;
  return { theme: theme === "light" || theme === "dark" ? theme : null };
}
```

**Layout (sketch):**

```tsx
export function Layout({ children }: Children) {
  const data = useRouteLoaderData("root") as { theme?: "light" | "dark" | null } | undefined;
  const theme = data?.theme ?? null;
  const htmlClass = cx(
    css({ backgroundColor: "background", colorScheme: theme ?? "light dark" }),
    theme === "dark" && "dark",
    theme === "light" && "light",
  );
  return (
    <html className={htmlClass} dir="ltr" lang="en" suppressHydrationWarning={theme == null}>
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content={theme ?? "light dark"} />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` **only** if a no-cookie script mutates class/style before hydrate. If first-visit theming is **pure CSS** (`:root:not(.light)` + media), omit the flag.

**`entry.server` (this app):** after `renderToReadableStream`, if `readStoredTheme` is `null`, pipe the body through `injectThemeBootstrapIntoStream`. Cookie parse and render are independent — wrap them in `Promise.all` so they do not waterfall ([`entry.server.tsx`](https://reactrouter.com/api/framework-conventions/entry.server.tsx)).

**Action (sketch):**

```ts
export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const next = form.get("theme");
  if (next !== "light" && next !== "dark" && next !== "system") {
    throw data({ ok: false }, { status: 400 });
  }
  if (next === "system") {
    return data(
      { theme: null },
      { headers: { "Set-Cookie": await themeCookie.serialize("", { maxAge: 0 }) } },
    );
  }
  return data(
    { theme: next },
    { headers: { "Set-Cookie": await themeCookie.serialize(next) } },
  );
}
```

Clearing **system**: do **not** `serialize(null)`. Installed `react-router@8.3.1` `createCookie` JSON+base64-encodes any non-empty value. `null` is encoded (`theme=bnVsbA%3D%3D`) and kept with the cookie `Max-Age` — cookie **stays**. Only `""` skips encoding ([`cookies.ts` serialize](https://github.com/remix-run/react-router/blob/react-router%408.3.1/packages/react-router/lib/server-runtime/cookies.ts)). `parse("theme=dark")` on a raw unencoded cookie returns `{}`, not `"dark"`. Always round-trip through this helper.

`expires: new Date(0)` without overriding `maxAge` also fails: Max-Age wins over Expires ([remix#5150](https://github.com/remix-run/remix/issues/5150)). Missing `Cookie.delete()`: [remix#6934](https://github.com/remix-run/remix/discussions/6934).

Expire for system (workaround until RR treats `null` as delete or ships `delete()`):

```ts
return data(
  { theme: null },
  {
    headers: {
      "Set-Cookie": await themeCookie.serialize("", { maxAge: 0 }),
    },
  },
);
```

(`Max-Age=0` from this package.) Loader must treat anything other than `"light"` | `"dark"` as system — including `null`, `""`, and `{}`. Implemented in [`app/theme/theme-cookie.server.ts`](../app/theme/theme-cookie.server.ts).

Inline script body (only if needed). Inject from `entry.server` after the color-scheme meta so it still runs **before** `<Links />` CSS. Do not put this tag in a React component:

```js
(() => {
  try {
    const root = document.documentElement;
    if (root.classList.contains("dark") || root.classList.contains("light")) return;
    const dark = matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(dark ? "dark" : "light");
    root.style.colorScheme = dark ? "dark" : "light";
  } catch {}
})();
```

React 19: a `<script>` in a component is **not** executed on the client ([facebook/react#34008](https://github.com/facebook/react/issues/34008); Vite forwards that `console.error`). `dangerouslySetInnerHTML` does not fix it. Keep the IIFE a string and splice it in `entry.server`. Do not use `async`/`defer` — that defeats before-paint. `entry.client.tsx` is also too late.

---

## Hydration / FOUC checklist

- [ ] First HTML for a cookied user already has `dark` or `light` on `<html>` (View Source / curl with the encoded `createCookie` value, not raw `theme=dark`).
- [ ] Hydrate: no mismatch warning on `<html>` class (unless the documented no-cookie script path + `suppressHydrationWarning`).
- [ ] No `useEffect` / `useState(mounted)` path that **applies** the theme after paint.
- [ ] Toggle UI may use loader `theme` (cookie is known on the server). Do not read `localStorage` during render.
- [ ] `<meta name="color-scheme">` is before `<Links />`.
- [ ] Optional script (if any) is injected from `entry.server` after `color-scheme` and before stylesheet links, blocking, `nonce` if CSP, `data-cfasync="false"` if Rocket Loader. Not in `Layout`. Not in `entry.client`.
- [ ] Public routes still `Vary: Cookie`. Theme action is the only `Set-Cookie` for this cookie. Root GET loader does not set it.
- [ ] Forced light while OS is dark: `html.light` and `_dark` must **not** still apply (media extend must `:not(.light)`).
- [ ] `Layout` still renders if root loader throws (`useRouteLoaderData` possibly `undefined`).
- [ ] Panda `_dark` still compiles to `.dark &` (or the extended selector you chose) after codegen.

---

## Sources

**React Router (current docs — v7/v8 lineage, no dedicated theme guide):**

- https://reactrouter.com/explanation/sessions-and-cookies
- https://reactrouter.com/explanation/state-management
- https://reactrouter.com/api/utils/createCookie
- https://reactrouter.com/api/utils/createCookieSessionStorage
- https://reactrouter.com/api/framework-conventions/root.tsx
- https://reactrouter.com/api/framework-conventions/entry.server.tsx
- https://reactrouter.com/how-to/headers
- https://reactrouter.com/how-to/resource-routes
- https://reactrouter.com/how-to/security
- https://reactrouter.com/api/hooks/useRevalidator
- https://reactrouter.com/api/components/Scripts
- https://github.com/remix-run/react-router/blob/react-router%408.3.1/packages/react-router/lib/server-runtime/cookies.ts
- https://github.com/remix-run/remix/issues/5150
- https://github.com/remix-run/remix/discussions/6934

**React:**

- https://react.dev/reference/react-dom/client/hydrateRoot
- https://react.dev/reference/react-dom/components/common#suppresshydrationwarning
- https://react.dev/reference/react-dom/components/script
- https://github.com/facebook/react/issues/34008

**Libraries (READMEs / npm, not blogs):**

- https://www.npmjs.com/package/next-themes
- https://www.npmjs.com/package/remix-themes
- https://github.com/abereghici/remix-themes

**Panda CSS:**

- https://panda-css.com/docs/concepts/conditional-styles
- https://panda-css.com/docs/customization/conditions
- https://panda-css.com/docs/guides/multiple-themes

**MDN:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
- https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Color-Scheme

**Cloudflare:**

- https://developers.cloudflare.com/workers/runtime-apis/request/
- https://developers.cloudflare.com/workers/runtime-apis/headers/
- https://developers.cloudflare.com/workers/runtime-apis/cache/
- https://developers.cloudflare.com/fundamentals/speed/rocket-loader/ignore-javascripts/ (via next-themes Rocket Loader note)

**This repo:**

- [`app/root.tsx`](../app/root.tsx)
- [`app/entry.server.tsx`](../app/entry.server.tsx)
- [`app/entry.client.tsx`](../app/entry.client.tsx)
- [`app/theme/theme-bootstrap.server.ts`](../app/theme/theme-bootstrap.server.ts)
- [`app/routes/layout/layout.tsx`](../app/routes/layout/layout.tsx)
- [`theme/semantic-tokens.ts`](../theme/semantic-tokens.ts)
- [`theme/conditions.ts`](../theme/conditions.ts)
- [`app/constants/cache-headers.ts`](../app/constants/cache-headers.ts)
- [`workers/app.ts`](../workers/app.ts)
- [`docs/dialog-hydration.md`](./dialog-hydration.md) (`suppressHydrationWarning` one-level rule already used here)
