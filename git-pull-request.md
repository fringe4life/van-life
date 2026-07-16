# How to Open a Pull Request (AI Runnable)

Provide this file (and ideally `git-commit-msg.md`) to have the AI: branch → commit → push → open a PR. Commit messages follow [`git-commit-msg.md`](./git-commit-msg.md). PR title/body derive from those commits (and the full branch diff).

## What the AI will do

1. Inspect working tree / branch vs base (`master`)
2. Create a branch if needed (or use current topic branch)
3. Generate commit message via `git-commit-msg.md`, then commit
4. Push branch to `origin` with upstream tracking
5. Open a PR with `gh pr create` — title + body derived from the commit(s)

## Prerequisites

- Attach **both** when possible:
  - `git-commit-msg.md` — commit message format (required for step 3)
  - `git-pull-request.md` — this file (branch / push / PR)
- User must explicitly ask to open a PR / push / commit (or paste the quick prompt below). Do not push or create a PR unless instructed.
- Base branch defaults to `master` unless the user names another.

---

## Workflow (run in order)

### 1. Inspect state

Run in parallel:

```bash
git status
git diff && git diff --cached
git diff --stat HEAD
git branch -vv
git rev-parse --abbrev-ref HEAD
git rev-parse --abbrev-ref @{upstream} 2>/dev/null || true
git log -5 --oneline
git log master..HEAD --oneline   # commits already on branch (if any)
git diff master...HEAD --stat    # full PR-bound diff once commits exist
```

Decide:

| Situation | Action |
|-----------|--------|
| Uncommitted changes | Stage + commit (step 3) before push/PR |
| On `master` / `main` with changes | Create topic branch first (step 2) |
| Already on topic branch, clean, ahead of remote | Push + PR (steps 4–5) |
| No changes and no commits ahead of base | Stop — nothing to PR |

### 2. Create / switch branch

Prefer `git switch` over `git checkout` (branch moves only — safer, no path/restore confusion).

If still on `master` (or user asks for a new branch):

```bash
git switch -c <type>/<short-kebab-description>
```

If switching onto an existing topic branch (no create):

```bash
git switch <type>/<short-kebab-description>
```

Branch naming:

- Prefix with commit type: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`, `perf/`, `ci/`, `build/`
- Short kebab case from the main change: `feat/form-status-button`, `fix/auth-redirect`
- Match the `type:` that will lead the commit message

If already on a good topic branch, keep it.

Do **not** use `git checkout -b` / bare `git checkout <branch>` here. Use `git restore` / `git restore --staged` only if discarding or unstaging file changes (rare in this workflow; never confuse with branch switch).

### 3. Commit (use `git-commit-msg.md`)

**Follow [`git-commit-msg.md`](./git-commit-msg.md) exactly** — do not invent a different commit style.

1. Analyze staged + unstaged diffs (and `--stat`)
2. Produce message: `type:` + newline + emoji bullets (scale by file count per that file)
3. Stage relevant files (never secrets: `.env`, credentials, etc.)
4. Commit with HEREDOC:

```bash
git add <files>
git commit -m "$(cat <<'EOF'
type:
emoji bullet one
emoji bullet two
EOF
)"
git status
```

Rules (same as commit guide + safety):

- Never `--no-verify` / skip hooks unless user asks
- Never amend unless user asks and amend safety rules pass
- Never update git config
- If pre-commit fails: fix, then **new** commit (do not amend failed commit)

If multiple logical commits already exist on the branch, keep them; do not squash unless asked. Still use `git-commit-msg.md` for any **new** commit.

### 4. Push to remote

```bash
git push -u origin HEAD
```

- First push on a branch: always `-u` / `--set-upstream` (same thing)
- Later pushes on same branch: `git push` is enough (upstream already set)
- Prefer `HEAD` over hard-coding the branch name — tracks whatever is checked out
- Never force-push to `master`/`main`
- Never `--force` / `--force-with-lease` unless user explicitly requests

### 5. Create PR title and description

**Source of truth (in priority order):**

1. Commit messages on the branch (`git log master..HEAD`) — already in `git-commit-msg.md` format
2. Full diff vs base (`git diff master...HEAD`) — for anything commits understate
3. Prefer synthesizing from commits; do not ignore extra commits or drift

#### PR title

- One line, ≤ ~72 chars preferred
- Pattern: `<type>: <imperative summary>`
- Use the **same type** as the primary / most impactful commit (`feat`, `fix`, `refactor`, …)
- Summary = compressed why/what of the branch — **no emoji in the title**
- If one commit: title can mirror that commit’s type + first-bullet gist
- If many commits: pick dominant type; summarize the theme (not a comma-list of every bullet)

Examples:

```text
feat: shared StatusButton form submit feedback
fix: safe redirectTo on login after host auth fail
refactor: flatten D1 migrations while keeping snapshots
```

#### PR body

Always use this structure (HEREDOC for `gh`):

```markdown
## Summary
- <bullet derived from commit emoji lines / theme>
- <bullet>
- <bullet>

