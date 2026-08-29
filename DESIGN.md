# Van Life Design System

## Overview

Van Life uses a warm, light, editorial interface for browsing camper vans and managing host activity. The visual language combines a lightly orange-tinted canvas, dark neutral typography, deliberate orange actions, and compact data-oriented controls. Surfaces should feel layered but not busy: the page canvas separates from the main shell, cards provide a clear reading surface, and accent colors are reserved for actions, status, and purposeful decoration.

The system is intentionally semantic. Components consume roles such as `bg-primary`, `text-muted-foreground`, and `border-subtle` rather than choosing a Tailwind palette color at the point of use. This keeps the visual language adjustable from one theme definition and prevents unrelated components from drifting apart.

## Source of Truth

- Runtime tokens and custom utilities: [`app/app.css`](./app/app.css)
- Tailwind integration: [`vite.config.ts`](./vite.config.ts) via `@tailwindcss/vite`
- Shared UI primitives: [`app/components/ui`](./app/components/ui)
- Domain-specific van presentation: [`app/features/vans/components`](./app/features/vans/components)

`app/app.css` is the only runtime source of truth. The Project Wallace export is evidence used to reconcile authored values and discover missing primitives; it must not be imported by the application or treated as a second theme file.

## Color System

### Principles

1. Use semantic roles in component class strings.
2. Keep palette primitives in `@theme` so a theme change has one edit point.
3. Pair every strong background role with a readable foreground role.
4. Use opacity modifiers on semantic utilities, for example `bg-primary/90` or `border-destructive/50`.
5. Do not use color as the only signal for an error, status, or action; pair it with text, icons, labels, or state styling.
6. Preserve the warm orange foundation, but do not spray orange across every element. Orange is strongest when it marks action, route, rating, or intentional emphasis.

### Semantic surfaces

| Utility | Role | Use |
| --- | --- | --- |
| `bg-background` | Outer page background | The document canvas around the application shell. |
| `bg-surface` | Main shell surface | The warm inner page surface behind route content. |
| `bg-surface-muted` / `bg-muted` | Quiet warm surface | Secondary panels, outline badges, filter affordances, and low-emphasis sections. |
| `bg-surface-accent` / `bg-accent` | Strong warm surface | Highlighted callouts, review bands, dialog content, and emphasized sections. |
| `bg-card` | Elevated reading surface | Cards, forms, and content that must remain visually distinct from the shell. |
| `bg-popover` | Overlay reading surface | Popovers and future floating surfaces. |
| `bg-surface-overlay` | White 70% overlay | Translucent filter container on smaller layouts. |
| `bg-surface-overlay-muted` | White 55% overlay | Nested translucent filter group. |
| `bg-surface-inverse` | Dark inverse surface | Footer and other deliberate contrast bands. |
| `text-surface-inverse-foreground` | Inverse content | Text and links placed on the inverse surface. |

### Content and interaction roles

| Utility | Role | Use |
| --- | --- | --- |
| `text-foreground` | Default content | Headings, body content, and dark controls. |
| `text-card-foreground` / `text-popover-foreground` | Content on elevated surfaces | Use when a component explicitly owns a card or popover surface. |
| `bg-primary` + `text-primary-foreground` | Primary action | Main buttons, selected sort controls, navigation hover, and primary links. |
| `bg-secondary` + `text-secondary-foreground` | Dark secondary action | Secondary buttons, luxury badges, and high-contrast actions. |
| `text-muted-foreground` | Quiet content | Metadata, helper text, timestamps, empty states, and secondary labels. |
| `bg-accent` + `text-accent-foreground` | Interactive accent | Dialog content and ghost-button hover states. |
| `text-on-image` | Image-readable content | Hero copy over the home image. |

### Feedback roles

Use the foreground pair when the role is used as a filled control or badge. Use the base foreground when the role is used for inline text or an icon.

| Utility family | Role | Use |
| --- | --- | --- |
| `destructive` | Errors and unavailable actions | Form errors, error icons, unable-to-pay messaging, unavailable actions, and negative emphasis. |
| `success` | Completed or pending-positive state | Success icons, pending navigation feedback, and positive inline emphasis. |
| `warning` | Caution | Future warning messaging and chart role; do not substitute it for domain status. |

Examples:

```tsx
<StatusButton status={status} variant="destructive">
  Delete van
</StatusButton>

<p className="text-destructive" role="alert">
  Something went wrong.
</p>
```

