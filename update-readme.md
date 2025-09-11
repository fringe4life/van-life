# How to Request a README Update (AI Runnable)

Provide ONLY this file in future sessions to have the AI re-scan and update `README.md` without giving full repo context.

## What the AI will do

- Re-scan these sources: `package.json`, `prisma.config.ts`, `vite.config.ts`, `react-router.config.ts`, `prisma/schema.prisma`, `prisma/seed.ts`, `app/lib/env.server.ts`, `app/lib/prisma.server.ts`, `app/routes/**/*.tsx`, `app/components/**/*.tsx`.
- Update sections in `README.md`:
  - Prerequisites and Getting Started
  - Environment variables block (keep in sync with any `.env` files and `app/lib/env.server.ts`)
  - Database setup commands (Prisma generate, db push, seed)
  - Available scripts from `package.json`
  - Tech stack and configuration notes (React Router 7, Vite, React Compiler, Neon, better-auth)
  - Project structure overview
- Keep wording concise, match existing style, do not over-explain.

## Rules

- Use Bun commands where possible; prefer `bunx prisma` for CLI tasks.
- If `prisma.config.ts` exists, reflect its usage (schema path, seed) and note that the deprecated `package.json#prisma` block has been removed.
- Reflect the CSS and linting standards from `biome.json` and Tailwind v4.
- Mention `nuqs` for type-safe search params via Context7.
- Mention centralized auth types in `app/lib/auth.server.ts`.
- Preserve existing README headings and tone, only patch relevant sections.
- Do not change license wording.

## Quick prompt you can paste

Copy this into the chat with this file attached:

```
Please update README.md based on the codebase. Keep sections accurate and concise, sync env vars with any .env files and app/lib/env.server.ts, prefer Bun commands (bunx prisma ...), include Neon adapter and better-auth notes, and ensure scripts from package.json are reflected. Keep headings and tone.
```

## Post-update

- Run Biome format: `bun run format`
- Generate commit message: see `git-commit-msg.md` and run AI to produce message under 140 chars.
