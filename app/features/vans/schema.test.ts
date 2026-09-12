import { describe, expect, it } from "bun:test";
import { VanState, VanType } from "~/db/enums";
import { validateSchema } from "~/utils/errors/parse-schema";
import { addVanSchema, vanState, vanType } from "./schema";

const validAddVanForm = {
  description: "A rugged camper",
  imageUrl: "https://images.unsplash.com/photo-x?w=300",
  name: "Beach Bum",
  price: "80",
  type: "SIMPLE",
};

describe("vanType catalog", () => {
  it("lists SIMPLE, RUGGED, then LUXURY", () => {
    expect(vanType.values).toEqual([
      VanType.SIMPLE,
      VanType.RUGGED,
      VanType.LUXURY,
    ]);
  });

  it("parses only exact known members", () => {
    expect(vanType.parse(VanType.SIMPLE)).toBe(VanType.SIMPLE);
    expect(vanType.parse("simple")).toBeNull();
    expect(vanType.parse(" SIMPLE ")).toBeNull();
    expect(vanType.parse(null)).toBeNull();
  });

  it("parseMany keeps exact members and drops misses", () => {
    expect(vanType.parseMany(["SIMPLE", "nope", "RUGGED"])).toEqual([
      VanType.SIMPLE,
      VanType.RUGGED,
    ]);
    expect(vanType.parseMany(["simple"])).toEqual([]);
    expect(vanType.parseMany([])).toEqual([]);
  });
});

describe("vanState catalog", () => {
  it("lists AVAILABLE, IN_REPAIR, then ON_SALE", () => {
    expect(vanState.values).toEqual([
      VanState.AVAILABLE,
      VanState.IN_REPAIR,
      VanState.ON_SALE,
    ]);
  });

  it("parses only exact known members", () => {
    expect(vanState.parse(VanState.ON_SALE)).toBe(VanState.ON_SALE);
    expect(vanState.parse("on_sale")).toBeNull();
    expect(vanState.parse(null)).toBeNull();
  });
});

describe("addVanSchema", () => {
  it("coerces padded and lowercase type strings", () => {
    const luxury = validateSchema(addVanSchema, {
      ...validAddVanForm,
      type: "  luxury  ",
    });
    expect(luxury.success).toBe(true);
    if (luxury.success) {
      expect(luxury.data.type).toBe(VanType.LUXURY);
    }

    const rugged = validateSchema(addVanSchema, {
      ...validAddVanForm,
      type: "rugged",
    });
    expect(rugged.success).toBe(true);
    if (rugged.success) {
      expect(rugged.data.type).toBe(VanType.RUGGED);
    }

    const simple = validateSchema(addVanSchema, {
      ...validAddVanForm,
      type: "simple ",
    });
    expect(simple.success).toBe(true);
    if (simple.success) {
      expect(simple.data.type).toBe(VanType.SIMPLE);
    }
  });

  it("rejects unknown and empty types without falling back", () => {
    expect(
      validateSchema(addVanSchema, { ...validAddVanForm, type: "nope" }).success
    ).toBe(false);
    expect(
      validateSchema(addVanSchema, { ...validAddVanForm, type: "" }).success
    ).toBe(false);
  });

  it("defaults missing or empty discount to 0", () => {
    const missing = validateSchema(addVanSchema, validAddVanForm);
    expect(missing.success).toBe(true);
    if (missing.success) {
      expect(missing.data.discount).toBe(0);
    }

    const empty = validateSchema(addVanSchema, {
      ...validAddVanForm,
      discount: "",
    });
    expect(empty.success).toBe(true);
    if (empty.success) {
      expect(empty.data.discount).toBe(0);
    }
  });
});
