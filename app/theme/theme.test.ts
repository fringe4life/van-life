import { describe, expect, it } from "bun:test";
import {
  applyDocumentTheme,
  colorSchemeForTheme,
  htmlThemeClassName,
  isThemeChoice,
  parseStoredTheme,
} from "./theme";

describe("theme helpers", () => {
  it("accepts only light, dark, and system choices", () => {
    expect(isThemeChoice("dark")).toBe(true);
    expect(isThemeChoice("light")).toBe(true);
    expect(isThemeChoice("system")).toBe(true);
    expect(isThemeChoice("Dim")).toBe(false);
    expect(isThemeChoice(null)).toBe(false);
  });

  it("stores only light or dark; everything else is system", () => {
    expect(parseStoredTheme("dark")).toBe("dark");
    expect(parseStoredTheme("light")).toBe("light");
    expect(parseStoredTheme("system")).toBeNull();
    expect(parseStoredTheme(null)).toBeNull();
    expect(parseStoredTheme({})).toBeNull();
  });

  it("maps stored theme to html class and color-scheme", () => {
    expect(htmlThemeClassName("dark")).toBe("dark");
    expect(htmlThemeClassName("light")).toBe("light");
    expect(htmlThemeClassName(null)).toBeUndefined();
    expect(colorSchemeForTheme("dark")).toBe("dark");
    expect(colorSchemeForTheme("light")).toBe("light");
    expect(colorSchemeForTheme(null)).toBe("light dark");
  });

  it("toggles html class and color-scheme without leaving the other class", () => {
    document.documentElement.className = "panda dark";
    applyDocumentTheme("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light");

    applyDocumentTheme("system");
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light dark");
    expect(document.documentElement.classList.contains("panda")).toBe(true);
  });
});
