import { data } from "react-router";
import { isThemeChoice } from "~/theme/theme";
import { serializeThemeSetCookie } from "~/theme/theme-cookie.server";
import type { Failure, Success } from "~/types";
import { badRequest } from "~/utils/errors/bad-request";
import type { Route } from "./+types/theme";

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const theme = form.get("theme");

  if (!isThemeChoice(theme)) {
    return badRequest({ ok: false } satisfies Failure);
  }

  return data({ ok: true, theme } satisfies Success & { theme: typeof theme }, {
    headers: { "Set-Cookie": await serializeThemeSetCookie(theme) },
  });
}
