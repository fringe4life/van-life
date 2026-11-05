# Van Life design system

Warm, light, editorial: orange-tinted surface, dark type, orange for action and
state. Surfaces layer; cards read; accents mark.

**Decisions only.** Panda's API — `css`, `cva`, `sva`, `cx`, patterns, conditions,
token paths, responsive objects, `keyframes()` — comes from the Panda MCP
(`@pandacss/mcp`). Token values and role names live in `theme/`. Variant lists
and a11y contracts live in the owning module. Long evidence lives in `docs/`.

## Sources

| Need | Open |
| --- | --- |
| Panda API | Panda MCP |
| Primitives, semantics, conditions, keyframes, view-transition bags, global CSS | `theme/` (wired by `panda.config.ts`) |
| Light/dark preference cookie and `data-theme` | `app/theme/` — not the design vocabulary |
| Layout helpers, skeleton | `app/styles.ts` |
| Shared primitives | `app/components/ui` |
| Glyphs | `app/components/icons` → [`docs/icon-packs.md`](./docs/icon-packs.md) |
| Type evidence (stacks, weights, money) | [`docs/typography.md`](./docs/typography.md) |
| Hand CSS outside Panda's object model | `app/app.css` — not a second token file |
| Generated helpers | `styled-system/*` — import, never edit |

## Colour

Consume semantic roles from `theme/semantic-tokens.ts`. Primitives in
`theme/tokens.ts` stay unread at call sites.

- A strong fill *pairs* with its `.foreground` at the point of use.
- Opacity lives in the token (`primary/90`), not a second translucent colour.
- Colour always *pairs* with text, a glyph, a label, or a disabled state.
- Availability (`status.*`), van type (`type.*`), and action availability are
  three families — a visual change in one must not redefine another.
- Orange is *earned*: action, route, rating, or deliberate emphasis.

Prefer an existing role over a new token; prefer a token over a raw value. A raw
value is justified only for a real layout constraint, a runtime custom property,
or a CSS function.

## Type

Faces and weights are defined in `theme/tokens.ts`; the short roles below are
the only ones. Evidence and per-face rounding: [`docs/typography.md`](./docs/typography.md).

| Role | Treatment |
| --- | --- |
| Body / UI | `fontFamily: "sans"`; weights `normal` \| `medium` \| `bold` only |
| Displayed money (`displayPrice()`) | `money` from [`figures.ts`](./app/components/ui/figures.ts) |
| Aligned statistic (column or in-place update) | `tabularNums` from the same file |
| Inline numeral or typed input | body face |

Keep prose out of a `money` element — suffix and label get their own nodes.
Money styles use `normal` or `bold` only. Metadata uses `muted.foreground`.

## Layout

Spacing, content widths (`sizes.content`, `sizes.shell`, …), and the responsive
gutter are Panda tokens — read `theme/tokens.ts` and `panda.config.ts`. Prefer
conditions over hand-written media queries.

- Named grid areas stay local to the parent; children receive the name; DOM
  order is visual order. Intrinsic or data-flow grids stay on explicit placement.
- Components that reflow inside a band use container queries against that band
  (`HostSummaryBand` / `summary`). Bound a middle step with a range condition;
  state the numeric *basis* once in the header, not on every figure.
- Shell breakouts and shared tracks: `gridMax`, `fullBleed`, `fullLayout`,
  `bgSkeleton` in `app/styles.ts`.

## Shape and elevation

Radius, shadow, and border roles are tokens. Borders explain grouping; an
element that is already distinct earns contrast or a border before another
shadow. Hero text shadow belongs to hero text over photography.

## Motion

Motion answers a state change. CSS only — keyframes, transitions, custom
properties, and pseudo-elements against markup we own.

- Shared keyframes → `theme/keyframes.ts`; one-offs → `keyframes()` at the
  consumer; named view-transition bags → `theme/view-transitions.ts`.
- Glyph motion is driven by ancestor state (`:hover`, `:focus-visible`,
  `[aria-current='page']`, `[data-held]`, `[data-pulse]`, `[open]`) so nothing
  animates on mount.
- `prefers-reduced-motion` in `theme/global-styles.ts` drops movement and keeps
  colour. Ambient loops only where they mean something (a pending spinner).

## Components

Compose the primitives already in `app/components/ui`. Variant maps and
behaviour contracts are the source of truth in those files — do not mirror them
here.

- Buttons: [`button-variants.ts`](./app/components/ui/button-variants.ts)
  (`css` + `cx`, not residual `cva` — [#270](https://github.com/fringe4life/van-life/issues/270)).
- Async submit: [`StatusButton`](./app/components/status-button.tsx).
- Badges: [`badge-variants.ts`](./app/components/ui/badge-variants.ts) — van
  state is not a feedback role.
- Forms: `Card` + `Field` + `Label` + `Input` + `Select` + `Textarea` +
  `FormError` + `StatusButton`. Keep `aria-invalid` / `aria-describedby` /
  `role="alert"`.
- Select, dialog, popover: native elements; scope `display` to `_open` so a
  closed dialog stays `display: none`.
- Money viz: `MoneyTimeline` / `MoneyLedger` on the page surface — never wrap
  data visualisation in a `Card`. Reviews use `rating` + `RatingMix`, not the
  chart palette.
- Transaction cards: the header row is its own container and the title steps
  with the card, so the ledger badge keeps its slot and gives up its word before
  the title wraps ([#481](https://github.com/fringe4life/van-life/issues/481)).

## Maintaining

Done when every item below holds:

1. New vocabulary lands in `theme/` and is wired in `panda.config.ts` before any
   consumer. One-off animations stay beside their consumer.
2. Every new strong background has a readable `.foreground`.
3. Static style calls stay extractable: literal values inside `css()`, never a
   spread, factory argument, or computed object.
4. Focus, disabled, pending, error, native-dialog, view-transition, and
   content-visibility behaviour survive the change.
5. After a token or global-style change: `bun x panda build`, `bun run check`,
   `bun run typecheck`, `bun run build`.

When a paragraph here starts explaining how Panda works rather than what we
chose, move it to the MCP's answer or to `docs/`.
