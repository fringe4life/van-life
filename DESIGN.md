# Van Life design system

A warm, light, editorial interface for browsing camper vans and managing host
activity: a lightly orange-tinted surface, dark neutral type, orange reserved for
action and state, compact data controls. Surfaces are layered, not busy — the
page anchors, cards read, accents mark.

**This file records only the decisions PandaCSS cannot tell you.** For the API —
`css`, `cva`, `sva`, `cx`, patterns, conditions, token paths, responsive objects,
`keyframes()` — ask the Panda MCP server (`@pandacss/mcp`, already a dev
dependency), which is current with the installed version. What follows is the
repo's token vocabulary, the role each role plays, and the conventions a
contributor has to honour to stay inside it.

## Where things live

| Area | Owner |
| --- | --- |
| Primitive tokens, semantic roles, conditions, keyframes, view transitions | `theme/tokens.ts`, `theme/semantic-tokens.ts`, `theme/conditions.ts`, `theme/keyframes.ts`, `theme/view-transitions.ts` |
| Breakpoints, container names and sizes, `globalVars`, compiler options | `panda.config.ts` |
| Global selectors that are not component-local (rating rail, reduced motion, heading balance, body face) | `theme/global-styles.ts` |
| Hand-authored CSS outside Panda's object model (Inter `@font-face`, view-transition pseudo-elements, scroll-driven classes) | `app/app.css` |
| Generated helpers | `styled-system/*` — import, never edit |
| Shared layout helpers, skeleton recipe | `app/styles.ts` |
| Shared primitives | `app/components/ui` |
| Glyphs | `app/components/icons` — see [`icon-packs.md`](./docs/icon-packs.md) |
| Full type reasoning | [`docs/typography.md`](./docs/typography.md) |

`theme/` owns the vocabulary; `panda.config.ts` wires it up; `@pandacss/vite`
generates `styled-system` and injects the sheet. `app/app.css` is not a second
token file.

## Colour

Consume semantic roles. A raw value is justified only for a real layout
constraint, a runtime custom property, or a CSS function.

| Surface | Reads as |
| --- | --- |
| `surface` | the warm page behind route content and the shell |
| `surface.muted` | quiet panels, outline badges, filter affordances |
| `surface.accent` | highlighted bands — review tier, dialog content, emphasis |
| `card` / `card.foreground` | elevated reading surface |
| `popover` / `popover.foreground` | floating surfaces |
| `surface.overlay`, `surface.overlay.muted` | translucent filter containers, nested |
| `surface.inverse` / `surface.inverse.foreground` | deliberate contrast bands, footer |

| Content and interaction | Reads as |
| --- | --- |
| `foreground` | default content and dark controls |
| `muted.foreground` | metadata, helper text, empty states |
| `primary` / `primary.foreground` | the action, the selected sort, route hover |
| `secondary` / `secondary.foreground` | dark secondary action, high contrast |
| `accent` / `accent.foreground` | ghost hover, dialog content |
| `on-image` | copy over photography |

| Feedback | Reads as |
| --- | --- |
| `destructive` / `destructive.foreground` | errors, unavailable actions |
| `success` / `success.foreground` | completed or pending-positive state |

| Domain | Reads as |
| --- | --- |
| `status.new`, `status.sale`, `status.repair`, `status.unavailable` | van availability, each with a `.foreground` |
| `type.rugged`, `type.simple` | van type, each with a `.foreground` |
| `rating` | review stars and rating rails only |
| `chart.inflow` / `chart.outflow` | the only data colours: money arriving / leaving |
| `skeleton` / `skeleton.highlight` | loading placeholders and shimmer |

| Boundary | Reads as |
| --- | --- |
| `border` | default boundary |
| `border.subtle` | quiet separators |
| `border.strong` | high-emphasis boundary |
| `border.accent` | the desktop filter rail and intentional route emphasis |
| `input` | form-control boundary |
| `ring` | keyboard focus |

Rules:

- **A strong background ships with its `.foreground`.** Pair them at the point of
  use, never assume `foreground` stays readable on `primary`, `destructive` or a
  status fill.
- **Opacity lives in the token value** — `primary/90`, `border.accent/70` — not in
  a second translucent colour.
