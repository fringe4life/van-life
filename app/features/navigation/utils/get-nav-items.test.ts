import { describe, expect, it } from "bun:test";
import { getAuthNavItems } from "./get-nav-items";

describe("getAuthNavItems", () => {
  it("uses a form item for sign out when authenticated", () => {
    const signOut = getAuthNavItems(true).find((item) => item.id === "signout");

    expect(signOut?.type).toBe("form");
  });

  it("omits sign out when signed out", () => {
    const signOut = getAuthNavItems(false).find(
      (item) => item.id === "signout"
    );

    expect(signOut).toBeUndefined();
  });
});
