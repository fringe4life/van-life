# Van Life Design System

## Overview

Van Life uses a warm, light, editorial interface for browsing camper vans and managing host activity. The visual language combines a lightly orange-tinted canvas, dark neutral typography, deliberate orange actions, and compact data-oriented controls. Surfaces should feel layered but not busy: the page canvas separates from the main shell, cards provide a clear reading surface, and accent colors are reserved for actions, status, and purposeful decoration.

The app uses PandaCSS v2 beta (`@pandacss/*` is currently pinned to `2.0.0-beta.15`). Styles are authored as typed Panda style objects, patterns, and recipes. These APIs generate class names that are passed to React's `className`; hand-authored utility vocabulary is not the styling API. The system is intentionally semantic so components consume roles such as `surface`, `muted.foreground`, and `border.subtle` rather than selecting a palette value at the point of use.

## Source of Truth

- Panda configuration and design tokens: [`panda.config.ts`](./panda.config.ts)
- Panda PostCSS integration: [`postcss.config.cjs`](./postcss.config.cjs)
- Generated Panda helpers and CSS: [`styled-system`](./styled-system) — generated output; do not edit it directly
- Authored global CSS: [`app/app.css`](./app/app.css)
- Shared style helpers: [`app/styles.ts`](./app/styles.ts)
- Shared UI primitives and recipes: [`app/components/ui`](./app/components/ui)
- Domain-specific van presentation: [`app/features/vans/components`](./app/features/vans/components)

`panda.config.ts` owns tokens, semantic aliases, breakpoints, container sizes and names, keyframes, global Panda CSS, global variables, and named view-transition definitions. `postcss.config.cjs` runs Panda's PostCSS plugin. `vite.config.ts` owns the Vite and React Router build; it is not the token source and does not contain a separate styling theme.

`app/app.css` is reserved for global CSS that is intentionally authored outside Panda's object model: the Inter `@font-face`, document view-transition selectors, and scroll-driven animation classes. It is not a second token file. Visual-diff reports and screenshots are evidence for maintaining the system, not runtime inputs.

## PandaCSS Authoring Model

### Generated helpers

Import generated helpers from `styled-system` and compose their results with `cx`:

```tsx
import { css, cx } from "../../../styled-system/css";
import { grid } from "../../../styled-system/patterns";

const className = cx(
  grid({ columns: { base: 1, md: 2 }, gap: "4" }),
  css({
    backgroundColor: "surface",
    borderColor: "border.subtle",
    color: "foreground",
    padding: "6",
    _hover: { backgroundColor: "surface.accent" },
  })
);
```

Use `css()` for component-local styles, `cx()` for composition, and generated patterns such as `grid`, `flex`, `hstack`, `vstack`, `gridItem`, and `cq` for recurring layout behavior. Keep the returned class name on the DOM element's `className` prop; do not reimplement generated declarations in a second stylesheet.

### Token path syntax

Panda style props consume token paths from `panda.config.ts`:

- A top-level semantic color uses `backgroundColor: "surface"` or `color: "foreground"`.
- A nested semantic color uses `backgroundColor: "surface.muted"` or `color: "surface.inverse.foreground"`.
- Opacity modifiers stay in the token value, for example `backgroundColor: "primary/90"` or `borderColor: "success/35"`.
- A token embedded in a raw CSS function uses Panda's reference syntax, for example `{colors.rating}` or `{colors.surface.accent}`.
- Keys that contain hyphens remain quoted as written in the config, such as `"brand-decorative"`, `"on-image"`, and `"padding-inline"`. `heroGradient` is camel-cased because that is the configured token key.

Use semantic tokens for ordinary component styling. A raw value is justified only when it describes a real layout constraint, a runtime custom property, a CSS function, or a deliberately isolated gradient/mask implementation.

## Color System

### Principles

1. Use semantic token paths in Panda style objects and recipes.
2. Keep palette primitives and semantic aliases in `panda.config.ts` so a theme change has one edit point.
3. Pair every strong background role with a readable foreground role.
4. Use token opacity modifiers such as `"primary/90"`, `"border.accent/70"`, and `"success/35"` instead of duplicating translucent colors.
5. Do not use color as the only signal for an error, status, or action; pair it with text, icons, labels, disabled state, or other state styling.
6. Preserve the warm orange foundation, but do not spray orange across every element. Orange is strongest when it marks action, route, rating, or intentional emphasis.

