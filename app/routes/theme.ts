import { data } from "react-router";
import { isThemeChoice } from "~/theme/schema";
import type { Failure, Success } from "~/types";
import { badRequest } from "~/utils/errors/bad-request";
import type { Route } from "./+types/theme";

export async function action({ request }: Route.ActionArgs) {
  /**
   * Workaround: `.server` module imported here rather than at module scope, because
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
  const [{ serializeThemeSetCookie }, form] = await Promise.all([
    import("~/theme/theme-cookie.server"),
    request.formData(),
  ]);
  const theme = form.get("theme");

  if (!isThemeChoice(theme)) {
    return badRequest({ ok: false } satisfies Failure);
  }

  return data({ ok: true, theme } satisfies Success & { theme: typeof theme }, {
    headers: { "Set-Cookie": await serializeThemeSetCookie(theme) },
  });
}
