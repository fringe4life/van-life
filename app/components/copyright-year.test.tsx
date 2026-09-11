import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import { CopyrightYear } from "./copyright-year";

describe("CopyrightYear", () => {
  it("renders the viewer-local calendar year", () => {
    const { container } = render(<CopyrightYear />);

    expect(container).toHaveTextContent(String(new Date().getFullYear()));
  });
});
