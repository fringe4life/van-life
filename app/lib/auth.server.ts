import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
// import prisma from '~/lib/prisma';
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
		cookieCache: { enabled: true, maxAge: 5 * 60 },
		expiresIn: 60 * 60 * 24 * 30, // 30 days
		updateAge: 60 * 60 * 24 * 3, // 1 day (every 1 day the session expiration is updated)
		preserveSessionInDatabase: true,
	},
});
