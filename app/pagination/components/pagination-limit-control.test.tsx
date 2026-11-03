import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { resetSupportsBaseSelect } from "~/hooks/use-supports-base-select";
import { PaginationLimitControl } from "./pagination-limit-control";

const originalGetComputedStyle = globalThis.getComputedStyle;
const originalConsoleError = console.error;

const isBaseSelectNestingWarning = (args: unknown[]) => {
  const text = args
    .map((arg) => (arg instanceof Error ? arg.message : String(arg)))
    .join(" ");
  return (
    text.includes("cannot be a child of") ||
    text.includes("cannot contain a nested") ||
    text.includes("react-stack-top-frame") ||
    text.includes("unrecognized in this browser")
  );
};

const renderLimitControl = (searchParams = "limit=10") =>
  render(<PaginationLimitControl />, {
    wrapper: ({ children }) => (
      <NuqsTestingAdapter searchParams={searchParams}>
        {children}
      </NuqsTestingAdapter>
    ),
  });

describe("PaginationLimitControl", () => {
  beforeEach(() => {
    resetSupportsBaseSelect();
  });

  afterEach(() => {
    globalThis.getComputedStyle = originalGetComputedStyle;
    console.error = originalConsoleError;
  });

  it("renders limit options without density icons when base-select is unsupported", () => {
    // An engine that parses `base-select` but does not resolve it: the shape
    // the probe has to reject, and the reason the glyphs were once invisible.
    globalThis.getComputedStyle = ((
      element: Element,
      pseudoElt?: string | null
    ) => {
      if (element instanceof HTMLSelectElement) {
        return {
          getPropertyValue: () => "",
        } as unknown as CSSStyleDeclaration;
      }
      return originalGetComputedStyle(element, pseudoElt);
    }) as typeof getComputedStyle;

    renderLimitControl();

    const select = screen.getByRole("combobox", {
      name: "Pagination amount control",
    });

    expect(select).toHaveDisplayValue("10");
    expect(select.querySelector("svg")).toBeNull();
    expect(select.querySelector("button")).toBeNull();
    expect(screen.getByRole("option", { name: "5" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "20" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "50" })).toBeInTheDocument();
  });

  it("renders picker chrome and density icons when base-select is supported", () => {
    // The capability probe sets `appearance: base-select` inline and reads the
    // computed value back; answer for that element and defer everything else to
    // the real implementation.
    globalThis.getComputedStyle = ((
      element: Element,
      pseudoElt?: string | null
    ) => {
      if (
        element instanceof HTMLSelectElement &&
        element.style.appearance === "base-select"
      ) {
        return {
          getPropertyValue: (property: string) =>
            property === "appearance" ? "base-select" : "",
        } as unknown as CSSStyleDeclaration;
      }
      return originalGetComputedStyle(element, pseudoElt);
    }) as typeof getComputedStyle;
    console.error = (...args: unknown[]) => {
      if (isBaseSelectNestingWarning(args)) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    renderLimitControl("limit=20");

    const select = screen.getByRole("combobox", {
      name: "Pagination amount control",
    });

    expect(select).toHaveDisplayValue("20");
    expect(
      select.querySelector(":scope > button > selectedcontent")
    ).not.toBeNull();
    expect(select.querySelectorAll("option svg")).toHaveLength(4);
  });
});
