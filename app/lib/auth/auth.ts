import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '~/lib/prisma';
// import prisma from '~/lib/prisma';
import { env } from '~/utils/env';

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
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
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
});
export type Session = typeof auth.$Infer.Session;
