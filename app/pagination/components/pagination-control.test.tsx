import { describe, expect, it } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { PaginationControl } from "./pagination-control";
import { PaginationOffsetTransition } from "./pagination-offset-transition";

const items: [{ id: string }, { id: string }] = [
  { id: "01900000-0000-7000-8000-000000000001" },
  { id: "01900000-0000-7000-8000-000000000002" },
];

const renderControl = (hasNextPage: boolean, hasPreviousPage: boolean) =>
  render(
    // The pulse is held by the wrapper, not the pager, so the button needs it.
    <PaginationOffsetTransition>
      <PaginationControl
        items={items}
        paginationMetadata={{ hasNextPage, hasPreviousPage }}
      />
    </PaginationOffsetTransition>,
    {
      wrapper: ({ children }) => (
        <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
      ),
    }
  );

const glyphPathsOf = (name: string): string[] => {
  const button = screen.getByRole("button", { name });
  return Array.from(button.querySelectorAll("svg path")).map(
    (path) => path.getAttribute("d") ?? ""
  );
};

describe("PaginationControl", () => {
  it("draws one custom glyph per direction, each with its shaft", () => {
    renderControl(true, true);

    const previous = glyphPathsOf("Previous page");
    const next = glyphPathsOf("Next page");

    expect(previous).toHaveLength(3);
    expect(next).toHaveLength(3);
    // The arrows are the same three paths; only the direction class differs.
    expect(next).toEqual(previous);
  });

  it("pulses only the pager that was pressed", async () => {
    const user = userEvent.setup();
    renderControl(true, true);

    const nextButton = screen.getByRole("button", { name: "Next page" });
    await user.click(nextButton);

    // The pending direction is what draws the speed lines, and it is stashed
    // inside the navigation transition, so it lands a tick after the click.
    await waitFor(() => {
      expect(nextButton).toHaveAttribute("data-pulse", "true");
    });
    expect(
      screen.getByRole("button", { name: "Previous page" })
    ).not.toHaveAttribute("data-pulse");
  });

  it("keeps each pager bound to its own page flag", () => {
    renderControl(false, true);

    expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });
});
