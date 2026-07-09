import { env as cfEnv } from "cloudflare:workers";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import {
  FIVE_MINUTES_IN_SECONDS,
  ONE_MONTH_IN_SECONDS,
  SECONDS_PER_DAY,
} from "~/constants/time-constants";
import { createDb } from "~/db/client.server";
import { schema } from "~/db/schema";
import { env } from "~/lib/env.server";
import { createId } from "~/lib/id.server";

const db = createDb(cfEnv.DB);

export const auth = betterAuth({
  advanced: {
    database: {
      generateId: createId,
    },
  },
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  experimental: { joins: true },
  secret: env.BETTER_AUTH_SECRET,
  session: {
    cookieCache: { enabled: true, maxAge: FIVE_MINUTES_IN_SECONDS },
    expiresIn: ONE_MONTH_IN_SECONDS, // 30 days
    preserveSessionInDatabase: true,
    updateAge: SECONDS_PER_DAY, // 1 day (every 1 day the session expiration is updated)
  },
  telemetry: { enabled: false },
});
