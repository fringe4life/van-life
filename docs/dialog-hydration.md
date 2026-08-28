# Native `<dialog>` hydration vs React Router `.client` modules

**Question:** Is `suppressHydrationWarning` on `<dialog>` recommended? Can `*.client.tsx` make [`app/components/ui/dialog.tsx`](../app/components/ui/dialog.tsx) client-only so the `open=""` mismatch goes away?

**Answer:** `suppressHydrationWarning` on the `<dialog>` node is the right escape hatch. RR `.client` is **not** Next.js `"use client"`. It does **not** SSR a placeholder then hydrate a component. It **strips the module from the server bundle** and makes exports `undefined` on the server.

## What actually mismatches

Invoker `command="show-modal"` / `HTMLDialogElement.showModal()` set the **`open` content attribute** on the live element ([MDN `<dialog>` `open`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#open)). MDN: prefer `.show()` / `.showModal()` over the `open` attribute; the attribute alone is **non-modal**.

React’s client VDOM for an uncontrolled `<dialog>` has **no** `open` prop. Hydrate compares DOM vs VDOM → warning. React **does not patch** mismatched attributes ([`hydrateRoot` caveats](https://react.dev/reference/react-dom/client/hydrateRoot#hydrateroot)). Modal **stays open**. Good.

`open={false}` in React would try to omit `open`. HTML spec: stripping `open` after `showModal()` is **not** a proper close — no `close` event; document can **stay blocked**. Use `.close()` / invoker `command="close"`. Also: JSX `open` is the **non-modal** path; `showModal()` on an already `open` dialog throws ([facebook/react#24399](https://github.com/facebook/react/issues/24399)).

This can happen **before JS** on supporting browsers ([MDN Invoker Commands](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)) or if the menu is open during HMR.

## React Router `.client` / `*.client.tsx`

Official: [`.client` modules](https://reactrouter.com/api/framework-conventions/client-modules). Local: [special-files.md](../.agents/skills/react-router-framework-mode/references/special-files.md).

| Fact | Source |
|------|--------|
| Force file **out of the server bundle** (`*.client.ts` or `.client/` dir) | RR client-modules |
| Job: browser **side effects** (`window`, analytics, feature detect) | same |
| Exports are **`undefined` on the server** | same |
| Read those exports only in **`useEffect` or event handlers** | same |
| Not a “Client Component” that still SSRs | contrast Next `"use client"` |

If `dialog.tsx` → `dialog.client.tsx` and `MobileNav` (SSR layout) does `import { Dialog } from "…/dialog.client"`:

```txt
server: Dialog === undefined  →  <undefined />  or throw
client: real Dialog
```

No `<dialog id="mobile-nav-dialog">` in SSR HTML. Invoker `commandfor` has **nothing to open** until JS. That **removes** progressive enhancement RR documents as core ([progressive enhancement](https://reactrouter.com/explanation/progressive-enhancement): “Everybody has JavaScript disabled until it's loaded”).

Vite plugin `react-router:dot-client` rewrites matching modules on SSR to `export … undefined` ([plugin.ts](https://github.com/remix-run/react-router/blob/main/packages/react-router-dev/vite/plugin.ts)).

RR unstable **RSC** `"use client"` is a different mode ([RSC how-to](https://reactrouter.com/how-to/react-server-components)). This app is framework SSR (`ssr: true`), not that.

Next `"use client"` **still prerenders HTML** ([Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)). Would **not** fix this `open` mismatch. RR `.client` omits the node instead.

## Is `suppressHydrationWarning` recommended?

React: treat hydration mismatches as **bugs**, then an **escape hatch** when a **single element’s attribute/text is unavoidably different**.

- [Common components — `suppressHydrationWarning`](https://react.dev/reference/react-dom/components/common#suppresshydrationwarning): rare cases (timestamps); **one level deep**; **don’t overuse**.
- [`hydrateRoot` — suppressing unavoidable mismatches](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors): example is a date; React **will not** patch mismatched text.

This `open` attr is unavoidable **if** you keep HTML invokers + SSR `<dialog>` (browser mutates `open`, React does not own it). Putting the flag **on `<dialog>` only** matches “one level / don’t overuse.” Same pattern as the footer year in [`layout.tsx`](../app/routes/layout/layout.tsx).

Not a license to suppress the whole nav tree.

## Ranked options (this app)

| Rank | Approach | Verdict |
|------|----------|---------|
| 1 | SSR uncontrolled `<dialog>` + `suppressHydrationWarning` on that node | **Best.** HTML invokers work pre-JS. Warning silenced. Modal not slammed shut. |
| 2 | Two-pass `useEffect` / `isClient` (React “different client vs server” section) | Valid when you **want** different UI. Extra render, slower hydrate, menu dead until JS. Against invoker PE. |
| 3 | `dialog.client.tsx` imported from SSR `MobileNav` | **Wrong tool.** `undefined` on server. No dialog in HTML. |
| 4 | Controlled `open={false}` | Can close an already-open modal. |
| 5 | Wait for hydrate before `command` / polyfill | Kills pre-JS `show-modal`. |

`entry.client.tsx` + `invokers-polyfill` stays the polyfill slot ([docs/invokers-polyfill.md](./invokers-polyfill.md)). That is **not** the same as making `Dialog` a `.client` module.

## Sources

- https://reactrouter.com/api/framework-conventions/client-modules
- https://reactrouter.com/explanation/progressive-enhancement
- https://react.dev/reference/react-dom/components/common#suppresshydrationwarning
- https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#open
- https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
- https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element
- https://github.com/facebook/react/issues/24399
- https://github.com/remix-run/react-router/blob/main/packages/react-router-dev/vite/plugin.ts
- `.agents/skills/react-router-framework-mode/references/special-files.md`
