# Typography

How type works in van-life: which face carries what, how the money subset is
built, and what is loaded on first paint.

`DESIGN.md` holds the rule. This page holds the reasoning behind it, so the rule
stays short enough to check against a diff.

- [Two faces, one body](#two-faces-one-body)
- [The rule is the numeral's role](#the-rule-is-the-numerals-role)
- [The money subset pipeline](#the-money-subset-pipeline)
- [The load path](#the-load-path)
- [Deliberately not here](#deliberately-not-here)

## Two faces, one body

| Face | Role | Declared | Token |
| --- | --- | --- | --- |
| Inter variable, latin subset | everything that is not money | `app/app.css` | `fonts.sans` |
| Space Mono 400 + 700, 23 glyphs | money only | `app/fonts/money/money.css` | `fonts.mono` |

Both tokens live in `theme/tokens.ts`, which is the only place a family name is
written. `app/app.css` imports the generated money stylesheet, and `body` takes
`fontFamily: "sans"` from `theme/global-styles.ts` — that declaration exists
because Panda's preset sets `body { font-family: var(--global-font-body, …) }`,
and `--global-font-body` is gone: under `hash: true` the token variables are
renamed, so a `var(--fonts-sans)` reference there would not resolve.

The split between one variable file and two static files matters more than the
family name. Inter ships as one
variable file, so weight is free; Space Mono ships two static files, so
`semibold`, `extrabold` and `black` all render as 700 while the CSS claims
otherwise. Money styles use `normal` and `bold` only.

## The rule is the numeral's role

"Money versus statistics" is a useful proxy, not the rule. Two independent
questions get conflated:

1. **Does the numeral need to align?** A column, or a figure that changes in
   place, needs `tabular-nums`. Inter has it; it costs nothing.
2. **Is the numeral the subject of its block?** Only then does it leave Inter.

What money and statistics genuinely differ on is precision, not family: money
always carries two decimals, so it needs decimal alignment; statistics are
integers or one-decimal, so they need column alignment. Tabular figures solve
both. A second family is justified by hierarchy, not by alignment — which is why
a percentage in a tally stays in Inter and the dashboard net does not.

The face decision itself — Space Mono against IBM Plex Mono, JetBrains Mono and
Inter-with-tabular-figures, with measured subset bytes — is recorded in the doc
comment on `app/components/ui/figures.ts` (#448). It is kept there rather than
restated here so there is one copy to keep true.

Consequences worth stating twice:

- **No prose inside a `money` element.** The subset is digits, separators,
  currency marks and two dashes. A `/day` suffix, a label or a duration gets its
  own element and stays in Inter, or it renders in the next face of the stack
  mid-string.
- **No money face inside an input.** `type="number"` accepts `1e3`, and no
  subset that omits `e` covers it.
- **Axis labels are an exception by design.** The money timeline's ticks are
  `4k`, `−2k`, `0`; `@tanstack/charts` 1.1.0 exposes no family on `tickLabels`,
  and `MONEY_GLYPHS` has no letters, so the ticks take Inter with
  `font-variant-numeric: tabular-nums` through the rendered `<text>` (#449).

## The money subset pipeline

```bash
bun run fonts:subset-money     # scripts/subset-money-font.ts
```

- **Reads** `node_modules/@fontsource/space-mono/files/space-mono-latin-{400,700}-normal.woff2`.
- **Subsets** both to `MONEY_GLYPHS` from `app/fonts/money-glyphs.ts`, the single
  glyph list shared by the script, the CSS and the test.
- **Writes** `app/fonts/money/space-mono-{400,700}.woff2` and `money.css`, the
  `@font-face` rules with a matching `unicode-range`.

Output is committed: `bun run build` never generates fonts, so a clean tree has
to build without running the script. Regenerating on a clean tree produces no
diff — the weights are awaited in declaration order and `money.css` is excluded
from Biome so formatting cannot manufacture one.

Sizes: **16,520 B → 5,476 B** (400) and **16,724 B → 5,660 B** (700), 11,136 B
for the pair.

`app/fonts/money-glyphs.test.ts` fails if `displayPrice()` starts emitting a
character the subset does not carry, if the `unicode-range` stops collapsing
adjacent code points, or if the committed CSS drifts from the glyph list.

## The load path

Inter and both money subsets are preloaded in `app/root.tsx`, alongside
`/assets/*` being cached for a year as immutable by `public/_headers`.

**Money is global here, and the sibling repo's route scoping does not transfer.**
In dollar-holler money painted on two route families, so a route matrix could
exclude the rest. Here money paints on `/`, `/vans`, `/vans/:id`, `/host`,
`/host/rental-activity`, `/host/wallet-activity` and the host van surfaces — a
preload matrix would have exactly one route to exclude.

That default has one known cost, stated as a number: the index route paints no
money yet pays **11,136 B** for both faces, because `<link rel="preload">`
fetches unconditionally while `@font-face` stays lazy. The cheaper shape is a
route-level `links` export on the routes that paint money — recorded in
[#452](https://github.com/fringe4life/van-life/issues/452), not done here.

## Deliberately not here

- **No third family.** No handwriting, display or decorative face.
- **No icon font.** Settled in [`icon-packs.md`](./icon-packs.md).
- **No glyph-limited face inside an editable control.** See above.
- **No metric-matched fallback faces, yet.** Both stacks declare
  `font-display: swap` with no `size-adjust` / `ascent-override`, so first paint
  can move when a face lands. That is a CLS measurement first, and it is
  [#450](https://github.com/fringe4life/van-life/issues/450).