- **Colour is never the only signal.** Pair it with text, a glyph, a label or a
  disabled state.
- **Availability, van type and action availability are three different things.**
  They keep three token families and three variants so a visual change to one
  cannot silently change what another means.
- **Orange earns its place** as action, route, rating or deliberate emphasis.
  Sprayed across a page it stops meaning anything.
- **Primitives stay unread.** They live in `theme/tokens.ts` and reach components
  through a semantic alias; needing a new colour is usually a role used wrongly.

## Typography

| Role | Face |
| --- | --- |
| everything that is not money | Inter variable, `fontFamily: "sans"` |
| a displayed currency amount | Space Mono, `fontFamily: "mono"` |

- `theme/tokens.ts` writes each stack once; `body` in `theme/global-styles.ts`
  takes the sans face from the token. **No third family** — a new face has to
  earn a role in the table below.
- Sizes come from the named scale (`xs` … `5xl`, plus `2xs` for the inverse
  footer attribution); route headings scale with responsive objects. Headings are
  `bold`–`extrabold` with balanced wrapping, already global.
- Metadata sits in `muted.foreground`, never a raw gray.

### Money and tabular figures

Two questions, and "money versus statistics" is only a proxy for them:

1. **Does the numeral need to align?** A column, or one that updates in place,
   gets `tabular-nums`. Inter has it; it costs nothing.
2. **Is the numeral the subject of its block?** Only then does it leave Inter.

| Role | Test | Treatment |
| --- | --- | --- |
| Money | a displayed amount from `displayPrice()` | `money` from [`figures.ts`](./app/components/ui/figures.ts) |
| Aligned statistic | count, percentage, average, date, range | `tabularNums` from the same file |
| Label | a numeral inline with prose | body face, inherits weight |
| Input | any numeral a user can type | body face, never the subset |

- **Keep prose out of a `money` element.** The subset is digits, separators,
  currency marks and two dashes; a `/day` suffix or a label gets its own element.
- **Money styles use `normal` or `bold` only.** Space Mono ships those two; asking
  for `semibold` renders 700 while the CSS claims otherwise.

Why the dividing line is the numeral's role rather than money-versus-statistics,
which face ships and at what measured byte cost, how the subset is generated and
what is preloaded on first paint: [`docs/typography.md`](./docs/typography.md).

## Spacing and layout

- Spacing uses Panda's scale (`gap: "4"`, `padding: "6"`), and the responsive
  inline gutter is the `padding-inline` token.
- Responsive values use Panda conditions, not hand-written media queries.
- Content widths: `sizes.content` (public reading, `64rem`), `sizes.shell` (max
  application width, `80rem`), `sizes.sm|md|lg|2xl` for forms and narrow blocks.
- Shell rows come from `--header-height` and `--footer-height`. The shell is a
  centred track capped at `sizes.shell` with responsive gutters; public hero
  imagery breaks out with `fullLayout`, and dashboard bands keep the shell's
  inline padding so edges line up.
- `gridMax`, `fullBleed`, `fullLayout` and `bgSkeleton` come from
  [`app/styles.ts`](./app/styles.ts).

**Named grid areas** where a grid has stable regions (`nav`, `content`, `filter`,
`image`, `details`, `metadata`, `action`): the parent owns the responsive map,
children receive the name, and names stay local rather than becoming tokens. A
wrapper that owns a real grouping gets one outer area and becomes a nested grid.
Keep DOM order as the visual order. Intrinsic or data-flow grids (auto-fit lists,
metric pairs, pagination) are clearer with explicit placement.

**Container queries, not viewport queries, for components that reflow inside a
band.** `HostSummaryBand` names the `summary` container and picks its step from
the band's own width: stacked, two figures in a row from `@summary/lg`, statement
lines from `@summary/4xl`. Two lessons came out of building it:

- Bound a middle step with a range condition (`@summary/lgTo4xl`) instead of
  relying on a wider size out-ranking it in the cascade.
- **State the basis once.** Every figure in the band is all-time, so the window is
  stated in the header slot rather than qualifying one number and leaving the next
  one open.

## Shape and elevation

