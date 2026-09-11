import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Select } from "./select";

describe("Select", () => {
  it("renders a labeled native select with its options", () => {
    render(
      <Select aria-label="Page size" defaultValue="10">
        <option value="5">5</option>
        <option value="10">10</option>
      </Select>
    );

    const select = screen.getByRole("combobox", { name: "Page size" });

    expect(select).toHaveDisplayValue("10");
    expect(select.querySelector("button")).toBeNull();
    expect(screen.getByRole("option", { name: "5" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
  });
});
