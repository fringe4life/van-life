# Van Life

<div align="center">

[![Made with Prisma](http://made-with.prisma.io/dark.svg)](https://prisma.io)
[![React Router](https://img.shields.io/badge/React%20Router-7.16.0-61DAFB?logo=react&logoColor=white)](https://reactrouter.com/)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.6.13-000000?logo=better-auth&logoColor=white)](https://better-auth.com/)
[![nuqs](https://img.shields.io/badge/nuqs-2.8.9-000000?logo=nuqs&logoColor=white)](https://nuqs.47ng.com/)
[![Biome](https://img.shields.io/badge/Biome-2.4.15-000000?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Ultracite](https://img.shields.io/badge/Ultracite-7.8.1-000000?logo=ultracite&logoColor=white)](https://ultracite.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma&logoColor=white)](https://prisma.io/)
[![Vite](https://img.shields.io/badge/Vite-7.3.5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.3.0--canary-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![ArkType](https://img.shields.io/badge/ArkType-2.2.0-000000?logo=arktype&logoColor=white)](https://arktype.io/)

</div>

A modern full-stack van rental platform built with React Router 7, showcasing advanced web development techniques including server-side rendering, authentication, and responsive design.

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

- 🚀 **Modern React Router 7** with server-side rendering and file-based routing
- 🔒 **Authentication** with better-auth (sign up, login, session management, safe `redirectTo` return URLs)
- ⚛️ **React 19 (canary) & Compiler** (Activity component, native meta elements, automatic optimizations, lazy loading)
- 🚌 **Van Management** (CRUD operations, van types, image handling, state management, SEO-friendly slug URLs)
- 🔍 **Advanced Van Filtering** (popover panel, multi-select types, state toggles, optimistic UI, debounced nuqs updates)
- 📱 **Mobile Navigation** (Radix Dialog drawer, animated hamburger, slide-in overlay)
- 🖼️ **Image Optimization** (WebP format, responsive images, quality compression, modern formats)
- 💸 **Rental System** (rent, return, and manage van rentals)
- ⭐ **Review System** (rate and review rentals with analytics)
- 📈 **Host Dashboard** (income tracking, bar charts, rental analytics)
- 💰 **Financial Management** (deposit/withdraw funds, transaction tracking with pagination)
- 🏷️ **Van State System** (NEW, IN_REPAIR, ON_SALE, AVAILABLE with discount pricing)
- 💲 **Dynamic Pricing** (discount system with strikethrough original prices)
- 🎨 **Modern UI/UX** with responsive design, custom Tailwind variants, and smooth animations
- 🧑‍💻 **TypeScript** throughout with strict type checking
- 🧪 **ArkType** for runtime schema validation and type-safe narrowing
- 🗄️ **Time-sortable database IDs** with UUID v7 and PostgreSQL `uuid` columns
- 🎨 **TailwindCSS 4** with modern CSS features
- 📦 **Prisma ORM** with Neon PostgreSQL and relation joins
- 🔧 **Generic Components** for reusability and maintainability
- 🎭 **Higher-Order Components** (HOCs) for component enhancement and DRY principles
- 🧩 **Compound Components** with React 19's modern context API (no `.Provider`, uses `use()`)
- 📊 **Sortable Data Tables** with reusable sorting components
- 📱 **Responsive Design** with mobile-first approach
- ⚡ **Performance Optimized** with lazy loading, code splitting, direct icon imports, and immutable array methods
- 🔗 **URL State Management** with nuqs 2.8.9 via Context7 for type-safe search parameters
- 🌐 **View Transitions** for smooth navigation experiences
- 🎯 **Middleware-Driven Headers** (automatic header forwarding via React Router v7 middleware)
- 🔄 **Shared Context Middleware** for eliminating duplicate data fetching between loaders and actions
- 🔍 **SEO Infrastructure** (canonical URLs, Open Graph/Twitter meta, `robots.txt`, dynamic `sitemap.xml` via `@forge42/seo-tools`)
- ☁️ **Cloudflare Workers** deployment with Varlock-managed secrets and Neon PostgreSQL

---

## Tech Stack

### Frontend

- **React canary** builds with stable Activity component for prerendering
- **React Router 7.16.0** (file-based routing, SSR, optional route parameters, v8 middleware flags)
- **TypeScript 6.0.3** with strict configuration
- **TailwindCSS 4.3.0** with modern CSS features
- **Radix UI** (`radix-ui` + `@radix-ui/react-dialog`) for popover, checkbox, label, and mobile nav dialog
- **Lucide React 1.17.0** for icons (direct imports for performance)
- **Recharts 3.8.1** for data visualization (lazy-loaded)
- **nuqs 2.8.9** for type-safe URL state management via Context7 parsers

### Backend & Database

- **Cloudflare Workers** with React Router SSR via `workers/app.ts`
- **Prisma 7.8.0** ORM with Neon PostgreSQL (Rust-free client, `workerd` runtime)
- **better-auth 1.6.13** with **@better-auth/prisma-adapter** for authentication
- **ArkType 2.2.0** for schema validation and type narrowing
- **uuidv7** for app-generated user IDs; Prisma `@default(uuid(7))` for domain models
- **@prisma/adapter-neon 7.8.0** for Neon database integration
- **Varlock** for typed, validated environment variables (Bitwarden integration in production)

### Development Tools

- **Vite 7.3.5** - Fast frontend tooling with optimized builds
- **vite-plugin-google-fonts** - Self-hosted Inter via generated `.google-fonts/` (gitignored)
- **vite-tsconfig-paths 6.1.1** - TypeScript path alias resolution for `~/` imports
- **React Compiler 1.0** (stable) - Automatic memoization and performance optimization
- **Biome 2.4.15** for linting and formatting with Ultracite integration
- **Ultracite 7.8.1** - AI-friendly linting rules for maximum type safety and accessibility
- **Varlock** - Typed env schema (`.env.schema`) with Cloudflare integration
- **Wrangler 4.97.0** - Cloudflare Workers CLI for deploy and typegen
- **react-doctor 0.2.16** - React diagnostics in CI and locally (`doctor.config.ts`)
- **Husky 9.1.7** for Git hooks and pre-commit automation with lint-staged
- **TypeScript 6.0.3** with `@typescript/native-preview` support
- **Bun** for fast package management and runtime

### Build System

- **Vite 7.3.5** - Fast builds with native ES modules and optimized bundling
- **React Compiler** - Configured via `vite-plugin-babel` for optimal integration
- **Automatic optimizations** - React Compiler handles memoization without manual `useMemo`/`useCallback`
- **Enhanced performance** - Faster builds and reduced memory usage
- **Type-safe configuration** - Full TypeScript support in Vite config

---

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI (button, popover, checkbox, badge, etc.)
│   └── [common]        # Generic components (forms, lists, sortable, etc.)
├── constants/          # App-wide constants and enums
├── dal/                # Global data access helpers
│   ├── schemas.server.ts      # Shared UUID v7 ArkType schema (branded)
│   └── parse-uuidv7.server.ts # Parse/string → UUIDv7 at trust boundaries
├── features/
│   ├── auth/
│   │   └── schemas.server.ts  # Login/sign-up ArkType schemas
│   ├── host/
│   │   ├── components/ # Host UI (van-form, charts, income, reviews)
│   │   ├── dal/        # Host Prisma repositories (*.server.ts)
│   │   ├── services/   # dashboard, income, rental, reviews, transfers, wallet
│   │   ├── rentals/
│   │   │   └── schemas.server.ts  # Rental action schemas
│   │   ├── schemas.server.ts  # Host action schemas (deposit/withdraw)
│   │   └── utils/      # Route determination helpers
│   ├── image/          # Image optimization utilities
│   ├── middleware/     # Auth middleware, Cloudflare context, auth-redirect helpers
│   ├── navigation/     # Nav, mobile-nav (Dialog), hamburger-icon
│   ├── pagination/     # Pagination utilities and components
│   ├── seo/            # SEO helpers (canonical URLs, SeoHead, sitemap)
│   │   └── dal/        # SEO Prisma reads (sitemap.server.ts)
│   ├── pagination/     # Shared pagination UI + utils (toPagination, getCursorMetadata)
│   └── vans/
│       ├── components/ # Van UI (VanCard, VanDetail, HostVanDetail*, VanFilters, etc.)
│       ├── constants/  # Van-related constants (van-types.ts for client-safe constants)
│       ├── dal/        # Van Prisma repositories (*.server.ts)
│       ├── services/   # catalog, host-vans, van-detail
│       ├── hooks/      # Host vans list reducer, display hooks, optimistic filter hooks
│       ├── schemas.server.ts  # Van form/search ArkType schemas
│       ├── types/      # Van-specific TypeScript types
│       └── utils/      # Van helpers (pricing, van-filter-url, pending-van-from-form-data)
├── hooks/              # Custom React hooks
├── lib/                # Server-side utilities
│   ├── auth.server.ts      # Better-auth configuration
│   ├── env.server.ts       # Varlock env re-export
│   ├── id.server.ts        # UUID v7 ID generator for Better Auth
│   ├── parsers.ts          # nuqs search parameter parsers
│   ├── search-params.server.ts  # Server-side search param loaders
│   ├── generic-sorting.server.ts  # Generic Prisma orderBy utilities
│   └── prisma.server.ts    # Prisma client (Neon adapter, workerd runtime)
├── types/              # Server-only branded types
│   ├── auth.server.ts      # AuthenticatedUser (UUIDv7 id)
│   ├── ids.server.ts       # UUIDv7 re-export from dal schemas
│   └── lucide-react-direct.d.ts  # Direct lucide-react icon import types
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
├── utils/              # Shared utilities (parse-arktype.server, try-catch, etc.)
├── assets/             # Static assets (SVGs, images)
├── root.tsx            # Root component
└── routes.ts           # Route configuration

prisma/
├── models/             # Modular Prisma model definitions
│   ├── betterAuth/     # Authentication models (User, Session, Account, Verification)
│   └── van/            # Van-related models (Van, Rent, Review, Transaction)
├── seed-data/          # Modular seed data files
├── schema.prisma       # Prisma schema entrypoint
└── seed.ts             # Database seeding script

workers/
└── app.ts              # Cloudflare Workers entry (React Router SSR)
```

---

## Database

- **Neon PostgreSQL** with Prisma ORM (Rust-free client)
- **Modular schema** with organized model files in subdirectories
- **Config via prisma.config.ts** (schema folder + seed command)
- **Main models:**
  - `User`, `Session`, `Account`, `Verification` - Authentication system
  - `Van` - Van listings with types (SIMPLE, LUXURY, RUGGED), states (NEW, IN_REPAIR, ON_SALE, AVAILABLE), and **SEO-friendly slugs** for human-readable URLs
  - `Rent` - Rental records and history (links to transactions)
  - `Review` - User reviews and ratings
  - `Transaction` - **Single source of truth** for all financial data (deposits, withdrawals, rental payments) with optional rental references and descriptions for complete audit trail
- **Advanced features:**
  - **Rust-free Prisma Client** with `queryCompiler` and `driverAdapters` (now GA)
  - **Relation joins** for optimized queries (preview feature)
  - **Full-text search** with PostgreSQL (preview feature) - searches across multiple fields with relevance-based ordering
  - **UUID v7** primary keys and foreign keys mapped to PostgreSQL `uuid` for time-ordered, index-friendly IDs
  - **Performance optimizations** - Direct lucide-react icon imports (15-70% faster dev boot, 28% faster builds), immutable array methods (`.toSorted()`), client-safe constants for server/client code separation
  - **Comprehensive indexing** for optimal query performance:
    - Transaction model: Composite indexes for pagination (`[userId, createdAt]`, `[userId, amount]`, `[userId, type, createdAt]`, `[userId, type, amount]`)
    - Review model: Indexes for rating and date sorting
    - Proper indexing and constraints with explicit column lengths
  - Modular seed data organization with separate files for each model
  - Enhanced seed data with varied van names, descriptions, and state management
  - Van state system with NEW (client-derived), IN_REPAIR, ON_SALE, AVAILABLE states
  - Discount pricing for ON_SALE vans with random discount percentages
  - **Slug-based routing** with unique, SEO-friendly URLs (e.g., `/vans/modest-explorer`)
  - **ArkType regex validation** for slugs with built-in length constraints
  - Native JavaScript database drivers for better edge/serverless compatibility
  - **Branded UUID v7 types** via ArkType (`#UUIDv7`) and `parseUuidV7` at auth/route boundaries

### Setup Database

```bash
# Generate Prisma client (Rust-free with relationJoins)
bunx prisma generate

# Push schema to database
bunx prisma db push

# Seed with enhanced data
bun run db:seed
```

### Prisma Configuration

This project uses `prisma.config.ts` for Prisma CLI configuration (GA in Prisma 7.x):

```
import type { PrismaConfig } from 'prisma/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'bun run prisma/seed.ts',
	},
	datasource: {
		url: process.env.DATABASE_URL ?? 'postgresql://ci:ci@127.0.0.1:5432/ci',
	},
}) as PrismaConfig;
```

Notes:

- Prisma CLI reads `DATABASE_URL` from the environment (loaded by Varlock in dev/deploy).
- Separate `seedClient` generator uses `runtime = "bun"` for local seeding; app client uses `runtime = "workerd"` for Cloudflare Workers.

### Data access and services

- **`app/dal/`** — global UUID branding and parsing only
- **`features/*/dal/*.server.ts`** — Prisma repositories (persistence, no `tryCatch`)
- **`features/*/services/*.server.ts`** — use-case orchestration, pagination DTOs, `tryCatch` where UI tolerates partial failure
- **Routes** — HTTP only: auth, form validation, call services, map errors to `data()` / redirects

```typescript
// Route
const dashboard = await loadHostDashboard(user.id);

// Service (owns tryCatch policy)
const [transactions, avgRating] = await Promise.all([
  tryCatch(() => getHostTransactions(userId)),
  tryCatch(() => getAverageReviewRating(userId)),
]);
```

### Feature-Specific Validators

The application uses **feature-specific validators** organized by domain for better maintainability:

- **Van validators** (`app/features/vans/utils/validators.ts`) - VanType and VanState validation with type guards and conversion utilities
- **Pagination validators** (`app/features/pagination/utils/validators.ts`) - Limit, direction, sort, and cursor validation for pagination
- **Shared UUID schema** (`app/dal/schemas.server.ts`) — `uuidv7Schema` for route/param validation
- **Server-side ArkType schemas** in feature `schemas.server.ts` files (auth, vans, host, rentals) with shared parsing via `app/utils/parse-arktype.server.ts`

**Benefits:**
- **Better organization** - Validators co-located with their feature domain
- **Easier maintenance** - Changes to validation logic isolated to specific features
- **Type safety** - Type guards and validation functions with proper TypeScript narrowing
- **Reusability** - Validators can be imported where needed within each feature

### Prisma Client Migration

This project uses the **Rust-free Prisma Client** with the following configuration:

```prisma
generator client {
  provider        = "prisma-client"
  output          = "../app/generated/prisma"
  previewFeatures = ["relationJoins", "fullTextSearchPostgres"]
  engineType      = "client"
  compilerBuild   = "fast"
  runtime         = "workerd"
}
```

**Key Benefits:**

- **No Rust binary dependencies** - eliminates native binary requirements
- **Smaller bundle sizes** - ideal for serverless and edge deployments
- **Native JavaScript drivers** - uses `@prisma/adapter-neon` for connection pooling
- **Cloudflare Workers compatible** - `workerd` runtime for production SSR
- **Simplified deployments** - no need to handle platform-specific binaries

---

## Authentication

- **better-auth 1.6.13** with **@better-auth/prisma-adapter** for secure email/password authentication
- **Session management** with proper security headers
- **Protected routes** with automatic redirects via `getLoginRedirectUrl` / `getSafeRedirectPath` (`app/features/middleware/utils/auth-redirect.ts`)
- **`redirectTo` query param** on login — returns users to the page they tried to visit (open-redirect safe)
- **ArkType validation** (`app/features/auth/schemas.server.ts`) for login/sign-up forms
- **Server-side session handling** in loaders
- **Modular model organization** for better maintainability
- **Better-auth config** in `app/lib/auth.server.ts`; **`AuthenticatedUser`** type in `app/types/auth.server.ts`
- **UUID v7 generator** (`createId` in `app/lib/id.server.ts`) for user IDs via Better Auth database hook

---

## URL State Management with nuqs

The application uses **nuqs 2.8.9** for type-safe URL state management:

### Features

- **Type-safe search parameters** with shared parsers between server and client
- **Server-side loaders** with `createLoader` for efficient data fetching
- **Client-side state management** with `useQueryStates`
- **Bidirectional cursor pagination** with forward/backward navigation
- **Pagination with sorting** on Reviews, Income, and Transfers pages
- **Van search functionality** with PostgreSQL full-text search across name and description fields, debounced input (250ms), immediate Enter key submission, and relevance-based result ordering
- **Advanced van filtering** via `vansFilterUrlParsers` — multi-select types, exclude in repair, only on sale; debounced adds, immediate removes (`van-filter-url.ts`)
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

React Router 7's middleware system enables efficient data sharing between loaders and actions:

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

// Database lookup by slug
export async function rentVan(
  vanSlug: string,
  renterId: string,
  hostId: string
) {
  const van = await prisma.van.findUnique({
    where: { slug: vanSlug },
    select: { id: true },
  });
  // ... use van.id for database operations
}

// Routes use slugs
route(":vanSlug", "./routes/vans/van.tsx");
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
// Van state with optional discount
model Van {
  state       VanState? @default(AVAILABLE)
  discount    Int?      @default(0) @db.SmallInt
  // ... other fields
}

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

- **Generic sorting utility** (`app/lib/generic-sorting.server.ts`) for any Prisma model
- **Reusable Sortable component** (`app/components/sortable.tsx`) for consistent UI
- **Type-safe orderBy clauses** with full TypeScript support
- **URL state integration** with nuqs for persistent sorting preferences
- **Four sort options**: newest, oldest, highest, lowest

### Implementation

```typescript
// Generic sorting utility
export function createGenericOrderBy<T>(
  sort: SortOption,
  config: SortConfig<T>
): T {
  // Returns type-safe Prisma orderBy clause
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
- **`getCursorMetadata` utility** (`app/features/pagination/utils/get-cursor-metadata.server.ts`) - Provides Prisma cursor object, sort order, take, and skip values for Prisma queries
- **Bidirectional pagination support** - Handles both forward and backward pagination with correct logic
- **Automatic result reversal** - Reverses results for backward pagination to maintain correct display order
- **Type-safe** - Full TypeScript support with generic types
- **`reverseSortOption` helper** (`app/features/pagination/utils/reverse-sort-order.ts`) - Reverses sort options for backward pagination queries
- **`buildVanSearchParams` utility** (`app/features/pagination/utils/build-search-params.ts`) - Builds URL search parameters for pagination and filter state preservation (supports types array, excludeInRepair, onlyOnSale, search params)

### Implementation

```typescript
// Get cursor metadata for Prisma queries
// actualCursor is a Prisma cursor object: { id: string } | undefined
// orderBy is a Prisma orderBy object: { id: 'asc' | 'desc' }
const { actualCursor, orderBy, take, skip } = getCursorMetadata({
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
  // Processes database results, handles extra item detection,
  // reverses results for backward pagination, and returns
  // items with paginationMetadata object
}

// Usage in loaders
const { actualCursor, ...rest } = getCursorMetadata({
  cursor,
  limit,
  direction,
});

const rawItems = await prisma.review.findMany({
  cursor: actualCursor, // Already a Prisma cursor object { id: string } | undefined
  ...rest, // Spreads orderBy, take, and skip
  // ... other query options
});

const { items, paginationMetadata } = toPagination({
  items: rawItems,
  limit,
  cursor,
  direction,
});
```

### Pagination Logic

The `toPagination` utility implements correct cursor pagination logic based on Prisma's documentation:

- **Forward pagination**: `hasNextPage = hasMoreResults`, `hasPreviousPage = has cursor`
- **Backward pagination**: `hasNextPage = has cursor`, `hasPreviousPage = hasMoreResults`
- **Result reversal**: For backward pagination, results are automatically reversed since Prisma returns them in opposite order
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

Heavy components like charts are code-split using `React.lazy()` and `Suspense`:

```tsx
const BarChart = lazy(() => import("./BarChart"));

<Suspense fallback={<Skeleton />}>
  <BarChart data={chartData} />
</Suspense>;
```

### Benefits

- **Better Performance** - Instant navigation, smaller bundles, automatic optimizations
- **Improved SEO** - Proper meta tags, social sharing support
- **Simpler Code** - Native elements, automatic memoization, no manual optimization
- **Enhanced UX** - Smooth transitions, progressive enhancement

---

## Getting Started

### Prerequisites

- Node.js 22+ (or Bun)
- Neon PostgreSQL database
- Bun (recommended)
- Cloudflare account (for deployment)
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
# Required: DATABASE_URL, BETTER_AUTH_SECRET (see .env.schema)

# Set up database
bunx prisma generate
bunx prisma db push
bun run db:seed

# Start development server (Varlock loads env)
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

Environment variables are defined in `.env.schema` (Varlock) and validated at runtime. Only `.env.schema` is committed; use `.env.local` for local overrides or Bitwarden via Varlock in deploy.

```env
# Environment (development | preview | production | test)
VARLOCK_ENV=development

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxx-xxx-xxx.region.aws.neon.tech/neondb

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here-min-20-chars
BETTER_AUTH_URL=http://localhost:5173

# SEO (canonical URLs, Open Graph)
SITE_URL=http://localhost:5173

# Optional: Bitwarden (Varlock plugin for production secrets)
# BITWARDEN_ACCESS_TOKEN=your-bitwarden-token
```

Validated and typed via Varlock (`.env.schema` → `env.d.ts`); consumed in app code through `app/lib/env.server.ts`.

---

## Scripts

- `bun run dev` – Start development server with HMR (Varlock loads env)
- `bun run build` – Build for production (Cloudflare Workers + client assets)
- `bun run preview` – Preview the production build locally
- `bun run deploy:project` – Deploy to Cloudflare Workers via Varlock + Wrangler
- `bun run typegen` – Generate Wrangler types and React Router route types
- `bun run typecheck` – TypeScript checking (`typegen` + `tsgo`)
- `bun run db:migrate` – Run Prisma migrations (dev)
- `bun run db:seed` – Seed database
- `bun run db:reset` – Reset database and re-seed
- `bun run fix` – Auto-fix issues with Ultracite (format + lint)
- `bun run check` – Run Ultracite checks (no fix)
- `bun run doctor` – Run Ultracite doctor
- `bun run react-doctor` – Run React Doctor diagnostics (`doctor.config.ts`)
- `bun run ultracite:upgrade` – Upgrade Ultracite and re-init (Bun, Biome, Cursor)

### Ultracite Commands

- `bunx ultracite init` – Initialize Ultracite in your project
- `bun run fix` – Format and fix code via Ultracite
- `bun run check` – Check for issues without fixing

### Git Hooks (Husky + lint-staged)

This project uses **Husky** with **lint-staged** for automated pre-commit checks:

- **Pre-commit hook** runs automatically before each commit
- **lint-staged** runs Ultracite only on staged files for efficiency
- **Automatic formatting** with Ultracite on staged files
- **Commit blocking** if any checks fail
- **TypeScript configuration** for type-safe setup

The pre-commit hook ensures code quality by:

1. Running Ultracite fix on staged files via lint-staged
2. Blocking the commit if any step fails

Configuration in `lint-staged.config.ts` runs `bunx ultracite fix` on staged files.

**Note:** TypeScript config files work seamlessly with Bun's first-class TypeScript support. For Node.js, requires version 22.6.0+ or the `--experimental-strip-types` flag.

---

## Styling

### TailwindCSS 4 & Modern CSS

- **TailwindCSS 4.3.0** with modern features (container queries, view transitions, scroll-driven animations, CSS containment)
- **Inter font** via `vite-plugin-google-fonts` (output in `.google-fonts/`, gitignored)
- **Mobile nav animations** — overlay fade and slide-in/out (`app/app.css`)
- **Responsive design** with mobile-first approach and CSS Grid layouts
- **Biome configuration** for CSS at-rules support

### Custom Design System

- **Component variants** using `class-variance-authority` for consistent UI
- **Custom Tailwind variants** for van states (`van-new`, `van-sale`, `van-repair`, `van-available`)
- **Centralized styling utilities** - `getVanStateStyles()` function provides consistent styling across all van components
- **Type-safe styling** with TypeScript support throughout

### Custom Utilities

- **Utility-first approach** with custom CSS utilities for specific needs
- **CSS custom properties** for dynamic theming and reusable values
- **Pseudo-random heights** using CSS trigonometric functions for skeleton loaders

---

## Code Quality

- **Biome 2.4.15** for linting and formatting with Ultracite integration
- **Ultracite 7.8.1** - AI-friendly linting rules for maximum type safety and accessibility
- **TypeScript 6.0.3** with strict configuration
- **ArkType 2.2.0** for runtime validation with regex support for slug validation
- **Consistent code style:**
  - Tab indentation
  - Single quotes
  - Sorted CSS classes
  - Organized imports
- **Type safety** throughout the application
- **Error handling** with proper error boundaries
- **nuqs** for type-safe URL state management
- **Prisma** with proper type generation and optimized ID constraints
- **Feature-specific validators** - Validators organized by feature domain (vans, pagination) for better maintainability and code organization

### GitHub Actions

- **CodeQL** (`.github/workflows/codeql.yml`) - Security and quality scanning on push/PR to `master`
- **React Doctor** (`.github/workflows/react-doctor.yml`, `doctor.config.ts`) - React diagnostics on pull requests to `main`

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
- **Wrangler config** - `wrangler.jsonc` (assets from `./build/client`, `nodejs_compat`)
- **Varlock deploy** - `bun run deploy:project` runs `varlock-wrangler deploy` for typed secrets
- **Neon PostgreSQL** - `@prisma/adapter-neon` with `poolQueryViaFetch` for Workers compatibility
- **Prisma client** - `workerd` runtime; generated on `postinstall`
- **Cloudflare context** - `cloudflareContext` middleware shares `env` and `ctx` with routes

```bash
# Build and deploy
bun run build
bun run deploy:project
```

Set production secrets (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `SITE_URL`, etc.) via Varlock/Bitwarden or Wrangler secrets before deploying.

### Build Process

```bash
# Production build
bun run build

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

_Built with ❤️ using React Router 7, TypeScript, nuqs, and modern web technologies._