### Domain roles

Availability and van type are intentionally different concepts.

| Utility family | Role | Use |
| --- | --- | --- |
| `status-new` | New van state | New state badge and new-state card treatment. |
| `status-sale` | Sale van state | Sale state badge and sale-state card treatment. |
| `status-repair` | Repair van state | Repair state badge and repair-state card treatment. |
| `status-unavailable` | Non-rentable action | Disabled rent action when a van cannot be rented. |
| `type-rugged` | Rugged van type | Rugged type badge. |
| `type-simple` | Simple van type | Simple type badge. |

Every domain background has an explicit foreground counterpart, for example `bg-status-repair text-status-repair-foreground`. The card recipe in [`van-card-recipe.ts`](./app/features/vans/components/van-card-recipe.ts) uses the same status roles at low opacity for the border and background treatment.

### Decorative and visualization roles

- `text-brand-decorative` is for intentional light-orange decoration, not primary actions.
- `text-rating` and `stroke-rating` are reserved for review stars.
- `chart-1` through `chart-5` are the visualization palette. The dashboard bar chart uses `var(--color-chart-1)` rather than a raw orange primitive.
- `hero-gradient-start`, `hero-gradient-via`, and `hero-gradient-end` preserve the home hero's diagonal indigo/green/yellow overlay while keeping the gradient stops themeable.
- `skeleton` and `skeleton-highlight` control loading placeholders and the shimmer utility.

### Primitive palette

The following primitives are available for semantic aliases and should rarely appear directly in a component:

- Orange: `orange-100`, `orange-200`, `orange-400`, `orange-600`
- Neutral: `neutral-50`, `neutral-400`, `neutral-600`, `neutral-900`
- Supporting authored stops: `gray-200`, `gray-300`, `indigo-300`, `green-300`, `teal-800`, and `yellow-200`
- Domain source colors: `van-new`, `van-sale`, and `van-repair`

If a component needs a new color, first decide whether it is a new semantic role or an existing role used incorrectly. Add a primitive only when the authored value is genuinely distinct and then expose it through a semantic alias.

### Borders and focus

| Utility | Role | Use |
| --- | --- | --- |
| `border-border` | Default low-contrast boundary | Cards, form shells, and normal separators. |
| `border-border-subtle` | Quiet separator | Filter groups and low-emphasis section rules. |
| `border-border-strong` | Strong neutral boundary | High-emphasis boundaries when default border is insufficient. |
| `border-border-accent` | Orange rail/accent boundary | Desktop filter rail and intentional route emphasis. |
| `border-input` | Form-control boundary | Inputs, textareas, and checkboxes. |
| `ring-ring` | Keyboard focus ring | Shared button and form focus states. |

## Typography

- Font family: `var(--font-sans)` backed by the variable Inter face declared in [`app/app.css`](./app/app.css).
- Use Tailwind's type scale for component text: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, and `text-5xl`.
- Use `text-2xs` for the very small inverse footer attribution; it is a named theme token rather than an arbitrary `text-[.5rem]` value.
- Headings use strong weights (`font-bold` through `font-extrabold`) and balanced wrapping. Large route titles scale from `text-2xl` or `text-3xl` to `text-4xl`/`text-5xl` at larger breakpoints.
- Supporting copy should use `text-muted-foreground` when it is metadata or helper text, not a raw gray utility.
- Avoid introducing a second font family without a clear editorial or data-display need.

## Spacing and Layout

The application uses Tailwind's spacing scale, with a small set of named layout tokens:

| Token or utility | Purpose |
| --- | --- |
| `--padding-inline` | Responsive inline gutter; mobile default is `0.75rem`, with the shell using a wider desktop value. |
| `--header-height` | First row of the application grid. |
| `--container-sm`, `--container-md`, `--container-lg`, `--container-2xl` | Narrow content widths and form/detail constraints. |
| `--container-content` | Main reading width for public content. |
| `--container-shell` | Maximum application shell width. |
| `grid-max` | Responsive two-column-capable grid for cards and lists. |
| `full-layout` | Full-bleed section that compensates for the current inline gutter. |
| `layout-grid` | Three-column shell grid with header, content, and footer rows. |

Prefer existing spacing utilities and these tokens over one-off pixel values. A custom value is justified only when it describes an actual layout constraint, such as a viewport-safe dialog height or an intrinsic image size.

