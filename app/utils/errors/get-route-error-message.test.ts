import { describe, expect, it } from "bun:test";
import { isRouteErrorResponse } from "react-router";
import { getRouteErrorMessage } from "./get-route-error-message";

const DEFAULT_FALLBACK = "An unknown error occurred.";

function routeError(
  overrides: { data?: unknown; status?: number; statusText?: string } = {}
) {
  return {
    data: overrides.data ?? null,
    internal: false,
    status: overrides.status ?? 404,
    statusText: overrides.statusText ?? "Not Found",
  };
}

describe("getRouteErrorMessage", () => {
  it("returns string data from a route error and ignores statusText", () => {
    const error = routeError({
      data: "Van not found",
      statusText: "Not Found",
    });

    expect(isRouteErrorResponse(error)).toBe(true);
    expect(getRouteErrorMessage(error)).toBe("Van not found");
  });

  it.each([
    { data: { reason: "gone" }, label: "object" },
    { data: 42, label: "number" },
  ] as const)(
    "returns statusText when route error data is a $label",
    ({ data }) => {
      expect(
        getRouteErrorMessage(routeError({ data, statusText: "Not Found" }))
      ).toBe("Not Found");
    }
  );

  it("returns the default fallback when route error has non-string data and empty statusText", () => {
    expect(
      getRouteErrorMessage(
        routeError({ data: { reason: "gone" }, statusText: "" })
      )
    ).toBe(DEFAULT_FALLBACK);
  });

  it("returns a custom fallback when route error has empty statusText", () => {
    expect(
      getRouteErrorMessage(routeError({ data: 1, statusText: "" }), {
        fallback: "Could not load vans",
      })
    ).toBe("Could not load vans");
  });

  it("returns Error.message for a thrown Error", () => {
    expect(getRouteErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns errorFallback instead of Error.message when provided", () => {
    expect(
      getRouteErrorMessage(new Error("boom"), {
        errorFallback: "Could not load",
      })
    ).toBe("Could not load");
  });

  it.each(["nope", null, {}] as const)(
    "returns the default fallback for unknown value %p",
    (value) => {
      expect(getRouteErrorMessage(value)).toBe(DEFAULT_FALLBACK);
    }
  );

  it("returns a custom fallback for unknown values", () => {
    expect(getRouteErrorMessage("nope", { fallback: "Something broke" })).toBe(
      "Something broke"
    );
  });
});
