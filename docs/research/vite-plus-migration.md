# Should van-life migrate to Vite+?

**Date:** 2026-11-08.  
**Question:** Adopt [Vite+](https://viteplus.dev/) (`vp` / [voidzero-dev/vite-plus](https://github.com/voidzero-dev/vite-plus)) as the unified toolchain, or keep the current stack?

**van-life today:** Vite 8.3.5, React Router 8 framework mode, Cloudflare Vite plugin, Panda CSS, varlock; Biome 2.6.4 via Ultracite (not ESLint/Prettier); `bun test` + happy-dom + Testing Library (not Vitest); Bun as package manager; husky + lint-staged; fallow; react-doctor; TypeScript 7.

## TL;DR

**Defer a full migration.** Vite+’s auto-migrator is built for ESLint/Prettier/Vitest consolidation. van-life already avoided that trio (Biome + `bun test`), so the biggest “one CLI replaces N tools” wins do not land for free. Bun as package manager is supported; Bun as the `vp test` runtime is not—keep `bun test` via `vp run` if adopting any of Vite+.

| Area | Vite+ default | van-life | Fit |
| --- | --- | --- | --- |
| Package manager | Bun supported for `vp install` / add / remove | Bun | Good |
| Lint / format | Oxlint + Oxfmt; ESLint/Prettier auto-migrated | Biome / Ultracite | Manual only |
| Tests | `vp test` = Node-hosted Vitest | `bun test` + happy-dom + Testing Library | Keep Bun via `vp run` |
| Hooks | Own `vp staged` / hooks; Husky left alone | husky + lint-staged | Manual if changing |
| Dev / build | `vp dev` / `vp build` (Vite + Rolldown) | Already Vite 8 + Cloudflare + RR framework | Possible, needs validation |

---

## What Vite+ is

Vite+ is VoidZero’s **unified web toolchain** behind the `vp` CLI: Vite, Rolldown, Vitest, Oxlint, Oxfmt, tsdown, and Vite Task, plus Node/runtime and package-manager management ([viteplus.dev](https://viteplus.dev/); [README](https://github.com/voidzero-dev/vite-plus)). Typical surface: `vp install`, `vp dev`, `vp check` (fmt + lint + typecheck), `vp test`, `vp build` / `vp pack`, `vp run` for project scripts/tasks.

Config is meant to live in one root `vite.config.ts` (`test`, `lint`, `fmt`, `run`, `staged` blocks) ([README](https://github.com/voidzero-dev/vite-plus)).

`vp migrate` consolidates separate Vite / Vitest / Oxlint / Oxfmt / **ESLint** / **Prettier** / tsdown / tsup / tsx / oxnode / ts-node setups ([migrate guide](https://viteplus.dev/guide/migrate)). Prerequisites for greenfield migrators include **Vite 7+** and **Vitest 4+** when those tools are in play ([migrate](https://viteplus.dev/guide/migrate), [migrate-rules](https://viteplus.dev/guide/migrate-rules)).

---

## Bun: package manager yes, `vp test` runtime no

**Package manager.** PR [#1005](https://github.com/voidzero-dev/vite-plus/pull/1005) adds Bun as a first-class package manager (detect `packageManager`, `bun.lock` / `bun.lockb`, `bunfig.toml`). Explicit scope: *“Bun is added only as a package manager and runtime support is not planned.”* Site copy lists `pnpm` / `npm` / `yarn` / `bun` for installs ([viteplus.dev](https://viteplus.dev/)).

**Tests.** Official discussion [#2852](https://github.com/voidzero-dev/vite-plus/discussions/2852): Vite+ manages **Node** as the tool runtime; there is no setting that makes built-in Vite/Vitest a Bun process. `vp test` is always Vitest on managed Node ([test guide](https://viteplus.dev/guide/test)). To keep Bun’s test runner: put `"test": "bun test"` (or `test:bun`) in scripts and run **`vp run test`** / `vp run test:bun`—not `vp test`.

Community parallel: happas (Astro + Bun) kept **existing tests on Bun**, used Vite+ for `vp check` / orchestration, and ran project scripts via `vp run` ([happas blog](https://happas.jp/blog/en/post/1314/)).

---

## Lint/format: Biome is not auto-migrated

`vp lint` / `vp fmt` / `vp check` are Oxlint and Oxfmt ([lint](https://viteplus.dev/guide/lint)). Migration docs and rules name **ESLint** and **Prettier** as optional auto-migrations (`eslint` → `vp lint`, `prettier` → `vp fmt`); Biome is absent from that list ([migrate](https://viteplus.dev/guide/migrate), [migrate-rules](https://viteplus.dev/guide/migrate-rules)).

LunaApp’s Vite+ PR did a **manual** Biome → Oxlint/Oxfmt move under `vp check`, kept Bun for package management and some `bun test` paths, and noted missing Biome-style import sorting in an early vite-plus release ([shakedex/LunaApp#1](https://github.com/shakedex/LunaApp/pull/1)).

For van-life that means: Ultracite/Biome configs, scripts, and editor wiring would be a deliberate rewrite, not `vp migrate` output.

---

## Benefits vs this stack

| Potential win | Relevance here |
| --- | --- |
| One `vp` entry + shared Vite config for test/lint/fmt | Partial: already one Vite app config; lint/test live outside Vite+ defaults |
| ESLint/Prettier → Oxc speed | **Low**—already on Biome, not ESLint/Prettier |
| Vitest sharing Vite transform/resolve | **Cost**, not win—would replace happy-dom + `bun test` unless dual suites |
| Bun still as PM | **Real**—aligned with [#1005](https://github.com/voidzero-dev/vite-plus/pull/1005) |
| `vp check` + tsgo type-aware lint | Interesting alongside TypeScript 7, but duplicates/competes with current Biome + `tsc`/doctor flows |
| Task caching / `setup-vp` CI | Optional; happas found Bun-test cache savings tiny and skipped cross-job cache complexity ([happas](https://happas.jp/blog/en/post/1314/)) |
| Framework plugins (Cloudflare, RR) | Claimed Vite-plugin meta-framework support ([viteplus.dev](https://viteplus.dev/)); still needs van-life-specific proof under `vite-plus` aliases |

---

## Friction points (van-life-specific)

1. **Biome / Ultracite** — no official auto-migrate; rule/format parity and organize-imports behavior must be hand-ported (cf. LunaApp).
2. **`bun test` + happy-dom + Testing Library** — `vp test` is Vitest on Node ([test](https://viteplus.dev/guide/test), [#2852](https://github.com/voidzero-dev/vite-plus/discussions/2852)). Migrating suites is optional and large; official advice is keep Bun via `vp run`.
3. **Vitest 4+ migrate precondition** — project has no Vitest; a full migrate path that assumes Vitest is a poor match ([migrate](https://viteplus.dev/guide/migrate)).
4. **husky + lint-staged** — migrate **does not** auto-convert Husky; leaves it with a warning. lint-staged can move into a `staged` block / `vp staged`, with caveats for non-JSON configs ([migrate](https://viteplus.dev/guide/migrate) “Git hook tools” / “lint-staged”).
5. **React Router framework mode + Cloudflare plugin + Panda + varlock** — must keep working under `vite-plus` / `@voidzero-dev/vite-plus-core` aliasing ([README](https://github.com/voidzero-dev/vite-plus)); high regression surface for little lint/test gain.
6. **Adjacent tooling** — fallow and react-doctor stay outside Vite+; migration does not replace them.
7. **Built-in vs script** — `vp test` ≠ `vp run test`; easy footgun if scripts are rewritten carelessly ([migrate](https://viteplus.dev/guide/migrate), [#2852](https://github.com/voidzero-dev/vite-plus/discussions/2852)).

---

## Recommendation

- **Do not** run a wholesale `vp migrate` expecting Biome and `bun test` to become Oxlint/Oxfmt/Vitest automatically.
- **Optional thin adoption later:** install `vite-plus` only if a concrete pain appears (CI orchestration, Oxc lint experiment, task caching)—keep `"test": "bun test"` and invoke via `vp run test`; leave Ultracite until a deliberate Biome→Ox project exists.
- **Revisit** if van-life moves off Biome toward Oxc, or adopts Vitest for Vite-shared transforms. Until then, current stack already covers the niches Vite+ markets hardest (fast lint/format without ESLint/Prettier; Bun installs; Vite 8).

## Sources

- [Vite+](https://viteplus.dev/), [Migrate](https://viteplus.dev/guide/migrate), [Migration rules](https://viteplus.dev/guide/migrate-rules), [Test](https://viteplus.dev/guide/test), [Lint](https://viteplus.dev/guide/lint)
- [voidzero-dev/vite-plus README](https://github.com/voidzero-dev/vite-plus), [PR #1005](https://github.com/voidzero-dev/vite-plus/pull/1005) (Bun as PM only), [Discussion #2852](https://github.com/voidzero-dev/vite-plus/discussions/2852) (`vp run` + `bun test` vs `vp test`)
- Community: [happas — Vite+ 1.0 from Astro + Bun](https://happas.jp/blog/en/post/1314/) (keep `bun test`); [LunaApp PR #1](https://github.com/shakedex/LunaApp/pull/1) (Biome → Oxlint/Oxfmt; Bun retained for some tests)
