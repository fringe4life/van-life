import { redirect } from "react-router";
import { authClient } from "~/lib/auth/client";

export const clientLoader = async () => {
  await authClient.signOut();
  throw redirect("/login");
};

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Signout() {
  return <p>Signing out</p>;
}
