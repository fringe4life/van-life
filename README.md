# Van Life

<div align="center">

[![React Router](https://img.shields.io/badge/React%20Router-8.3.1-61DAFB?logo=react&logoColor=white)](https://reactrouter.com/)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PandaCSS](https://img.shields.io/badge/PandaCSS-2.0.0--beta.15-F6E05E?logoColor=black)](https://panda-css.com/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.7.2-000000?logo=better-auth&logoColor=white)](https://better-auth.com/)
[![nuqs](https://img.shields.io/badge/nuqs-2.10.1-000000?logo=nuqs&logoColor=white)](https://nuqs.47ng.com/)
[![Biome](https://img.shields.io/badge/Biome-2.5.11-000000?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Ultracite](https://img.shields.io/badge/Ultracite-7.10.7-000000?logo=ultracite&logoColor=white)](https://ultracite.dev/)
[![Drizzle](https://img.shields.io/badge/Drizzle-1.0.0--rc.4-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare%20D1-SQLite-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.3.0--canary-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Valibot](https://img.shields.io/badge/Valibot-1.4.2-000000?logo=valibot&logoColor=white)](https://valibot.dev/)

</div>

A modern full-stack van rental platform built with React Router 8, showcasing advanced web development techniques including server-side rendering, authentication, and responsive design.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database](#database)
- [Authentication](#authentication)
- [URL State Management](#url-state-management-with-nuqs)
- [SEO & Routing](#seo-friendly-slug-based-routing)
- [React 19 Features](#react-19-features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Styling](#styling)
- [Code Quality](#code-quality)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Features

- 🚀 **Modern React Router 8** with server-side rendering and file-based routing
- 🔒 **Authentication** with better-auth (sign up, login, session management, safe `redirectTo` return URLs, per-field form errors; sign-out is a POST resource route + `SignOutForm`, no empty page)
- 📤 **Shared form actions** (`FormActionResult`, `StatusButton`, fetcher status helpers) for pending/success/error submit UX across auth and host forms
- 🧱 **Typed service results** (`ServiceResult` + `DomainError` → `toActionResultOrThrow`) map host rentals/wallet failures to `badRequest` / `conflict` / `internalError` / `notFound`
- ⚛️ **React 19 (canary) & Compiler** (Activity component, native meta elements, automatic optimizations, lazy loading)
- 🚌 **Van Management** (CRUD operations, van types, image handling, state management, SEO-friendly slug URLs)
- 🔍 **Advanced Van Filtering** (modular filter panel on the vans catalog, facet-based state filters, `useVanFilters` hook, multi-select types, optimistic UI, debounced nuqs updates)
- 📱 **Navigation** — public header (`nav-shell-scroll` compact on scroll) + native `<dialog>` mobile drawer; host rail grouped Activity / Listings / Rental workflow, tablet `host-nav` container, mobile native `popover` + CSS Anchor + Invoker Commands
- 🖼️ **Image Optimization** (WebP format, responsive images, quality compression, modern formats)
- 💸 **Rental System** (rent, return, and manage van rentals)
- ⭐ **Review System** (rate and review rentals; `reviewRecipe` / `ReviewBadge` + container-query layout)
- 📈 **Host Dashboard** (modular sections — income, reviews, vans, wallet — with TanStack Charts bars; wallet form uses `@container/wallet` two-column layout)
- 💰 **Financial Management** — `/host/rental-activity` (rental pay/return) vs `/host/wallet-activity` (deposit/withdraw); typed transaction rows + pagination
- 🏷️ **Van State System** (NEW, IN_REPAIR, ON_SALE, AVAILABLE with discount pricing)
- 💲 **Dynamic Pricing** (discount system with strikethrough original prices)
- 🎨 **Semantic design system** (`DESIGN.md` + `panda.config.ts`) — token paths (`surface`, `muted.foreground`, `border.subtle`) not raw palette at call sites
- 🧑‍💻 **TypeScript** throughout with strict type checking
- 🧪 **Valibot** isomorphic `schema.ts` (client + SSR) and `schema.server.ts` (forms/actions); nuqs literals share picklist arrays
- 🗄️ **Time-sortable database IDs** with UUID v7 (text columns on D1/SQLite)
- 🎨 **PandaCSS 2** (typed `css` / patterns / recipes; PostCSS + `panda build`)
- 📦 **Drizzle ORM** with Cloudflare D1 (SQLite) and relational queries
- 📋 **List primitives** — `ItemList` for guaranteed arrays (nav, sort); `CollectionList` for async/empty/error collections (`OutcomeState`)
- 🎭 **Panda recipes** (`cva` from `styled-system/css`) — `vanCard`, `transactionRecipe`, `reviewRecipe`, `outcomeState`
- 🧩 **Compound Components** with React 19's modern context API (no `.Provider`, uses `use()`)
- 📊 **Sortable Data Tables** with reusable sorting components
- 📱 **Responsive Design** with mobile-first approach
- ⚡ **Performance Optimized** with deferred loader promises (`app/components/deferred/*`), lazy charts, code splitting, and immutable array methods
- 🧯 **Outcome + route errors** — shared `OutcomeState` empty/error chrome; `RouteErrorBoundary`; nested public/host `*` 404s keep layout chrome
- 🧊 **HTTP cache headers** — `PRIVATE_NO_STORE` for host/auth; `PUBLIC_SHORT_CACHE` + `Vary: Cookie` for catalog; leaf `headers` exports via `forwardDataHeaders`
- 🔗 **URL State Management** with nuqs 2.10.1 for type-safe search parameters
- 🌐 **View Transitions** for smooth navigation (auth login/sign-up, host rental/wallet/dashboard amounts, sortable titles, chart pages, footer, and form field morphs; no nested `viewTransitionName`s)
- 🎯 **Middleware-Driven Headers** (automatic header forwarding via React Router 8 middleware)
- 🔄 **Shared Context Middleware** for eliminating duplicate data fetching between loaders and actions
- 🔐 **Consolidated host auth middleware** on `host-layout.tsx` (no duplicate session lookups on leaf routes)
- 🔍 **SEO Infrastructure** (canonical URLs, Open Graph/Twitter meta, `robots.txt`, dynamic `sitemap.xml` via `@forge42/seo-tools`)
- ☁️ **Cloudflare Workers** deployment with Varlock-managed secrets, D1 binding (`env.DB`), and Workers Cache enabled

---

## Tech Stack

### Frontend

- **React canary** builds with stable Activity component for prerendering
- **React Router 8.3.1** (file-based routing, SSR, optional route parameters, middleware)
- **TypeScript 7.0.2** with strict configuration
- **PandaCSS 2.0.0-beta.15** — tokens, recipes, patterns (`css`, `cx`, `cva` from `styled-system`)
- **Native HTML** (`<dialog>`, `popover`, CSS Anchor, Invoker Commands) with local Panda recipe wrappers (button, badge, card, checkbox, dialog, input, label, textarea, popover)
- **Lucide React 1.38.0** for icons (direct imports for performance)
- **TanStack Charts 0.16.0** for host income/review bars (lazy-loaded via `LazyBarChart`)
- **nuqs 2.10.1** for type-safe URL state management via shared parsers

### Backend & Database

- **Cloudflare Workers** with React Router SSR via `workers/app.ts`
- **Drizzle ORM 1.0.0-rc.4** with **Cloudflare D1** (SQLite; `drizzle-orm/d1`)
- **better-auth 1.7.2** with **@better-auth/drizzle-adapter** (`relations-v2`) for authentication
- **Valibot 1.4.2** for schema validation (Cloudflare Workers–friendly; no JIT)
- **uuidv7** for app-generated IDs (`createId` / `uuidv7PrimaryKey` helpers)
- **Varlock** for typed, validated environment variables (Bitwarden integration in production)

### Development Tools

- **Vite 8.2.2** - Rolldown-based tooling; native `resolve.tsconfigPaths` for `~/` imports
- **@vitejs/devtools 0.6.2** - Vite DevTools + DevTools for Rolldown (client/ssr environments)
- **rollup-plugin-visualizer 7.1.1** - Client/server bundle treemaps (`VITE_ANALYZE=true`)
- **@fontsource-variable/inter** - Self-hosted Inter (latin variable subset, ~48KB)
- **React Compiler 1.0** (stable) - Automatic memoization via `@rolldown/plugin-babel` + `reactCompilerPreset`
- **Biome 2.5.11** for linting and formatting with Ultracite integration
- **Ultracite 7.10.7** - AI-friendly linting rules for maximum type safety and accessibility
- **Varlock 1.18.0** - Typed env schema (`.env.schema`) with Cloudflare integration
- **Wrangler 4.127.1** - Cloudflare Workers CLI for deploy, D1 migrations, and typegen
- **drizzle-kit 1.0.0-rc.4** - Schema migrations (`d1-http` remote; `drizzle.local.config.ts` for local Studio)
- **react-doctor 0.9.13** - React diagnostics in CI, locally, lint-staged, and via Cursor post-edit hook (`.cursor/hooks/react-doctor.mjs`)
- **fallow 3.22.0** - Code health, dead code, duplication, complexity, architecture boundaries (`.fallowrc.jsonc`)
- **Husky 9.1.7** for Git hooks and pre-commit automation with lint-staged
- **TypeScript 7.0.2** (native `tsc`; VS Code `js/ts.experimental.useTsgo` optional)
- **@types/bun 1.4.0** — `bun:test` / `bun:sqlite` for `tsc` (`tsconfig` `types` includes `"bun"`)
- **Bun** for fast package management and runtime

### Build System

- **Vite 8.2.2** - Rolldown pipeline, `build.target: "esnext"`, `server.forwardConsole`
- **React Compiler** - `@rolldown/plugin-babel` + `reactCompilerPreset()` from `@vitejs/plugin-react` (import preset only — not `react()`; see `docs/babel-react-compiler.md`)
- **Automatic optimizations** - React Compiler handles memoization without manual `useMemo`/`useCallback`
- **Path aliases** - Native Vite `resolve.tsconfigPaths` (no `vite-tsconfig-paths` plugin)
- **Bundle analysis** - Per-environment Rolldown plugins: visualizer → `build/client|server/stats.html`; DevTools capture → `build/devtools/` when `VITE_ANALYZE=true`
- **Type-safe configuration** - Full TypeScript support in Vite config

---

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── ui/             # Panda recipe wrappers: button, dialog, checkbox, badge, card, input, label, textarea, popover
│   ├── form/           # Field, FormError, FormActionResult types, fetcher status → StatusButton helpers
│   ├── deferred/       # Await / Items / Paginated (Suspense + Await)
│   ├── image/          # Progressive image primitive (moved from features/image)
│   ├── links/          # CustomLink / CustomNavLink
│   ├── outcome-state/  # Empty/error chrome (`OutcomeState` + recipe)
│   ├── collection-list.tsx  # Uncertain lists → OutcomeState or ItemList
│   ├── item-list.tsx   # Guaranteed T[] map (nav, sort, static tabs)
│   ├── route-error-boundary.tsx  # Shared route ErrorBoundary
│   ├── status-button.tsx  # Pending/success/error submit button (idle auto-reset via useAutoIdleStatus)
│   ├── types.ts        # Shared prop types (AsProps, EmptyState, ErrorState, ViewTransitionTune)
│   └── [common]        # Sortable, search-input, etc.
├── constants/          # App-wide constants (cache-headers, time-constants, enums)
├── dal/                # Global data access helpers
│   ├── schema.server.ts      # UUID v7 Valibot schema (brand at parseUuidV7)
│   └── parse-uuidv7.server.ts # Parse/string → UUIDv7 at trust boundaries
├── features/
│   ├── auth/
│   │   ├── components/        # AuthCard, AuthForm + AUTH_VT view-transition names
│   │   ├── hooks/             # use-auth-form
│   │   ├── schema.server.ts   # Login/sign-up Valibot schemas
│   │   └── types.ts           # Login/sign-up field keys + field-error types
│   ├── host/
│   │   ├── components/ # Host UI (van-form, charts, dashboard, reviews, transaction/, host-nav/)
│   │   │   ├── dashboard/  # host-income-section, host-review-section, host-vans-section, host-wallet-form
│   │   │   ├── host-nav/   # Grouped rail + tablet container + mobile popover
│   │   │   ├── review/     # Review + review-recipe / review-badge
│   │   │   └── transaction/ # Transaction, rental/wallet rows, transaction-recipe / badge
│   │   ├── constants/  # host-nav-items, host-nav-groups, host-nav-types
│   │   ├── dal/        # rental-activity, wallet-movement, review, transaction-sort
│   │   ├── services/   # dashboard, income, rental, reviews, transfers, wallet
│   │   ├── hooks/      # use-host-wallet, balance-reducer
│   │   ├── rentals/
│   │   │   └── schema.server.ts  # Rental action schemas
│   │   ├── schema.server.ts  # Host money form + transaction-type Valibot `is`
│   │   └── utils/      # Chart period/points, pickChartGranularity, resolveChartContext
│   ├── middleware/     # Auth, Cloudflare, db context, auth-redirect helpers
│   ├── navigation/     # Nav, mobile-nav (native dialog + invoker), sign-out-form, hamburger-icon
│   ├── pagination/     # Pagination + PaginationLimitControl / PaginationControl; schema.ts parsers + loaders.server.ts
│   ├── seo/            # SEO helpers (canonical URLs, SeoHead, sitemap)
│   │   └── dal/        # SEO Drizzle reads (sitemap.server.ts)
│   └── vans/
│       ├── components/ # Van UI (VanCard, van-card-recipe, VanDetail, HostVanDetail*, van-filters/, vans-list/)
│       │   ├── van-filters/  # VanFilters, type/state sections, facet config, shared filter types
│       │   └── vans-list/    # Public catalog list + metadata/state helpers
│       ├── constants/  # vans-constants.ts
│       ├── dal/        # Van Drizzle repositories (*.server.ts)
│       ├── services/   # catalog, host-vans, van-detail
│       ├── hooks/      # use-van-filters, host-vans list reducer, display hooks, optimistic filter hooks
│       ├── schema.ts          # Van type/URL Valibot schemas + nuqs parsers
│       ├── schema.server.ts   # addVan form schema
│       ├── types.ts    # Van-specific TypeScript types (incl. VanFormValues / field errors)
│       └── utils/      # pricing, van-filter-url, to-van-form-values, pending-van-from-form-data
├── db/                 # Drizzle schema, client, seed, migrations
│   ├── client.server.ts    # createDb(d1) → drizzle-orm/d1
│   ├── d1-http.server.ts   # Remote D1 HTTP (`/raw`) for seed; tryCatch + split helpers
│   ├── migrations/         # SQL migrations (flattened for Wrangler D1)
│   ├── schema/             # auth.ts, van.ts, index.ts
│   ├── seed-data/          # Modular seed data files
│   ├── seed.ts             # Local + remote seed entry
│   └── relations.ts        # Drizzle relations
├── hooks/              # Custom React hooks
├── lib/                # Server-side utilities
│   ├── auth.server.ts      # Better-auth + drizzle-adapter/relations-v2
│   ├── env.server.ts       # Varlock env re-export
│   ├── id.server.ts        # UUID v7 ID generator for Better Auth
│   ├── nuqs-options.ts     # Shared nuqs default options
│   └── generic-sorting.server.ts  # Generic Drizzle orderBy utilities
├── types/              # Shared utility types (Maybe, List, Id, Prettify, Replace, Search)
│   ├── auth.server.ts      # AuthenticatedUser (UUIDv7 id)
│   └── ids.server.ts       # UUIDv7 re-export from dal/schema.server.ts
├── routes/             # Route modules (Activity-based single routes)
│   ├── api/            # better-auth handler (auth.ts)
│   ├── auth/           # login, sign-up; sign-out.ts resource action (POST → /login)
│   ├── host/           # Dashboard, rental-activity, wallet-activity, reviews, vans, rentals
│   │   ├── 404.tsx     # Host catch-all (keeps host chrome)
│   │   └── rentals/    # rentals list, rent/:vanSlug, returnRental/:rentId
│   ├── layout/         # Layout components
│   └── public/         # Public routes
│       ├── vans.tsx    # Van listing
│       ├── van-detail.tsx  # Van detail page
│       ├── home.tsx    # Home page
│       ├── about.tsx   # About page
│       ├── robots.txt.ts   # Dynamic robots.txt
│       ├── sitemap.xml.ts  # Dynamic sitemap
│       └── 404.tsx     # Public catch-all
├── styles.ts           # Shared Panda helpers (gridMax, fullBleed, bgSkeleton)
├── utils/              # Shared utilities
│   ├── result.ts       # Tiny Result helper
│   └── errors/         # tryCatch, ServiceResult, DomainError, toActionResultOrThrow, parse-schema.ts, HTTP helpers
├── assets/             # Static assets (SVGs, images)
├── root.tsx            # Root component
└── routes.ts           # Route configuration

workers/
└── app.ts              # Cloudflare Workers entry (React Router SSR)

DESIGN.md                   # Semantic design system (Panda tokens, roles, usage)
panda.config.ts             # Panda tokens, recipes, conditions, view transitions
postcss.config.cjs          # Panda PostCSS plugin
styled-system/              # Generated Panda helpers (do not edit; import `styled-system/*` via tsconfig path)

docs/
├── react-router-audit.md   # Framework-mode audit and middleware notes
├── react-router-framework-to-data-mode.md # Framework → data-mode notes
├── octane-compatibility.md # Octane / React Compiler notes
├── babel-react-compiler.md # React Compiler via @rolldown/plugin-babel (Vite 8)
├── react-stinky-report.md  # React Stinky smell sweep + fixes
├── fallow-health-backlog.md # Code health backlog from fallow analysis
├── financial-display-routing.md # Host rental vs wallet activity IA
├── cursor-pagination-limit-and-component-split.md # Pagination limit vs cursor split
├── host-navigation-popover.md # Host rail / tablet / native popover contract
└── temporal-api.md         # Temporal.Instant notes (not shipped; polyfill required)

.fallowrc.jsonc             # Fallow config (boundaries, health thresholds, security categories)
```

---

## Database

- **Cloudflare D1** (SQLite) with **Drizzle ORM** (`drizzle-orm/d1`)
- **Schema** in `app/db/schema/` (`auth.ts`, `van.ts`); remote via `drizzle.config.ts` (`d1-http`); local Studio via `drizzle.local.config.ts` (Miniflare SQLite)
- **Main tables:**
  - `user`, `session`, `account`, `verification` — Authentication (better-auth)
  - `van` — Listings with types (SIMPLE, LUXURY, RUGGED), states (IN_REPAIR, ON_SALE, AVAILABLE), SEO slugs
  - `rent` — Rental records and history
  - `review` — User reviews and ratings
  - `transaction` — Financial ledger (deposits, withdrawals, rental payments)
- **Account (better-auth 1.7):** `issuer` + `accountId` (unique together); credential rows use `issuer = local:credential`
- **Features:**
  - **UUID v7** primary keys via `uuidv7PrimaryKey` / `createId`
  - **Drizzle relations v2** (`defineRelations` in `app/db/relations.ts`; passed to `drizzle(d1, { relations })`)
  - **Van search** — case-insensitive `LIKE` on name/description (word-split)
  - **Indexes** for host/type composites, rent pagination (`renterId`/`rentedTo`/`id`), review FKs; unique `van.slug`
  - **Van state** — NEW is client-derived; IN_REPAIR / ON_SALE / AVAILABLE stored
  - **Slug-based routing** with Valibot regex + max length validation
  - **Branded UUID v7 types** via a unique-symbol brand and `parseUuidV7` at trust boundaries
  - **`dbContext` middleware** — shares `AppDb` from `env.DB` with loaders/actions

### Setup Database

```bash
# Generate SQL migrations from schema
bun run db:generate

# Apply locally (Miniflare) or remotely
bun run db:migrate:local
bun run db:migrate:remote

# Seed (needs ≥3 users via sign-up first)
bun run db:seed          # local
bun run db:seed:remote   # remote D1 HTTP

# Optional: run SQLite PRAGMA optimize after heavy seed/migrate
bun run db:optimize:local
bun run db:optimize:remote

# Drizzle Studio (local Miniflare SQLite / remote D1 HTTP)
bun run db:studio:local
bun run db:studio:remote
```

### Drizzle Configuration

```ts
// drizzle.config.ts (remote d1-http)
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: ["./app/db/schema/auth.ts", "./app/db/schema/van.ts"],
  out: "./app/db/migrations",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
    databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "",
    token: process.env.CLOUDFLARE_D1_TOKEN ?? "",
  },
});
```

Notes:

- Runtime uses `createDb(env.DB)` — no `DATABASE_URL`.
- Remote seed uses `createD1HttpDb` (`app/db/d1-http.server.ts`): sqlite-proxy → Cloudflare D1 `/raw`; `tryCatch` on fetch; helpers for parse, success assert, and row shaping (keeps fallow CRAP under threshold).
- `CLOUDFLARE_*` vars required in `.env.schema` (drizzle-kit Studio / remote seed).
- Local Studio: `drizzle.local.config.ts` resolves Miniflare SQLite under `.wrangler/state/...`.
- Nested drizzle-kit folders flattened by `scripts/flatten-d1-migrations.ts` before Wrangler apply; `snapshot.json` kept nested for next `db:generate` diffs.
- Hyperdrive is **not** used (Postgres/MySQL only).

### Data access and services

- **`app/dal/`** — global UUID branding and parsing only (`parseUuidV7` throws `DomainError` `INVALID_ID`)
- **`features/*/dal/*.server.ts`** — Drizzle repositories (persistence, no `tryCatch`)
- **`features/*/services/*.server.ts`** — use-case orchestration; return `ServiceResult` (`ok` / `err`) for mutating flows; `tryCatch` where UI tolerates partial failure
- **Routes** — HTTP only: auth, form validation, call services, map via `toActionResultOrThrow` (or `throwDomainHttp` in loaders/middleware)

```typescript
// Route action
const result = await completeReturnRental(db, args);
const actionFailure = toActionResultOrThrow(result);
if (actionFailure) {
  return actionFailure;
}

// Service (typed failure kinds)
return err({ kind: "insufficient_funds", message: "Cannot afford…" });
```

### Validation (Valibot)

- **`schema.ts`** — isomorphic (client + server, including SSR). **`schema.server.ts`** — server only. **`schema.client.ts`** — none: RR `.client.ts` cannot be imported from route modules or SSR components.
- **Van / pagination URL enums** — feature `schema.ts`. Form actions (`addVan`, money, login/sign-up) live in `schema.server.ts`. Types via `InferOutput`. URL/form → DB: `vanTypeFromClientSchema`. Van type in URL, filters, and badges is `VanType` (`SIMPLE` / `RUGGED` / `LUXURY`).
- **UUID v7** (`app/dal/schema.server.ts`) — `uuidv7Schema`, branded at `parseUuidV7`
- **Rental actions** (`app/features/host/rentals/schema.server.ts`)
- **Parse helper** (`app/utils/errors/parse-schema.ts`) — `validateSchema`, `schemaErrorsToFieldErrors` for per-field form UI
- **nuqs** — primitive query enums use `parseAsStringLiteral` / `parseAsNumberLiteral` on the same const arrays as Valibot `picklist`. Standard Schema in nuqs is `parseAsJson` (JSON blobs in the URL) and `createStandardSchemaV1` (nuqs parsers → tRPC / TanStack Router), not Valibot → `?limit=10`. Unconstrained bits stay `parseAsString` / `parseAsBoolean`.

---

## Authentication

- **better-auth 1.7.2** with **@better-auth/drizzle-adapter/relations-v2** (SQLite / D1)
- **Joins** via `advanced.database.joins: true` (session/user fetched with relational queries)
- **Account identity** keyed by `(issuer, accountId)` — `issuer` is new in 1.7
- **Session management** with cookie cache + `preserveSessionInDatabase`
- **Protected routes** with automatic redirects via `getLoginRedirectUrl` / `getSafeRedirectPath` (`app/features/middleware/utils/auth-redirect.ts`)
- **Return path** from React Router’s normalized middleware `url` (`getReturnPathFromUrl`) — strips `.data` / `_.data` / `_routes` (do not use raw `request.url`)
- **Host auth middleware** runs once on `host-layout.tsx` (stub loader ensures `.data` requests on client navigations)
- **`redirectTo` query param** on login — returns users to the page they tried to visit (open-redirect safe)
- **Valibot validation** (`app/features/auth/schema.server.ts`) for login/sign-up forms
- **Per-field errors** — `schemaErrorsToFieldErrors` + `LOGIN_FORM_FIELDS` / `SIGN_UP_FORM_FIELDS` (`app/features/auth/types.ts`); UI via shared `Field` / `FormError`
- **Form action results** — `FormActionResult` + `toActionResultOrThrow` map `ServiceResult` kinds to `badRequest` / `conflict` / `internalError` / `notFound`; `getFetcherStatus` + `useAutoIdleStatus` drive `StatusButton`
- **Accessible auth forms** — `useFetcher` + `useTransition`, labeled inputs, `aria-invalid` / `aria-describedby`, form-level `role="alert"`
- **View transitions** on login/sign-up — shared `AuthCard` + `AUTH_VT` names on card, title, fields, submit, footer
- **Server-side session handling** in loaders
- **Better-auth config** in `app/lib/auth.server.ts`; **`AuthenticatedUser`** type in `app/types/auth.server.ts`
- **UUID v7 generator** (`createId` in `app/lib/id.server.ts`) for user IDs via Better Auth `generateId`
- **Sign-out** — resource route `app/routes/auth/sign-out.ts` (`POST /signout`); `SignOutForm` posts via fetcher; success `replace`s to `/login`

---

## URL State Management with nuqs

The application uses **nuqs 2.10.1** for type-safe URL state management:

### Features

- **Type-safe search parameters** with shared parsers between server and client
- **Server-side loaders** with `createLoader` for efficient data fetching
- **Client-side state management** with `useQueryStates`
- **Bidirectional cursor pagination** with forward/backward navigation
- **Pagination with sorting** on Reviews, rental-activity, and wallet-activity pages
- **Split pagination parsers** — `limitParsers` vs `cursorPaginationParsers` (`app/features/pagination/schema.ts`); limit change does not reset cursor
- **Van search functionality** with case-insensitive `LIKE` across name and description (word-split), debounced input (250ms), immediate Enter key submission
- **Advanced van filtering** via `vansFilterUrlParsers` — multi-select types plus facet-driven state filters (`van-state-filter-config.ts`); debounced adds, immediate removes (`van-filter-url.ts`)
- **Automatic URL synchronization** with proper type handling
- **View transitions support** for smooth navigation
- **Pagination state preservation** - All search params (cursor, limit, types, excludeInRepair, onlyOnSale, search) preserved when navigating to detail pages and back via `buildVanSearchParams` utility

### Implementation

```typescript
// Cursor vs limit (app/features/pagination/schema.ts)
export const limitParsers = { limit: parseAsLimit };
export const cursorPaginationParsers = { cursor, direction };

// Host lists compose both + sort (feature parsers)
export const hostPaginationParsers = {
  ...cursorPaginationParsers,
  ...limitParsers,
  sort: parseAsSortOption,
};

// Server-side loaders (app/features/pagination/loaders.server.ts)
export const loadSearchParams = createLoader(paginationParsers);

// Client-side usage
const [{ cursor, limit, direction, type }, setSearchParams] =
  useQueryStates(paginationParsers);

// Preserve pagination and filter state in detail pages
export async function loader({ params, request }: Route.LoaderArgs) {
  const { cursor, limit } = loadPaginationParams(request);
  const { search } = loadSearchParams(request);
  const { types, excludeInRepair, onlyOnSale } = loadVanFiltersParams(request);
  // ... fetch data
  return data({ van, cursor, limit, search, types, excludeInRepair, onlyOnSale });
}

// Build back link with preserved params (all filters included)
const backLink = buildVanSearchParams({
  cursor,
  limit,
  types,
  excludeInRepair,
  onlyOnSale,
  search,
  baseUrl: href('/vans')
});
```

---

## Shared Context Middleware Pattern

React Router 8's middleware system enables efficient data sharing between loaders and actions:

### Benefits

- **Eliminates duplicate fetching** - Data fetched once in middleware, shared between loader and action
- **Type-safe context** - Fully typed shared data with TypeScript
- **Cleaner code** - Loaders and actions focus on business logic, not data fetching
- **Better performance** - Reduces database queries and API calls

### Implementation

```typescript
import { createContext } from 'react-router';

// Define typed context
type SharedData = {
  rent: NonNullable<Awaited<ReturnType<typeof getRent>>>;
  balance: number;
};

const sharedDataContext = createContext<SharedData>();

// Fetch data once in middleware
const fetchDataMiddleware: Route.MiddlewareFunction = async (
  { params, context },
  next
) => {
  const [rent, balance] = await Promise.all([
    getRent(params.rentId),
    getBalance(session.user.id),
  ]);
  
  context.set(sharedDataContext, { rent, balance });
  return next();
};

export const middleware = [authMiddleware, fetchDataMiddleware];

// Synchronous loader - just retrieves from context
export function loader({ context }: Route.LoaderArgs) {
  return context.get(sharedDataContext);
}

// Action also uses same data
export async function action({ context }: Route.ActionArgs) {
  const { rent, balance } = context.get(sharedDataContext);
  // Use shared data for validation/business logic
}
```

**Note:** Loaders can be synchronous when only retrieving data from context (no `await` needed).

---

## SEO-Friendly Slug-Based Routing

The application uses **human-readable slugs** for van URLs and a centralized SEO layer:

### SEO Infrastructure

- **`SeoHead` component** (`app/features/seo/seo-head.tsx`) - title, description, canonical, Open Graph, and Twitter meta
- **Server-side SEO builders** (`build-page-seo.server.ts`) - per-route title/description/canonical URLs
- **`SITE_URL` env var** - canonical and OG link base (falls back to request origin)
- **Dynamic `robots.txt`** - production allows public routes, blocks host/auth/api; dev disallows all
- **Dynamic `sitemap.xml`** - lists public van detail pages from database
- **`@forge42/seo-tools`** - robots.txt generation

### Slug Routing Features

- **SEO-friendly URLs** - `/vans/modest-explorer` instead of `/vans/cmgg0wp450001zrijvbpx2uo0`
- **User-friendly** - Shareable, memorable URLs for better user experience
- **Type-safe validation** - Valibot schema with regex + max length
- **Automatic generation** - Slugs auto-generated from van names using `getSlug()` utility
- **Unique constraint** - Database-enforced uniqueness with indexed lookups
- **Internal ID usage** - Database operations use UUID v7 for security and referential integrity

### Implementation

```typescript
// Slug schema (kebab-case words, max 70 chars)
const slugSchema = pipe(
  string(),
  regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers, hyphens"),
  maxLength(70)
);

// Database lookup by slug (Drizzle)
const [row] = await db
  .select({ id: van.id })
  .from(van)
  .where(eq(van.slug, vanSlug))
  .limit(1);

// Routes use slugs
route(":vanSlug", "./routes/public/van-detail.tsx");
```

### URL Examples

- Public van detail: `/vans/modest-explorer`
- Public van detail with pagination: `/vans/modest-explorer?cursor=abc123&type=luxury`
- Host van detail: `/host/vans/beach-bum`
- Rent van: `/host/rentals/rent/the-cruiser`

### Pagination State Preservation

When navigating from a paginated list to a detail page, all search params (cursor, limit, types, excludeInRepair, onlyOnSale, search) are preserved in the URL and automatically included in the back link via the `buildVanSearchParams` utility. This ensures users return to the exact same filtered and paginated view they were viewing, maintaining complete filter state across navigation.

---

## Van State System & Dynamic Pricing

The application features a comprehensive **van state management system** with dynamic pricing:

### Van States

- **NEW** - Client-derived state for vans created within the last 6 months
- **IN_REPAIR** - Vans currently under maintenance (not rentable)
- **ON_SALE** - Vans with discount pricing applied
- **AVAILABLE** - Standard rentable vans

### Dynamic Pricing Features

- **Discount System** - ON_SALE vans can have 5-100% discounts
- **Price Display** - Original price with strikethrough, discounted price highlighted
- **VanPrice Component** - Reusable component for consistent pricing display
- **Smart Badges** - VanBadge component shows relevant state information
- **Client-side Derivation** - NEW state computed from createdAt timestamp

### Implementation

```typescript
// Van state + discount (Drizzle sqliteTable)
state: text("state", {
  enum: ["IN_REPAIR", "ON_SALE", "AVAILABLE"],
}).default("AVAILABLE"),
discount: integer("discount").default(0),

// Dynamic pricing component
<VanPrice van={{ price, discount, state }} />
```

### Benefits

- **Flexible pricing** - Easy to manage sales and promotions
- **State consistency** - Prevents renting of unavailable vans
- **User experience** - Clear visual indicators for van status
- **Maintainable** - Centralized pricing logic in reusable components

---

## Generic Sorting System

The application features a **reusable sorting system** with type-safe generic utilities:

### Features

- **Generic sorting utility** (`app/lib/generic-sorting.server.ts`) for Drizzle orderBy clauses
- **Reusable Sortable component** (`app/components/sortable.tsx`) for consistent UI
- **Type-safe orderBy clauses** with full TypeScript support
- **URL state integration** with nuqs for persistent sorting preferences
- **Four sort options**: newest, oldest, highest, lowest

### Implementation

```typescript
// Generic sorting utility
export function createGenericOrderBy(
  sort: SortOption,
  config: SortConfig
): OrderByClause {
  // Returns { field: 'asc' | 'desc' } for Drizzle
}

// Reusable component
<Sortable
  title="Reviews"
  itemCount={reviews.length}
/>

// Database integration
const orderBy = createGenericOrderBy(sort, {
  dateField: 'createdAt',
  valueField: 'rating'
});
```

### Usage

- **Reviews page**: Sort by newest/oldest date or highest/lowest rating (with pagination)
- **Rental activity** (`/host/rental-activity`): Sort by date or amount (rental pay/return)
- **Wallet activity** (`/host/wallet-activity`): Sort by date or amount (deposit/withdraw)
- **Extensible**: Easy to add sorting to any new data table

### Backward Pagination with Sorting

When navigating backward through paginated, sorted results, the sort order is automatically reversed to fetch the correct items. The `reverseSortOption` helper ensures proper bidirectional pagination:

- `newest` ↔ `oldest` (for date-based sorting)
- `highest` ↔ `lowest` (for value-based sorting)

Results are then reversed back to the correct display order by the `toPagination` utility.

---

## Pagination Utilities

The application features **generic pagination utilities** for consistent cursor-based pagination across all data tables:

### Features

- **Generic `toPagination` utility** (`app/features/pagination/utils/to-pagination.server.ts`) - Processes database results and returns items with pagination metadata
- **`getCursorMetadata` utility** (`app/features/pagination/utils/get-cursor-metadata.server.ts`) - Provides `cursorId`, sort order, and `take` for Drizzle `lt`/`gt` + `limit` queries
- **`resolveSortedCursor` helper** (`app/features/pagination/utils/resolve-sorted-cursor.server.ts`) - Shared cursor + `orderBy` prelude for host rental-activity / reviews / wallet-activity DALs
- **Split UI** — `PaginationLimitControl` (limit only) + `PaginationControl` (cursor pages); compose in `Pagination`
- **Bidirectional pagination support** - Handles both forward and backward pagination with correct logic
- **Automatic result reversal** - Reverses results for backward pagination to maintain correct display order
- **Type-safe** - Full TypeScript support with generic types
- **`reverseSortOption` helper** (`app/features/pagination/utils/reverse-sort-order.ts`) - Reverses sort options for backward pagination queries
- **`buildVanSearchParams` utility** (`app/features/pagination/utils/build-search-params.ts`) - Builds URL search parameters for pagination and filter state preservation (supports types array, excludeInRepair, onlyOnSale, search params)

### Implementation

```typescript
// Get cursor metadata for Drizzle queries
const { cursorId, orderBy, take } = getCursorMetadata({
  cursor,
  limit,
  direction,
});

// Generic pagination utility
export function toPagination<T extends Id>({
  items,
  limit,
  cursor,
  direction = 'forward',
}: ToPaginationParams<T>): PaginationProps<T> {
  // Processes results, detects extra item, reverses for backward nav
}

// Usage in loaders — apply cursorId with lt/gt on id + limit(take)
const rawItems = await db
  .select()
  .from(review)
  .where(/* cursorId ? lt/gt(review.id, cursorId) : undefined */)
  .orderBy(/* from orderBy */)
  .limit(take);

const { items, paginationMetadata } = toPagination({
  items: rawItems,
  limit,
  cursor,
  direction,
});
```

### Pagination Logic

The `toPagination` utility implements correct cursor pagination logic:

- **Forward pagination**: `hasNextPage = hasMoreResults`, `hasPreviousPage = has cursor`
- **Backward pagination**: `hasNextPage = has cursor`, `hasPreviousPage = hasMoreResults`
- **Result reversal**: For backward pagination, results are automatically reversed since the query returns them in opposite order
- **Pagination metadata**: Returns `paginationMetadata` object with `hasNextPage` and `hasPreviousPage` flags instead of separate props

### Benefits

- **Consistent pagination** - Same logic used across all paginated pages (Reviews, rental-activity, wallet-activity, Vans)
- **Correct bidirectional navigation** - Proper handling of forward/backward pagination
- **Type safety** - Generic utility works with any data type
- **Maintainability** - Single source of truth for pagination logic

---

## Van card recipe

`vanCard` Panda recipe in `app/features/vans/components/van-card-recipe.ts` maps van state to border/wash tokens. Call sites pass `viewTransitionName` separately (`card-${van.id}`).

```tsx
<Card
  className={vanCard({ className, state: lowercaseVanState(van) })}
  style={{ viewTransitionName: `card-${van.id}` }}
>
```

**Used in:** `VanCard`, `VanDetail`, `VanDetailCard`

### Compound Components

`VanDetailCard` uses the compound component pattern with React 19's modern context API:

```typescript
// Usage with sub-components
<VanDetailCard van={van}>
  <Activity mode={isDetailsPage ? 'visible' : 'hidden'}>
    <VanDetailCard.Details />
  </Activity>
  <Activity mode={isPhotosPage ? 'visible' : 'hidden'}>
    <VanDetailCard.Photos />
  </Activity>
  <Activity mode={isPricingPage ? 'visible' : 'hidden'}>
    <VanDetailCard.Pricing />
  </Activity>
</VanDetailCard>
```

**Benefits:**
- **Cleaner API**: No prop drilling, van data shared via context
- **Modern React 19**: Uses `use()` hook and context without `.Provider`
- **Composable**: Mix and match sub-components as needed
- **Type-safe**: Full TypeScript support with proper error boundaries

---

## React 19 Features

The application leverages **React 19's modern features** for better performance and developer experience:

### Activity Component for Prerendering

React 19's stable Activity component enables instant navigation by prerendering multiple views:

```tsx
import { Activity } from "react";

export default function Vans({ params }) {
  const isDetailPage = params.vanSlug !== undefined;

  return (
    <>
      <Activity mode={isDetailPage ? "visible" : "hidden"}>
        <VanDetail />
      </Activity>
      <Activity mode={isDetailPage ? "hidden" : "visible"}>
        <VanList />
      </Activity>
    </>
  );
}
```

**Benefits:** Zero perceived latency between views, state preservation (scroll position, filters), memory efficient with paused effects.

### Native Meta Elements & SeoHead

Meta tags use React 19 native elements and the shared `SeoHead` component for full SEO coverage:

```tsx
import { SeoHead } from '~/features/seo/seo-head';

export default function Home() {
  return (
    <section>
      <SeoHead title="Home | Van Life" description="..." url={canonicalUrl} />
      {/* rest of component */}
    </section>
  );
}
```

This replaces the deprecated `meta` export pattern and removes the need for the `<Meta />` component in `root.tsx`.

### React Compiler (Stable)

The application uses **React Compiler 1.0** for automatic performance optimizations:

```tsx
// React Compiler automatically optimizes components
export default function MyComponent({ items }) {
  // No manual useMemo/useCallback needed
  const filtered = items.filter((item) => item.active);

  return <List items={filtered} />;
}
```

**Benefits:** Automatic memoization, reduced boilerplate, better performance without manual optimization.

### Optimistic UI with useOptimistic

React 19's `useOptimistic` hook provides instant visual feedback for user interactions, particularly useful for filter toggles and search:

```tsx
import { useOptimistic } from 'react';

const [optimisticValue, toggleOptimistic] = useOptimistic(
  initialValue,
  reducer
);

// Immediate UI update, actual state update debounced
toggleOptimistic({ type: 'toggle' });
```

**Benefits:** Instant feedback with lower opacity indicators, reduced perceived latency, improved UX with debounced server updates.

### Lazy Loading with React.lazy()

Heavy components like charts are code-split using `React.lazy()` and `Suspense` via `LazyBarChart` → `bar-chart.tsx` (`@tanstack/charts`; no `.client` suffix):

```tsx
const BarChartComponent = lazy(() => import("./bar-chart"));

<Suspense fallback={<Skeleton />}>
  <BarChartComponent data={chartData} />
</Suspense>;
```

### Deferred loader streaming

Host rental-activity / reviews / wallet-activity return critical summary data immediately and defer paginated lists via promises. UI wraps with `app/components/deferred` (`Await` / `Paginated`) + route skeletons (`TransactionListSkeleton`, `ReviewListSkeleton`, `PaginatedItemsSkeleton`).

```tsx
<DeferredPaginated
  Component={Transaction}
  fallback={<TransactionListSkeleton />}
  resolve={pagePromise}
  renderProps={renderIncomeItemProps}
/>
```

Chart series use server SQL aggregations (`resolveChartContext`, `pickChartGranularity`, period/points helpers) so clients receive buckets — not raw transaction rows.

### Benefits

- **Better Performance** - Faster TTFB via deferred lists, smaller payloads, automatic optimizations
- **Improved SEO** - Proper meta tags, social sharing support
- **Simpler Code** - Native elements, automatic memoization, no manual optimization
- **Enhanced UX** - Skeletons while deferred promises resolve; smooth view transitions

---

## Getting Started

### Prerequisites

- Node.js 24+ (or Bun)
- Bun (recommended)
- Cloudflare account + D1 database (Wrangler D1 binding `DB` in `wrangler.jsonc`)
- Bitwarden access token (optional; for Varlock secret resolution in production)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd van-life

# Install dependencies
bun install

# Environment: edit .env.schema defaults or add .env.local (gitignored)
# Secrets resolve via Varlock; Bitwarden optional in production
# Required: BETTER_AUTH_SECRET, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN (see .env.schema)

# Set up D1 (create DB + paste database_id into wrangler.jsonc first)
bun run db:generate
bun run db:migrate:local
# Sign up ≥3 users in the app, then:
bun run db:seed

# Start development server (Varlock loads env; Vite CF plugin provides env.DB)
bun run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
# Build
bun run build

# Preview locally
bun run preview

# Deploy to Cloudflare Workers
bun run deploy:project
```

---

## Environment Variables

Environment variables are defined in `.env.schema` (Varlock) and validated at runtime. Committed env files:

- `.env.schema` — schema + non-secret defaults
- `.env.bitwarden` — Bitwarden plugin init + `bitwarden()` resolvers (imported when `VARLOCK_ENV` is `development` | `preview` | `production`)
- `.env.test` — plain placeholders for CI / `VARLOCK_ENV=test` (no Bitwarden)

Use `.env.local` (gitignored) for local overrides. Bitwarden machine token via env / GH secret `BITWARDEN_ACCESS_TOKEN`.

```env
# Environment (development | preview | production | test)
VARLOCK_ENV=development

# Authentication (resolved via Bitwarden when not test)
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:5173

# SEO (canonical URLs, Open Graph)
SITE_URL=http://localhost:5173

# drizzle-kit d1-http / remote seed (required in .env.schema)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_D1_TOKEN=

# Bitwarden (required for non-test envs)
# BITWARDEN_ACCESS_TOKEN=
```

Validated and typed via Varlock (`.env.schema` → `env.d.ts`); consumed in app code through `app/lib/env.server.ts`. Runtime DB is the Wrangler D1 binding `env.DB` (not a connection string).

---

## Scripts

- `bun run dev` – Start development server with HMR (Varlock loads env; Vite DevTools dock available)
- `bun run build` – Build for production (Cloudflare Workers + client assets)
- `bun run analyze` – Production build with bundle analysis (`VITE_ANALYZE=true`; visualizer + DevTools capture)
- `bun run devtools` – Open standalone Vite DevTools UI (`vite-devtools`)
- `bun run preview` – Preview the production build locally
- `bun run deploy:project` – Deploy to Cloudflare Workers via Varlock + Wrangler (upload + go live)
- `bun run deploy:upload` – Upload a Worker version only (preview URL; prod traffic unchanged)
- `bun run deploy:versions` – Promote an uploaded version to traffic (interactive; supports gradual %)
- `bun run typegen` – Generate Wrangler types and React Router route types
- `bun run typecheck` – TypeScript checking (`typegen` + `tsc`)
- `bun run db:generate` – Generate Drizzle SQL migrations to `app/db/migrations`
- `bun run db:migrate:local` – Flatten + apply D1 migrations locally
- `bun run db:migrate:remote` – Flatten + apply D1 migrations remotely
- `bun run db:optimize:local` – `PRAGMA optimize` on local Miniflare D1
- `bun run db:optimize:remote` – `PRAGMA optimize` on remote D1
- `bun run db:seed` – Seed local Miniflare D1
- `bun run db:seed:remote` – Seed remote D1 via HTTP API
- `bun run db:studio:local` – Drizzle Studio against local Miniflare SQLite
- `bun run db:studio:remote` – Drizzle Studio against remote D1 (`d1-http`)
- `bun run fix` – Auto-fix issues with Ultracite (format + lint)
- `bun run check` – Run Ultracite checks (no fix)
- `bun run doctor` – Run Ultracite doctor
- `bun run react-doctor` – React Doctor on changed files (`--verbose --scope changed`)
- `bun run fallow` – Full fallow analysis (dead code + dupes + health)
- `bun run fallow:audit` – PR-style audit (dead code, complexity, duplication on changed files)
- `bun run test` – Run Bun test suite
- `bun run prepare` – Install Husky hooks and run `panda build`
- `bun run ultracite:upgrade` – Upgrade Ultracite and re-init (Bun, Biome, Cursor)

### Ultracite Commands

- `bunx ultracite init` – Initialize Ultracite in your project
- `bun run fix` – Format and fix code via Ultracite
- `bun run check` – Check for issues without fixing

### Git Hooks (Husky + lint-staged)

This project uses **Husky** with **lint-staged** for automated pre-commit checks:

- **Pre-commit hook** (`bunx lint-staged`) runs automatically before each commit
- **lint-staged** runs Ultracite, react-doctor, typecheck, tests, and fallow on staged files
- **Automatic formatting** with Ultracite on staged files
- **Commit blocking** if any checks fail

The pre-commit hook ensures code quality by:

1. Running `bun fix` (Ultracite) on staged files via lint-staged
2. Running `react-doctor --staged` on JS/TS files
3. Running `bun typecheck` and `bun test` on TypeScript files
4. Running `fallow dead-code --file …` on staged TS/TSX files (boundaries + dead code)
5. Blocking the commit if any step fails

Configuration in `lint-staged.config.ts`.

**Note:** TypeScript config files work seamlessly with Bun's first-class TypeScript support. For Node.js, requires version 22.6.0+ or the `--experimental-strip-types` flag.

---

## Styling

### PandaCSS 2 & Modern CSS

- **PandaCSS 2.0.0-beta.15** — typed `css` / `cx` / `cva` / patterns from `styled-system` (generated; do not edit)
- **Tokens + recipes** in `panda.config.ts`; PostCSS via `postcss.config.cjs`; `bun run prepare` runs `panda build`
- **Inter font** via `@fontsource-variable/inter` (latin variable woff2 only)
- **Mobile nav animations** — native `<dialog>` panel/fullscreen variants (`starting-style`, `transition-discrete`, Invoker Commands)
- **Public header** — `nav-shell-scroll` keyframes compact the bar on scroll (`panda.config.ts`)
- **Host nav** — grouped rail; tablet named `host-nav` container; mobile native `popover="auto"` + CSS Anchor + Invoker `toggle-popover` (uncontrolled; see `docs/host-navigation-popover.md`)
- **Reusable keyframes** — parameterized fade / scale / slide / `nav-shell-scroll` in `panda.config.ts` + leftover `::view-transition-*` in `app/app.css`
- **Auth + host view transitions** — named bags via `defineViewTransitions`; unique `view-transition-name` stays on the element
- **Semantic tokens** — `DESIGN.md`; consume paths (`surface`, `muted.foreground`, `border.subtle`) not palette primitives at call sites
- **Scroll-driven host nav hint** — `supportsScroll` condition + scroll-driven classes in `app/app.css`
- **Responsive design** with mobile-first approach and Panda `grid` / `cq` patterns
- **Shared helpers** — `app/styles.ts` (`gridMax`, `fullBleed`, `fullLayout`, `bgSkeleton`)

### Custom Design System

- **Theme tokens** in `panda.config.ts` — palette primitives + semantic roles; see `DESIGN.md`
- **Component variants** using Panda `cva` (`button-variants.ts`, `badge-variants.ts`, `vanCard`, `dialogVariants`, `outcomeState`, `popover`)
- **Van card chrome** — `vanCard` recipe in `van-card-recipe.ts`
- **Named container queries** — host wallet / outcome-state layouts via Panda `cq` and `gridTemplateAreas`
- **Type-safe styling** with TypeScript token paths throughout

---

## Code Quality

- **Biome 2.5.11** for linting and formatting with Ultracite integration
- **Ultracite 7.10.7** - AI-friendly linting rules for maximum type safety and accessibility
- **TypeScript 7.0.2** with strict configuration
- **Valibot 1.4.2** for runtime validation with regex support for slug validation
- **Consistent code style:**
  - Tab indentation
  - Single quotes
  - Sorted CSS classes
  - Organized imports
- **Type safety** throughout the application
- **Error handling** with `DomainError` / `ServiceResult` / `toActionResultOrThrow`, plus `notFound` / `serverError` / `badRequest` / `conflict` / `internalError`, `getRouteErrorMessage` for boundaries, and `getCollectionState` for list empty/error states
- **nuqs** for type-safe URL state management
- **Drizzle** with typed schema in `app/db/schema/`
- **Feature schemas** — vans/pagination URL enums in `schema.ts`; form actions in `schema.server.ts`; Van type is uppercase `VanType` (`SIMPLE` / `RUGGED` / `LUXURY`) end-to-end
- **fallow 3.22.0** - Architecture boundaries (feature↔route pairing in `.fallowrc.jsonc`), dead-code/dupes/health analysis; rules at `warn` until backlog cleared
- **Bun `overrides`** — pin transitive audit fixes (`@remix-run/server-runtime`, `brace-expansion`, `fast-uri`, `picomatch`, `turbo-stream`, …) while `bunfig.toml` keeps `minimumReleaseAge`

### GitHub Actions

- **CI** (`.github/workflows/ci.yml`) — least-privilege permissions:
  - **Quality** (`contents: read`) — `VARLOCK_ENV=test` loads `.env.test` (no Bitwarden); Bun install, Ultracite `check`, `typecheck`, `test`
  - **Varlock** (`contents: read`, `push` to `master` only) — `VARLOCK_ENV=development` loads `.env.bitwarden` + `BITWARDEN_ACCESS_TOKEN`
  - **React Doctor** (PR only; `pull-requests` / `issues` / `statuses: write`) — SHA-pinned `millionco/react-doctor@v2.2.9` Action (`version: 0.9.13`, same as `package.json`); self-contained, no Bun install
  - **Fallow** (PR only; `pull-requests: write`, `checks: write`) — SHA-pinned `fallow-rs/fallow@v3.22.0` Action (CLI `version: 3.22.0`, same as `package.json`); audit + health score + PR summary/review comments + Check Run; security scan (soft gate, `fail-on-issues: false`)
- **CodeQL** (`.github/workflows/codeql.yml`) — separate security scan on push/PR/schedule to `master`
- **Secret:** set `BITWARDEN_ACCESS_TOKEN` via `gh secret set BITWARDEN_ACCESS_TOKEN` (Varlock job on `master` only)
- **Pinned Actions:** third-party `uses:` pin full commit SHAs (version comment beside) to reduce supply-chain tag mutability; bump via Dependabot `github-actions` or periodic SHA refresh

### Ultracite Integration

This project uses **Ultracite** for enhanced code quality and AI-friendly development:

- **Zero configuration required** - Works out of the box with sensible defaults
- **Subsecond performance** - Lightning-fast linting and formatting
- **Maximum type safety** - Strict TypeScript rules and accessibility standards
- **AI-friendly code generation** - Optimized for modern AI development workflows
- **Accessibility enforcement** - Built-in a11y rules and best practices
- **React/Next.js specific rules** - Tailored for modern React development

### Biome Configuration

- **Ultracite integration** via `extends: ["ultracite/biome/react", "ultracite/biome/core", "ultracite/biome/remix"]` in `biome.jsonc`
- **CSS at-rules support** for Panda layers (`reset`, `base`, `tokens`, `recipes`, `utilities`)
- **Sorted CSS classes** for consistency
- **TypeScript strict mode** enabled
- **Import organization** and sorting
- **Custom rules** for class sorting and organization

---

## Deployment

### Cloudflare Workers

The application deploys to **Cloudflare Workers** with static client assets:

- **Worker entry** - `workers/app.ts` with React Router SSR request handler
- **Wrangler config** - `wrangler.jsonc` (assets from `./build/client`, `nodejs_compat`, D1 binding `DB`, `cache.enabled`)
- **Workers Cache** - edge caching for public GETs; host/auth use `private, no-store` via `app/constants/cache-headers.ts`
- **Varlock deploy** - `bun run deploy:project` runs `varlock-wrangler deploy` for typed secrets
- **Cloudflare D1** - SQLite via `env.DB`; Drizzle `createDb(d1)` in middleware/`auth.server.ts`
- **Cloudflare context** - `cloudflareContext` + `dbContext` middleware share `env` / `AppDb` with routes

```bash
# Migrate remote D1, then build
bun run db:migrate:remote
bun run build

# Safe path: upload → test preview URL → promote
bun run deploy:upload      # preview only
bun run deploy:versions    # promote when ready

# Or all-in-one (goes live immediately)
bun run deploy:project
```

Set production secrets (`BETTER_AUTH_SECRET`, `SITE_URL`, etc.) via Varlock/Bitwarden or Wrangler secrets before deploying.

### Build Process

```bash
# Production build
bun run build

# Bundle analysis (client/server stats.html + DevTools capture)
bun run analyze
bun run devtools

# Type checking
bun run typecheck

# Linting and formatting
bun run check
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding style guide (see `biome.json`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Use Biome with Ultracite for formatting and linting
- Follow TypeScript best practices with Ultracite's strict rules
- Write meaningful commit messages
- Add tests for new features
- Use nuqs for URL state management
- Follow the established project structure
- Follow Ultracite's accessibility and code quality standards
- **Pre-commit hooks** automatically ensure code quality before commits

---

## License

This project is for educational/portfolio purposes and demonstrates modern full-stack web development best practices.

---

_Built with ❤️ using React Router 8, TypeScript, nuqs, and modern web technologies._