### Semantic surfaces

| Token path | Typical Panda usage | Role | Use |
| --- | --- | --- | --- |
| `background` | `backgroundColor: "background"` | Outer page background | The document canvas around the application shell. |
| `surface` | `backgroundColor: "surface"` | Main shell surface | The warm inner page surface behind route content. |
| `surface.muted` | `backgroundColor: "surface.muted"` | Quiet warm surface | Secondary panels, outline badges, filter affordances, and low-emphasis sections. |
| `surface.accent` | `backgroundColor: "surface.accent"` | Strong warm surface | Highlighted callouts, review bands, dialog content, and emphasized sections. |
| `card` / `card.foreground` | `backgroundColor: "card"` / `color: "card.foreground"` | Elevated reading surface | Cards, forms, and content that must remain distinct from the shell. |
| `popover` / `popover.foreground` | `backgroundColor: "popover"` / `color: "popover.foreground"` | Overlay reading surface | Popovers and future floating surfaces. |
| `surface.overlay` | `backgroundColor: "surface.overlay"` | White 70% overlay | Translucent filter containers on smaller layouts. |
| `surface.overlay.muted` | `backgroundColor: "surface.overlay.muted"` | White 55% overlay | Nested translucent filter groups. |
| `surface.inverse` / `surface.inverse.foreground` | `backgroundColor: "surface.inverse"` / `color: "surface.inverse.foreground"` | Dark inverse surface | Footer and other deliberate contrast bands. |

### Content and interaction roles

| Token path | Typical Panda usage | Role | Use |
| --- | --- | --- | --- |
| `foreground` | `color: "foreground"` | Default content | Headings, body content, and dark controls. |
| `card.foreground` / `popover.foreground` | `color: "card.foreground"` | Elevated-surface content | Content that explicitly belongs to a card or popover. |
| `primary` / `primary.foreground` | `backgroundColor: "primary"` and `color: "primary.foreground"` | Primary action | Main buttons, selected sort controls, navigation hover, and primary links. |
| `secondary` / `secondary.foreground` | `backgroundColor: "secondary"` and `color: "secondary.foreground"` | Dark secondary action | Secondary buttons, luxury badges, and high-contrast actions. |
| `muted.foreground` | `color: "muted.foreground"` | Quiet content | Metadata, helper text, timestamps, empty states, and secondary labels. |
| `accent` / `accent.foreground` | `backgroundColor: "accent"` and `color: "accent.foreground"` | Interactive accent | Dialog content and ghost-button hover states. |
| `on-image` | `color: "on-image"` | Image-readable content | Hero copy over the home image. |

### Feedback roles

Use the `.foreground` token when a role is used as a filled control or badge. Use the base token when it is used for inline text or an icon.

| Token path | Role | Use |
| --- | --- | --- |
| `destructive` / `destructive.foreground` | Errors and unavailable actions | Form errors, error icons, unable-to-pay messaging, unavailable actions, and negative emphasis. |
| `success` / `success.foreground` | Completed or pending-positive state | Success icons, pending navigation feedback, and positive inline emphasis. |
| `warning` / `warning.foreground` | Caution | Future warning messaging and chart roles; do not substitute it for a domain status. |

```tsx
<StatusButton status={status} variant="destructive">
  Delete van
</StatusButton>

<p className={css({ color: "destructive" })} role="alert">
  Something went wrong.
</p>
```

### Domain roles

Availability and van type are intentionally different concepts. Keep their token families and component variants separate.

| Token path | Role | Use |
| --- | --- | --- |
| `status.new` / `status.new.foreground` | New van state | New-state badge and card treatment. |
| `status.sale` / `status.sale.foreground` | Sale van state | Sale-state badge and card treatment. |
| `status.repair` / `status.repair.foreground` | Repair van state | Repair-state badge and card treatment. |
| `status.unavailable` / `status.unavailable.foreground` | Non-rentable action | Disabled rent action and unavailable badge. |
| `type.rugged` / `type.rugged.foreground` | Rugged van type | Rugged type badge. |
| `type.simple` / `type.simple.foreground` | Simple van type | Simple type badge. |

