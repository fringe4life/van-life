import { env } from '~/lib/env.server';

export const getSiteOrigin = (request?: Request): string => {
	if (env.SITE_URL) {
		return env.SITE_URL;
	}

	if (request) {
		return new URL(request.url).origin;
	}

	return env.BETTER_AUTH_URL;
};
