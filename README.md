# Van Life

A full-stack portfolio project for managing van rentals, showcasing modern web development skills with React, TypeScript, Prisma, and more.

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
- [Contributing](#contributing)

---

## Features

- 🚀 **Server-side rendering** with React Router
- 🔒 **Authentication** (sign up, login, session management)
- 🚌 **Van management** (CRUD for vans, van types, images)
- 💸 **Rental flow** (rent, return, and manage vans)
- ⭐ **Reviews** (rate and review rentals)
- 📈 **Income tracking** (host dashboard, bar charts)
- 💰 **Account management** (deposit/withdraw funds)
- ⚡️ **Modern CSS**: Container Queries, View Transitions, Scroll-driven animations, CSS containment, grid
- 🧑‍💻 **TypeScript** throughout
- 🧪 **Zod** for schema validation
- 🎨 **TailwindCSS** for styling
- 📦 **Prisma** ORM with PostgreSQL
- 📖 **Generics** and reusable components

---

## Tech Stack

- **Frontend:** React 19, React Router 7, TypeScript, TailwindCSS
- **Backend:** Node.js, React Router server, Prisma ORM
- **Database:** PostgreSQL (via Prisma)
- **Authentication:** better-auth, custom session management
- **Validation:** Zod
- **Charts:** recharts
- **UI:** Radix UI, custom design system

---

## Project Structure

```
app/
  components/      # Reusable UI and feature components
  constants/       # App-wide constants
  db/              # Database access and queries (Prisma)
  hooks/           # Custom React hooks
  lib/             # Server-side utilities (auth, schemas, etc.)
  routes/          # Route modules (pages, API, layouts)
  utils/           # Utility functions
  assets/          # Static assets (SVGs, images)
prisma/
  models/          # Prisma model definitions
  schema.prisma    # Prisma schema entrypoint
  seed.ts          # Database seeding script
public/            # Public static files
```

---

## Database

- **Prisma ORM** with PostgreSQL.
- Main models: `User`, `UserInfo`, `Van`, `Rent`, `Review`.
- Enum: `VanType` (`SIMPLE`, `LUXURY`, `RUGGED`).
- To set up the database:
  ```bash
  npx prisma migrate dev
  npm run seed
  ```
- Models are defined in `prisma/models/`. See `schema.prisma` for datasource and generator config.

---

## Authentication

- Uses [better-auth](https://www.npmjs.com/package/better-auth) for email/password authentication.
- Session management and protected routes.
- Zod schemas for validation.
- See `app/lib/auth.server.ts` and `app/lib/schemas.server.ts`.

---

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```
App runs at [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
```

---

## Environment Variables

Create a `.env` file in the root with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/vanlife
DIRECT_URL=postgresql://user:password@localhost:5432/vanlife
```

---

## Scripts

- `npm run dev` – Start development server with HMR
- `npm run build` – Build for production
- `npm run typecheck` – TypeScript and route type generation
- `npm run seed` – Seed the database (see `prisma/seed.ts`)

---

## Styling

- **TailwindCSS** for utility-first styling.
- Custom CSS for animations, transitions, and layout (`app/app.css`).
- Uses Radix UI primitives for accessible components.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

---

*This project is for educational/portfolio purposes and demonstrates modern full-stack web development best practices.*

