import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import { StarGlyph } from "./star-icon";

describe("IconShell", () => {
  it("keeps fill as an attribute so a caller fill class can paint", () => {
    const { container } = render(<StarGlyph />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("fill", "none");
  });
});
