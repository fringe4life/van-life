# Van Life

<div align="center">

[![React Router](https://img.shields.io/badge/React%20Router-8.2.0-61DAFB?logo=react&logoColor=white)](https://reactrouter.com/)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![fallow health](.github/badges/health.svg)](https://docs.fallow.tools)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.7.0--rc.1-000000?logo=better-auth&logoColor=white)](https://better-auth.com/)
[![nuqs](https://img.shields.io/badge/nuqs-2.9.0-000000?logo=nuqs&logoColor=white)](https://nuqs.47ng.com/)
[![Biome](https://img.shields.io/badge/Biome-2.5.3-000000?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Ultracite](https://img.shields.io/badge/Ultracite-7.9.4-000000?logo=ultracite&logoColor=white)](https://ultracite.dev/)
[![Drizzle](https://img.shields.io/badge/Drizzle-1.0.0--rc.4-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare%20D1-SQLite-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
[![Vite](https://img.shields.io/badge/Vite-8.1.5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.3.0--canary-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![ArkType](https://img.shields.io/badge/ArkType-2.2.3-000000?logo=arktype&logoColor=white)](https://arktype.io/)

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
- 🔒 **Authentication** with better-auth (sign up, login, session management, safe `redirectTo` return URLs, per-field form errors)
- 📤 **Shared form actions** (`FormActionResult`, `StatusButton`, fetcher status helpers) for pending/success/error submit UX across auth and host forms
- 🧱 **Typed service results** (`ServiceResult` + `DomainError` → `toActionResultOrThrow`) map host rentals/wallet failures to `badRequest` / `conflict` / `internalError` / `notFound`
- ⚛️ **React 19 (canary) & Compiler** (Activity component, native meta elements, automatic optimizations, lazy loading)
- 🚌 **Van Management** (CRUD operations, van types, image handling, state management, SEO-friendly slug URLs)
- 🔍 **Advanced Van Filtering** (modular filter panel, facet-based state filters, `useVanFilters` hook, multi-select types, optimistic UI, debounced nuqs updates)
- 📱 **Mobile Navigation** (Base UI Dialog drawer, animated hamburger, slide-in overlay)
- 🖼️ **Image Optimization** (WebP format, responsive images, quality compression, modern formats)
- 💸 **Rental System** (rent, return, and manage van rentals)
- ⭐ **Review System** (rate and review rentals with analytics)
- 📈 **Host Dashboard** (modular sections — income, reviews, vans, wallet — with bar charts and rental analytics)
- 💰 **Financial Management** (deposit/withdraw funds, transaction tracking with pagination)
- 🏷️ **Van State System** (NEW, IN_REPAIR, ON_SALE, AVAILABLE with discount pricing)
- 💲 **Dynamic Pricing** (discount system with strikethrough original prices)
- 🎨 **Modern UI/UX** with responsive design, custom Tailwind variants, and smooth animations
- 🧑‍💻 **TypeScript** throughout with strict type checking
- 🧪 **ArkType** for runtime schema validation and type-safe narrowing
- 🗄️ **Time-sortable database IDs** with UUID v7 (text columns on D1/SQLite)
- 🎨 **TailwindCSS 4** with modern CSS features
- 📦 **Drizzle ORM** with Cloudflare D1 (SQLite) and relational queries
- 🔧 **Generic Components** for reusability and maintainability
- 🎭 **Higher-Order Components** (HOCs) for component enhancement and DRY principles
- 🧩 **Compound Components** with React 19's modern context API (no `.Provider`, uses `use()`)
- 📊 **Sortable Data Tables** with reusable sorting components
- 📱 **Responsive Design** with mobile-first approach
- ⚡ **Performance Optimized** with deferred loader promises (`DeferredAwait` / `DeferredPaginated`), lazy charts, code splitting, and immutable array methods
- 🧊 **HTTP cache headers** — `PRIVATE_NO_STORE` for host/auth; `PUBLIC_SHORT_CACHE` + `Vary: Cookie` for catalog; leaf `headers` exports via `forwardDataHeaders`
- 🔗 **URL State Management** with nuqs 2.9.0 for type-safe search parameters
- 🌐 **View Transitions** for smooth navigation (auth login/sign-up, host chart pages, footer, and form field morphs)
- 🎯 **Middleware-Driven Headers** (automatic header forwarding via React Router 8 middleware)
- 🔄 **Shared Context Middleware** for eliminating duplicate data fetching between loaders and actions
- 🔐 **Consolidated host auth middleware** on `host-layout.tsx` (no duplicate session lookups on leaf routes)
- 🔍 **SEO Infrastructure** (canonical URLs, Open Graph/Twitter meta, `robots.txt`, dynamic `sitemap.xml` via `@forge42/seo-tools`)
- ☁️ **Cloudflare Workers** deployment with Varlock-managed secrets, D1 binding (`env.DB`), and Workers Cache enabled

---

## Tech Stack

### Frontend

- **React canary** builds with stable Activity component for prerendering
- **React Router 8.2.0** (file-based routing, SSR, optional route parameters, middleware)
- **TypeScript 7.0.2** with strict configuration
- **TailwindCSS 4.3.2** with modern CSS features
- **@base-ui/react 1.6.0** + **shadcn/ui** (`base-nova` style) for dialog, popover, checkbox, label, and mobile nav
- **Lucide React 1.24.0** for icons (direct imports for performance)
- **Recharts 3.9.2** for data visualization (lazy-loaded)
- **nuqs 2.9.0** for type-safe URL state management via shared parsers

### Backend & Database

- **Cloudflare Workers** with React Router SSR via `workers/app.ts`
- **Drizzle ORM 1.0.0-rc.4** with **Cloudflare D1** (SQLite; `drizzle-orm/d1`)
- **better-auth 1.7.0-rc.1** with **@better-auth/drizzle-adapter** for authentication
- **ArkType 2.2.3** for schema validation and type narrowing
- **uuidv7** for app-generated IDs (`createId` / `uuidv7PrimaryKey` helpers)
- **Varlock** for typed, validated environment variables (Bitwarden integration in production)

### Development Tools

- **Vite 8.1.5** - Rolldown-based tooling; native `resolve.tsconfigPaths` for `~/` imports
- **@vitejs/devtools 0.4.1** - Vite DevTools + DevTools for Rolldown (client/ssr environments)
- **rollup-plugin-visualizer 7.0.1** - Client/server bundle treemaps (`VITE_ANALYZE=true`)
- **@fontsource-variable/inter** - Self-hosted Inter (latin variable subset, ~48KB)
- **React Compiler 1.0** (stable) - Automatic memoization via `@rolldown/plugin-babel` + `reactCompilerPreset`
- **Biome 2.5.3** for linting and formatting with Ultracite integration
- **Ultracite 7.9.4** - AI-friendly linting rules for maximum type safety and accessibility
- **Varlock 1.11.0** - Typed env schema (`.env.schema`) with Cloudflare integration
- **Wrangler 4.112.0** - Cloudflare Workers CLI for deploy, D1 migrations, and typegen
- **drizzle-kit 1.0.0-rc.4** - Schema migrations (`d1-http` remote; `drizzle.local.config.ts` for local Studio)
- **react-doctor 0.7.8** - React diagnostics in CI, locally, lint-staged, and via Cursor post-edit hook (`.cursor/hooks/react-doctor.mjs`)
- **fallow 3.6.0** - Code health, dead code, duplication, complexity, architecture boundaries (`.fallowrc.jsonc`)
- **Husky 9.1.7** for Git hooks and pre-commit automation with lint-staged
- **TypeScript 7.0.2** (native `tsc`; VS Code `js/ts.experimental.useTsgo` optional)
- **Bun** for fast package management and runtime

### Build System

- **Vite 8.1.5** - Rolldown pipeline, `build.target: "esnext"`, `server.forwardConsole`
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
│   ├── ui/             # shadcn base-nova (@base-ui/react): button, dialog, popover, checkbox, badge, etc.
│   │                   # Variant tokens in button-variants.ts, badge-variants.ts
│   ├── form/           # Field, FormError, FormActionResult types, fetcher status → StatusButton helpers
│   ├── deferred-*.tsx  # DeferredAwait / DeferredItems / DeferredPaginated (Suspense + Await)
│   ├── status-button.tsx  # Pending/success/error submit button (idle auto-reset via useAutoIdleStatus)
│   ├── types.ts        # Shared prop types (AsProps, EmptyState, ErrorState, ViewTransitionTune)
│   └── [common]        # Generic components (lists, sortable, etc.)
├── constants/          # App-wide constants (cache-headers, time-constants, enums)
├── dal/                # Global data access helpers
│   ├── schemas.server.ts      # Shared UUID v7 ArkType schema (branded)
│   └── parse-uuidv7.server.ts # Parse/string → UUIDv7 at trust boundaries
├── features/
│   ├── auth/
│   │   ├── schemas.server.ts  # Login/sign-up ArkType schemas
│   │   └── types.ts           # Login/sign-up field keys + field-error types
│   ├── host/
│   │   ├── components/ # Host UI (van-form, charts, dashboard sections, reviews)
│   │   │   └── dashboard/  # host-income-section, host-review-section, host-vans-section, host-wallet-form
│   │   ├── dal/        # Host Drizzle repositories (*.server.ts)
│   │   ├── services/   # dashboard, income, rental, reviews, transfers, wallet
│   │   ├── hooks/      # use-host-wallet, balance-reducer
│   │   ├── rentals/
│   │   │   └── schemas.server.ts  # Rental action schemas
│   │   ├── schemas.server.ts  # Host action schemas (deposit/withdraw)
│   │   └── utils/      # Chart period/points, pickChartGranularity, resolveChartContext
│   ├── image/          # Image optimization utilities
│   ├── middleware/     # Auth, Cloudflare, db context, auth-redirect helpers
│   ├── navigation/     # Nav, mobile-nav (Base UI Dialog), hamburger-icon
│   ├── pagination/     # Shared pagination UI + utils (toPagination, getCursorMetadata, resolveSortedCursor, build-search-params)
│   ├── seo/            # SEO helpers (canonical URLs, SeoHead, sitemap)
│   │   └── dal/        # SEO Drizzle reads (sitemap.server.ts)
│   └── vans/
│       ├── components/ # Van UI (VanCard, VanDetail, HostVanDetail*, van-filters/, etc.)
│       │   └── van-filters/  # VanFilters, type/state sections, facet config, shared filter types
│       ├── constants/  # Van-related constants (van-types.ts for client-safe constants)
│       ├── dal/        # Van Drizzle repositories (*.server.ts)
│       ├── services/   # catalog, host-vans, van-detail
│       ├── hooks/      # use-van-filters, host-vans list reducer, display hooks, optimistic filter hooks
│       ├── schemas.server.ts  # Van form/search ArkType schemas
│       ├── types.ts    # Van-specific TypeScript types (incl. VanFormValues / field errors)
│       └── utils/      # pricing, van-filter-url, to-van-form-values, pending-van-from-form-data
├── db/                 # Drizzle schema, client, seed, migrations
│   ├── client.server.ts    # createDb(d1) → drizzle-orm/d1
│   ├── d1-http.server.ts   # Remote D1 HTTP client for seed/studio
│   ├── migrations/         # SQL migrations (flattened for Wrangler D1)
│   ├── schema/             # auth.ts, van.ts, index.ts
│   ├── seed-data/          # Modular seed data files
│   ├── seed.ts             # Local + remote seed entry
│   └── relations.ts        # Drizzle relations
├── hooks/              # Custom React hooks
├── lib/                # Server-side utilities
│   ├── auth.server.ts      # Better-auth + drizzle-adapter
│   ├── env.server.ts       # Varlock env re-export
│   ├── id.server.ts        # UUID v7 ID generator for Better Auth
│   ├── parsers.ts          # nuqs search parameter parsers
│   ├── search-params.server.ts  # Server-side search param loaders
│   └── generic-sorting.server.ts  # Generic Drizzle orderBy utilities
├── types/              # Shared utility types (Maybe, List, Id, Prettify, Replace, Search)
│   ├── auth.server.ts      # AuthenticatedUser (UUIDv7 id)
│   └── ids.server.ts       # UUIDv7 re-export from dal schemas
├── routes/             # Route modules (Activity-based single routes)
│   ├── api/            # better-auth handler (auth.ts)
│   ├── auth/           # login, sign-up, sign-out
│   ├── host/           # Dashboard, income, transfers, reviews, vans, rentals
│   │   └── rentals/    # rentals list, rent/:vanSlug, returnRental/:rentId
│   ├── layout/         # Layout components
│   └── public/         # Public routes
│       ├── vans.tsx    # Van listing
│       ├── van-detail.tsx  # Van detail page
│       ├── home.tsx    # Home page
│       ├── about.tsx   # About page
│       ├── robots.txt.ts   # Dynamic robots.txt
│       ├── sitemap.xml.ts  # Dynamic sitemap
│       └── 404.tsx     # Not found page
├── utils/              # Shared utilities (parse-arktype, try-catch, not-found, server-error, bad-request, conflict, internal-error, service-result, domain-error, to-action-result, get-elapsed-time.server, get-route-error-message, get-collection-state)
├── assets/             # Static assets (SVGs, images)
├── root.tsx            # Root component
└── routes.ts           # Route configuration

workers/
└── app.ts              # Cloudflare Workers entry (React Router SSR)

docs/
├── d1-setup.md             # Cloudflare D1 create/migrate/seed guide
├── react-router-audit.md   # Framework-mode audit and middleware notes
├── babel-react-compiler.md # React Compiler via @rolldown/plugin-babel (Vite 8)
├── react-stinky-report.md  # React Stinky smell sweep + fixes
└── fallow-health-backlog.md # Code health backlog from fallow analysis

.fallowrc.jsonc             # Fallow config (boundaries, health thresholds, security categories)
.github/badges/health.svg   # Fallow health score badge (A/88; refreshed on master push)
```

---

## Database

- **Cloudflare D1** (SQLite) with **Drizzle ORM** (`drizzle-orm/d1`)
- **Schema** in `app/db/schema/` (`auth.ts`, `van.ts`); remote via `drizzle.config.ts` (`d1-http`); local Studio via `drizzle.local.config.ts` (Miniflare SQLite)
- **Setup guide:** [`docs/d1-setup.md`](docs/d1-setup.md)
- **Main tables:**
  - `user`, `session`, `account`, `verification` — Authentication (better-auth)
  - `van` — Listings with types (SIMPLE, LUXURY, RUGGED), states (IN_REPAIR, ON_SALE, AVAILABLE), SEO slugs
  - `rent` — Rental records and history
  - `review` — User reviews and ratings
  - `transaction` — Financial ledger (deposits, withdrawals, rental payments)
- **Features:**
  - **UUID v7** primary keys via `uuidv7PrimaryKey` / `createId`
  - **Drizzle relations** (`app/db/relations.ts`) for typed relational queries
  - **Van search** — case-insensitive `LIKE` on name/description (word-split)
  - **Indexes** for host/type composites, rent pagination (`renterId`/`rentedTo`/`id`), review FKs; unique `van.slug`
  - **Van state** — NEW is client-derived; IN_REPAIR / ON_SALE / AVAILABLE stored
  - **Slug-based routing** with ArkType regex validation
  - **Branded UUID v7 types** via ArkType (`#UUIDv7`) and `parseUuidV7` at trust boundaries
  - **`dbContext` middleware** — shares `AppDb` from `env.DB` with loaders/actions

### Setup Database

```bash
# Create D1 DB once (see docs/d1-setup.md), then:

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

### Feature-Specific Validators

- **Van validators** (`app/features/vans/utils/validators.ts`) — VanType / VanState guards
- **Pagination validators** (`app/features/pagination/utils/validators.ts`) — limit, direction, sort, cursor
- **Shared UUID schema** (`app/dal/schemas.server.ts`) — `uuidv7Schema`
- **Server-side ArkType schemas** in feature `schemas.server.ts` files with `app/utils/parse-arktype.server.ts` (`validateArkType`, `arkErrorsToFieldErrors` for per-field form UI)

---

## Authentication

- **better-auth 1.7.0-rc.1** with **@better-auth/drizzle-adapter** (SQLite / D1)
- **Session management** with proper security headers
- **Protected routes** with automatic redirects via `getLoginRedirectUrl` / `getSafeRedirectPath` (`app/features/middleware/utils/auth-redirect.ts`)
- **Host auth middleware** runs once on `host-layout.tsx` (stub loader ensures `.data` requests on client navigations)
- **`redirectTo` query param** on login — returns users to the page they tried to visit (open-redirect safe)
- **ArkType validation** (`app/features/auth/schemas.server.ts`) for login/sign-up forms
- **Per-field errors** — `arkErrorsToFieldErrors` + `LOGIN_FORM_FIELDS` / `SIGN_UP_FORM_FIELDS` (`app/features/auth/types.ts`); UI via shared `Field` / `FormError`
- **Form action results** — `FormActionResult` + `toActionResultOrThrow` map `ServiceResult` kinds to `badRequest` / `conflict` / `internalError` / `notFound`; `getFetcherStatus` + `useAutoIdleStatus` drive `StatusButton`
- **Accessible auth forms** — `useFetcher` + `useTransition`, labeled inputs, `aria-invalid` / `aria-describedby`, form-level `role="alert"`
- **View transitions** on login/sign-up — named `viewTransitionName` on card, title, fields, submit, footer with CSS morph animations
- **Server-side session handling** in loaders
- **Better-auth config** in `app/lib/auth.server.ts`; **`AuthenticatedUser`** type in `app/types/auth.server.ts`
- **UUID v7 generator** (`createId` in `app/lib/id.server.ts`) for user IDs via Better Auth `generateId`

---

## URL State Management with nuqs

The application uses **nuqs 2.9.0** for type-safe URL state management:

### Features

- **Type-safe search parameters** with shared parsers between server and client
- **Server-side loaders** with `createLoader` for efficient data fetching
- **Client-side state management** with `useQueryStates`
- **Bidirectional cursor pagination** with forward/backward navigation
- **Pagination with sorting** on Reviews, Income, and Transfers pages
- **Van search functionality** with case-insensitive `LIKE` across name and description (word-split), debounced input (250ms), immediate Enter key submission
- **Advanced van filtering** via `vansFilterUrlParsers` — multi-select types plus facet-driven state filters (`van-state-filter-config.ts`); debounced adds, immediate removes (`van-filter-url.ts`)
- **Automatic URL synchronization** with proper type handling
- **View transitions support** for smooth navigation
- **Pagination state preservation** - All search params (cursor, limit, types, excludeInRepair, onlyOnSale, search) preserved when navigating to detail pages and back via `buildVanSearchParams` utility

### Implementation

```typescript
// Shared parsers (app/lib/parsers.ts)
export const paginationParsers = {
  cursor: parseAsString.withDefault(DEFAULT_CURSOR),
  limit: parseAsNumberLiteral(LIMITS).withDefault(DEFAULT_LIMIT),
  direction: parseAsStringEnum(DIRECTIONS).withDefault(DEFAULT_DIRECTION),
  type: parseAsVanType,
};

// Server-side loaders (app/lib/search-params.server.ts)
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
- **Type-safe validation** - ArkType schema with regex validation
- **Automatic generation** - Slugs auto-generated from van names using `getSlug()` utility
- **Unique constraint** - Database-enforced uniqueness with indexed lookups
- **Internal ID usage** - Database operations use UUID v7 for security and referential integrity

### Implementation

```typescript
// Slug schema with built-in regex validation (1-70 chars, no leading/trailing hyphens)
export const slugSchema = type("/^[a-z0-9](?:[a-z0-9-]{0,68}[a-z0-9])?$/");

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
- **Income page**: Sort by newest/oldest date or highest/lowest amount (with pagination)
- **Transfers page**: Sort by newest/oldest date or highest/lowest amount (with pagination)
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
- **`resolveSortedCursor` helper** (`app/features/pagination/utils/resolve-sorted-cursor.server.ts`) - Shared cursor + `orderBy` prelude for host income/reviews/transfers DALs
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

- **Consistent pagination** - Same logic used across all paginated pages (Reviews, Income, Transfers, Vans)
- **Correct bidirectional navigation** - Proper handling of forward/backward pagination
- **Type safety** - Generic utility works with any data type
- **Maintainability** - Single source of truth for pagination logic

---

## Higher-Order Components (HOC) Pattern

Reusable HOCs for component enhancement and DRY principles:

### Van Card Styling HOC

`withVanCardStyles` HOC encapsulates common van card styling logic:

```typescript
// Create styled component
const StyledCard = withVanCardStyles(Card);

// Use with van data
<StyledCard van={van} className="custom-classes">
  {children}
</StyledCard>
```

**Features:**
- Automatic van state styling (NEW, ON_SALE, IN_REPAIR, AVAILABLE)
- View transition names for smooth animations
- Data attributes for CSS-driven child visibility (e.g., VanBadge)
- Group class for Tailwind parent selectors
- Type-safe with full TypeScript support

**Benefits:**
- **DRY**: Common styling logic in one place
- **Consistency**: All van cards styled identically
- **Maintainability**: Single source of truth for van card behavior
- **Type-safe**: Proper TypeScript generics and constraints

**Used in:** `VanCard`, `VanDetail`, `HostVanDetail` compound component

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

Heavy components like charts are code-split using `React.lazy()` and `Suspense`. Recharts lives in `bar-chart.client.tsx` (`.client` suffix) so `es-toolkit` stays out of the SSR graph:

```tsx
const BarChartComponent = lazy(() => import("./bar-chart.client"));

<Suspense fallback={<Skeleton />}>
  <BarChartComponent data={chartData} />
</Suspense>;
```

### Deferred loader streaming

Host income / reviews / transfers return critical summary data immediately and defer paginated lists via promises. UI wraps with `DeferredAwait` / `DeferredPaginated` + route skeletons (`IncomeListSkeleton`, `ReviewListSkeleton`, `PaginatedItemsSkeleton`).

```tsx
<DeferredPaginated
  Component={Income}
  fallback={<IncomeListSkeleton />}
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
- Cloudflare account + D1 database (see [`docs/d1-setup.md`](docs/d1-setup.md))
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
- `bun run react-doctor` – Run React Doctor diagnostics (`doctor.config.ts`)
- `bun run fallow` – Full fallow analysis (dead code + dupes + health)
- `bun run fallow:audit` – PR-style audit (dead code, complexity, duplication on changed files)
- `bun run fallow:badge` – Regenerate `.github/badges/health.svg`
- `bun run test` – Run Bun test suite
- `bun run prepare` – Install Husky hooks
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

### TailwindCSS 4 & Modern CSS

- **TailwindCSS 4.3.3** with modern features (container queries, view transitions, scroll-driven animations, CSS containment)
- **Inter font** via `@fontsource-variable/inter` (latin variable woff2 only)
- **Mobile nav animations** — overlay fade and slide-in/out (`app/app.css`)
- **Reusable keyframes** — parameterized `--fade` / `--scale` / `--slide-x` / `--slide-y` with CSS custom properties
- **Auth + host view transitions** — login/sign-up and chart-page morphs (`::view-transition-old/new` in `app/app.css`)
- **Scroll-driven host nav hint** — `mask-scroll-hint` utility with `animation-timeline: scroll(x self)`
- **Responsive design** with mobile-first approach and CSS Grid layouts
- **Biome configuration** for CSS at-rules support

### Custom Design System

- **Component variants** using `cva` (`button-variants.ts`, `badge-variants.ts`) for consistent UI
- **Custom Tailwind variants** for van states (`van-new`, `van-sale`, `van-repair`, `van-available`)
- **Centralized styling utilities** - `getVanStateStyles()` function provides consistent styling across all van components
- **Type-safe styling** with TypeScript support throughout

### Custom Utilities

- **Utility-first approach** with custom CSS utilities for specific needs
- **CSS custom properties** for dynamic theming and reusable values
- **`bg-skeleton`** shimmer utility for deferred-list / chart skeletons
- **Pseudo-random heights** using CSS trigonometric functions for skeleton loaders

---

## Code Quality

- **Biome 2.5.3** for linting and formatting with Ultracite integration
- **Ultracite 7.9.4** - AI-friendly linting rules for maximum type safety and accessibility
- **TypeScript 7.0.2** with strict configuration
- **ArkType 2.2.3** for runtime validation with regex support for slug validation
- **Consistent code style:**
  - Tab indentation
  - Single quotes
  - Sorted CSS classes
  - Organized imports
- **Type safety** throughout the application
- **Error handling** with `DomainError` / `ServiceResult` / `toActionResultOrThrow`, plus `notFound` / `serverError` / `badRequest` / `conflict` / `internalError`, `getRouteErrorMessage` for boundaries, and `getCollectionState` for list empty/error states
- **nuqs** for type-safe URL state management
- **Drizzle** with typed schema in `app/db/schema/`
- **Feature-specific validators** - Validators organized by feature domain (vans, pagination) for better maintainability and code organization
- **fallow 3.6.0** - Architecture boundaries (feature↔route pairing in `.fallowrc.jsonc`), dead-code/dupes/health analysis; rules at `warn` until backlog cleared

### GitHub Actions

- **CI** (`.github/workflows/ci.yml`) — least-privilege permissions:
  - **Quality** (`contents: read`) — `VARLOCK_ENV=test` loads `.env.test` (no Bitwarden); Bun install, Ultracite `check`, `typecheck`, `test`
  - **Varlock** (`contents: read`, `push` to `master` only) — `VARLOCK_ENV=development` loads `.env.bitwarden` + `BITWARDEN_ACCESS_TOKEN`
  - **React Doctor** (PR only; `pull-requests` / `issues` / `statuses: write`) — self-contained Action, no Bun install
  - **Fallow** (PR only; `pull-requests: write`, `checks: write`) — SHA-pinned `fallow-rs/fallow@v3.6.0`; audit + health score + PR summary/review comments + Check Run; security scan (soft gate, `fail-on-issues: false`)
  - **Fallow badge** (`contents: write`, `pull-requests: write`, `push` to `master` only) — regenerates `.github/badges/health.svg`, uploads CI artifact, opens/updates PR `chore/fallow-health-badge` (no direct push to `master`)
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
- **CSS at-rules support** for TailwindCSS 4 features
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