Every strong domain background has an explicit foreground counterpart, for example:

```tsx
css({
  backgroundColor: "status.repair",
  color: "status.repair.foreground",
});
```

The [`vanCard`](./app/features/vans/components/van-card-recipe.ts) recipe uses the same status roles with low-opacity backgrounds and solid status borders. [`VanBadge`](./app/features/vans/components/van-badge.tsx) owns the visible state label, while the type variant remains independent.

### Decorative and visualization roles

- `brand-decorative` is for intentional light-orange decoration, not primary actions.
- `rating` is reserved for review stars and rating rails. Use `color: "rating"` or `stroke: "rating"` in a Panda style object; there is no separate `stroke-rating` utility token.
- `chart.1` through `chart.5` form the visualization palette. The dashboard bar chart uses `color: "chart.1"` and the chart library consumes `currentColor`.
- `heroGradient.start`, `heroGradient.via`, and `heroGradient.end` are semantic gradient stops for future hero consumers. The current home overlay keeps its authored `indigo.300`, `green.300`, and `yellow.200` references localized to the gradient definition.
- `skeleton` and `skeleton.highlight` control loading placeholders and the shimmer helper.

### Primitive palette

Primitive tokens are declared under `theme.extend.tokens.colors` and should rarely be selected by ordinary components. Current authored primitives are:

- Gray: `gray.200`, `gray.300`
- Green: `green.300`
- Indigo: `indigo.300`
- Neutral: `neutral.400`, `neutral.600`, `neutral.900`
- Orange: `orange.100`, `orange.200`, `orange.400`, `orange.600`
- Teal: `teal.800`
- Van source colors: `van.new`, `van.repair`, `van.sale`
- Yellow: `yellow.200`

If a component needs a new color, first decide whether it is an existing semantic role used incorrectly. Add a primitive only when the authored value is genuinely distinct, then expose it through a semantic alias in `panda.config.ts`.

### Borders and focus

| Token path | Typical Panda usage | Role | Use |
| --- | --- | --- | --- |
| `border` | `borderColor: "border"` | Default low-contrast boundary | Cards, form shells, and normal separators. |
| `border.subtle` | `borderColor: "border.subtle"` | Quiet separator | Filter groups and low-emphasis section rules. |
| `border.strong` | `borderColor: "border.strong"` | Strong neutral boundary | High-emphasis boundaries when the default border is insufficient. |
| `border.accent` | `borderColor: "border.accent"` | Orange rail/accent boundary | Desktop filter rail and intentional route emphasis. |
| `input` | `borderColor: "input"` | Form-control boundary | Inputs, textareas, and checkboxes. |
| `ring` | `focusRingColor: "ring"` | Keyboard focus ring | Shared button and form focus states. |

Use explicit border styles when a component owns a visible border, for example `borderStyle: "solid"` and `borderWidth: "1"`. Opacity belongs in the token value, such as `borderColor: "border.accent/70"`.

## Typography

- Font family: use `fontFamily: "sans"`, backed by the variable Inter face declared in [`app/app.css`](./app/app.css) and registered as `fonts.sans` in [`panda.config.ts`](./panda.config.ts). Panda emits the generated `--fonts-sans` variable; do not introduce a second font-family variable.
- Use Panda's named font-size tokens: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, and `5xl`. `2xs` is the authored token for the very small inverse-footer attribution.
- Use responsive Panda objects for route-scale headings, for example `fontSize: { base: "2xl", sm: "3xl", md: "4xl" }`.
- Headings use strong weights (`bold` through `extrabold`) and balanced wrapping. Global heading `textWrap: "balance"` is configured in Panda.
- Supporting copy uses `color: "muted.foreground"` when it is metadata or helper text, not a raw gray token.
- Use the configured line-height names `4` through `10` when a component needs a deliberate line-height. Keep heading letter spacing restrained; use a custom value only for an intentional display treatment.
- Avoid introducing another font family without a clear editorial or data-display need.

## Spacing and Layout

The application uses Panda's spacing scale and a small set of named layout tokens. Style objects may use token names directly:

```tsx
css({
  gap: "4",
  marginBlockEnd: "6",
  padding: "6",
  paddingInline: "padding-inline",
});
```

Responsive values use Panda conditions rather than hand-authored media-query strings:

