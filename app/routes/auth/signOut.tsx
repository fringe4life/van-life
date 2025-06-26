import { redirect } from "react-router";
import type { Route } from "./+types/signOut";
import { auth } from "~/lib/auth/auth";

export const loader = async ({ request }: Route.LoaderArgs) => {
  await auth.api.revokeSessions({ headers: request.headers });
  throw redirect("/login");
};

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Signout() {
  return <p>Signing out</p>;
}
