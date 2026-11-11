# GitHub Actions workflows

## Workflow lockfile (required)

This repo uses [workflow dependency lockfiles](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles).

- **File:** `actions.lock` (machine-generated — do not hand-edit)
- **Policy:** Settings → Actions → [Policies](https://github.com/fringe4life/van-life/settings/actions/policies) — create/enable **Require lockfile** for all workflows. **Confirm enforcement on that page** before assuming unlocked workflows are blocked (repo Settings are not verified by this file).
- **Effect when Active:** a workflow that is not listed in `actions.lock` fails at startup (`startup_failure`), even if its `uses:` lines look fine

Readable tags in YAML (`uses: owner/action@v1.2.3`) are expected. The lockfile pins the commit (including transitive nested actions).

### When you add or change a workflow

```bash
gh extension install github/gh-actions-lock   # once
gh actions-lock                               # regenerate actions.lock
gh actions-lock --verify                      # must pass before merge
```

Commit the workflow **and** the updated `actions.lock` in the same PR. Dependabot action bumps should update both together.

### Relock a floating ref on purpose

```bash
gh actions-lock --relock
```

Review the lockfile diff: a changed commit SHA means different code will run.

### Not covered by the lockfile

- Reusable workflow calls (`jobs.<job_id>.uses`) — pin those by full commit SHA
- Local `./` path actions
- Container image digests

## Other hardening (not Policies)

Settings rows are **not** proven by this file — confirm in the linked UI.

| Control | Where | Status |
| --- | --- | --- |
| Default `GITHUB_TOKEN` read-only | Actions → General → Workflow permissions | Confirm in Settings (prefer Read) |
| Selected / allowlisted actions | Actions → General → Actions permissions | Optional follow-up |
| Egress firewall | `.github/egress-firewall.yaml` + `runs-on: ubuntu-24.04-firewall` | Log mode first (#529); then `enforce` |
| Shrink third-party write scopes | #531 | react-doctor: sticky comment only (`issues: write`); fallow: annotations only (`contents: read`) |

## Egress firewall

- Policy file: [`.github/egress-firewall.yaml`](../egress-firewall.yaml) (must live there — not under `workflows/`)
- Runner: `ubuntu-24.04-firewall` (technical preview; ~15–20% slower; log mode can still break some TLS clients)
- **Phase 1:** `mode: log` only — traffic is recorded, not denied. Enforce + allowlist is a follow-up after audit data exists (#529)
- **Who can widen policy:** any PR can edit the YAML; [CODEOWNERS](../CODEOWNERS) requires `@fringe4life` review. No org-level egress ceiling in the preview
- Preview logs: job summary + run artifact — use them to build `allow` before switching `mode: enforce`
- Ref: [Actions native egress firewall](https://github.com/github-early-access/actions-native-egress-firewall)
