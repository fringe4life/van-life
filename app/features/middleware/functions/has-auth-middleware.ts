import type { MiddlewareFunction } from "react-router";
import { hasAuthContext } from "~/features/middleware/contexts/has-auth";
import { getUserWithHeaders } from "~/features/middleware/utils/get-user-with-headers";
import { setCookieHeaders } from "~/features/middleware/utils/set-cookie-headers";

const hasAuthMiddleware: MiddlewareFunction<Response> = async (
  { request, context },
  next
) => {
  const { user, headers } = await getUserWithHeaders(request);

  if (user) {
    context.set(hasAuthContext, true);
  } else {
    context.set(hasAuthContext, false);
  }

  // Call next to continue the middleware chain
  const result = await next();

  // Forward Better Auth cookie-cache Set-Cookie onto this response when the
  // session cookie cache is refreshed (~every cookieCache.maxAge, currently
  // 5 minutes). That Set-Cookie makes Workers Cache BYPASS for that one
  // request — a rare miss we tolerate so public browsing still renews the
  // cookie cache without a separate sidecar fetch to /api/auth/get-session.
  // Trade-off: miss rate scales with concurrent logged-in users hitting
  // public routes on refresh; a sidecar keeps page responses cookie-free
  // and cacheable if that cost grows.
  return setCookieHeaders({ headers, result });
};

export { hasAuthMiddleware };
