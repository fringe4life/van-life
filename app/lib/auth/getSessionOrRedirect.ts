import { redirect, href } from "react-router";
import { auth } from "./auth";

export async function getSessionOrRedirect(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect(href("/login"));

  return session;
}
