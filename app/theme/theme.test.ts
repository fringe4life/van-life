import { describe, expect, it } from "bun:test";
import {
  applyDocumentTheme,
  colorSchemeForTheme,
  htmlThemeClassName,
} from "./theme";

describe("theme helpers", () => {
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
