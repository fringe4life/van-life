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
  - **Badge version numbers** (sync with package.json versions)
- Keep wording concise, match existing style, do not over-explain.

## Rules

### General Guidelines

- Use Bun commands where possible; prefer `bunx prisma` for CLI tasks.
- If `prisma.config.ts` exists, reflect its usage (schema path, seed) and note that the deprecated `package.json#prisma` block has been removed.
- Preserve existing README headings and tone, only patch relevant sections.
- Do not change license wording.
- **Keep updates concise** - avoid verbose explanations, focus on essential information.

### Logical Grouping

When adding or updating content, place information in the appropriate existing section:

- **Styling-related** → "Styling" section (TailwindCSS, CSS utilities, custom variants, design system)
- **React 19-related** → "React 19 Features" section (Activity, native meta elements, lazy loading)
- **Performance-related** → "Performance Optimizations & Lazy Loading" section
- **Database-related** → "Database" section (Prisma, models, queries)
- **Auth-related** → "Authentication" section (better-auth, session management)
- **Routing-related** → "SEO-Friendly Slug-Based Routing" or relevant routing section
- **State management** → "URL State Management with nuqs" section
- **Build tools** → "Build System" under "Tech Stack"

Do NOT create new top-level sections for features that fit within existing sections.

### Content Standards

- Reflect the CSS and linting standards from `biome.jsonc` (with Ultracite integration) and Tailwind v4.
- Mention `nuqs` for type-safe search params via Context7.
- Mention centralized auth types in `app/lib/auth.server.ts`.
- Keep code examples short and focused (remove verbose explanations).
- Use bullet points over paragraphs where possible.

### Badge Version Sync

Always check `package.json` for current versions and update README badges accordingly:

- React Router: `react-router` version
- TypeScript: `typescript` version
- TailwindCSS: `tailwindcss` version
- Prisma: `prisma` version
- Better Auth: `better-auth` version
- nuqs: `nuqs` version
- Biome: `@biomejs/biome` version
- React: `react` version

## Quick prompt you can paste

Copy this into the chat with this file attached:

```
Please update README.md based on the codebase. Keep sections accurate and concise, sync env vars with any .env files and app/lib/env.server.ts, prefer Bun commands (bunx prisma ...), include Neon adapter and better-auth notes, ensure scripts from package.json are reflected, sync badge version numbers with package.json, logically group new information into existing sections (no new top-level sections), and keep all updates brief. Keep headings and tone.
```

## Post-update

- Run Biome format: `bun run format`
- Generate commit message: see `git-commit-msg.md` and run AI to produce message under 140 chars.
