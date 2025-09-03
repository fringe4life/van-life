# How to Request a README Update (AI Runnable)

Provide ONLY this file in future sessions to have the AI re-scan and update `README.md` without giving full repo context.

## What the AI will do

- Re-scan these sources: `package.json`, `env.example`, `next.config.ts`, `prisma/schema.prisma`, `prisma/seed.ts`, `src/lib/env.ts`, `src/lib/prisma.ts`, `src/app/**/layout.tsx`, `src/app/**/page.tsx`.
- Update sections in `README.md`:
  - Prerequisites and Getting Started
  - Environment variables block (keep in sync with `env.example` and `src/lib/env.ts`)
  - Database setup commands (Prisma generate, db push, seed)
  - Available scripts from `package.json`
  - Tech stack and configuration notes (Next.js, Turbopack, React Compiler, Neon, Resend)
  - Project structure overview
- Keep wording concise, match existing style, do not over-explain.

## Rules

- Use Bun commands where possible; prefer `bunx prisma` for CLI tasks.
- Reflect the CSS and linting standards from `biome.json` and Tailwind v4.
- Mention `nuqs` for type-safe search params via Context7.
- Mention centralized auth types in `src/features/auth/types.ts`.
- Preserve existing README headings and tone, only patch relevant sections.
- Do not change license wording.

## Quick prompt you can paste

Copy this into the chat with this file attached:

```
Please update README.md based on the codebase. Keep sections accurate and concise, sync env vars with env.example and src/lib/env.ts, prefer Bun commands (bunx prisma ...), include Neon adapter and Resend notes, and ensure scripts from package.json are reflected. Keep headings and tone.
```

## Post-update

- Run Biome format: `bun run format`
- Generate commit message: see `git-commit-msg.md` and run AI to produce message under 140 chars.
