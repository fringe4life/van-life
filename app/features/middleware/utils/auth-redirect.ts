import { href } from 'react-router';

const REDIRECT_SEARCH_PARAM = 'redirectTo';

const AUTH_PATH_PREFIXES = [
	href('/login'),
	href('/signup'),
	href('/signout'),
] as const;

const DEFAULT_REDIRECT = href('/host');

const PATH_SEPARATOR_REGEX = /[?#]/;
export function getReturnPathFromRequest(request: Request): string {
	const { pathname, search } = new URL(request.url);
	return pathname + search;
}

export function getSafeRedirectPath(
	path: unknown,
	fallback: string = DEFAULT_REDIRECT
): string {
	if (typeof path !== 'string' || path.length === 0) {
		return fallback;
	}

	if (!path.startsWith('/') || path.startsWith('//')) {
		return fallback;
	}

	const pathname = path.split(PATH_SEPARATOR_REGEX)[0] ?? path;

	if (AUTH_PATH_PREFIXES.some((authPath) => pathname === authPath)) {
		return fallback;
	}

	return path;
}

export function getRedirectFromRequest(
	request: Request,
	fallback: string = DEFAULT_REDIRECT
): string {
	const value = new URL(request.url).searchParams.get(REDIRECT_SEARCH_PARAM);
	return getSafeRedirectPath(value, fallback);
}

export function getLoginRedirectUrl(returnPath: string): string {
	const redirectTo = getSafeRedirectPath(returnPath);
	const params = new URLSearchParams({ [REDIRECT_SEARCH_PARAM]: redirectTo });
	return `${href('/login')}?${params}`;
}
