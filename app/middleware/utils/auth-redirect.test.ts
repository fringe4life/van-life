import { describe, expect, it } from "bun:test";
import { href } from "react-router";
import {
  getLoginRedirectUrl,
  getReturnPathFromUrl,
  getSafeRedirectPath,
} from "./auth-redirect";

describe("getSafeRedirectPath", () => {
  it("leaves normal paths unchanged", () => {
    const rentalActivity = href("/host/rental-activity");
    expect(getSafeRedirectPath(rentalActivity)).toBe(rentalActivity);
  });

  it("preserves search params", () => {
    const vansWithPage = `${href("/host/vans")}?page=2`;
    expect(getSafeRedirectPath(vansWithPage)).toBe(vansWithPage);
  });

  it("rejects open redirects", () => {
    expect(getSafeRedirectPath("https://evil.example")).toBe(href("/host"));
    expect(getSafeRedirectPath("//evil.example")).toBe(href("/host"));
  });

  it("rejects auth routes as return targets", () => {
    expect(getSafeRedirectPath(href("/login"))).toBe(href("/host"));
    expect(getSafeRedirectPath(`${href("/signup")}?x=1`)).toBe(href("/host"));
    expect(getSafeRedirectPath(href("/signout"))).toBe(href("/host"));
  });
});

describe("getReturnPathFromUrl", () => {
  it("uses pathname + search from the normalized URL", () => {
    const returnPath = `${href("/host/review")}?tab=recent`;
    const url = new URL(`http://localhost${returnPath}`);
    expect(getReturnPathFromUrl(url)).toBe(returnPath);
  });
});

describe("getLoginRedirectUrl", () => {
  it("encodes redirectTo from a safe return path", () => {
    const returnPath = href("/host/rental-activity");
    const url = getLoginRedirectUrl(returnPath);
    const params = new URLSearchParams({ redirectTo: returnPath });
    expect(url).toBe(`${href("/login")}?${params}`);
  });
});