## Test plan
- [ ] <concrete check>
- [ ] <concrete check>
```

**Summary bullets:**

- Derive from emoji bullets across branch commits (and diff if needed)
- Strip leading emojis in Summary (or keep them — prefer **keep emojis** so PR body matches commit style)
- Keep the same priority order: most impactful first
- Scale like commits:
  - 1 commit / small: 2–3 bullets
  - Medium: 3–4
  - Large / multi-commit: 5–7 (cap ~8; consolidate noise)
- Do **not** paste the raw `type:` line into Summary; type belongs in the title

**Test plan:**

- Checklist of real verification steps for this diff (UI paths, `bun run typecheck` / `bun run check`, migrate/seed if schema changed, etc.)
- Prefer actionable `bun` / UI steps over vague “test everything”

### 6. Open the PR

```bash
gh pr create --title "<type>: <summary>" --body "$(cat <<'EOF'
## Summary
✨ …
🎨 …
🔧 …

## Test plan
- [ ] …
- [ ] …

EOF
)"
```

After create:

- Return the PR URL to the user
- Do not merge unless asked

Optional flags (only if user asks):

- `--draft`
- `--base <branch>`
- `--reviewer <user>`

---

## Mapping: commit message → PR

| Commit (`git-commit-msg.md`) | Pull request |
|------------------------------|--------------|
| Leading `feat:` / `fix:` / … | Title prefix `feat:` / `fix:` / … |
| Emoji bullet lines | Summary bullets (same emojis, same order) |
| Multiple commits on branch | Merge themes into one title type; union bullets, dedupe |
| File-count scaling for bullets | Same scaling for Summary length |
| Common emoji meanings | Reuse from `git-commit-msg.md` |

**Single-commit PR (ideal):**

Commit:

```text
feat:
✨ Added FormActionResult and StatusButton helpers
🎨 Wired auth and host forms to fetcher status
📝 Synced README badges and scripts
```

PR title:

```text
feat: shared StatusButton form submit feedback
```

PR body Summary:

```markdown
## Summary
✨ Added FormActionResult and StatusButton helpers
🎨 Wired auth and host forms to fetcher status
📝 Synced README badges and scripts
```

**Multi-commit PR:** fold bullets under one dominant type; drop duplicate themes.

---

## Safety / do-not

- Do not commit or push secrets
- Do not force-push `master`/`main`
- Do not open a PR with an empty Summary or empty Test plan
- Do not use Interactive git (`-i`)
- Do not use `git checkout` for branch create/switch — use `git switch` / `git switch -c`
- Do not rewrite published history unless user asks
- If push/PR fails on auth/network: report error; do not invent a “successful” URL

---

## Quick prompt you can paste

Copy into chat with `git-commit-msg.md` + this file attached:

```
Follow git-commit-msg.md and git-pull-request.md: inspect changes, git switch -c a topic branch if on master, commit using the emoji commit format, push -u to origin, and open a gh PR. Derive the PR title (type: summary, no emoji) and Summary bullets from the commit message(s); add a concrete Test plan. Return the PR URL.
```

Partial prompts:

- Commit only: attach `git-commit-msg.md` only (or say “commit only”)
- PR only (already pushed): “open PR from current branch using git-pull-request.md”
- Draft PR: add “create as draft”

---

## Post-create checklist (AI)

- [ ] Branch not `master`/`main`
- [ ] Commit(s) follow `git-commit-msg.md`
- [ ] Remote tracking set (`-u` on first push)
- [ ] PR title = `type: summary` (no emoji)
- [ ] PR Summary bullets align with commit bullets
- [ ] Test plan present with checkboxes
- [ ] User received PR URL
