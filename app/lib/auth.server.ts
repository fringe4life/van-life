import { createId } from '@paralleldrive/cuid2';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import {
	FIVE_MINUTES_IN_SECONDS,
	ONE_DAY_IN_SECONDS,
	ONE_MONTH_IN_SECONDS,
} from '~/constants/timeConstants';
import { env } from '~/lib/env.server';
import { prisma } from '~/lib/prisma.server';
export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	databaseHooks: {
		user: {
			create: {
				// biome-ignore lint/suspicious/useAwait: better-auth requires async function signature
				before: async (user) => {
					return {
						data: {
							...user,
							id: createId(),
						},
					};
				},
				after: async (user) => {
					const { id: userId } = user;
					// TODO: add error handling...
					await prisma.userInfo.create({
						data: { userId },
					});
				},
			},
		},
	},
	secret: env.BETTER_AUTH_SECRET,
	session: {
		cookieCache: { enabled: true, maxAge: FIVE_MINUTES_IN_SECONDS },
		expiresIn: ONE_MONTH_IN_SECONDS, // 30 days
		updateAge: ONE_DAY_IN_SECONDS, // 1 day (every 1 day the session expiration is updated)
		preserveSessionInDatabase: true,
	},
	telemetry: { enabled: false },
});
