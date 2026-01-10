import { type } from 'arktype';

const envSchema = type({
	DATABASE_URL: 'string',
	BETTER_AUTH_SECRET: 'string >= 20',
	BETTER_AUTH_URL: 'string',
});

const envResult = envSchema(process.env);
if (envResult instanceof type.errors) {
	throw new Error(`Environment validation failed: ${envResult.summary}`);
}
export const env = envResult;
