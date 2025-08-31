import { createId } from '@paralleldrive/cuid2';
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
		cookieCache: { enabled: true, maxAge: 5 * 60 },
		expiresIn: 60 * 60 * 24 * 30, // 30 days
		updateAge: 60 * 60 * 24 * 3, // 1 day (every 1 day the session expiration is updated)
		preserveSessionInDatabase: true,
	},
	telemetry: { enabled: false },
	onAPIError: {
		throw: false, // Don't throw errors, handle them gracefully
		onError: (error, ctx) => {
			console.error('[Better Auth Error]:', {
				message: error instanceof Error ? error.message : 'Unknown error',
				status:
					error instanceof Error && 'status' in error
						? error?.status
						: 'Unknown',
				context: ctx,
			});
		},
		errorURL: '/auth/error', // Redirect to error page
	},
});
