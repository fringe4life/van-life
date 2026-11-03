import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { resetSupportsBaseSelect } from "~/hooks/use-supports-base-select";
import { Select } from "./select";

const originalGetComputedStyle = globalThis.getComputedStyle;
const originalConsoleError = console.error;

/*
 * The capability probe asks `getComputedStyle` for the appearance of a select
 * carrying `appearance: base-select` inline. Answer that question directly
 * rather than depending on what the test DOM claims to support.
 */
const stubBaseSelect = (supported: boolean) => {
  globalThis.getComputedStyle = ((
    element: Element,
    pseudoElt?: string | null
  ) => {
    if (element instanceof HTMLSelectElement) {
      return {
        getPropertyValue: (property: string) =>
          supported && property === "appearance" ? "base-select" : "",
      } as unknown as CSSStyleDeclaration;
    }
    return originalGetComputedStyle(element, pseudoElt);
  }) as typeof getComputedStyle;
};

const renderSelect = (selectedIcon?: ReactNode) =>
  render(
    <Select
      aria-label="Page size"
      defaultValue="10"
      selectedIcon={selectedIcon}
    >
      <option value="5">5</option>
      <option value="10">10</option>
    </Select>
  );

const isBaseSelectNestingWarning = (args: unknown[]) => {
  const text = args
    .map((arg) => (arg instanceof Error ? arg.message : String(arg)))
    .join(" ");
  return (
    text.includes("unrecognized in this browser") ||
    text.includes("cannot be a child of") ||
    text.includes("cannot contain a nested")
  );
};

describe("Select", () => {
  beforeEach(() => {
    resetSupportsBaseSelect();
  });

  afterEach(() => {
    globalThis.getComputedStyle = originalGetComputedStyle;
    console.error = originalConsoleError;
    resetSupportsBaseSelect();
  });

  it("renders a labeled native select with its options", () => {
    stubBaseSelect(false);
    renderSelect();

    const select = screen.getByRole("combobox", { name: "Page size" });

    expect(select).toHaveDisplayValue("10");
    expect(select.querySelector("button")).toBeNull();
    expect(screen.getByRole("option", { name: "5" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
  });

  it("renders the select button with the supplied icon when base-select resolves", () => {
    stubBaseSelect(true);
    console.error = (...args: unknown[]) => {
      if (!isBaseSelectNestingWarning(args)) {
        originalConsoleError.apply(console, args);
      }
    };

    renderSelect(<svg data-testid="chosen-limit-icon" />);

    const select = screen.getByRole("combobox", { name: "Page size" });
    const button = select.querySelector("button");

    expect(button).not.toBeNull();
    expect(button?.querySelector("selectedcontent")).not.toBeNull();
    expect(
      button?.querySelector('[data-testid="chosen-limit-icon"]')
    ).not.toBeNull();
  });
});
