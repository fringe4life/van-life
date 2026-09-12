import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import {
  FIVE_MINUTES_IN_SECONDS,
  ONE_MONTH_IN_SECONDS,
  SECONDS_PER_DAY,
} from "~/constants/time-constants";
import { getDb } from "~/db/get-db.server";
import { schema } from "~/db/schema";
import { env } from "~/lib/env.server";
import { createId } from "~/lib/id.server";

const createAuth = () => {
  // Better Auth 1.7.3 AccountKey is (providerId, accountId); issuer identity was reverted; no identityStrategy option.
  return betterAuth({
    advanced: {
      database: {
        generateId: createId,
        joins: true,
      },
    },
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(getDb(), {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    secret: env.BETTER_AUTH_SECRET,
    session: {
      cookieCache: { enabled: true, maxAge: FIVE_MINUTES_IN_SECONDS },
      expiresIn: ONE_MONTH_IN_SECONDS, // 30 days
      preserveSessionInDatabase: true,
      updateAge: SECONDS_PER_DAY, // 1 day (every 1 day the session expiration is updated)
    },
    telemetry: { enabled: false },
  });
};

export type Auth = ReturnType<typeof createAuth>;

let instance: Auth | undefined;

/** Isolate-cached. `drizzleAdapter` reads `db._` at construct — must not run at import. */
export const getAuth = (): Auth => {
  instance ??= createAuth();
  return instance;
};
