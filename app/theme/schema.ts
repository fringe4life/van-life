import { defineCatalog } from "~/literals/catalog";

export const themeChoice = defineCatalog(["light", "dark", "system"] as const);
export const storedTheme = themeChoice.excluding("system");

export type ThemeChoice = (typeof themeChoice.values)[number];
export type StoredTheme = (typeof storedTheme.values)[number];

export const THEME_CHOICES = themeChoice.values;
export const isThemeChoice = themeChoice.includes;
export const parseStoredTheme = storedTheme.parse;
