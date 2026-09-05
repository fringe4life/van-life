import { href, replace } from "react-router";
import { auth } from "~/lib/auth.server";
import type { Failure } from "~/types";
import { badRequest } from "~/utils/errors/bad-request";
import { tryCatch } from "~/utils/errors/try-catch.server";
import type { Route } from "./+types/sign-out";

export const action = async ({ request }: Route.ActionArgs) => {
  const { data: signOut, error } = await tryCatch(() =>
    auth.api.signOut({
      headers: request.headers,
      returnHeaders: true,
    })
  );

  if (!signOut?.response?.success || error) {
    return badRequest({ ok: false } satisfies Failure);
  }

  throw replace(href("/login"), { headers: signOut.headers });
};
