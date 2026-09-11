import { createContext, use, useSyncExternalStore } from "react";

export const THEME_CHOICES = ["light", "dark", "system"] as const;

export type ThemeChoice = (typeof THEME_CHOICES)[number];

export type StoredTheme = Exclude<ThemeChoice, "system">;

export const THEME_TRANSITION_TYPE = "theme-change" as const;
export const THEME_VIEW_TRANSITION_NAME = "theme" as const;

const HTML_THEME_CLASSES = {
  dark: "dark",
  light: "light",
} as const satisfies Record<StoredTheme, StoredTheme>;

export function isThemeChoice(value: unknown): value is ThemeChoice {
  const isSupportedThemeChoice =
    value === "dark" || value === "light" || value === "system";
  return isSupportedThemeChoice;
}

export function parseStoredTheme(value: unknown): StoredTheme | null {
  return value === "dark" || value === "light" ? value : null;
}

export function colorSchemeForTheme(
  theme: StoredTheme | null
): "dark" | "light" | "light dark" {
  if (theme === "dark" || theme === "light") {
    return theme;
  }

  return "light dark";
}

export function htmlThemeClassName(
  theme: StoredTheme | null
): string | undefined {
  return theme === null ? undefined : HTML_THEME_CLASSES[theme];
}

export function applyDocumentTheme(theme: ThemeChoice): void {
  const root = document.documentElement;
  root.classList.toggle(HTML_THEME_CLASSES.dark, theme === "dark");
  root.classList.toggle(HTML_THEME_CLASSES.light, theme === "light");
  root.style.colorScheme = colorSchemeForTheme(
    theme === "system" ? null : theme
  );
}

type ThemeChangeHandler = (theme: ThemeChoice) => void;

export const ThemeChangeContext = createContext<ThemeChangeHandler | null>(
  null
);

export function useThemeChange(): ThemeChangeHandler {
  return use(ThemeChangeContext) ?? applyDocumentTheme;
}

const SYSTEM_THEME_MEDIA = "(prefers-color-scheme: dark)";

const subscribeSystemTheme = (onStoreChange: () => void) => {
  const media = window.matchMedia(SYSTEM_THEME_MEDIA);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
};

const getSystemThemeClass = (): StoredTheme =>
  window.matchMedia(SYSTEM_THEME_MEDIA).matches ? "dark" : "light";

const getServerThemeClass = (): null => null;

export function useHtmlThemeClass(
  cookieTheme: StoredTheme | null
): StoredTheme | null {
  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeClass,
    getServerThemeClass
  );

  return cookieTheme ?? systemTheme;
}
