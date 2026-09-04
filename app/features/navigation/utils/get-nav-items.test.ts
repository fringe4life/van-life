import { describe, expect, it } from "bun:test";
import { getNavItems } from "./get-nav-items";

describe("getNavItems", () => {
  it("uses a form item for sign out when authenticated", () => {
    const signOut = getNavItems(true).auth.find(
      (item) => item.id === "signout"
    );

    expect(signOut?.type).toBe("form");
  });

  it("omits sign out when signed out", () => {
    const signOut = getNavItems(false).auth.find(
      (item) => item.id === "signout"
    );

    expect(signOut).toBeUndefined();
  });
});
