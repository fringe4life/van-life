import { describe, expect, it } from "bun:test";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { shouldRevalidate } from "./host-vans";

const args = (
  actionResult: unknown,
  defaultShouldRevalidate = true
): ShouldRevalidateFunctionArgs =>
  ({ actionResult, defaultShouldRevalidate }) as ShouldRevalidateFunctionArgs;

describe("shouldRevalidate", () => {
  it("skips loader reload after successful add-van with extra payload fields", () => {
    expect(
      shouldRevalidate(
        args({ clientKey: "x", ok: true, van: { name: "Beach Bum" } })
      )
    ).toBe(false);
  });

  it("skips loader reload when success payload has a null prototype", () => {
    const actionResult = Object.create(null);
    actionResult.ok = true;
    actionResult.van = {};
    actionResult.clientKey = "x";

    expect(shouldRevalidate(args(actionResult))).toBe(false);
  });

  it("keeps the default when the action failed", () => {
    expect(shouldRevalidate(args({ ok: false }, true))).toBe(true);
    expect(shouldRevalidate(args({ ok: false }, false))).toBe(false);
  });

  it("keeps the default when actionResult is missing ok", () => {
    expect(shouldRevalidate(args({ van: {} }))).toBe(true);
    expect(shouldRevalidate(args(undefined))).toBe(true);
    expect(shouldRevalidate(args(null))).toBe(true);
  });
});
