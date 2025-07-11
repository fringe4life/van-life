import { redirect, href } from "react-router";
import { auth } from "./auth";
export async function getSessionOrRedirect(
  request: Request,
  redirectTo = href("/login")
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect(redirectTo);

  return session;
}
