import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router";
import { ThemeToggle } from "./theme-toggle";

const HYDRATION_MISMATCH = /hydrated but some attributes/;

const themeToggleTree = (
  theme: "dark" | "light" | null = null,
  ui: ReactNode = <ThemeToggle />
) => {
  const Fixture = () => ui;
  const router = createMemoryRouter(
    [
      {
        Component: Fixture,
        children: [
          {
            action: () => ({ ok: true, theme: "dark" }),
            path: "theme",
          },
        ],
        HydrateFallback: Fixture,
        id: "root",
        loader: () => ({ theme }),
        path: "/",
      },
    ],
    {
      hydrationData: {
        loaderData: { root: { theme } },
      },
    }
  );

  return <RouterProvider router={router} />;
};

const renderThemeToggle = (
  theme: "dark" | "light" | null = null,
  ui: ReactNode = <ThemeToggle />
) => render(themeToggleTree(theme, ui));

describe("ThemeToggle", () => {
  it("marks system as checked when the cookie is missing", () => {
    renderThemeToggle(null);

    for (const radio of screen.getAllByRole("radio", { name: "System" })) {
      expect(radio).toBeChecked();
    }
    for (const radio of screen.getAllByRole("radio", { name: "Light" })) {
      expect(radio).not.toBeChecked();
    }
    for (const radio of screen.getAllByRole("radio", { name: "Dark" })) {
      expect(radio).not.toBeChecked();
    }
  });

  it("marks the stored theme as checked", () => {
    renderThemeToggle("dark");

    for (const radio of screen.getAllByRole("radio", { name: "Dark" })) {
      expect(radio).toBeChecked();
    }
  });

  it("applies the html class on click before the action settles", async () => {
    const user = userEvent.setup();
    renderThemeToggle(null);

    const [darkRadio] = screen.getAllByRole("radio", { name: "Dark" });
    if (!darkRadio) {
      throw new Error("Expected a dark theme radio option");
    }

    await user.click(darkRadio);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("gives the mobile-nav instance its own popover id", () => {
    renderThemeToggle(
      null,
      <>
        <ThemeToggle />
        <ThemeToggle instance="mobile-nav" />
      </>
    );

    expect(document.getElementById("theme-toggle-popover")).not.toBeNull();
    expect(
      document.getElementById("mobile-nav-theme-toggle-popover")
    ).not.toBeNull();
  });

  it("renders only the compact control for the mobile-nav instance", () => {
    renderThemeToggle(null, <ThemeToggle instance="mobile-nav" />);

    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(
      screen.getByRole("button", { name: "Color theme: System" })
    ).toBeInTheDocument();
  });

  it("hydrates after Chromium inlines caret-color on the radios", async () => {
    const hydrationErrors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      hydrationErrors.push(args.map(String).join(" "));
    };

    const container = document.createElement("div");
    document.body.appendChild(container);

    try {
      container.innerHTML = renderToString(themeToggleTree("light"));
      for (const radio of container.querySelectorAll<HTMLInputElement>(
        'input[type="radio"]'
      )) {
        radio.style.caretColor = "transparent";
      }

      let root: ReturnType<typeof hydrateRoot> | undefined;
      await act(() => {
        root = hydrateRoot(container, themeToggleTree("light"));
      });
      await act(() => {
        root?.unmount();
      });
    } finally {
      console.error = originalError;
      container.remove();
    }

    expect(hydrationErrors.join("\n")).not.toMatch(HYDRATION_MISMATCH);
  });
});
