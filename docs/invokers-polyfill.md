# Invoker Commands polyfill (React Router 8 + Vite)

Declarative `command` / `commandfor` on `<button>` (open/close `<dialog>`, popovers). This app uses it in mobile nav.

Package: [`invokers-polyfill`](https://github.com/keithamus/invokers-polyfill) **1.0.4**. Spec: [MDN Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API), [Open UI explainer](https://open-ui.org/components/invokers.explainer/).

## Why `entry.client.tsx`

`react-router.config.ts` has `ssr: true`. Default import is:

```js
if (!isSupported()) apply();
```

`apply()` uses `document`. On Cloudflare/Node, `HTMLButtonElement` is missing → `isSupported()` is false → `apply()` runs → crash.

React Router’s slot for client libs is [`entry.client.tsx`](https://reactrouter.com/api/framework-conventions/entry.client.tsx) (first browser code, not in the SSR graph). Reveal:

```bash
bun x react-router reveal entry.client
```

Do **not** import `invokers-polyfill` from `root.tsx`, layouts, or `mobile-nav.tsx`.

`.client.ts` wrappers also strip from the server bundle. Prefer `entry.client` so listeners exist before `hydrateRoot`.

## Current wiring

```tsx
import "invokers-polyfill";
```

at the top of [`app/entry.client.tsx`](../app/entry.client.tsx). Auto-apply is enough there (browser-only). Manual `/fn` only if you need extra `document` / `isPolyfilled` guards.

## JSX

Keep lowercase `command` and `commandfor`. React DOM does not ship `commandFor` / `onCommand` yet ([facebook/react#32478](https://github.com/facebook/react/issues/32478), [PR #36493](https://github.com/facebook/react/pull/36493)). Unknown camelCase can be dropped. Types: [`app/types/react-html.d.ts`](../app/types/react-html.d.ts).

Buttons need **both** attributes and `type="button"` (form participant without it throws in the polyfill).

## Support vs polyfill

MDN: Baseline 2025 (December 2025). Approx first versions: Chrome/Edge 135, Firefox 144, Safari 26.2 ([Can I Use](https://caniuse.com/mdn-html_elements_button_commandfor)).

Supporting browsers: invokers work **before** JS. Polyfill: older browsers only **after** this client module.

## Limitations

- Polyfill does **not** set native implicit ARIA (`aria-expanded`, etc.). Modal hamburger: labels + `aria-labelledby` on the dialog are the right mapping; Open UI treats `aria-expanded` on `show-modal` as mostly redundant.
- User can open a native dialog before hydration. Keep `<dialog>` uncontrolled (no React `open={false}` that would slam it shut). `Dialog` sets `suppressHydrationWarning` so the browser-owned `open` attr does not warn. React will not patch it anyway — modal stays open. RR `.client` does **not** replace this; see [dialog-hydration.md](./dialog-hydration.md).
- Custom commands (`--foo`) need `addEventListener("command")`, not JSX `onCommand`.
