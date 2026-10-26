import { describe, expect, it } from "bun:test";
import { applyDocumentTheme, htmlThemeAttribute } from "./theme";

describe("theme helpers", () => {
  it("maps stored theme to data-theme and omits system", () => {
    expect(htmlThemeAttribute("dark")).toBe("dark");
    expect(htmlThemeAttribute("light")).toBe("light");
    expect(htmlThemeAttribute("system")).toBeUndefined();
    expect(htmlThemeAttribute(null)).toBeUndefined();
  });

  it("sets data-theme without leaving classes or inline color-scheme", () => {
    document.documentElement.className = "panda dark";
    document.documentElement.style.colorScheme = "dark";
    document.documentElement.setAttribute("data-theme", "dark");

    applyDocumentTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("");
    expect(document.documentElement.classList.contains("panda")).toBe(true);

    applyDocumentTheme("system");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
