import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "drizzle-kit";

const LOCAL_D1_MISSING_ERROR =
  "No local D1 database found. Run `bun run db:migrate:local` first.";

function localD1SqliteUrl() {
  const dir = path.resolve(".wrangler/state/v3/d1/miniflare-D1DatabaseObject");
  if (!existsSync(dir)) {
    throw new Error(LOCAL_D1_MISSING_ERROR);
  }
  const file = readdirSync(dir).find(
    (name) => name.endsWith(".sqlite") && name !== "metadata.sqlite"
  );
  if (!file) {
    throw new Error(LOCAL_D1_MISSING_ERROR);
  }
  return path.join(dir, file);
}

export default defineConfig({
  dbCredentials: {
    url: localD1SqliteUrl(),
  },
  dialect: "sqlite",
  out: "./app/db/migrations",
  schema: ["./app/db/schema/auth.ts", "./app/db/schema/van.ts"],
});