```tsx
grid({
  columns: { base: 1, md: 2 },
  gap: { base: "4", lg: "8" },
});
```

| Token or helper | Purpose |
| --- | --- |
| `padding-inline` | Responsive inline gutter; base is `0.75rem`, and the `md` value is `3rem`. |
| `--header-height` | First row of the application shell grid. |
| `--footer-height` | Footer row height in the shared shell grid. |
| `sizes.sm`, `sizes.md`, `sizes.lg`, `sizes.2xl` | Narrow content and form constraints. |
| `sizes.content` | Main public reading width, `64rem`. |
| `sizes.shell` | Maximum application shell width, `80rem`. |
| `gridMax` | Imported helper from [`app/styles.ts`](./app/styles.ts) for responsive two-column-capable lists. |
| `fullBleed` | Imported helper that breaks a section out through the current inline gutter. |
| `fullLayout` | Imported helper that breaks out and restores matching inline padding. |
| `cq({ name: ... })` | Names a container for component-local responsive conditions. |
| `@card/md`, `@form/xl`, etc. | Named container conditions generated from Panda's container names and sizes. |

The main shell is centered with `maxInlineSize: "shell"` and `marginInline: "auto"`. Route content sits in the middle shell grid column. Public hero imagery may break out with `fullLayout`; dashboard bands use the same inline padding as the shell so their edges align with the rest of the application.

### Semantic grid areas

Use `gridTemplateAreas` and `gridArea` when a parent grid has stable semantic regions such as `nav`, `content`, `footer`, `filters`, `results`, `image`, `details`, `metadata`, or `action`. The parent owns the responsive area map; direct children receive the matching area name. Keep area names local to the component rather than promoting them to design tokens.

A wrapper is not an obstacle to named areas. If it owns a meaningful grouping or styling role, assign the wrapper one outer area and make it a nested grid. Prefer `subgrid` only when the child must inherit shared parent tracks; do not use it merely to avoid a small local template. Preserve DOM/source order when changing visual placement.

Keep explicit numeric placement for intrinsic or dynamic arrangements where names add no clarity, including auto-fit list helpers, repeated metric pairs, chart/list sequencing, pagination, and other data-flow grids. Always-stacked forms such as `AuthForm` do not need named areas. Components that own a full-card link overlay must keep interactive action regions above that overlay.

Prefer generated patterns and named tokens over one-off CSS. A custom value is justified when it describes an actual layout constraint, such as a viewport-safe dialog size, an intrinsic image size, a `minmax()` grid track, or a runtime custom property.

## Shape and Borders

The configured radii are:

| Token | Value | Use |
| --- | --- | --- |
| `control` | `4px` | Compact native checkboxes and control-specific shapes. |
| `sm` | `0.375rem` | Small images, links, and compact controls. |
| `md` | `0.5rem` | Default control and card sub-element radius. |
| `lg` | `0.625rem` | Grouped filter surfaces and larger nested panels. |
| `xl` | `0.75rem` | Cards, dialogs, and primary elevated containers. |
| `full` | Preset value | Pill-shaped status badges and skeleton badge placeholders. |

Use `borderRadius: "md"` or the `rounded: "xl"` shorthand when it matches the surrounding code. Use `borderRadius: "full"` for pills. Borders should explain grouping rather than outline every element: cards have a default border, nested filter groups use the quieter border role, and the desktop filter rail uses the accent border role.

## Elevation

Elevation is restrained and functional:

- `shadow: "xs"` separates compact controls, buttons, and filter surfaces.
- `shadow: "sm"` separates cards from the warm shell.
- `shadow: "md"` is reserved for dialog panels and other transient overlays.
- Do not add a shadow to every section. Prefer surface contrast or a border when the element is already visually distinct.
- Hero text uses the existing text-shadow treatment because it sits over photography; ordinary content should not inherit hero text treatment.

## Motion

Motion reinforces state changes and navigation rather than decorating static content.

### Panda motion tokens and helpers

