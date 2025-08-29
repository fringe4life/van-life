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
- [Contributing](#contributing)

---

## Features

- 🚀 **Modern React Router 7** with server-side rendering and file-based routing
- 🔒 **Authentication** with better-auth (sign up, login, session management)
- 🚌 **Van Management** (CRUD operations, van types, image handling)
- 💸 **Rental System** (rent, return, and manage van rentals)
- ⭐ **Review System** (rate and review rentals with analytics)
- 📈 **Host Dashboard** (income tracking, bar charts, rental analytics)
- 💰 **Financial Management** (deposit/withdraw funds, payment tracking)
- 🎨 **Modern UI/UX** with responsive design and smooth animations
- 🧑‍💻 **TypeScript** throughout with strict type checking
- 🧪 **Zod** for runtime schema validation
- 🎨 **TailwindCSS 4** with modern CSS features
- 📦 **Prisma ORM** with PostgreSQL and relation joins
- 🔧 **Generic Components** for reusability and maintainability
- 📱 **Responsive Design** with mobile-first approach
- ⚡ **Performance Optimized** with React 19 and modern tooling

---

## Tech Stack

### Frontend
- **React 19** with React Compiler
- **React Router 7** (file-based routing, SSR)
- **TypeScript 5.9** with strict configuration
- **TailwindCSS 4** with modern CSS features
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Recharts** for data visualization

### Backend & Database
- **Node.js** with React Router server
- **Prisma 6.15** ORM with PostgreSQL
- **better-auth** for authentication
- **Zod** for schema validation
- **CUID2** for unique identifiers

### Development Tools
- **Vite 7** with React Router plugin
- **Biome** for linting and formatting
- **TypeScript** with native preview
- **Babel** with React Compiler plugin

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
├── routes/             # Route modules (pages, API, layouts)
│   ├── api/            # API routes
│   ├── auth/           # Authentication routes
│   ├── host/           # Host dashboard routes
│   ├── layout/         # Layout components
│   └── vans/           # Van listing and detail routes
├── utils/              # Utility functions
└── assets/             # Static assets (SVGs, images)

prisma/
├── models/             # Modular Prisma model definitions
│   ├── betterAuth.prisma
│   ├── enums.prisma
│   ├── rent.prisma
│   ├── review.prisma
│   ├── userInfo.prisma
│   └── van.prisma
├── schema.prisma       # Prisma schema entrypoint
└── seed.ts            # Database seeding script
```

---

## Database

- **PostgreSQL** with Prisma ORM
- **Modular schema** with separate model files for better organization
- **Main models:**
  - `User` & `UserInfo` - User accounts and profiles
  - `Van` - Van listings with types (SIMPLE, LUXURY, RUGGED)
  - `Rent` - Rental transactions and history
  - `Review` - User reviews and ratings
- **Advanced features:**
  - Relation joins for optimized queries
  - CUID2 for unique identifiers
  - Proper indexing and constraints

### Setup Database
```bash
npx prisma migrate dev
npm run seed
```

---

## Authentication

- **better-auth** for secure email/password authentication
- **Session management** with proper security headers
- **Protected routes** with automatic redirects
- **Zod validation** for all auth forms
- **Server-side session handling** in loaders

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
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
# Edit .env with your database credentials

# Set up database
npx prisma migrate dev
npm run seed

# Start development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
npm run start
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vanlife
DIRECT_URL=postgresql://user:password@localhost:5432/vanlife

# Authentication (if using better-auth)
AUTH_SECRET=your-secret-key-here
```

---

## Scripts

- `npm run dev` – Start development server with HMR
- `npm run build` – Build for production
- `npm run typecheck` – TypeScript checking and route type generation
- `npm run seed` – Seed the database with sample data

---

## Styling

- **TailwindCSS 4** with modern CSS features
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

---

## Code Quality

- **Biome** for linting and formatting
- **TypeScript** with strict configuration
- **Consistent code style:**
  - Tab indentation
  - Single quotes
  - Sorted CSS classes
  - Organized imports
- **Type safety** throughout the application
- **Error handling** with proper error boundaries

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

---

## License

This project is for educational/portfolio purposes and demonstrates modern full-stack web development best practices.

---

*Built with ❤️ using React Router 7, TypeScript, and modern web technologies.*

