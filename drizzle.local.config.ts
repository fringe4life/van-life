import { readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "drizzle-kit";

function localD1SqliteUrl() {
  const dir = path.resolve(".wrangler/state/v3/d1/miniflare-D1DatabaseObject");
  const file = readdirSync(dir).find(
    (name) => name.endsWith(".sqlite") && name !== "metadata.sqlite"
  );
  if (!file) {
    throw new Error(
      "No local D1 database found. Run `bun run db:migrate:local` first."
    );
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
