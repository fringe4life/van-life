import { describe, expect, it } from "bun:test";
import { VanType } from "~/db/enums";
import { addVanSchema } from "~/features/vans/schema";
import { validateSchema } from "~/utils/errors/parse-schema";
import { pendingVanFromFormData } from "./pending-van-from-form-data";

const validAddVanForm = {
  description: "A rugged camper",
  imageUrl: "https://images.unsplash.com/photo-x?w=300",
  name: "Beach Bum",
  price: "80",
  type: "SIMPLE",
};

const pendingFromForm = (fields: Record<string, string>, clientKey: string) => {
  const validation = validateSchema(addVanSchema, {
    ...validAddVanForm,
    ...fields,
  });
  expect(validation.success).toBe(true);
  if (!validation.success) {
    throw new Error("expected valid add-van form");
  }
  return pendingVanFromFormData(validation.data, clientKey);
};

describe("pendingVanFromFormData", () => {
  it("maps validated add-van output including lowercase rugged type", () => {
    expect(
      pendingFromForm(
        {
          description: "A rugged camper",
          discount: "10",
          imageUrl: "https://images.unsplash.com/photo-x?w=300",
          name: "Beach Bum",
          price: "80",
          type: "rugged",
        },
        "ck-1"
      )
    ).toEqual({
      clientKey: "ck-1",
      description: "A rugged camper",
      discount: 10,
      id: "pending:ck-1",
      imageUrl: "https://images.unsplash.com/photo-x?w=300",
      name: "Beach Bum",
      price: 80,
      slug: "beach-bum",
      status: "pending",
      type: VanType.RUGGED,
    });
  });

  it("treats empty discount as 0", () => {
    expect(pendingFromForm({ discount: "" }, "k").discount).toBe(0);
  });

  it("treats missing discount as 0", () => {
    expect(pendingFromForm({ name: "X" }, "k").discount).toBe(0);
  });

  it("uses schema-coerced padded luxury type", () => {
    expect(pendingFromForm({ type: "  luxury  " }, "k").type).toBe(
      VanType.LUXURY
    );
  });

  it("slugs a padded name without leading hyphen", () => {
    expect(pendingFromForm({ name: " Modest Explorer " }, "k").slug).toBe(
      "modest-explorer"
    );
  });
});
