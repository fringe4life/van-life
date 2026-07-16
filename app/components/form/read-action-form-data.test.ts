import { describe, expect, it } from "bun:test";
import { readActionFormData } from "./read-action-form-data";

type ErrorFields = "email" | "password" | "name";
type EchoFields = "email" | "name";

const defaults = {
  email: "guest@example.com",
  name: "",
} as const;

describe("readActionFormData", () => {
  it("returns defaults and empty error fields when data is undefined", () => {
    const result = readActionFormData<ErrorFields, EchoFields, typeof defaults>(
      undefined,
      { defaults }
    );

    expect(result).toEqual({
      fieldErrors: undefined,
      formData: { email: "guest@example.com", name: "" },
      formError: undefined,
      ok: undefined,
    });
  });

  it("keeps defaults on success and surfaces ok: true", () => {
    const result = readActionFormData<ErrorFields, EchoFields, typeof defaults>(
      { ok: true },
      { defaults }
    );

    expect(result).toEqual({
      fieldErrors: undefined,
      formData: { email: "guest@example.com", name: "" },
      formError: undefined,
      ok: true,
    });
  });

  it("merges echoed failure formData over defaults", () => {
    const result = readActionFormData<ErrorFields, EchoFields, typeof defaults>(
      {
        fieldErrors: { email: "Invalid email" },
        formData: { email: "bad@", name: "Ada" },
        formError: "Fix the highlighted fields",
        ok: false,
      },
      { defaults }
    );

    expect(result).toEqual({
      fieldErrors: { email: "Invalid email" },
      formData: { email: "bad@", name: "Ada" },
      formError: "Fix the highlighted fields",
      ok: false,
    });
  });

  it("keeps default when echoed key is missing", () => {
    const result = readActionFormData<ErrorFields, EchoFields, typeof defaults>(
      {
        formData: { email: "echoed@example.com" },
        ok: false,
      },
      { defaults }
    );

    expect(result.formData).toEqual({
      email: "echoed@example.com",
      name: "",
    });
  });

  it("skips undefined echo values so defaults stay", () => {
    const result = readActionFormData<ErrorFields, EchoFields, typeof defaults>(
      {
        formData: { email: undefined, name: "Kept" },
        ok: false,
      },
      { defaults }
    );

    expect(result.formData).toEqual({
      email: "guest@example.com",
      name: "Kept",
    });
  });

  it("returns empty formData object when no defaults and no echo", () => {
    const result = readActionFormData<
      ErrorFields,
      EchoFields,
      Record<string, never>
    >({ ok: false });

    expect(result).toEqual({
      fieldErrors: undefined,
      formData: {},
      formError: undefined,
      ok: false,
    });
  });

  it("does not treat success payload formData as echo", () => {
    const result = readActionFormData<ErrorFields, EchoFields, typeof defaults>(
      { ok: true },
      { defaults }
    );

    expect(result.formData).toEqual({
      email: "guest@example.com",
      name: "",
    });
    expect(result.ok).toBe(true);
  });
});
