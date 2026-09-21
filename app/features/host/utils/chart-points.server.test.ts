import { describe, expect, it } from "bun:test";
import { toTxnChartPoint, toTxnChartPoints } from "./chart-points.server";

describe("toTxnChartPoint", () => {
  it("labels the bar at UTC minute precision", () => {
    expect(
      toTxnChartPoint(12.4, new Date("2024-01-01T00:00:42.500Z"), "txn-1")
    ).toEqual({
      amount: 12,
      id: "txn-1",
      name: "2024-01-01T00:00",
    });
  });
});

describe("toTxnChartPoints", () => {
  it("aggregates two transaction records within one minute into one bar", () => {
    const points = toTxnChartPoints([
      {
        amount: 10.4,
        createdAt: new Date("2024-01-01T00:00:10.000Z"),
        id: "txn-1",
      },
      {
        amount: 25.4,
        createdAt: new Date("2024-01-01T00:00:50.000Z"),
        id: "txn-2",
      },
      {
        amount: 5,
        createdAt: new Date("2024-01-01T00:01:00.000Z"),
        id: "txn-3",
      },
    ]);

    expect(points).toEqual([
      { amount: 35, id: "txn-1", name: "2024-01-01T00:00" },
      { amount: 5, id: "txn-3", name: "2024-01-01T00:01" },
    ]);
  });
});