| Token or mechanism | Use |
| --- | --- |
| `easings.glide` | Dialog and panel translation; use `transitionTimingFunction: "glide"`. |
| `easings.spring` | Playful hamburger/icon morph. |
| `easings.springSoft` | Rising host-list transition with a restrained overshoot. |
| `--duration-dialog` | Native dialog open/close and mobile navigation transitions. |
| `animationName: "fade"`, `"scale"`, `"slide-x"`, `"slide-y"` | Configured view-transition keyframes. |
| `animationName: "shimmer"` | Loading placeholder animation used by `bgSkeleton`. |
| `viewTransition("authTitle")` and related helpers | Named Panda view-transition bags. |
| `viewTransitionName` | Unique element identity; keep it on the element alongside the named bag when both are required. |

Panda view-transition bags are defined with `defineViewTransitions` in [`panda.config.ts`](./panda.config.ts). Use the generated `viewTransition()` helper for configured bags such as `authTitle`, `authFooter`, and `sortableTitle`, and keep unique names such as `card-${van.id}` on the element. The generic `@view-transition` and `::view-transition-*` rules remain in [`app/app.css`](./app/app.css).

### Authored global motion

The following behaviors intentionally remain in `app/app.css` or global Panda CSS rather than being component-local token declarations:

- `.scroll-sm`, `.scroll-md`, and `.scroll-lg` provide scroll-timeline reveal behavior for later list items.
- `.rating-rail` and `.rating-star-fill` are global Panda selectors for the rating visualization.
- `bgSkeleton` in [`app/styles.ts`](./app/styles.ts) composes the `shimmer` keyframe with `skeleton` tokens and runtime `--skeleton-color` overrides.
- `supportsScroll` is a Panda condition for `@supports (animation-timeline: scroll())`.

Preserve view-transition names and animation variables when changing layout or color styles. The list, chart, auth, dialog, and image transitions are part of component behavior, not decoration. Do not make a transition the only way a state change is communicated.

## Component Conventions

### Buttons and links

[`button-variants.ts`](./app/components/ui/button-variants.ts) is the source of truth for button variants. Keep the existing `default`, `destructive`, `ghost`, `link`, `outline`, and `secondary` API, plus the `default`, `sm`, `lg`, and `icon` sizes. The recipe uses `cva()` from `styled-system/css`; `Button` combines its output with `cx()` and accepts a generated `className` override.

- Primary action: `backgroundColor: "primary"` with `color: "primary.foreground"`.
- Destructive action: `backgroundColor: "destructive"` with `color: "destructive.foreground"`.
- Dark secondary action: `backgroundColor: "secondary"` with `color: "secondary.foreground"`.
- Outline action: `backgroundColor: "card"`, `color: "card.foreground"`, and `borderColor: "foreground"`.
- Ghost action: neutral by default; use `backgroundColor: "accent"` and `color: "accent.foreground"` on hover.

Use [`StatusButton`](./app/components/status-button.tsx) for asynchronous form actions so pending, success, and error states preserve the button's dimensions. Links use `css()`/`cx()` composition and the shared navigation helpers in [`app/features/navigation/styles.ts`](./app/features/navigation/styles.ts). Pending route links use `color: "success"`; active links use an underline so state is not conveyed by color alone.

### Badges

[`badge-variants.ts`](./app/components/ui/badge-variants.ts) owns the `luxury`, `new`, `outline`, `repair`, `rugged`, `sale`, `simple`, and `unavailable` variants. Keep badge labels short, preserve explicit foreground pairings, and do not reuse feedback roles when the label represents a van domain state or type. Badge recipes use `cva()` and nested token paths such as `status.new.foreground` and `type.rugged.foreground`.

### Cards and forms

[`card.tsx`](./app/components/ui/card.tsx) provides the elevated surface, foreground, padding, radius, and default shadow through `css()` and `cx()`. Forms compose `Card`, `Field`, `Label`, `Input`, `Textarea`, `FormError`, and `StatusButton` rather than restyling each control independently.

`VanCard` owns the placement and inline-end alignment of its required `action` slot. Callers provide action content such as a price, edit link, return link, or pending label without adding alignment-only wrappers. Keep `VanCard` and `VanCardSkeleton` on the same named-area and track contract. When a card wrapper contains title/details as well as an action, prefer a nested named grid and use `CardContent` where the content semantics fit; do not change the shared `CardFooter` meaning for one card variant.

