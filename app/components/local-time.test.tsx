import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { LocalTime } from "./local-time";

const date = new Date("2024-01-15T00:00:00.000Z");

describe("LocalTime", () => {
  it("formats the instant with a machine-readable datetime", () => {
    render(<LocalTime date={date} />);

    const time = screen.getByText(
      new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
        weekday: "short",
        year: "numeric",
      }).format(date)
    );

    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", date.toISOString());
  });
});
