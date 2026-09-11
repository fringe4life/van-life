import { afterEach, describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
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
  afterEach(() => {
    globalThis.getComputedStyle = originalGetComputedStyle;
    console.error = originalConsoleError;
  });

  it("renders limit options without density icons when base-select is unsupported", () => {
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
    globalThis.getComputedStyle = ((
      element: Element,
      pseudoElt?: string | null
    ) => {
      if (element instanceof HTMLSelectElement && !element.isConnected) {
        return { appearance: "base-select" } as CSSStyleDeclaration;
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
