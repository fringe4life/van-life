import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth/minimal';
import {
	FIVE_MINUTES_IN_SECONDS,
	ONE_MONTH_IN_SECONDS,
	SECONDS_PER_DAY,
} from '~/constants/time-constants';
import { env } from '~/lib/env.server';
import { createId } from '~/lib/id.server';
import { prisma } from '~/lib/prisma.server';
export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	experimental: { joins: true },
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	session: {
		cookieCache: { enabled: true, maxAge: FIVE_MINUTES_IN_SECONDS },
		expiresIn: ONE_MONTH_IN_SECONDS, // 30 days
		updateAge: SECONDS_PER_DAY, // 1 day (every 1 day the session expiration is updated)
		preserveSessionInDatabase: true,
	},
	telemetry: { enabled: false },
	advanced: {
		database: {
			generateId: createId,
		},
	},
});
