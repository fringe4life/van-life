import { describe, expect, it } from "bun:test";
import {
  getFetcherStatus,
  getNavigationFormStatus,
} from "./get-fetcher-status";

describe("getFetcherStatus", () => {
  it("returns pending while fetcher is busy", () => {
    expect(getFetcherStatus("submitting")).toBe("pending");
    expect(getFetcherStatus("loading", { ok: true })).toBe("pending");
  });

  it("returns pending when transition is pending even if idle", () => {
    expect(
      getFetcherStatus("idle", { ok: true }, { isTransitionPending: true })
    ).toBe("pending");
  });

  it("maps idle + ok discriminant to success / error / idle", () => {
    expect(getFetcherStatus("idle", { ok: true })).toBe("success");
    expect(getFetcherStatus("idle", { ok: false })).toBe("error");
    expect(getFetcherStatus("idle")).toBe("idle");
    expect(getFetcherStatus("idle", null)).toBe("idle");
    expect(getFetcherStatus("idle", {})).toBe("idle");
  });
});

describe("getNavigationFormStatus", () => {
  it("returns pending for this form's submitting / loading navigation", () => {
    expect(getNavigationFormStatus("submitting")).toBe("pending");
    expect(getNavigationFormStatus("loading", { ok: true })).toBe("pending");
    expect(
      getNavigationFormStatus(
        "submitting",
        { ok: false },
        {
          isFormNavigation: true,
        }
      )
    ).toBe("pending");
  });

  it("ignores unrelated navigation when isFormNavigation is false", () => {
    expect(
      getNavigationFormStatus(
        "loading",
        { ok: true },
        {
          isFormNavigation: false,
        }
      )
    ).toBe("success");

    expect(
      getNavigationFormStatus(
        "submitting",
        { ok: false },
        {
          isFormNavigation: false,
        }
      )
    ).toBe("error");

    expect(
      getNavigationFormStatus("loading", undefined, {
        isFormNavigation: false,
      })
    ).toBe("idle");
  });

  it("maps idle + ok discriminant to success / error / idle", () => {
    expect(getNavigationFormStatus("idle", { ok: true })).toBe("success");
    expect(getNavigationFormStatus("idle", { ok: false })).toBe("error");
    expect(getNavigationFormStatus("idle")).toBe("idle");
    expect(getNavigationFormStatus("idle", null)).toBe("idle");
    expect(getNavigationFormStatus("idle", {})).toBe("idle");
  });

  it("defaults isFormBusy from navigationState when option omitted", () => {
    // submitting → isFormBusy true → pending
    expect(getNavigationFormStatus("submitting", { ok: true })).toBe("pending");
    // idle → isFormBusy false → read actionData
    expect(getNavigationFormStatus("idle", { ok: true })).toBe("success");
  });
});
