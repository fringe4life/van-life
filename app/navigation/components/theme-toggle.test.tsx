import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router";
import { ThemeToggle } from "./theme-toggle";

const HYDRATION_MISMATCH = /hydrated but some attributes/u;

const themeToggleTree = (
  theme: "dark" | "light" | null = null,
  ui: ReactNode = <ThemeToggle />
) => {
  const router = createMemoryRouter(
    [
      {
        children: [
          {
            action: () => ({ ok: true, theme: "dark" }),
            path: "theme",
          },
        ],
        element: ui,
        hydrateFallbackElement: ui,
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

  it("sets data-theme on click before the action settles", async () => {
    const user = userEvent.setup();
    renderThemeToggle(null);

    const [darkRadio] = screen.getAllByRole("radio", { name: "Dark" });
    if (!darkRadio) {
      throw new Error("Expected a dark theme radio option");
    }

    await user.click(darkRadio);

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("marks the compact trigger as holding the current theme", () => {
    // No cookie: system is the held choice.
    renderThemeToggle(null);

    // The button owns the value without containing the radio, so the glyphs
    // need a marker of their own or the sun and monitor render unlit here.
    const trigger = screen.getByRole("button", { name: "Color theme: System" });
    expect(trigger).toHaveAttribute("data-held", "true");
    expect(trigger).toHaveClass("group");

    const [checked] = screen.getAllByRole("radio", { name: "System" });
    expect(checked?.closest("label")).toHaveAttribute("data-held", "true");

    const [unchecked] = screen.getAllByRole("radio", { name: "Light" });
    expect(unchecked?.closest("label")).not.toHaveAttribute("data-held");
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
