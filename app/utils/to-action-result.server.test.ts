import { describe, expect, it } from "bun:test";
import { err, ok } from "~/utils/service-result.server";
import { toActionResultOrThrow } from "~/utils/to-action-result.server";

interface FailurePayload {
  fieldErrors?: Partial<Record<string, string>>;
  formData?: Partial<Record<string, string>>;
  formError: string;
  ok: false;
}

interface DataResult<TData = FailurePayload> {
  data: TData;
  init: { status: number };
  type: "DataWithResponseInit";
}

function asDataResult<TData = FailurePayload>(
  value: unknown
): DataResult<TData> {
  return value as DataResult<TData>;
}

describe("toActionResultOrThrow", () => {
  it("returns null on success so caller can continue", () => {
    expect(toActionResultOrThrow(ok({ id: "van_1" }))).toBeNull();
  });

  it("throws notFound (404) for not_found", () => {
    expect(() =>
      toActionResultOrThrow(err({ kind: "not_found", message: "Van gone" }))
    ).toThrow();

    try {
      toActionResultOrThrow(err({ kind: "not_found", message: "Van gone" }));
    } catch (thrown) {
      const result = asDataResult<string>(thrown);
      expect(result.type).toBe("DataWithResponseInit");
      expect(result.init.status).toBe(404);
      expect(result.data).toBe("Van gone");
    }
  });

  it.each([
    "forbidden",
    "unavailable",
    "insufficient_funds",
    "invalid_input",
  ] as const)("maps %s → badRequest (400)", (kind) => {
    const result = asDataResult(
      toActionResultOrThrow(err({ kind, message: `${kind} boom` }))
    );

    expect(result.type).toBe("DataWithResponseInit");
    expect(result.init.status).toBe(400);
    expect(result.data).toEqual({
      formError: `${kind} boom`,
      ok: false,
    });
  });

  it("maps conflict → conflict (409)", () => {
    const result = asDataResult(
      toActionResultOrThrow(
        err({ kind: "conflict", message: "Already rented" })
      )
    );

    expect(result.init.status).toBe(409);
    expect(result.data).toEqual({
      formError: "Already rented",
      ok: false,
    });
  });

  it("maps internal → internalError (500)", () => {
    const result = asDataResult(
      toActionResultOrThrow(err({ kind: "internal", message: "DB melted" }))
    );

    expect(result.init.status).toBe(500);
    expect(result.data).toEqual({
      formError: "DB melted",
      ok: false,
    });
  });

  it("forwards fieldErrors and formData extras onto client failures", () => {
    const extras = {
      fieldErrors: { amount: "Too low" },
      formData: { amount: "1" },
    };

    const result = asDataResult(
      toActionResultOrThrow(
        err({ kind: "insufficient_funds", message: "Need more coin" }),
        extras
      )
    );

    expect(result.init.status).toBe(400);
    expect(result.data).toEqual({
      fieldErrors: { amount: "Too low" },
      formData: { amount: "1" },
      formError: "Need more coin",
      ok: false,
    });
  });

  it("forwards extras onto conflict and internal too", () => {
    const extras = {
      fieldErrors: { slug: "Taken" },
      formData: { slug: "desert-dream" },
    };

    const conflictResult = asDataResult(
      toActionResultOrThrow(
        err({ kind: "conflict", message: "Slug taken" }),
        extras
      )
    );
    expect(conflictResult.init.status).toBe(409);
    expect(conflictResult.data.fieldErrors).toEqual({ slug: "Taken" });
    expect(conflictResult.data.formData).toEqual({ slug: "desert-dream" });

    const internalResult = asDataResult(
      toActionResultOrThrow(err({ kind: "internal", message: "Nope" }), extras)
    );
    expect(internalResult.init.status).toBe(500);
    expect(internalResult.data.fieldErrors).toEqual({ slug: "Taken" });
  });
});
