# Fallow + Cursor MCP integration

**Date:** 2026-09-06

**Question:** How deeply can Fallow integrate with Cursor via MCP, and what is missing in this repo versus the official stack?

**Method:** Primary sources only: [docs.fallow.tools/llms.txt](https://docs.fallow.tools/llms.txt), [Agent integration (MCP)](https://docs.fallow.tools/integrations/mcp.md), [`fallow agent`](https://docs.fallow.tools/cli/agent.md), [Agent Skills](https://docs.fallow.tools/integrations/agent-skills.md), [`fallow init`](https://docs.fallow.tools/cli/init.md), [environment variables](https://docs.fallow.tools/configuration/environment.md), [Claude Code hooks](https://docs.fallow.tools/integrations/claude-hooks.md), [VS Code extension](https://docs.fallow.tools/integrations/vscode.md), [Cursor MCP](https://cursor.com/docs/context/mcp.md), [Cursor hooks](https://cursor.com/docs/agent/hooks.md), [Cursor Cloud Agents](https://cursor.com/docs/cloud-agent.md), [Cloud Agent capabilities](https://cursor.com/docs/cloud-agent/capabilities.md), [Open VSX fallow-vscode](https://open-vsx.org/api/fallow-rs/fallow-vscode). Local evidence: `fallow agent status --format json` and `fallow agent install --harness cursor --dry-run --format json` against fallow **3.22.0**. No blogs.

---

## Verdict

Fallow already ships a first-class Cursor MCP server (`fallow-mcp`, stdio). This repo pins fallow 3.22.0 and has the binary, skill, config, CI, and lint-staged path. **MCP is the missing Cursor layer.** Official one-command wire-up is `fallow agent install --harness cursor`, but a blind run here would fight Ultracite `AGENTS.md` and an unmarked skill. Cursor **cannot** use Fallow's Claude/Codex commit gate; Cursor-native hooks can fill that gap.

Four official layers, complementary:

| Layer | What it is | This repo |
| --- | --- | --- |
| CLI | Shell JSON (`fallow --format json`) | Yes (`bun run fallow`, lint-staged, CI Action) |
| Skill | Teaches when/how to call fallow | Yes (`.agents/skills/fallow`, also user skill) |
| MCP | Typed tools, no CLI text parsing | **No** (`.cursor/mcp.json` has only Panda) |
| LSP / VS Code extension | Human diagnostics, Code Lens, health sidebar | **No** (`fallow-lsp` binary present, extension not recommended) |

Official stance: CLI is primary; MCP is optional structured layer; best agent experience is **skill + MCP + CLI fallback**. ([mcp.md](https://docs.fallow.tools/integrations/mcp.md), [agent-skills.md](https://docs.fallow.tools/integrations/agent-skills.md))

---

## This repo today

Facts from the tree + `fallow agent status` (fallow 3.22.0):

- `fallow@3.22.0` in `devDependencies`. npm package also ships `fallow-mcp` and `fallow-lsp` (`package.json` `bin` + `"mcpName": "io.github.fallow-rs/fallow"`).
- Local binaries exist: `node_modules/.bin/fallow`, `fallow-mcp`, `fallow-lsp`.
- Config: `.fallowrc.jsonc` (boundaries, type-aware `best-effort`, security categories, Panda-relevant CSS/token analysis).
- Skill: `.agents/skills/fallow` exists but is **foreign** to the installer (`skill named fallow without a fallow marker`). Same for `~/.agents/skills/fallow`.
- `AGENTS.md` is Ultracite, **no fallow task-map block**.
- `.cursor/mcp.json`: Panda only. Status: `cursor/mcp = absent`, `no fallow entry`.
- Cursor hooks: Ultracite `afterFileEdit` (`bun fix`) + react-doctor `stop`. No fallow gate.
- Human git: Husky → lint-staged already runs `fallow dead-code --file` on staged TS/TSX.
- CI: SHA-pinned `fallow-rs/fallow@v3.22.0` audit + security on PRs (`fail-on-issues: false`).

`fallow agent install --harness cursor --dry-run` plan:

| Step | Status | Path | Note |
| --- | --- | --- | --- |
| `guide` | would write | `AGENTS.md` | Appends fallow task-map block. Ultracite already owns this file. |
| `skill` | **refused** | `.agents/skills/fallow` | `skill_name_taken`. Needs `--force` to replace. |
| `mcp` | would write | `.cursor/mcp.json` | Adds `mcpServers.fallow`. Would keep existing Panda entry (installer only touches a fallow-owned command). |
| `hooks` | **skipped** | — | `unsupported_harness`: "Cursor's beforeShellExecution hook uses a different contract; Cursor still reads AGENTS.md" |

Installer is idempotent and marker-based. Foreign MCP entries are refused without `--force`. ([agent.md](https://docs.fallow.tools/cli/agent.md))

---

## MCP: what Cursor actually gets

`fallow-mcp` is stdio. Thin `rmcp` wrapper around the CLI binary. Same JSON envelopes as CLI. `FALLOW_BIN` locates `fallow` (env → sibling binary → `PATH`). Default subprocess timeout 120s (`FALLOW_TIMEOUT_SECS`). Exit 1 (issues found) is success for MCP; exit 2+ is error. ([mcp.md](https://docs.fallow.tools/integrations/mcp.md))

Cursor project config is `.cursor/mcp.json`, `mcpServers` map, stdio via `command`/`args`/`env`. Interpolation: `${workspaceFolder}`, `${env:NAME}`. Agent uses tools in Agent/Plan modes. Destructive tools go through Cursor approval / Auto-review. ([Cursor MCP](https://cursor.com/docs/context/mcp.md))

### Official snippets

Global PATH (global install):

```json
{
  "mcpServers": {
    "fallow": {
      "command": "fallow-mcp"
    }
  }
}
```

Project `devDependency` (this repo — bun, matches existing Panda server):

```json
{
  "mcpServers": {
    "fallow": {
      "command": "bunx",
      "args": ["fallow-mcp"]
    }
  }
}
```

Docs also list `npx fallow-mcp`, `pnpm exec fallow-mcp`, `yarn fallow-mcp`. Start the agent from the project root so the runner sees `node_modules/.bin`. ([mcp.md](https://docs.fallow.tools/integrations/mcp.md))

**Gotchas:**
- `"command": "fallow-mcp"` with no PATH → `ENOENT`.
- Installer MCP probe is `npx --no fallow-mcp` (npm-installed), then `PATH`, then the running multicall binary — **not `bunx`**. Bun snippet is hand-written only. A `--without guide --without skill --without hooks` install here would likely write `npx`, which is wrong for this repo; prefer the bun snippet below.
- Cursor STDIO extras (`type`, `envFile`, `${env:NAME}` interpolation) are Cursor-native, not in Fallow snippets. ([Cursor MCP](https://cursor.com/docs/context/mcp.md))

Hardened variant for this workspace:

```json
{
  "mcpServers": {
    "fallow": {
      "command": "bun",
      "args": ["x", "fallow-mcp"],
      "cwd": "${workspaceFolder}",
      "env": {
        "FALLOW_BIN": "${workspaceFolder}/node_modules/.bin/fallow",
        "FALLOW_AGENT_SOURCE": "cursor"
      }
    }
  }
}
```

`FALLOW_AGENT_SOURCE=cursor` only attributes telemetry **if** the user already enabled it. Agents must not run `fallow telemetry enable`. ([environment.md](https://docs.fallow.tools/configuration/environment.md), fallow skill rule 11)

Optional MCP `env` (inherited by spawned CLI):

| Var | Why |
| --- | --- |
| `FALLOW_BIN` | Pin the 3.22.0 local binary |
| `FALLOW_TIMEOUT_SECS` | Raise for huge dumps / `check_runtime_coverage` |
| `FALLOW_AGENT_SOURCE` | `cursor` |
| `FALLOW_CHANGED_SINCE` | Default git-ref scope for analysis tools |
| `FALLOW_DIFF_FILE` | Line-level diff scoping |
| `FALLOW_SUGGESTIONS` | `off` to drop `next_steps[]` |
| `FALLOW_AUDIT_BASE` | Pin audit base for forks / worktrees |
| `FALLOW_COVERAGE` / `FALLOW_COVERAGE_ROOT` | Istanbul dump + path rebase; tool params win |

Do **not** set `FALLOW_INTEGRATION_SURFACE` or `FALLOW_MCP_TOOL` in `env` — the MCP server stamps those on the CLI it spawns. ([environment.md](https://docs.fallow.tools/configuration/environment.md))

MCP also exposes **resources** (no subprocess): `fallow://tools`, `fallow://issue-types`, `fallow://explain/{issue_type}`, `fallow://task-matrix`, plus schema URIs. Cursor lists Resources as supported. ([mcp.md](https://docs.fallow.tools/integrations/mcp.md), [Cursor MCP](https://cursor.com/docs/context/mcp.md))

### Tools (3.22.0 docs, richer than the checked-in skill)

The skill table is a subset. Docs add tools the agent should prefer once MCP is live:

| Tool | Use |
| --- | --- |
| `analyze` / `check_changed` / `audit` | Dead code / incremental / PR verdict |
| `inspect_target` | One file or export: trace + dead-code + dupes + complexity + security in one bundle |
| `code_execute` | Read-only JS sandbox composing multiple fallow calls (`fallow.run(tool, params)`). No fs/network/shell. Mutating fix tools not exposed |
| `recommend` | Cold-start config proposal (`auto` / `default` / `taste`) |
| `decision_surface` | Ranked structural review questions (coupling, public API, new dep) |
| `security_candidates` | Unverified local candidates; this repo already enables a subset in `.fallowrc.jsonc` |
| `trace_symbol` / `symbol_impact` | Type-aware exact-symbol proof (`trace_symbol`, not `symbol_trace`). Repo already has `typeAware.enabled` |
| `get_token_blast_radius` | Static design-token consumers. **PandaCSS `defineTokens` is a documented consumer kind** |
| `check_health` (`css: true`) | CSS + Panda token reverse index |
| `find_dupes` / `trace_clone` | Duplication + fingerprint deep-dive |
| `fix_preview` / `fix_apply` | Dry-run then apply. `fix_apply` is destructive — keep behind Cursor approval |
| `trace_export` / `trace_file` / `trace_dependency` | Before deleting "unused" things |
| `feature_flags` / `list_boundaries` / `list_suppressions` / `project_info` | Inventory |
| `check_runtime_coverage` + `get_hot_paths` / `get_blast_radius` / `get_importance` / `get_cleanup_candidates` | Runtime. One local capture free; continuous/cloud paid |
| `impact` / `impact_closure` / `impact_all` | Read-only local value report. Do not enable tracking for the user |

`next_steps[]` on analyze/health/dupes/audit maps `id` → MCP tool (`trace_export`, `trace_clone`, `audit`, `code_execute`), not a shell string. ([mcp.md](https://docs.fallow.tools/integrations/mcp.md))

---

## Deeper than MCP: Cursor-native surfaces Fallow does not auto-wire

### 1. Cursor hooks (the real Cursor gate)

Fallow's agent installer **skips** Cursor hooks. Claude gets `PreToolUse` + `fallow-gate.sh` (`fallow audit --gate-marker agent`). Cursor's `beforeShellExecution` contract is different. ([agent.md](https://docs.fallow.tools/cli/agent.md), [claude-hooks.md](https://docs.fallow.tools/integrations/claude-hooks.md))

Cursor can still gate locally. Official hook events: `beforeShellExecution` (permission allow/deny on `git commit`/`git push`), `stop` (this repo already uses it for react-doctor), `afterFileEdit`. Cloud Agents run repo `.cursor/hooks.json` command hooks; `beforeMCPExecution`/`afterMCPExecution` are **deferred** for cloud. ([hooks.md](https://cursor.com/docs/agent/hooks.md))

Closest Fallow-equivalent for Cursor, not shipped by fallow:

- `beforeShellExecution` matcher `git commit|git push` → `fallow audit --format json --quiet --explain --gate-marker agent`; deny on `verdict: "fail"`.
- Optional extra `stop` hook (alongside react-doctor) so the agent cannot finish a failing changeset.

Do **not** run full `fallow` on every `afterFileEdit` — Ultracite already formats there. Prefer commit/stop gates + MCP `audit`/`check_changed` during the turn.

### 2. LSP / VS Code extension (human loop)

`fallow-lsp` is already in `node_modules/.bin`. Extension id `fallow-rs.fallow-vscode`: inline diagnostics, Code Lens ref counts, health/security/audit status bar, JSON schema for `.fallowrc.json`. Cursor installs third-party extensions from **Open VSX**, not the full MS Marketplace; `fallow-rs/fallow-vscode` **is on Open VSX** at **3.22.0** (`engines.vscode: ^1.96.0`). Installing the extension does **not** register `fallow-mcp`. This is for **you** in the editor. MCP is for **the agent**. They do not replace each other. ([vscode.md](https://docs.fallow.tools/integrations/vscode.md), [Open VSX](https://open-vsx.org/api/fallow-rs/fallow-vscode), [Cursor extensions](https://cursor.com/docs/configuration/extensions.md))

Not in `.vscode/extensions.json` today.

### 3. AGENTS.md task map

`fallow init --agents` / `fallow agent install` writes a task-to-command matrix (same as `fallow schema` `task_matrix`). Cursor reads `AGENTS.md`. Installer **appends a marked block**; it does not replace a foreign file unless `--force`. Safe path: `--without guide` and keep Ultracite `AGENTS.md`, or allow the marked fallow block to append. ([init.md](https://docs.fallow.tools/cli/init.md), [agent.md](https://docs.fallow.tools/cli/agent.md))

### 4. Cloud Agents

Cloud Agents **do not read repo `.cursor/mcp.json`**. Configure MCP in the [cursor.com/agents](https://cursor.com/agents) dropdown and/or **Dashboard → Integrations & MCP**. HTTP or stdio; SSE / `mcp-remote` not supported. HTTP recommended (tools proxied; creds never in the VM). Stdio runs **inside the VM**, so the cloud environment must have `bunx`/`fallow-mcp` after install — success is not verified until launch. Fallow does **not** document a hosted HTTP MCP. Repo `fallow agent install` MCP is **IDE/CLI only**.

Repo hooks from `.cursor/hooks.json` run once the VM is writable; `~/.cursor/hooks.json` does **not**. `beforeMCPExecution` / `afterMCPExecution` are **deferred** for cloud. ([cloud-agent.md](https://cursor.com/docs/cloud-agent.md), [Cloud Agent capabilities](https://cursor.com/docs/cloud-agent/capabilities.md))

### 5. Approval / tool budget

Fallow MCP exposes many tools (`analyze` through `impact_all`). Cursor Auto-review should allowlist read-only (`analyze`, `audit`, `inspect_target`, `trace_*`, `check_health`) and keep `fix_apply` on ask. Too many MCP servers can crowd the tool list; Panda + Fallow is a natural pair here (Panda tokens ↔ `get_token_blast_radius`).

---

## Skills vs MCP vs CLI vs LSP

From [agent-skills.md](https://docs.fallow.tools/integrations/agent-skills.md) and [integrations/index.md](https://docs.fallow.tools/integrations/index.md):

| | Skill | MCP | CLI | LSP |
| --- | --- | --- | --- | --- |
| Provides | Knowledge | Typed tools | Any shell agent | Editor diagnostics |
| This repo | Present | Missing | Present | Binary present, extension not installed |
| Best for | Routing intent | Agent frameworks | CI, lint-staged, fallback | Human squiggles / Code Lens |

Skill still tells the agent `--format json --quiet` + `|| true`. Once MCP is connected, prefer MCP tools; CLI remains fallback and the only path for write-only setup (`init`, `hooks install`, `license activate`).

---

## Recommended next steps (not applied)

Ordered by leverage. Do not run `fallow agent install` unattended in this repo.

1. **Add `fallow` to `.cursor/mcp.json`** with `bun`/`bunx` + `FALLOW_BIN` + `FALLOW_AGENT_SOURCE=cursor`. Leave Panda. Toggle the server in Cursor Customize, confirm tools in MCP Logs.
2. **Keep the existing skill** (or `--force` only if you want the installer-marked copy that points at `node_modules/fallow/skills/fallow` so it cannot drift from 3.22.0).
3. **Do not overwrite Ultracite `AGENTS.md`.** Optional: `fallow agent install --harness cursor --without guide --without skill --without hooks` so only MCP is written — then still verify the command is `bunx`, not `npx`.
4. **Optional Cursor gate:** `beforeShellExecution` on git commit/push running `fallow audit`, same semantics as Claude's fallow-gate (`new-only`, fail on `verdict: fail`).
5. **Optional human LSP:** recommend `fallow-rs.fallow-vscode` in `.vscode/extensions.json`.
6. **Agent usage after MCP is live:** `audit` / `check_changed` after feature work; `inspect_target` before deleting an export; `trace_symbol` / `symbol_impact` for type-aware renames; `get_token_blast_radius` before Panda token edits; `fix_preview` then user-approved `fix_apply`.
7. **Cloud Agents (if used):** add Fallow in the team MCP dashboard as stdio (`bunx fallow-mcp` after env `bun install`) or wait for an HTTP MCP Fallow does not ship. Project `.cursor/mcp.json` will not follow the cloud VM.

---

## Sources

- [https://docs.fallow.tools/integrations/mcp.md](https://docs.fallow.tools/integrations/mcp.md)
- [https://docs.fallow.tools/cli/agent.md](https://docs.fallow.tools/cli/agent.md)
- [https://docs.fallow.tools/integrations/agent-skills.md](https://docs.fallow.tools/integrations/agent-skills.md)
- [https://docs.fallow.tools/cli/init.md](https://docs.fallow.tools/cli/init.md)
- [https://docs.fallow.tools/configuration/environment.md](https://docs.fallow.tools/configuration/environment.md)
- [https://docs.fallow.tools/integrations/claude-hooks.md](https://docs.fallow.tools/integrations/claude-hooks.md)
- [https://docs.fallow.tools/integrations/vscode.md](https://docs.fallow.tools/integrations/vscode.md)
- [https://docs.fallow.tools/integrations/index.md](https://docs.fallow.tools/integrations/index.md)
- [https://cursor.com/docs/context/mcp.md](https://cursor.com/docs/context/mcp.md)
- [https://cursor.com/docs/agent/hooks.md](https://cursor.com/docs/agent/hooks.md)
- [https://cursor.com/docs/cloud-agent.md](https://cursor.com/docs/cloud-agent.md)
- [https://cursor.com/docs/cloud-agent/capabilities.md](https://cursor.com/docs/cloud-agent/capabilities.md)
- [https://open-vsx.org/api/fallow-rs/fallow-vscode](https://open-vsx.org/api/fallow-rs/fallow-vscode)
- Local: `fallow agent status --format json`, `fallow agent install --harness cursor --dry-run --format json` (fallow 3.22.0)
