import { z } from 'zod/v4';

const envSchema = z.object({
	DATABASE_URL: z.url(),
	DIRECT_URL: z.url(),

	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.url(),

	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