| Radius | Use |
| --- | --- |
| `control` (4px) | compact native controls |
| `sm` (0.375rem) | small images, links, compact controls |
| `md` (0.5rem) | default control and card sub-element |
| `lg` (0.625rem) | grouped filter surfaces, nested panels |
| `xl` (0.75rem) | cards, dialogs, primary containers |
| `full` | pills, skeleton badges |

Borders explain grouping rather than outline everything: cards take `border`,
nested filter groups `border.subtle`, the desktop filter rail `border.accent`.
Elevation: `xs` for compact controls and filter surfaces, `sm` for cards, `md` for
transient overlays. An element that is already distinct earns contrast or a
border, not another shadow. Hero text shadow belongs to hero text over photography.

## Motion

Motion answers a state change; it never decorates a static page. **No animation
library** — CSS keyframes, transitions, custom properties and pseudo-elements
against markup we own.

| Mechanism | Owns |
| --- | --- |
| `easings.glide` | dialog and panel translation |
| `easings.spring`, `easings.springSoft` | glyph morphs; the restrained host-list rise |
| `--duration-dialog` | native dialog and mobile navigation |
| `theme/keyframes.ts` | anything shared by three or more consumers |
| `keyframes()` at the consumer | one-off beats |
| `theme/view-transitions.ts` | named view-transition bags (`authTitle`, `authFooter`, `sortableTitle`) |

- Glyph motion is driven by ancestor state — `:hover`, `:focus-visible`,
  `[aria-current='page']`, `[data-held]`, `[data-pulse]`, `[open]` — so nothing
  animates on mount and static captures stay deterministic.
- `prefers-reduced-motion: reduce` is one guard in `theme/global-styles.ts`: view
  transitions and every SVG part drop their animation, colour still lands.
  Ambient loops only where they mean something (a pending spinner), never in the
  sticky header.
- A transition is never the only way a state change is communicated, and unique
  view-transition names stay on the element when a named bag is also used.

## Components

