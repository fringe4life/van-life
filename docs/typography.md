# Typography

Two system stacks, no font files: what each platform resolves to, what money
means without a bundled face, and how to bring one back.

This is the reasoning behind
[#476](https://github.com/fringe4life/van-life/issues/476). `DESIGN.md` holds the
short rule — this page holds the evidence, so the rule stays checkable against a
diff.

- [Two stacks, no bytes](#two-stacks-no-bytes)
- [What each OS resolves to](#what-each-os-resolves-to)
- [Weight coverage is the trade](#weight-coverage-is-the-trade)
- [The money role](#the-money-role)
- [The lab](#the-lab)
- [The load path](#the-load-path)
- [Deliberately not here](#deliberately-not-here)

## Two stacks, no bytes

| Token | Stack | Role |
| --- | --- | --- |
| `fonts.sans` | `Avenir, Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif` | everything that is not money |
| `fonts.mono` | `ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace` | money only |

Both are copied **verbatim** from Modern Font Stacks: [Geometric
Humanist](https://github.com/system-fonts/modern-font-stacks#geometric-humanist)
and [Monospace Code](https://github.com/system-fonts/modern-font-stacks#monospace-code).

Verbatim is the point. Each stack is the output of that project's per-OS
coverage maths, so re-ordering a name or appending a safety generic does not add
a fallback — it changes which face wins on the OS that name was placed for,
which is the decision the stack exists to make. If a face is wrong for this
product, the fix is a different stack from that catalogue, not a splice.

`theme/tokens.ts` is the only place either stack is written. `app/app.css`
declares no `@font-face`, `app/root.tsx` preloads nothing, and a production
build ships **no font bytes** and no font declarations at all.

## What each OS resolves to

| Platform | Sans lands on | Mono lands on |
| --- | --- | --- |
| macOS / iOS | Avenir | SF Mono through `ui-monospace` in Safari; Menlo elsewhere |
| Windows | Corbel | Cascadia Code on 11+, Consolas on anything older |
| Linux | Montserrat where it is installed, else URW Gothic, else the generic | Source Code Pro where it is installed, else DejaVu Sans Mono |
| Android | `source-sans-pro` (the platform's name for Source Sans Pro) | Droid Sans Mono through `monospace` |

Montserrat is the one name no OS ships. On a machine that has it — this dev box
does — the stack jumps to a full 100–900 family and the local render is not what
Windows shows. That is why the lab measures resolution per machine rather than
documenting one machine's answer as the truth.

## Weight coverage is the trade

| Face | Weights it ships | 600 | 800 |
| --- | --- | --- | --- |
| Avenir | 300, 400, 500, 800, 900 | synthesised | real |
| Montserrat | 100–900 | real | real |
| Corbel | 300, 400, 700 | synthesised | synthesised |
| URW Gothic | 300, 600 | real | synthesised |
| source-sans-pro | 400, 600, 700 | real | synthesised |

Inter's variable axis had every weight on every OS. The geometric stack has an
800 on two of five faces, and 600 on three of them — Avenir and Corbel have
neither, which matters because 600 was the weight the UI used for card titles,
filter chips and transaction labels.

**Decision:** the display ceiling is `bold` (700), the UI accent ceiling is
`medium` (500), and `font-synthesis: none` is global on `html`. A requested
weight therefore resolves to the cut the face ships; nothing thickens by
smearing and nothing slants that has no italic.

There is no `extrabold` and no `black` left — the hero, the about card, the review
rating figure and the `#VANLIFE` wordmark all ask for `bold`, the last of them
because a 900 only exists on Avenir and Montserrat and the mark was already
resolving to 700 on Windows — and no `semibold` either. That is not a taste change: 600
was the one weight Avenir answers with its 800, so a card title or a filter chip
would have come out heavier on Apple than on Windows. `medium` is the heaviest
accent every face in the stack can honour, so it is what the UI uses.

That trades weight truth for a different cost, rounding, which is per-OS and
worth knowing before adding a weight:

| Request | Avenir (300, 400, 500, 800, 900) | Corbel (300, 400, 700) | URW Gothic (300, 600) | source-sans-pro (400, 600, 700) |
| --- | --- | --- | --- | --- |
| 400 body | 400 | 400 | → 300 | 400 |
| 500 accent | 500 | → 400 | → 300 | → 400 |
| 600 — not used | → 800 | → 700 | 600 | 600 |
| 700 | → 800 | 700 | → 600 | 700 |

Three things to know before leaning on a row: on Avenir `bold` renders at 800
(real, but heavier than the request); on Corbel and source-sans-pro a 500 accent
renders at 400, so labels are a shade lighter on Windows than on Apple; and on a
bare Linux box everything below 600 renders at 300, because URW Gothic ships only
300 and 600. All are constants per platform, not shifts mid-view. If the URW case
becomes a problem the fix is a different stack from the catalogue, not a synth
flag — `font-synthesis: weight none` would restore the smear, which is the thing
this setting exists to avoid.

The lab's *Compression and shaping* band has the card to see it, marked `shipped`.

## The money role

`money` from [`figures.ts`](../app/components/ui/figures.ts) sets
`fontFamily: "mono"`. That is the OS mono stack — four things to know:

- **Weight is the face's, not ours.** Menlo, Consolas and DejaVu Sans Mono ship
  400 and 700 only, so money styles stay `normal` or `bold`; asking for
  `semibold` renders as whichever cut is nearest and the CSS lies about it.
- **Digits follow the platform.** Every reachable system mono rounds figures
  its own way. Accepted deliberately: a flat-top 3 was not worth bundling a
  face for one glyph.
- **There is no glyph-limited face.** A `/day` suffix inside a `money` element
  is a layout question rather than a correctness one — it still should not be
  there, for the reason in `DESIGN.md`.
- **Alignment is unchanged.** `tabular-nums` still does that work, on a mono
  face that is tabular by construction.

Bundled Inter / Space Mono, the subset pipeline, and the glyph-list test are
gone. The type lab's baseline closed that comparison; reverting would mean
re-adding packages and `@font-face`, not flipping a dormant switch.

## The lab

[`docs/lab/type-lab.html`](./lab/type-lab.html) — 30 treatments on real copy, a
baseline of the shipped stacks against `ui-sans-serif` / `ui-monospace`, a
measured resolution table per stack name, and the at-rule demos.

It is a static file, not a route: outside `app/` and `public/`, so nothing in it
can reach a build, and listed under `ignorePatterns` in `.fallowrc.jsonc`. Serve
the repo root over HTTP (`bun x serve .`) and open `/docs/lab/type-lab.html`.
Delete the file and nothing else changes.

## The load path

Nothing is preloaded, nothing is fetched, and no `@font-face` exists, so there is
no swap shift to fix: first paint is final paint, and the CLS contribution from
type is zero. [#450](https://github.com/fringe4life/van-life/issues/450) — the
metric-override work — is moot for the download case.

What remains is not a shift but a difference: Avenir, Corbel and Montserrat sit
on different baselines, so a heading's block height is a per-OS constant. That is
visible in the lab's at-rule card, which is also the recipe if it ever needs
flattening — a `local()` alias with `ascent-override`, `descent-override` and
`line-gap-override`.

## Deliberately not here

- **No third family.** No handwriting, display or decorative face.
- **No icon font.** Settled in [`icon-packs.md`](./icon-packs.md).
- **No glyph-limited face inside an editable control.** `type="number"` accepts
  `1e3`; a subset that omits `e` cannot cover it.
- **No metric-matched `@font-face`.** Described above; nothing downloads, so
  there is no shift for it to fix.
