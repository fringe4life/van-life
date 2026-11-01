import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import { MoneyLedger } from "./money-ledger";

describe("MoneyLedger", () => {
  it("shows the net figure and both directions with their labels", () => {
    const { container, getByText } = render(
      <MoneyLedger
        inflow={38_300}
        inflowLabel="Payments received"
        net={-360}
        netLabel="Net, rentals"
        outflow={38_660}
        outflowLabel="Payments sent"
      />
    );

    expect(getByText("Net, rentals")).toBeInTheDocument();
    expect(getByText("Payments received")).toBeInTheDocument();
    expect(getByText("Payments sent")).toBeInTheDocument();
    expect(getByText("-$360.00")).toBeInTheDocument();
    expect(getByText("$38,300.00")).toBeInTheDocument();
    expect(getByText("-$38,660.00")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-direction]")).toHaveLength(2);
  });
});
