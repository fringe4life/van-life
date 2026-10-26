import { createContext, use } from "react";
import type { StoredTheme, ThemeChoice } from "~/theme/schema";

export const THEME_TRANSITION_TYPE = "theme-change" as const;
export const THEME_VIEW_TRANSITION_NAME = "theme" as const;

/** `data-theme` on `<html>` only when a stored light/dark override exists. */
export function htmlThemeAttribute(
  theme: ThemeChoice | StoredTheme | null
): StoredTheme | undefined {
  if (theme === "dark" || theme === "light") {
    return theme;
  }

  return undefined;
}

export function applyDocumentTheme(theme: ThemeChoice): void {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.style.removeProperty("color-scheme");
  if (theme === "system") {
    root.removeAttribute("data-theme");
    return;
  }

  root.setAttribute("data-theme", theme);
}

type ThemeChangeHandler = (theme: ThemeChoice) => void;

export const ThemeChangeContext = createContext<ThemeChangeHandler | null>(
  null
);

export function useThemeChange(): ThemeChangeHandler {
  return use(ThemeChangeContext) ?? applyDocumentTheme;
}