The main shell is centered and capped at `max-w-shell`. Route content sits in the middle grid column. Public hero imagery can break out with `full-layout`; dashboard bands use the same inline padding as the shell so their edges align with the rest of the application.

## Shape and Borders

- `--radius-control` (`rounded-control`) is the 4px control radius for compact native checkboxes.
- `--radius-sm` (`rounded-sm`) is used for small images, links, and compact controls.
- `--radius-md` (`rounded-md`) is the default control/card sub-element radius.
- `--radius-lg` (`rounded-lg`) is used for grouped filter surfaces and larger nested panels.
- `--radius-xl` (`rounded-xl`) is used for cards, dialogs, and primary elevated containers.
- `rounded-full` remains appropriate for pill-shaped status badges and skeleton badge placeholders.

Use borders to explain grouping, not to outline every element. Cards have a default border; nested filter groups use the quieter border role; the desktop filter rail uses the accent border role.

## Elevation

Elevation is restrained and functional:

- `shadow-xs` separates compact controls, buttons, and filter surfaces.
- `shadow-sm` separates cards from the warm shell.
- `shadow-md` is reserved for the dialog panel and other transient overlays.
- Do not add a shadow to every section. Prefer surface contrast or a border when the element is already visually distinct.
- Hero text uses the existing text-shadow utilities because it sits over photography; ordinary content should not inherit hero text treatment.

## Motion

Motion reinforces state changes and navigation rather than decorating static content.

| Token or mechanism | Use |
| --- | --- |
| `--duration-dialog` | Native dialog open/close and mobile navigation transitions. |
| `--ease-spring` | Playful hamburger/icon morph. |
| `--ease-spring-soft` | Rising host-list transition with a restrained overshoot. |
| `--ease-glide` | Dialog and panel translation. |
| `@view-transition` | Route-level continuity for images, charts, list items, auth fields, and sortable titles. |
| `scroll-reveal` | Small scale/fade/slide reveal for later list items. |
| `bg-skeleton` | Two-second linear shimmer for deferred content placeholders. |

View-transition names are part of component behavior. Preserve them when changing layout or color classes. The list, chart, auth, and image transitions should remain functional if a component is restyled.

## Component Conventions

### Buttons and links

[`button-variants.ts`](./app/components/ui/button-variants.ts) is the source of truth for button variants. Keep the existing `default`, `destructive`, `ghost`, `link`, `outline`, and `secondary` API. Use `StatusButton` for asynchronous form actions so pending, success, and error states do not shift the layout. Links should use the shared navigation class utilities where they need consistent hover and pending behavior.

- Primary action: `bg-primary text-primary-foreground`.
- Destructive action: `bg-destructive text-destructive-foreground`.
- Dark secondary action: `bg-secondary text-secondary-foreground`.
- Outline action: `bg-card text-card-foreground` with `border-foreground`.
- Ghost action: neutral by default, `bg-accent text-accent-foreground` on hover.

### Badges

[`badge-variants.ts`](./app/components/ui/badge-variants.ts) owns `luxury`, `new`, `outline`, `repair`, `rugged`, `sale`, `simple`, and `unavailable`. Keep badge labels short, preserve explicit foreground pairings, and do not reuse feedback roles when the label represents a van domain state or type.

### Cards and forms

[`card.tsx`](./app/components/ui/card.tsx) provides the elevated surface, foreground, padding, radius, and default shadow. Forms compose `Card`, `Field`, `Label`, `Input`, `Textarea`, `FormError`, and `StatusButton` rather than restyling each control independently.

Inputs and textareas use `bg-input-background`, `text-input-foreground`, `border-input`, `text-placeholder`, and `ring-ring`. Error text uses `text-destructive`. Labels use `text-foreground`. Keep `aria-invalid`, `aria-describedby`, and `role="alert"` behavior intact when changing form presentation.

### Dialogs and navigation

[`dialog.tsx`](./app/components/ui/dialog.tsx) uses native dialog behavior with discrete transitions. Fullscreen mobile navigation and panel dialogs share the inverse backdrop role and accent content surface. Closed dialogs must remain `display: none`; scope layout utilities to `open:` states.

Desktop and mobile navigation share the primary hover role. Pending route links use `text-success`; active links use an underline so state is not conveyed by color alone.

