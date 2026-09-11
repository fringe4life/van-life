import { describe, expect, it } from "bun:test";
import { VanType } from "~/db/enums";
import { pendingVanFromFormData } from "./pending-van-from-form-data";

const form = (fields: Record<string, string> = {}): FormData => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }
  return data;
};

describe("pendingVanFromFormData", () => {
  it("maps a full valid form including lowercase rugged type", () => {
    expect(
      pendingVanFromFormData(
        form({
          description: "A rugged camper",
          discount: "10",
          imageUrl: "https://example.com/van.jpg",
          name: "Beach Bum",
          price: "80",
          type: "rugged",
        }),
        "ck-1"
      )
    ).toEqual({
      clientKey: "ck-1",
      description: "A rugged camper",
      discount: 10,
      id: "pending:ck-1",
      imageUrl: "https://example.com/van.jpg",
      name: "Beach Bum",
      price: 80,
      slug: "beach-bum",
      status: "pending",
      type: VanType.RUGGED,
    });
  });

  it("defaults empty FormData to blank pending van", () => {
    expect(pendingVanFromFormData(new FormData(), "abc")).toEqual({
      clientKey: "abc",
      description: "",
      discount: 0,
      id: "pending:abc",
      imageUrl: "",
      name: "",
      price: 0,
      slug: "",
      status: "pending",
      type: VanType.SIMPLE,
    });
  });

  it("treats empty discount as 0", () => {
    expect(pendingVanFromFormData(form({ discount: "" }), "k").discount).toBe(
      0
    );
  });

  it("treats missing discount as 0", () => {
    expect(pendingVanFromFormData(form({ name: "X" }), "k").discount).toBe(0);
  });

  it("falls back to SIMPLE for invalid type", () => {
    expect(pendingVanFromFormData(form({ type: "nope" }), "k").type).toBe(
      VanType.SIMPLE
    );
  });

  it("parses padded luxury type", () => {
    expect(pendingVanFromFormData(form({ type: "  luxury  " }), "k").type).toBe(
      VanType.LUXURY
    );
  });

  it("slugs a padded name without leading hyphen", () => {
    expect(
      pendingVanFromFormData(form({ name: " Modest Explorer " }), "k").slug
    ).toBe("modest-explorer");
  });
});
