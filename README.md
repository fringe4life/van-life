# Van Life

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
- 🚌 **Van Management** (CRUD operations, van types, image handling)
- 💸 **Rental System** (rent, return, and manage van rentals)
- ⭐ **Review System** (rate and review rentals with analytics)
- 📈 **Host Dashboard** (income tracking, bar charts, rental analytics)
- 💰 **Financial Management** (deposit/withdraw funds, transaction tracking)
- 🎨 **Modern UI/UX** with responsive design and smooth animations
- 🧑‍💻 **TypeScript** throughout with strict type checking
- 🧪 **Zod** for runtime schema validation
- 🎨 **TailwindCSS 4** with modern CSS features
- 📦 **Prisma ORM** with Neon PostgreSQL and relation joins
- 🔧 **Generic Components** for reusability and maintainability
- 📱 **Responsive Design** with mobile-first approach
- ⚡ **Performance Optimized** with React 19 and React Compiler
- 🔗 **URL State Management** with nuqs for type-safe search parameters
- 🌐 **View Transitions** for smooth navigation experiences

---

## Tech Stack

### Frontend

- **React 19.1.1** with React Compiler for performance optimization
- **React Router 7.8.2** (file-based routing, SSR)
- **TypeScript 5.9.2** with strict configuration
- **TailwindCSS 4.1.13** with modern CSS features
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Recharts** for data visualization
- **nuqs 2.6.0** for type-safe URL state management

### Backend & Database

- **Node.js** with React Router server
- **Prisma 6.16.0** ORM with Neon PostgreSQL
- **better-auth 1.3.9** for authentication
- **Zod 4.1.5** for schema validation
- **CUID2** for unique identifiers
- **@prisma/adapter-neon** for Neon database integration

### Development Tools

- **rolldown-vite** (latest) - Next-generation Vite with Rolldown bundler
- **Biome 2.2.4** for linting and formatting
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

- **Neon PostgreSQL** with Prisma ORM
- **Modular schema** with organized model files in subdirectories
- **Main models:**
  - `User`, `Session`, `Account`, `Verification` - Authentication system
  - `Van` - Van listings with types (SIMPLE, LUXURY, RUGGED)
  - `Rent` - Rental transactions and history
  - `Review` - User reviews and ratings
  - `UserInfo` - Extended user profile information
  - `Transaction` - Financial transactions (deposits/withdrawals)
- **Advanced features:**
  - Relation joins for optimized queries
  - CUID2 for unique identifiers
  - Proper indexing and constraints
  - Modular seed data organization with separate files for each model
  - Enhanced seed data with varied van names and descriptions

### Setup Database

```bash
# Generate Prisma client
bunx prisma generate

# Push schema to database
bunx prisma db push

# Seed with enhanced data
bunx prisma db seed
```

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

# Optional: Google OAuth (if configured)
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

- **Biome 2.2.4** for linting and formatting
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

### Biome Configuration

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
- **React Compiler** optimization for production builds

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

- Use Biome for formatting and linting
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Use nuqs for URL state management
- Follow the established project structure
- Use React Compiler for performance optimization

---

## License

This project is for educational/portfolio purposes and demonstrates modern full-stack web development best practices.

---

_Built with ❤️ using React Router 7, TypeScript, nuqs, and modern web technologies._
