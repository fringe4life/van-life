import { env } from "cloudflare:workers";
import { type AppDb, createDb } from "./client.server";

let instance: AppDb | undefined;

/**
 * Isolate-cached Drizzle wrapper. D1 is an RPC stub, not a connection; `createDb`
 * must not run at import (`env.DB` is not ready). Same pattern as `getAuth`.
 *
 * Binding-only deploys may reuse the isolate while `env.DB` points at a new
 * database (Cloudflare bindings docs). The common fixes are this singleton
 * (Better Auth / D1 templates) or `createDb(env.DB)` per request (cheap).
 *
 * Unusual middle path — not used here — key the cache on stub identity:
 *
 * ```
 * let d1: D1Database | undefined;
 * export const getDb = (): AppDb => {
 *   if (d1 !== env.DB) {
 *     d1 = env.DB;
 *     instance = createDb(d1);
 *   }
 *   return instance!;
 * };
 * ```
 *
 * Recreate `getAuth` when this wrapper (or `BETTER_AUTH_SECRET`) changes.
 */
export const getDb = (): AppDb => {
  instance ??= createDb(env.DB);
  return instance;
};
