import { describe, expect, it } from "bun:test";
import { array, minLength, object, pipe, string } from "valibot";
import {
  schemaErrorsToFieldErrors,
  validateSchema,
} from "./parse-schema.server";

const nestedSchema = object({
  address: object({
    city: pipe(string(), minLength(1, "city required")),
  }),
});

const listSchema = object({
  items: array(
    object({
      name: pipe(string(), minLength(1, "name required")),
    })
  ),
});

describe("schemaErrorsToFieldErrors", () => {
  it("maps top-level paths onto allowlisted keys", () => {
    const validation = validateSchema(
      object({ email: pipe(string(), minLength(1, "email required")) }),
      { email: "" }
    );

    expect(validation.success).toBe(false);
    if (validation.success) {
      return;
    }

    expect(
      schemaErrorsToFieldErrors(validation.errors, ["email"] as const)
    ).toEqual({ email: "email required" });
  });

  it("keeps nested dot paths when the full key is allowlisted", () => {
    const validation = validateSchema(nestedSchema, { address: { city: "" } });

    expect(validation.success).toBe(false);
    if (validation.success) {
      return;
    }

    expect(
      schemaErrorsToFieldErrors(validation.errors, ["address.city"] as const)
    ).toEqual({ "address.city": "city required" });
  });

  it("falls back to the longest allowlisted prefix", () => {
    const validation = validateSchema(nestedSchema, { address: { city: "" } });

    expect(validation.success).toBe(false);
    if (validation.success) {
      return;
    }

    expect(
      schemaErrorsToFieldErrors(validation.errors, ["address"] as const)
    ).toEqual({ address: "city required" });
  });

  it("maps array item paths onto nested or parent allowlisted keys", () => {
    const validation = validateSchema(listSchema, { items: [{ name: "" }] });

    expect(validation.success).toBe(false);
    if (validation.success) {
      return;
    }

    expect(
      schemaErrorsToFieldErrors(validation.errors, ["items.0.name"] as const)
    ).toEqual({ "items.0.name": "name required" });
    expect(
      schemaErrorsToFieldErrors(validation.errors, ["items.name"] as const)
    ).toEqual({ "items.name": "name required" });
    expect(
      schemaErrorsToFieldErrors(validation.errors, ["items"] as const)
    ).toEqual({ items: "name required" });
  });

  it("drops issues whose path does not match any allowlisted field", () => {
    const validation = validateSchema(nestedSchema, { address: { city: "" } });

    expect(validation.success).toBe(false);
    if (validation.success) {
      return;
    }

    expect(
      schemaErrorsToFieldErrors(validation.errors, ["email"] as const)
    ).toEqual({});
  });
});