### Filters, sorting, pagination, and charts

- `VanFilters` uses translucent surface roles on compact layouts and the accent border rail on desktop.
- `Sortable` uses the primary background and primary foreground for the selected sort control.
- `Pagination` uses muted foreground for the no-results message and the shared outline button.
- Dashboard charts use the chart token family. Skeleton charts may override the skeleton custom properties with a chart role, but must not reference a raw palette primitive.

### Van cards and status treatments

`VanCard` and `VanDetailCard` use the `vanCard` recipe for low-opacity state borders/backgrounds and `VanBadge` for the visible state label. Type badges use the type roles. Keep availability state, type, and action availability separate so a visual change in one does not silently change the meaning of another.

## Accessibility

- Maintain readable contrast for all foreground/background pairs, especially filled primary, destructive, status, and type badges.
- Use the matching `*-foreground` role for filled surfaces; do not assume `text-foreground` will remain readable on a strong color.
- Preserve visible `focus-visible` rings and borders for keyboard users.
- Pair color statuses with text, icons, disabled state, or labels.
- Keep semantic headings, labels, `aria-live`, `aria-busy`, `aria-invalid`, and alert roles intact.
- Images need meaningful alt text; decorative SVG icons should remain `aria-hidden` when adjacent text already describes the action.
- Do not use a translucent surface as the only contrast boundary when the content must remain readable across photography or changing backgrounds.

## Direct-Utility Migration Rules

Raw Tailwind palette classes are not supported in application component class strings. Use this mapping when migrating existing code:

| Avoid | Use |
| --- | --- |
| `bg-neutral-50` / `bg-orange-50` | `bg-background` / `bg-surface` |
| `bg-orange-100` / `bg-orange-200` | `bg-surface-muted` / `bg-surface-accent` |
| `bg-orange-400` | `bg-primary` for actions; `bg-brand-decorative` only for decoration |
| `bg-orange-600` | `bg-type-simple` for type badges; `bg-primary` for actions |
| `bg-red-500` | `bg-destructive` or `bg-status-unavailable` |
| `bg-green-500` / `bg-yellow-500` / `bg-gray-500` | `bg-status-sale` / `bg-status-repair` / `bg-status-new` |
| `bg-teal-800` | `bg-type-rugged` |
| `text-white` / `text-black` | Matching semantic foreground role, or `text-on-image` over photography |
| `text-neutral-900` | `text-foreground` |
| `text-neutral-600` / `text-gray-500` | `text-muted-foreground` |
| `text-neutral-400` | `text-placeholder` |
| `text-red-500` / `text-red-400` | `text-destructive` |
| `text-green-500` | `text-success` |
| `text-orange-400` / `text-orange-600` | `text-brand-decorative`, `text-rating`, or `text-primary` according to role |
| `border-neutral-900/10` / `/15` | `border-border-subtle` / `border-border` |
| `border-orange-400/60` | `border-border-accent` |
| `border-neutral-600` | `border-input` |
| `decoration-red-500` / `decoration-green-500` | `decoration-destructive` / `decoration-success` |
| `from-indigo-300/40`, `via-green-300/40`, `to-yellow-200/40` | Named `hero-gradient-*` roles |
| raw `var(--color-gray-200/300)` in consumers | `var(--color-skeleton-highlight)` / `var(--color-skeleton)` |

Permitted implementation exceptions are `transparent`, `current`, and `inherit` when they describe actual transparency or SVG inheritance. The `black` and `transparent` stops in `mask-scroll-hint` are mask implementation details, not UI palette decisions; leave them in the utility. If a new exception is needed, document why it cannot be represented semantically before adding it.

## Maintenance Checklist

- [ ] Add new authored colors to the `@theme` block in [`app/app.css`](./app/app.css) before consuming them.
- [ ] Give new strong backgrounds an explicit readable foreground token.
- [ ] Prefer an existing semantic role over creating a new one for a one-off component.
- [ ] Keep primitive references inside semantic aliases, custom utilities, or visualization configuration—not in route/component class strings.
- [ ] Preserve focus, disabled, pending, error, and reduced-layout behavior when migrating styles.
- [ ] Run the direct palette scan, `bun run check`, `bun run typecheck`, and `bun run build` after theme changes.
- [ ] Update this guide when a new semantic role, component convention, layout token, or motion pattern becomes part of the product language.
