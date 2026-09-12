import { env } from "cloudflare:workers";
import { type AppDb, createDb } from "./client.server";

let instance: AppDb | undefined;

/** Isolate-cached. D1 bind is isolate-scoped; drizzle wrapper is not a connection. Must not run at import. */
export const getDb = (): AppDb => {
  instance ??= createDb(env.DB);
  return instance;
};
