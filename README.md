# Van Life

<div align="center">

[![Made with Prisma](http://made-with.prisma.io/dark.svg)](https://prisma.io)
[![React Router](https://img.shields.io/badge/React%20Router-7.9.6-61DAFB?logo=react&logoColor=white)](https://reactrouter.com/)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.3.34-000000?logo=better-auth&logoColor=white)](https://better-auth.com/)
[![nuqs](https://img.shields.io/badge/nuqs-2.7.3-000000?logo=nuqs&logoColor=white)](https://nuqs.47ng.com/)
[![Biome](https://img.shields.io/badge/Biome-2.3.5-000000?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Ultracite](https://img.shields.io/badge/Ultracite-6.3.3-000000?logo=ultracite&logoColor=white)](https://ultracite.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?logo=prisma&logoColor=white)](https://prisma.io/)
[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-canary-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![ArkType](https://img.shields.io/badge/ArkType-2.1.26-000000?logo=arktype&logoColor=white)](https://arktype.io/)

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
- 🔒 **Authentication** with better-auth (sign up, login, session management)
- ⚛️ **React 19 (canary) & Compiler** (Activity component, native meta elements, automatic optimizations, lazy loading)
- 🚌 **Van Management** (CRUD operations, van types, image handling, state management, SEO-friendly slug URLs)
- 🖼️ **Image Optimization** (WebP format, responsive images, quality compression, modern formats)
- 💸 **Rental System** (rent, return, and manage van rentals)
- ⭐ **Review System** (rate and review rentals with analytics)
- 📈 **Host Dashboard** (income tracking, bar charts, rental analytics)
- 💰 **Financial Management** (deposit/withdraw funds, transaction tracking)
- 🏷️ **Van State System** (NEW, IN_REPAIR, ON_SALE, AVAILABLE with discount pricing)
- 💲 **Dynamic Pricing** (discount system with strikethrough original prices)
- 🎨 **Modern UI/UX** with responsive design, custom Tailwind variants, and smooth animations
- 🧑‍💻 **TypeScript** throughout with strict type checking
- 🧪 **ArkType** for runtime schema validation and type-safe narrowing
- 🗄️ **Optimized Database IDs** with 25-character CUID v2 and VARCHAR(25) constraints
- 🎨 **TailwindCSS 4** with modern CSS features
- 📦 **Prisma ORM** with Neon PostgreSQL and relation joins
- 🔧 **Generic Components** for reusability and maintainability
- 🎭 **Higher-Order Components** (HOCs) for component enhancement and DRY principles
- 🧩 **Compound Components** with React 19's modern context API (no `.Provider`, uses `use()`)
- 📊 **Sortable Data Tables** with reusable sorting components
- 📱 **Responsive Design** with mobile-first approach
- ⚡ **Performance Optimized** with lazy loading, code splitting, and smart loader revalidation
- 🔗 **URL State Management** with nuqs 2.7.3 via Context7 for type-safe search parameters
- 🌐 **View Transitions** for smooth navigation experiences
- 🚫 **Smart Revalidation** with `shouldRevalidate` to prevent unnecessary data fetching
- 🎯 **Middleware-Driven Headers** (automatic header forwarding via React Router v7 middleware)
- 🔄 **Shared Context Middleware** for eliminating duplicate data fetching between loaders and actions

---

## Tech Stack

### Frontend

- **React canary** builds with stable Activity component for prerendering
- **React Router 7.9.6** (file-based routing, SSR, optional route parameters)
- **TypeScript 5.9.3** with strict configuration
- **TailwindCSS 4.1.17** with modern CSS features
- **Radix UI** for accessible components
- **Lucide React 0.553.0** for icons
- **Recharts 3.4.1** for data visualization (lazy-loaded)
- **nuqs 2.7.3** for type-safe URL state management via Context7 parsers

### Backend & Database

- **Node.js** with React Router server
- **Prisma 6.19.0** ORM with Neon PostgreSQL (Rust-free client)
- **better-auth 1.3.34** for authentication
- **ArkType 2.1.26** for schema validation and type narrowing
- **CUID2 3.1.0** for unique identifiers (configured for 25-character IDs)
- **@prisma/adapter-neon 6.19.0** for Neon database integration

### Development Tools

- **Vite 7.2.2** - Next-generation frontend tooling with optimized builds
- **React Compiler 1.0** (stable) - Automatic memoization and performance optimization
- **Biome 2.3.5** for linting and formatting with Ultracite integration
- **Ultracite 6.3.3** - AI-friendly linting rules for maximum type safety and accessibility
- **Husky 9.1.7** for Git hooks and pre-commit automation with lint-staged
- **TypeScript 5.9.3** with `@typescript/native-preview` nightly support
- **Bun** for fast package management and runtime

### Build System

- **Vite 7.2.2** - Fast builds with native ES modules and optimized bundling
- **React Compiler** - Configured via `vite-plugin-babel` for optimal integration
- **Automatic optimizations** - React Compiler handles memoization without manual `useMemo`/`useCallback`
- **Enhanced performance** - Faster builds and reduced memory usage
- **Type-safe configuration** - Full TypeScript support in Vite config

---

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components (buttons, inputs, cards, etc.)
│   └── [common]        # Generic components (forms, lists, sortable, etc.)
├── constants/          # App-wide constants and enums
├── db/                 # Database layer
│   ├── rental/         # Rental-related queries and transactions
│   ├── review/         # Review analytics and queries
│   ├── user/           # User analytics and payments
│   └── van/            # Van CRUD operations and queries
├── features/
│   ├── host/
│   │   ├── components/ # Host-specific components (charts, income, reviews)
│   │   └── utils/      # Route determination helpers
│   ├── image/          # Image optimization utilities
│   ├── middleware/     # Auth middleware and contexts
│   ├── navigation/     # Navigation components and hooks
│   ├── pagination/     # Pagination utilities and components
│   └── vans/
│       ├── components/ # Van UI (VanCard, VanDetail, HostVanDetail*, etc.)
│       ├── constants/  # Van-related constants
│       └── utils/      # Van helpers (pricing, styling, display)
├── hooks/              # Custom React hooks
├── lib/                # Server-side utilities
│   ├── auth.server.ts      # Better-auth configuration
│   ├── parsers.ts          # nuqs search parameter parsers
│   ├── schemas.server.ts   # ArkType validation schemas
│   └── search-params.server.ts  # Server-side search param loaders
├── routes/             # Route modules (Activity-based single routes)
│   ├── api/            # API routes
│   ├── auth/           # Authentication routes (login, signup, signout)
│   ├── host/           # Host dashboard routes (consolidated with Activity)
│   │   └── rentals/    # Rental management routes
│   ├── layout/         # Layout components
│   └── public/         # Public routes
│       ├── vans.tsx    # Van listing/detail (Activity-based single route)
│       ├── home.tsx    # Home page
│       ├── about.tsx   # About page
│       └── 404.tsx     # Not found page
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── assets/             # Static assets (SVGs, images)
├── root.tsx            # Root component
└── routes.ts           # Route configuration

prisma/
├── models/             # Modular Prisma model definitions
│   ├── betterAuth/     # Authentication models (User, Session, Account, Verification)
│   └── van/            # Van-related models (Van, Rent, Review, UserInfo, Transaction)
├── seed-data/          # Modular seed data files
├── schema.prisma       # Prisma schema entrypoint
└── seed.ts             # Database seeding script
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
  - `UserInfo` - Extended user profile information
  - `Transaction` - **Single source of truth** for all financial data (deposits, withdrawals, rental payments) with optional rental references and descriptions for complete audit trail
- **Advanced features:**
  - **Rust-free Prisma Client** with `queryCompiler` and `driverAdapters` (now GA)
  - **Relation joins** for optimized queries (preview feature)
  - **Optimized CUID2** with 25-character IDs and VARCHAR(25) constraints for better performance
  - Proper indexing and constraints with explicit column lengths
  - Modular seed data organization with separate files for each model
  - Enhanced seed data with varied van names, descriptions, and state management
  - Van state system with NEW (client-derived), IN_REPAIR, ON_SALE, AVAILABLE states
  - Discount pricing for ON_SALE vans with random discount percentages
  - **Slug-based routing** with unique, SEO-friendly URLs (e.g., `/vans/modest-explorer`)
  - **ArkType regex validation** for slugs with built-in length constraints
  - Native JavaScript database drivers for better edge/serverless compatibility

### Setup Database

```bash
# Generate Prisma client (Rust-free with relationJoins)
bunx prisma generate

# Push schema to database
bunx prisma db push

# Seed with enhanced data
bunx prisma db seed
```

### Prisma Configuration

This project uses `prisma.config.ts` for Prisma CLI configuration (GA in Prisma 6.x):

```
import 'dotenv/config';
import type { PrismaConfig } from 'prisma/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	schema: 'prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'tsx prisma/seed.ts',
	},
	datasource: {
		url: env('DATABASE_URL'),
	},
} satisfies PrismaConfig);
```

Notes:

- The deprecated `package.json#prisma` block has been removed.
- Environment variables load via `dotenv/config` in `prisma.config.ts`.

### Prisma Client Migration

This project uses the **Rust-free Prisma Client** with the following configuration:

```prisma
generator client {
  provider        = "prisma-client"
  output          = "../app/generated/prisma"
  previewFeatures = ["relationJoins"]
  engineType      = "client"
}
```

**Key Benefits:**

- **No Rust binary dependencies** - eliminates native binary requirements
- **Smaller bundle sizes** - ideal for serverless and edge deployments
- **Native JavaScript drivers** - uses `@prisma/adapter-neon` for connection pooling
- **Better edge compatibility** - works seamlessly in Vercel Edge Runtime
- **Simplified deployments** - no need to handle platform-specific binaries

---

## Authentication

- **better-auth** for secure email/password authentication
- **Session management** with proper security headers
- **Protected routes** with automatic redirects
- **ArkType validation** for all auth forms with custom narrow() validators
- **Server-side session handling** in loaders
- **Modular model organization** for better maintainability
- **Centralized auth types/config** in `app/lib/auth.server.ts`
- **Custom CUID v2 generator** for 25-character user IDs optimized for database storage

---

## URL State Management with nuqs

The application uses **nuqs 2.7.3** for type-safe URL state management:

### Features

- **Type-safe search parameters** with shared parsers between server and client
- **Server-side loaders** with `createLoader` for efficient data fetching
- **Client-side state management** with `useQueryStates`
- **Bidirectional cursor pagination** with forward/backward navigation
- **Automatic URL synchronization** with proper type handling
- **View transitions support** for smooth navigation

### Implementation

```typescript
// Shared parsers (app/lib/parsers.ts)
export const paginationParsers = {
  cursor: parseAsString.withDefault(DEFAULT_CURSOR),
  limit: parseAsNumberLiteral(LIMITS).withDefault(DEFAULT_LIMIT),
  direction: parseAsStringEnum(DIRECTIONS).withDefault(DEFAULT_DIRECTION),
  type: parseAsVanType,
};

// Server-side loaders (app/lib/searchParams.server.ts)
export const loadSearchParams = createLoader(paginationParsers);

// Client-side usage
const [{ cursor, limit, direction, type }, setSearchParams] =
  useQueryStates(paginationParsers);
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

## Smart Loader Revalidation

React Router 7's `shouldRevalidate` prevents unnecessary data fetching during navigation:

### Optimization Strategy

**Problem**: In SSR mode, loaders revalidate on every navigation by default, even when data hasn't changed.

**Solution**: Export `shouldRevalidate` to skip revalidation for specific scenarios.

### Implementation

```typescript
export function shouldRevalidate({
  currentParams,
  nextParams,
  currentUrl,
  nextUrl,
  formMethod,
}: ShouldRevalidateFunctionArgs) {
  // Always revalidate on form submissions
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // If vanSlug changed, revalidate to fetch new van data
  if (currentParams.vanSlug !== nextParams.vanSlug) {
    return true;
  }

  // If pagination params changed, revalidate
  if (currentUrl.searchParams.toString() !== nextUrl.searchParams.toString()) {
    return true;
  }

  // Same van, same pagination, just changing action (pricing → photos → details)
  // Skip revalidation - we already have the van data
  if (
    currentParams.vanSlug === nextParams.vanSlug &&
    currentParams.action !== nextParams.action
  ) {
    return false;
  }

  return false;
}
```

### Benefits

- **Reduced database queries** - Skip fetching when navigating between sub-routes
- **Faster navigation** - No loading states when data is already available
- **Better UX** - Instant transitions between pricing/photos/details
- **Bandwidth savings** - Less data transferred over the network

### Example Scenarios

- ✅ **Skip**: `/vans/silver-bullet` → `/vans/silver-bullet` (same page)
- ✅ **Skip**: `/host/vans/beach-bum/pricing` → `/host/vans/beach-bum/photos` (same van, different action)
- ❌ **Revalidate**: `/vans/silver-bullet` → `/vans/beach-bum` (different van)
- ❌ **Revalidate**: `/vans?type=luxury` → `/vans?type=simple` (filter change)
- ❌ **Revalidate**: Form submission (POST/PUT/DELETE)

---

## SEO-Friendly Slug-Based Routing

The application uses **human-readable slugs** for van URLs instead of database IDs:

### Features

- **SEO-friendly URLs** - `/vans/modest-explorer` instead of `/vans/cmgg0wp450001zrijvbpx2uo0`
- **User-friendly** - Shareable, memorable URLs for better user experience
- **Type-safe validation** - ArkType schema with regex validation
- **Automatic generation** - Slugs auto-generated from van names using `getSlug()` utility
- **Unique constraint** - Database-enforced uniqueness with indexed lookups
- **Internal ID usage** - Database operations still use CUIDs for security and referential integrity

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
- Host van detail: `/host/vans/beach-bum`
- Rent van: `/host/rentals/rent/the-cruiser`

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

- **Generic sorting utility** (`app/lib/genericSorting.server.ts`) for any Prisma model
- **Reusable Sortable component** (`app/components/common/Sortable.tsx`) for consistent UI
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

- **Reviews page**: Sort by newest/oldest date or highest/lowest rating
- **Income page**: Sort by newest/oldest date or highest/lowest amount
- **Extensible**: Easy to add sorting to any new data table

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

**Used in:** `VanCard`, `VanDetail`, `HostVanDetailCard`

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

### Native Meta Elements

Meta tags are defined directly within components using React 19's built-in elements:

```tsx
export default function Home() {
  return (
    <section>
      <title>Home | Van Life</title>
      <meta name="description" content="Welcome to Van Life..." />
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

- Node.js 18+
- Neon PostgreSQL database
- Bun (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd van-life

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Neon database credentials

# Set up database
bunx prisma generate
bunx prisma db push
bunx prisma db seed

# Start development server
bun run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
# Build
bun run build

# Serve the production build
bunx @react-router/serve
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxx-xxx-xxx.region.aws.neon.tech/neondb

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:5173

# Optional: Google OAuth (commented out in env.server.ts)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Environment variables are validated at runtime in `app/lib/env.server.ts` via ArkType schemas to keep configuration type-safe.

---

## Scripts

- `bun run dev` – Start development server with HMR
- `bun run build` – Build for production
- `bun run preview` – Preview the production build with the bundled server output
- `bun run typecheck` – TypeScript checking and route type generation
- `bun run lint` – Run Biome linting
- `bun run lint:fix` – Fix linting issues automatically
- `bun run format` – Check code formatting
- `bun run format:fix` – Fix formatting issues automatically
- `bun run check` – Run all checks (lint + format)
- `bun run check:fix` – Fix all issues automatically
- `bun run ci` – Run CI checks
- `bun run ultracite` – Run Ultracite checks through Biome integration
- `bun run ultracite:fix` – Auto-fix issues with Ultracite rules

### Ultracite Commands

- `bunx ultracite init` – Initialize Ultracite in your project
- `bun run ultracite:fix` – Format and fix code automatically
- `bun run ultracite` – Check for issues without fixing

### Git Hooks (Husky + lint-staged)

This project uses **Husky** with **lint-staged** for automated pre-commit checks:

- **Pre-commit hook** runs automatically before each commit
- **lint-staged** runs Ultracite only on staged files for efficiency
- **Automatic formatting** with Ultracite on staged files
- **Commit blocking** if any checks fail
- **TypeScript configuration** for type-safe setup

The pre-commit hook ensures code quality by:

1. Running `bun x ultracite fix` on staged files via lint-staged
2. Blocking the commit if any step fails

Configuration in `lint-staged.config.ts`:

```typescript
import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '*.{js,jsx,ts,tsx,json,jsonc,css,scss,md,mdx}': ['bun x ultracite fix'],
};

export default config;
```

**Note:** TypeScript config files work seamlessly with Bun's first-class TypeScript support. For Node.js, requires version 22.6.0+ or the `--experimental-strip-types` flag.

---

## Styling

### TailwindCSS 4 & Modern CSS

- **TailwindCSS 4.1.17** with modern features (container queries, view transitions, scroll-driven animations, CSS containment)
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

- **Biome 2.3.5** for linting and formatting with Ultracite integration
- **Ultracite 6.3.3** - AI-friendly linting rules for maximum type safety and accessibility
- **TypeScript 5.9.3** with strict configuration
- **ArkType 2.1.26** for runtime validation with regex support for slug validation
- **Consistent code style:**
  - Tab indentation
  - Single quotes
  - Sorted CSS classes
  - Organized imports
- **Type safety** throughout the application
- **Error handling** with proper error boundaries
- **nuqs** for type-safe URL state management
- **Prisma** with proper type generation and optimized ID constraints

### GitHub Actions (CodeQL)

This project uses GitHub Actions for automated code scanning via CodeQL.

- Location: `.github/workflows/codeql.yml`
- Triggered on: push and pull requests to `master`, plus a weekly schedule
- Language matrix: JavaScript/TypeScript
- Purpose: statically analyze the codebase for security vulnerabilities and quality issues
- Implementation: `github/codeql-action` (`init` and `analyze`) with `build-mode: none` (no manual build required)
- Permissions: writes security events; reads packages, actions, and contents as needed

### Ultracite Integration

This project uses **Ultracite** for enhanced code quality and AI-friendly development:

- **Zero configuration required** - Works out of the box with sensible defaults
- **Subsecond performance** - Lightning-fast linting and formatting
- **Maximum type safety** - Strict TypeScript rules and accessibility standards
- **AI-friendly code generation** - Optimized for modern AI development workflows
- **Accessibility enforcement** - Built-in a11y rules and best practices
- **React/Next.js specific rules** - Tailored for modern React development

### Biome Configuration

- **Ultracite integration** via `extends: ["ultracite/core", "ultracite/remix", "ultracite/react"]` in `biome.jsonc`
- **CSS at-rules support** for TailwindCSS 4 features
- **Sorted CSS classes** for consistency
- **TypeScript strict mode** enabled
- **Import organization** and sorting
- **Custom rules** for class sorting and organization

---

## Deployment

### Vercel Deployment

The application is configured for Vercel deployment with:

- **Prisma client generation** via `postinstall` script
- **Neon database integration** with `@prisma/adapter-neon`
- **Edge runtime compatibility** with proper WASM handling
- **Environment variable configuration** for production
- **Rust-free Prisma Client** for optimized serverless deployments

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
