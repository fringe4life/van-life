import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import type { Status } from "./status-button";
import { StatusButton } from "./status-button";

const renderStatus = (status: Status) =>
  render(
    <StatusButton status={status} type="submit">
      Save
    </StatusButton>
  );

const buttonOf = (): HTMLButtonElement =>
  screen.getByRole("button") as HTMLButtonElement;

describe("StatusButton", () => {
  it("keeps its label and stays enabled when idle", () => {
    const { container } = renderStatus("idle");

    expect(buttonOf().disabled).toBe(false);
    expect(buttonOf().getAttribute("aria-busy")).toBe("false");
    expect(container.querySelector("svg")).toBeNull();
    expect(screen.getByText("Save")).toBeDefined();
  });

  it("swaps the label for a glyph, disables itself and reports busy while pending", () => {
    const { container } = renderStatus("pending");

    expect(buttonOf().disabled).toBe(true);
    expect(buttonOf().getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector("svg")).not.toBeNull();
    // The label stays in the DOM — it is hidden so the button keeps its width.
    expect(screen.getByText("Save")).toBeDefined();
  });

  it("drops aria-busy once the action settles, but stays disabled", () => {
    for (const status of ["success", "error"] as const) {
      const { container, unmount } = renderStatus(status);

      expect(buttonOf().disabled).toBe(true);
      expect(buttonOf().getAttribute("aria-busy")).toBe("false");
      expect(container.querySelector("svg")).not.toBeNull();

      unmount();
    }
  });
});