- **Buttons.** [`button-variants.ts`](./app/components/ui/button-variants.ts) is
  the source of truth: `default`, `destructive`, `ghost`, `link`, `outline`,
  `secondary`, sizes `default|sm|lg|icon`, built as `css()` maps composed with
  `cx()` rather than residual `cva` so open-props ships no unused `.raw`/`config`
  ([#270](https://github.com/fringe4life/van-life/issues/270)).
- **Async actions** use [`StatusButton`](./app/components/status-button.tsx): one
  20px box for its three marks, dimensions stable across states, full opacity
  while a status shows (a faded glyph is not a legible one) and `disabled`
  blocking a second submit. Pending links take `success`; active links keep an
  underline so the state survives without colour.
- **Badges.** [`badge-variants.ts`](./app/components/ui/badge-variants.ts) owns
  `luxury`, `new`, `outline`, `repair`, `rugged`, `sale`, `simple`, `unavailable`.
  Short labels, explicit foreground pairings, and no feedback role borrowed for a
  van state.
- **Cards and forms.** [`card.tsx`](./app/components/ui/card.tsx) owns the
  elevated surface; forms compose `Card`, `Field`, `Label`, `Input`, `Select`,
  `Textarea`, `FormError`, `StatusButton` instead of restyling controls. Inputs
  use `input.background`, `input.foreground`, `input`, `placeholder`, `ring`;
  labels `foreground`; error text `destructive`. Keep `aria-invalid`,
  `aria-describedby` and `role="alert"` intact. `VanCard` owns its required
  `action` slot's alignment, so callers pass content and no wrapper.
- **Select** is the native element. It opts into `appearance: base-select` under
  `_supportsBaseSelect` (`card` / `card.foreground` / `input`, picker on
  `popover` + `shadow: md`, checked options `primary`), stays a classic select for
  SSR and the first hydrate (`useSupportsBaseSelect` server snapshot `false`), and
  draws its own disclosure chevron on both paths — the UA `::picker-icon` is
  hidden because its shape is not ours. React may still log a DEV nesting warning
  ([#33038](https://github.com/facebook/react/issues/33038)); that is a client
  update, not a hydrate mismatch.
- **Dialogs** use top-level `css()` bindings plus a variant map and Panda
  conditions (`_open`, `_starting`, `_backdrop`) — closed native dialogs must stay
  `display: none`, so `display` is scoped to `_open`.
- **Navigation.** Desktop and mobile share the primary hover role; the mobile
  drawer uses `groupOpenMobileNav` with the dialog duration and glide easing.
  Labels, dialog relationships and focus behaviour stay intact.
- **Popovers** are the compound slots in
  [`popover.tsx`](./app/components/ui/popover.tsx): semantic `popover` roles,
  uncontrolled native `popover` state, `display` scoped to `_open`, the discrete
  `opacity,translate,display,overlay` transition, Escape and light dismissal, and
  focus restored to the trigger. No focus trap unless the flow is genuinely a
  dialog.
- **Filters, sorting, pagination.** `VanFilters` uses the translucent overlays on
  compact layouts and the accent rail on desktop; `Sortable` uses `primary` for
  the selected control; pagination uses outline prev/next buttons and `Select` for
  page size. The pager arrows are [`chevron-icon.tsx`](./app/components/icons/chevron-icon.tsx)
  with `morph="arrow"` — chevron at rest, barbs folding and shaft growing on the
  button's hover or focus-visible — while `arrowRecipe` keeps colour and travel.
- **Charts.** Both money routes render one `MoneyTimeline`: direction-stacked bars
  on a single currency axis plus a cumulative-net line, palette `chart.inflow` /
  `chart.outflow`, labels supplied by the route. `MoneyLedger` holds the totals
  above it. Axis numerals are Inter with tabular figures — the money subset has no
  letters and `@tanstack/charts` exposes no family on `tickLabels`. Transaction
  rails and the badge glyph repeat the direction colour; in the wallet pair only
  the arrow is tinted ([`money-ink.ts`](./app/components/icons/money-ink.ts)).
  Skeletons mirror the real block and take `TIMELINE_CHART_HEIGHT_PX` so the lazy
  swap cannot shift layout.
- **Reviews** use no chart palette or library: the average is a star run on the
  heading row, and `RatingMix` renders one glyph per review with counts and shares,
  reading `rating` and sizing from the `rating-mix` container. A review card's rail
  is its own rating, never chart data.
- **Data visualisation is never wrapped in a `Card`.** It sits on the page surface
  behind rules; a panel fill shrinks the plot for nothing.
- **Van cards** use the `vanCard` recipe for low-opacity status borders and
  `VanBadge` for the visible label, with `cq({ name: "card" })` for card-local
  steps. Keep intrinsic sizing and `contentVisibility` on list cards and
  skeletons — they carry scroll performance.

## Accessibility

- Contrast holds for every pairing, including filled primary, destructive, status
  and type badges; use the matching `.foreground`.
- Keep `focusVisibleRing` and focus borders visible for keyboard users.
- Status colour is always paired with text, a glyph, a label or `aria-busy` /
  `aria-invalid` / `role="alert"`.
- Decorative glyphs stay `aria-hidden` where adjacent text already names the
  action; images keep meaningful alt text.
- A translucent surface is never the only boundary protecting readable content
  over photography.
- Native dialogs keep their labels, focus handling and closed-state behaviour.
- `prefers-reduced-motion` leaves colour and state, never movement.

## Maintaining this file

1. A new token goes in `theme/` (or a new shared keyframe, condition or
   view-transition bag in its module) and is wired in `panda.config.ts` before
   anything consumes it. One-off animations stay beside their consumer.
2. Every new strong background gets a readable `.foreground`.
3. Prefer an existing role over a new token; prefer a token over a raw value.
4. Token references (`{colors.*}`) only inside raw CSS strings; runtime custom
   properties only for genuinely dynamic values.
5. Static style calls must stay statically extractable: literal values inside
   `css()`, never a spread, a factory argument or a computed object — a prop-built
   style emits a class with no rule behind it.
6. Preserve focus, disabled, pending, error, native-dialog, view-transition and
   content-visibility behaviour when changing styles.
7. Run `bun x panda build`, `bun run check`, `bun run typecheck` and
   `bun run build` after a token or global-style change.
8. This file records decisions, not the API. When something here starts explaining
   how Panda works rather than what we chose, it belongs in the MCP's answer or in
   `docs/`, not here.
