import { href, replace } from "react-router";
import { UnsuccesfulState } from "~/components/unsuccesful-state";
import { auth } from "~/lib/auth.server";
import { getRouteErrorMessage } from "~/utils/get-route-error-message";
import { serverError } from "~/utils/server-error";
import { tryCatch } from "~/utils/try-catch.server";
import type { Route } from "./+types/sign-out";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { data: signOut, error } = await tryCatch(() =>
    auth.api.signOut({
      headers: request.headers,
      returnHeaders: true,
    })
  );
  if (!signOut?.response?.success || error) {
    serverError("Failed to sign out. Please try again later.");
  }
  throw replace(href("/login"), { headers: signOut.headers });
};

export default function Signout() {
  return (
    <>
      <title>Sign Out | Van Life</title>
      <meta content="Signing out of your Van Life account" name="description" />
      <p>Signing out</p>
    </>
  );
}

const SIGN_OUT_ERROR = "Your signout failed, please try again.";

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <UnsuccesfulState
    isError
    message={getRouteErrorMessage(error, {
      errorFallback: SIGN_OUT_ERROR,
      fallback: SIGN_OUT_ERROR,
    })}
  />
);
