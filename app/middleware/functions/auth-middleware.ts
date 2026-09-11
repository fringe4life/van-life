import { type MiddlewareFunction, redirect } from "react-router";
import { authContext } from "~/middleware/contexts/auth";
import {
  getLoginRedirectUrl,
  getReturnPathFromUrl,
} from "~/middleware/utils/auth-redirect";
import { getUserWithHeaders } from "~/middleware/utils/get-user-with-headers";
import { setCookieHeaders } from "~/middleware/utils/set-cookie-headers";

const authMiddleware: MiddlewareFunction<Response> = async (
  { request, context, url },
  next
) => {
  const { user, headers } = await getUserWithHeaders(request);

  if (!user) {
    // `url` is RR-normalized (no `.data` / `_.data` / `_routes`) — not `request.url`
    const returnPath = getReturnPathFromUrl(url);
    throw redirect(getLoginRedirectUrl(returnPath));
  }

  context.set(authContext, user);

  // Call next to continue the middleware chain
  const result = await next();

  // Set cookie headers to update cookie cache
  return setCookieHeaders({ headers, result });
};

export { authMiddleware };
