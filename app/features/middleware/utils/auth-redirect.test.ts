import { describe, expect, it } from "bun:test";
import {
  getLoginRedirectUrl,
  getReturnPathFromUrl,
  getSafeRedirectPath,
} from "./auth-redirect";

describe("getSafeRedirectPath", () => {
  it("leaves normal paths unchanged", () => {
    expect(getSafeRedirectPath("/host/income")).toBe("/host/income");
  });

  it("preserves search params", () => {
    expect(getSafeRedirectPath("/host/vans?page=2")).toBe("/host/vans?page=2");
  });

  it("rejects open redirects", () => {
    expect(getSafeRedirectPath("https://evil.example")).toBe("/host");
    expect(getSafeRedirectPath("//evil.example")).toBe("/host");
  });

  it("rejects auth routes as return targets", () => {
    expect(getSafeRedirectPath("/login")).toBe("/host");
    expect(getSafeRedirectPath("/signup?x=1")).toBe("/host");
  });
});

describe("getReturnPathFromUrl", () => {
  it("uses pathname + search from the normalized URL", () => {
    const url = new URL("http://localhost/host/reviews?tab=recent");
    expect(getReturnPathFromUrl(url)).toBe("/host/reviews?tab=recent");
  });
});

describe("getLoginRedirectUrl", () => {
  it("encodes redirectTo from a safe return path", () => {
    const url = getLoginRedirectUrl("/host/income");
    expect(url).toBe("/login?redirectTo=%2Fhost%2Fincome");
  });
});
