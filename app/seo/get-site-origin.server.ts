import { env } from "~/lib/env.server";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

const isLocalOrigin = (origin: string): boolean => {
  try {
    return LOCAL_HOSTS.has(new URL(origin).hostname);
  } catch {
    return false;
  }
};

/**
 * A public SITE_URL wins, so canonicals stay on the live host.
 * The schema default is localhost, which must not override a public request.
 */
export const resolveSiteOrigin = (
  siteUrl: string | undefined,
  request?: Request,
  fallback?: string
): string => {
  if (siteUrl && !isLocalOrigin(siteUrl)) {
    return siteUrl;
  }

  if (request) {
    return new URL(request.url).origin;
  }

  return siteUrl ?? fallback ?? "";
};

export const getSiteOrigin = (request?: Request): string =>
  resolveSiteOrigin(env.SITE_URL, request, env.BETTER_AUTH_URL);
