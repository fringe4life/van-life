import { describe, expect, it } from "bun:test";
import { resolveSiteOrigin } from "./get-site-origin.server";

const publicRequest = new Request("https://van-life.org/");
const localRequest = new Request("http://localhost:5173/");

describe("resolveSiteOrigin", () => {
  it("uses a public request when SITE_URL is the localhost default", () => {
    expect(resolveSiteOrigin("http://localhost:5173", publicRequest)).toBe(
      "https://van-life.org"
    );
  });

  it("keeps a configured public SITE_URL", () => {
    expect(resolveSiteOrigin("https://van-life.org", localRequest)).toBe(
      "https://van-life.org"
    );
  });

  it("uses the request origin for local development", () => {
    expect(resolveSiteOrigin("http://localhost:5173", localRequest)).toBe(
      "http://localhost:5173"
    );
  });
});