Inputs and textareas use `input.background`, `input.foreground`, `input`, `placeholder`, and `ring` through Panda style props. Labels use `foreground`. Error text uses `destructive`. Keep `aria-invalid`, `aria-describedby`, and `role="alert"` behavior intact when changing form presentation.

### Dialogs and navigation

[`dialog.tsx`](./app/components/ui/dialog.tsx) uses a `cva()` recipe with Panda conditions such as `_open`, `_starting`, and `_backdrop`. Fullscreen mobile navigation and panel dialogs share the inverse backdrop role and accent content surface. Closed native dialogs must remain `display: none`; never add an unconditional `display` style that overrides the browser's closed-dialog behavior. Scope layout styles to `_open` when a dialog needs an open-state display value.

Desktop and mobile navigation share the primary hover role. The mobile drawer uses the named `groupOpenMobileNav` condition and the configured dialog duration/glide easing. Keep the hamburger's semantic button labels, dialog relationships, focus behavior, and close controls intact.

### Filters, sorting, pagination, and charts

- `VanFilters` uses `surface.overlay` and `surface.overlay.muted` on compact layouts and the `border.accent` rail on desktop.
- `Sortable` uses `backgroundColor: "primary"` and `color: "primary.foreground"` for the selected sort control.
- `Pagination` uses `muted.foreground` for no-results messaging and the shared outline button.
- Dashboard charts use the `chart.*` token family. The bar chart uses `color: "chart.1"`, while the chart mark uses `currentColor`.
- Skeleton charts use `bgSkeleton` with runtime values such as `"--skeleton-color": "{colors.chart.1}"` and `"--skeleton-highlight": "{colors.surface.accent}"`; do not reintroduce obsolete color variable names.

### Van cards and status treatments

`VanCard` and `VanDetailCard` use the [`vanCard`](./app/features/vans/components/van-card-recipe.ts) recipe for low-opacity status borders/backgrounds and `VanBadge` for the visible state label. Type badges use the type roles. Keep availability state, van type, and action availability separate so a visual change in one does not silently change the meaning of another.

Use `cq({ name: "card" })` for card container queries and conditions such as `"@card/md"` for card-local responsive layouts. Keep intrinsic sizing and `contentVisibility` behavior on list cards and skeletons because those rules support scroll performance.

## Accessibility

- Maintain readable contrast for all foreground/background pairs, especially filled primary, destructive, status, and type badges.
- Use the matching `.foreground` token for filled surfaces; do not assume `foreground` will remain readable on a strong color.
- Preserve visible `focusVisibleRing` styles and borders for keyboard users.
- Pair color statuses with text, icons, disabled state, or labels.
- Keep semantic headings, labels, `aria-live`, `aria-busy`, `aria-invalid`, and alert roles intact.
- Images need meaningful alt text; decorative SVG icons should remain `aria-hidden` when adjacent text already describes the action.
- Do not use a translucent surface as the only contrast boundary when content must remain readable across photography or changing backgrounds.
- Native dialogs must retain their accessible labels, focus handling, and closed-state behavior.

## PandaCSS Maintenance Rules

1. Add new authored colors, radii, spacing, font, easing, size, keyframe, or semantic roles to `panda.config.ts` before consuming them.
2. Give every new strong background an explicit readable `.foreground` token.
3. Prefer an existing semantic role over creating a one-off token.
4. Use `css()`, `cx()`, `cva()`, `sva()`, and generated patterns instead of duplicating a component's declarations in a separate stylesheet.
5. Use nested Panda token paths such as `surface.accent`, `status.repair.foreground`, and `type.rugged.foreground`; do not invent hyphenated aliases that are not present in the config.
6. Use `{colors.*}`, `{spacing.*}`, and other Panda references only inside raw CSS strings where a token must be embedded in a function or custom property.
7. Keep runtime custom properties for genuinely dynamic values, such as ratings, chart dimensions, dialog duration, and skeleton overrides. Give static values a named Panda token instead.
8. Do not edit generated files under `styled-system`; regenerate them with Panda after changing the config or source usage.
9. Preserve focus, disabled, pending, error, native-dialog, view-transition, and content-visibility behavior when changing styles.
10. After a token or global-style change, run `bun x panda build`, `bun run check`, `bun run typecheck`, and `bun run build`.
11. Update this guide whenever a new semantic role, component convention, layout token, or motion pattern becomes part of the product language.
