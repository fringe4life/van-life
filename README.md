# Van Life

[![Made with Prisma](http://made-with.prisma.io/dark.svg)](https://prisma.io)
[![React Router](https://img.shields.io/badge/React%20Router-7.8.2-61DAFB?logo=react&logoColor=white)](https://reactrouter.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.0-2D3748?logo=prisma&logoColor=white)](https://prisma.io/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.3.9-000000?logo=better-auth&logoColor=white)](https://better-auth.com/)
[![nuqs](https://img.shields.io/badge/nuqs-2.6.0-000000?logo=nuqs&logoColor=white)](https://nuqs.47ng.com/)
[![Biome](https://img.shields.io/badge/Biome-2.2.2-000000?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.1.0-000000?logo=bun&logoColor=white)](https://bun.sh/)

A modern full-stack van rental platform built with React Router 7, showcasing advanced web development techniques including server-side rendering, authentication, and responsive design.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database](#database)
- [Authentication](#authentication)
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
- 🚌 **Van Management** (CRUD operations, van types, image handling, state management)
- 💸 **Rental System** (rent, return, and manage van rentals)
- ⭐ **Review System** (rate and review rentals with analytics)
- 📈 **Host Dashboard** (income tracking, bar charts, rental analytics)
- 💰 **Financial Management** (deposit/withdraw funds, transaction tracking)
- 🏷️ **Van State System** (NEW, IN_REPAIR, ON_SALE, AVAILABLE with discount pricing)
- 💲 **Dynamic Pricing** (discount system with strikethrough original prices)
- 🎨 **Modern UI/UX** with responsive design and smooth animations
- 🧑‍💻 **TypeScript** throughout with strict type checking
- 🧪 **Zod** for runtime schema validation
- 🎨 **TailwindCSS 4** with modern CSS features
- 📦 **Prisma ORM** with Neon PostgreSQL and relation joins
- 🔧 **Generic Components** for reusability and maintainability
- 📊 **Sortable Data Tables** with reusable sorting components
- 📱 **Responsive Design** with mobile-first approach
- ⚡ **Performance Optimized** with React 19
- 🔗 **URL State Management** with nuqs for type-safe search parameters
- 🌐 **View Transitions** for smooth navigation experiences

---

## Tech Stack

### Frontend

- **React 19.1.1** for performance optimization
- **React Router 7.8.2** (file-based routing, SSR)
- **TypeScript 5.9.2** with strict configuration
- **TailwindCSS 4.1.13** with modern CSS features
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Recharts** for data visualization
- **nuqs 2.6.0** for type-safe URL state management

### Backend & Database

- **Node.js** with React Router server
- **Prisma 6.16.0** ORM with Neon PostgreSQL (Rust-free client)
- **better-auth 1.3.9** for authentication
- **Zod 4.1.5** for schema validation
- **CUID2** for unique identifiers
- **@prisma/adapter-neon** for Neon database integration

### Development Tools

- **rolldown-vite** (latest) - Next-generation Vite with Rolldown bundler
- **Biome 2.2.2** for linting and formatting with Ultracite integration
- **Ultracite 5.3.3** - AI-friendly linting rules for maximum type safety and accessibility
- **Husky 9.1.7** for Git hooks and pre-commit automation
- **TypeScript 5.9.2** with native preview
- **Bun** for fast package management and runtime

### Build System

- **rolldown-vite** replaces traditional Vite with Rust-based Rolldown bundler
- **Enhanced performance** with faster builds and reduced memory usage
- **Oxc integration** for improved code transformation
- **Native plugin support** with `experimental.enableNativePlugin: true`
- **Optimized dependency handling** with `rollupOptions` instead of deprecated `esbuildOptions`

---

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (forms, lists, etc.)
│   ├── host/           # Host-specific components (charts, reviews)
│   ├── navigation/     # Navigation components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   └── van/            # Van-related components
├── constants/          # App-wide constants and enums
├── db/                 # Database layer
│   ├── rental/         # Rental-related queries and transactions
│   ├── review/         # Review analytics and queries
│   ├── user/           # User analytics and payments
│   └── van/            # Van CRUD operations and queries
├── hooks/              # Custom React hooks
├── lib/                # Server-side utilities
│   ├── parsers.ts      # nuqs search parameter parsers
│   ├── searchParams.server.ts  # Server-side search param loaders
│   ├── getCursorPaginationInformation.server.ts  # Cursor pagination utilities
│   └── hasPagination.server.ts  # Generic pagination logic
├── routes/             # Route modules (pages, API, layouts)
│   ├── api/            # API routes
│   ├── auth/           # Authentication routes
│   ├── host/           # Host dashboard routes
│   ├── layout/         # Layout components
│   └── vans/           # Van listing and detail routes
├── utils/              # Utility functions
├── assets/             # Static assets (SVGs, images)
├── root.tsx            # Root component
└── routes.ts           # Route configuration

prisma/
├── models/             # Modular Prisma model definitions
│   ├── betterAuth/     # Authentication models (User, Session, Account, Verification)
│   ├── van/            # Van-related models (Van, Rent, Review, UserInfo, Transaction)
│   ├── enums.prisma    # Shared enums
│   └── schema.prisma   # Main schema file
├── seed-data/          # Modular seed data files
│   ├── vans.ts         # Van seed data
│   ├── rents.ts        # Rental seed data
│   ├── reviews.ts      # Review seed data
│   ├── transactions.ts # Transaction seed data
│   └── index.ts        # Seed data exports
├── schema.prisma       # Prisma schema entrypoint
├── seed.ts            # Database seeding script
└── seedFns.ts         # Seed helper functions
```

---

## Database

- **Neon PostgreSQL** with Prisma ORM (Rust-free client)
- **Modular schema** with organized model files in subdirectories
- **Config via prisma.config.ts** (schema folder + seed command)
- **Main models:**
  - `User`, `Session`, `Account`, `Verification` - Authentication system
  - `Van` - Van listings with types (SIMPLE, LUXURY, RUGGED) and states (NEW, IN_REPAIR, ON_SALE, AVAILABLE)
  - `Rent` - Rental transactions and history
  - `Review` - User reviews and ratings
  - `UserInfo` - Extended user profile information
  - `Transaction` - Financial transactions (deposits/withdrawals)
- **Advanced features:**
  - **Rust-free Prisma Client** with `queryCompiler` and `driverAdapters` (now GA)
  - **Relation joins** for optimized queries (preview feature)
  - CUID2 for unique identifiers
  - Proper indexing and constraints
  - Modular seed data organization with separate files for each model
  - Enhanced seed data with varied van names, descriptions, and state management
  - Van state system with NEW (client-derived), IN_REPAIR, ON_SALE, AVAILABLE states
  - Discount pricing for ON_SALE vans with random discount percentages
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
import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'prisma',
	migrations: {
		seed: 'tsx prisma/seed.ts',
	},
});
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
- **Zod validation** for all auth forms
- **Server-side session handling** in loaders
- **Modular model organization** for better maintainability
- **Centralized auth types/config** in `app/lib/auth.server.ts`

---

## URL State Management with nuqs

The application uses **nuqs v2.6.0** for type-safe URL state management:

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

---

## Scripts

- `bun run dev` – Start development server with HMR
- `bun run build` – Build for production
- `bun run typecheck` – TypeScript checking and route type generation
- `bun run lint` – Run Biome linting
- `bun run lint:fix` – Fix linting issues automatically
- `bun run format` – Check code formatting
- `bun run format:fix` – Fix formatting issues automatically
- `bun run check` – Run all checks (lint + format)
- `bun run check:fix` – Fix all issues automatically
- `bun run ci` – Run CI checks

### Ultracite Commands

- `bunx ultracite init` – Initialize Ultracite in your project
- `bunx ultracite fix` – Format and fix code automatically
- `bunx ultracite check` – Check for issues without fixing

### Git Hooks (Husky)

This project uses **Husky** for automated pre-commit checks:

- **Pre-commit hook** runs automatically before each commit
- **Automatic formatting** with Ultracite on staged files
- **Linting checks** with Biome on staged files
- **Type checking** with TypeScript before commit
- **Commit blocking** if any checks fail

The pre-commit hook ensures code quality by:

1. Running `bun x ultracite fix` on staged files
2. Running `bun x @biomejs/biome check --staged` for linting
3. Running `bun x tsc --noEmit` for type checking
4. Blocking the commit if any step fails

---

## Styling

- **TailwindCSS 4.1.13** with modern CSS features
- **Custom design system** with consistent components
- **Responsive design** with mobile-first approach
- **Modern CSS features:**
  - Container queries
  - View transitions
  - Scroll-driven animations
  - CSS containment
  - CSS Grid layouts
- **Component variants** using class-variance-authority
- **Utility-first approach** with custom utilities
- **Biome configuration** for CSS at-rules support

---

## Code Quality

- **Biome 2.2.2** for linting and formatting with Ultracite integration
- **Ultracite 5.3.3** - AI-friendly linting rules for maximum type safety and accessibility
- **TypeScript 5.9.2** with strict configuration
- **Consistent code style:**
  - Tab indentation
  - Single quotes
  - Sorted CSS classes
  - Organized imports
- **Type safety** throughout the application
- **Error handling** with proper error boundaries
- **nuqs** for type-safe URL state management
- **Prisma** with proper type generation
- **React Compiler** for performance optimization

### Ultracite Integration

This project uses **Ultracite** for enhanced code quality and AI-friendly development:

- **Zero configuration required** - Works out of the box with sensible defaults
- **Subsecond performance** - Lightning-fast linting and formatting
- **Maximum type safety** - Strict TypeScript rules and accessibility standards
- **AI-friendly code generation** - Optimized for modern AI development workflows
- **Accessibility enforcement** - Built-in a11y rules and best practices
- **React/Next.js specific rules** - Tailored for modern React development

### Biome Configuration

- **Ultracite integration** via `"extends": ["ultracite"]` in biome.jsonc
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
- Use React Compiler for performance optimization
- Follow Ultracite's accessibility and code quality standards
- **Pre-commit hooks** automatically ensure code quality before commits

---

## License

This project is for educational/portfolio purposes and demonstrates modern full-stack web development best practices.

---

_Built with ❤️ using React Router 7, TypeScript, nuqs, and modern web technologies._
