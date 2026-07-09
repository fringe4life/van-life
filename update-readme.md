# How to Request a README Update (AI Runnable)

Provide ONLY this file in future sessions to have the AI re-scan and update `README.md` without giving full repo context.

## What the AI will do

- Re-scan these sources: `package.json`, `drizzle.config.ts`, `vite.config.ts`, `react-router.config.ts`, `wrangler.jsonc`, `app/db/schema/**`, `app/db/seed.ts`, `app/lib/env.server.ts`, `app/db/client.server.ts`, `docs/d1-setup.md`, `.env.schema`, `app/routes/**/*.tsx`, `app/components/**/*.tsx`.
- Update sections in `README.md`:
  - Prerequisites and Getting Started
  - Environment variables block (keep in sync with `.env.schema` and `app/lib/env.server.ts`)
  - Database setup commands (Drizzle generate, D1 migrate local/remote, seed)
  - Available scripts from `package.json`
  - Tech stack and configuration notes (React Router 8, Vite, React Compiler, D1, Drizzle, better-auth)
  - Project structure overview
  - **Badge version numbers** (sync with package.json versions)
- Keep wording concise, match existing style, do not over-explain.

## Rules

### General Guidelines

- Use Bun commands where possible; prefer `bun run db:*` / `bun x drizzle-kit` / `bun x wrangler` for CLI tasks.
- Reflect `drizzle.config.ts` (schema path, `d1-http`, migrations out dir) and `docs/d1-setup.md`.
- Preserve existing README headings and tone, only patch relevant sections.
- Do not change license wording.
- **Keep updates concise** - avoid verbose explanations, focus on essential information.

### Logical Grouping

When adding or updating content, place information in the appropriate existing section:

- **Styling-related** → "Styling" section (TailwindCSS, CSS utilities, custom variants, design system)
- **React 19-related** → "React 19 Features" section (Activity, native meta elements, lazy loading)
- **Performance-related** → "Performance Optimizations & Lazy Loading" section
- **Database-related** → "Database" section (Drizzle, D1, schema, migrations, seed)
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
- Drizzle: `drizzle-orm` version
- Better Auth: `better-auth` version
- nuqs: `nuqs` version
- Biome: `@biomejs/biome` version
- React: `react` version
- Vite: `vite` version

## Quick prompt you can paste

Copy this into the chat with this file attached:

```
Please update README.md based on the codebase. Keep sections accurate and concise, sync env vars with .env.schema and app/lib/env.server.ts, prefer Bun commands (bun run db:*, bun x drizzle-kit, bun x wrangler), include D1 + Drizzle and better-auth drizzle-adapter notes, ensure scripts from package.json are reflected, sync badge version numbers with package.json, logically group new information into existing sections (no new top-level sections), and keep all updates brief. Keep headings and tone.
```

## Post-update

- Run Biome format: `bun fix`
- Generate commit message: see `git-commit-msg.md` and run AI to produce message under 140 chars.
