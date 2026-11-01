import { href, replace } from "react-router";
import type { Failure } from "~/types";
import { badRequest } from "~/utils/errors/bad-request";
import type { Route } from "./+types/sign-out";

export const action = async ({ request }: Route.ActionArgs) => {
  /**
   * Workaround: `.server` modules imported here rather than at module scope, because
   * a static import survives React Router's client export removal and then trips its
   * `.server` resolver.
   *
   * @remarks
   * Still required on `@react-router/dev@8.5.1` with `vite@8.3.5` in `vite serve`.
   * Drop when upstream ships a fix; re-verify this module returns 200. Full note:
   * `app/routes/host/rental-activity.tsx`.
   *
   * @see https://github.com/remix-run/react-router/issues/14997 — open
   * @see https://github.com/fringe4life/van-life/issues/402 — tracking
   */
  const [{ getAuth }, { tryCatch }] = await Promise.all([
    import("~/lib/auth.server"),
    import("~/utils/errors/try-catch.server"),
  ]);

  const { data: signOut, error } = await tryCatch(() =>
    getAuth().api.signOut({
      headers: request.headers,
      returnHeaders: true,
    })
  );

  if (!signOut?.response?.success || error) {
    return badRequest({ ok: false } satisfies Failure);
  }

  throw replace(href("/login"), { headers: signOut.headers });
};
