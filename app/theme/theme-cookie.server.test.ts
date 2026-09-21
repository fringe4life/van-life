import { describe, expect, it } from "bun:test";
import { createCookie } from "react-router";
import {
  readStoredTheme,
  serializeThemeSetCookie,
  THEME_COOKIE_NAME,
} from "./theme-cookie.server";

const SET_COOKIE_MAX_AGE = /(?:^|; )\s*Max-Age=([^;]*)/i;

const setCookieName = (header: string) => header.split("=", 1)[0];

const setCookieMaxAge = (header: string) => {
  const match = header.match(SET_COOKIE_MAX_AGE);
  return match?.[1] ?? null;
};

describe("theme cookie", () => {
  it("round-trips light and dark through createCookie encoding", async () => {
    const darkHeader = await serializeThemeSetCookie("dark");
    const lightHeader = await serializeThemeSetCookie("light");

    expect(setCookieName(darkHeader)).toBe(THEME_COOKIE_NAME);
    expect(darkHeader).not.toContain("theme=dark");
    expect(await readStoredTheme(darkHeader.split(";", 1)[0])).toBe("dark");
    expect(await readStoredTheme(lightHeader.split(";", 1)[0])).toBe("light");
  });

  it("treats a missing cookie and garbage payload as system", async () => {
    expect(await readStoredTheme(null)).toBeNull();
    expect(await readStoredTheme("")).toBeNull();
    expect(await readStoredTheme(`${THEME_COOKIE_NAME}=dark`)).toBeNull();
  });

  it("expires the cookie for system instead of serializing JSON null", async () => {
    const systemHeader = await serializeThemeSetCookie("system");
    const nullHeader = await createCookie(THEME_COOKIE_NAME, {
      path: "/",
    }).serialize(null);

    expect(setCookieMaxAge(systemHeader)).toBe("0");
    expect(setCookieMaxAge(nullHeader)).toBeNull();
    expect(nullHeader).toContain("bnVsbA");
  });
});
