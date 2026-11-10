# GitHub Actions workflows

## Workflow lockfile (required)

This repo uses [workflow dependency lockfiles](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles).

- **File:** `actions.lock` (machine-generated — do not hand-edit)
- **Policy:** Settings → Actions → [Policies](https://github.com/fringe4life/van-life/settings/actions/policies) → **Require Lockfile Policy** is **Active** for all workflows
- **Effect:** a workflow that is not listed in `actions.lock` fails at startup (`startup_failure`), even if its `uses:` lines look fine

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

| Control | Where | Status |
| --- | --- | --- |
| Default `GITHUB_TOKEN` read-only | Actions → General → Workflow permissions | On |
| Selected / allowlisted actions | Actions → General → Actions permissions | Optional follow-up |
| Egress firewall | follow-up #529 | Separate PR |
| Shrink third-party write scopes | follow-up #531 | Separate PR |
