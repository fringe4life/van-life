# Cloudflare D1 setup (van-life)

This app uses **Cloudflare D1** (SQLite) with **Drizzle ORM**. Hyperdrive is **not** used — Hyperdrive pools Postgres/MySQL only.

## 1. Create the D1 database

```bash
bun x wrangler d1 create van-life
```

Copy the printed `database_id` into [`wrangler.jsonc`](../wrangler.jsonc):

```jsonc
"d1_databases": [{
  "binding": "DB",
  "database_name": "van-life",
  "database_id": "<paste-id-here>",
  "migrations_dir": "app/db/migrations"
}]
```

## 2. Generate migrations

```bash
bun run db:generate
```

Drizzle Kit 1.0 rc may emit nested folders (`app/db/migrations/<timestamp>_name/migration.sql`). Apply scripts flatten them for Wrangler.

## 3. Apply migrations

Local (Miniflare / Vite CF plugin):

```bash
bun run db:migrate:local
```

Remote (production D1):

```bash
bun run db:migrate:remote
```

## 4. Seed data

Create at least **3 users** via the app (sign-up), then:

```bash
bun run db:seed          # local Miniflare D1 (needs migrate:local + ≥3 users)
bun run db:seed:remote   # cloud D1 via HTTP API
```

Remote seed needs in `.env` / Varlock (same as drizzle-kit Studio):

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_DATABASE_ID` (same UUID as `wrangler.jsonc` `database_id`)
- `CLOUDFLARE_D1_TOKEN` (API token with D1 edit)

Also ≥3 users already on **remote** (sign up on deployed app, or import).

Seed inserts are chunked — D1 rejects statements with too many bound parameters (`SQLITE_ERROR: too many SQL variables`).

## 5. Develop

```bash
bun run dev
```

The Cloudflare Vite plugin provides `env.DB` to the Worker. Auth and loaders use that binding.

## 6. Deploy

```bash
bun run db:migrate:remote
bun run deploy:project
```

## 7. Optional: Drizzle Kit HTTP (Studio / push)

Set in `.env` / Varlock (see [`.env.schema`](../.env.schema)):

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_DATABASE_ID`
- `CLOUDFLARE_D1_TOKEN` (API token with D1 edit)

Then you can run `bun x drizzle-kit studio` against remote D1 via `d1-http`.

## Hyperdrive note

Do **not** add a Hyperdrive binding for this stack. If you later move to Postgres (e.g. Neon), you would:

1. Switch Drizzle dialect to `postgresql`
2. Create a Hyperdrive config pointing at that DB
3. Bind `HYPERDRIVE` in Wrangler and use `env.HYPERDRIVE.connectionString` with Drizzle `postgres-js` / `node-postgres`

Until then, D1 alone is enough.
