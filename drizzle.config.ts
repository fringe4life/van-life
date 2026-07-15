import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
    databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "",
    token: process.env.CLOUDFLARE_D1_TOKEN ?? "",
  },
  dialect: "sqlite",
  driver: "d1-http",
  out: "./app/db/migrations",
  schema: ["./app/db/schema/auth.ts", "./app/db/schema/van.ts"],
});
