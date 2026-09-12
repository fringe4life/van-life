import { createCookie } from "react-router";
import { ONE_YEAR_IN_SECONDS } from "~/constants/time-constants";
import {
  parseStoredTheme,
  type StoredTheme,
  type ThemeChoice,
} from "~/theme/schema";

export const THEME_COOKIE_NAME = "theme";

const themeCookie = createCookie(THEME_COOKIE_NAME, {
  httpOnly: true,
  maxAge: ONE_YEAR_IN_SECONDS,
  path: "/",
  sameSite: "lax",
  secure: import.meta.env.PROD,
});

export async function readStoredTheme(
  cookieHeader: string | null
): Promise<StoredTheme | null> {
  return parseStoredTheme(await themeCookie.parse(cookieHeader));
}

/**
 * `createCookie.serialize(null)` does **not** delete the cookie.
 *
 * RR 8.3.1 only skips encoding for `""`. Any other value — including `null` —
 * is `JSON.stringify`'d then base64 (`null` → `bnVsbA==`) and kept with the
 * cookie's default `Max-Age`:
 * https://github.com/remix-run/react-router/blob/react-router%408.3.1/packages/react-router/lib/server-runtime/cookies.ts
 *
 * `expires: new Date(0)` without overriding `maxAge` also fails: Max-Age
 * wins over Expires — https://github.com/remix-run/remix/issues/5150
 *
 * Missing `Cookie.delete()`:
 * https://github.com/remix-run/remix/discussions/6934
 *
 * Workaround: `serialize("", { maxAge: 0 })`. Drop this helper's expire
 * branch if RR starts treating `null` as delete or ships `cookie.delete()`.
 */
export async function serializeThemeSetCookie(
  theme: ThemeChoice
): Promise<string> {
  if (theme === "system") {
    return await themeCookie.serialize("", { maxAge: 0 });
  }

  return await themeCookie.serialize(theme);
}
