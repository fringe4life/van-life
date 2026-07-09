import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { relations } from "./relations";

export function createDb(d1: D1Database) {
  return drizzle(d1, { relations });
}

export type AppDb = ReturnType<typeof createDb>;

export type {
  ReviewModel,
  TransactionModel,
  UserModel,
  VanInsert,
  VanModel,
} from "./types";
