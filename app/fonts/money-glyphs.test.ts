import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { displayPrice } from "~/features/vans/utils/display-price";
import { MONEY_GLYPHS, MONEY_UNICODE_RANGE } from "./money-glyphs";

/**
 * The subset is only correct while it covers what `displayPrice()` can emit.
 * Nothing about `Intl.NumberFormat` guarantees that — a currency style change,
 * another locale, or a long magnitude can introduce a character the woff2 does
 * not carry, and the symptom is a single glyph dropping into the next face mid
 * number (#449).
 *
 * The sibling repo shipped this test and it is what surfaced a missing exponent
 * letter. Keep the amounts representative rather than exhaustive: zero, cents,
 * a thousands separator, a negative and a large magnitude between them exercise
 * every branch the formatter has.
 */
const REPRESENTATIVE_AMOUNTS = [
  0, 0.05, 4, 12.5, 1234.56, -1234.56, 999_999.99,
] as const;

const toCoveredRange = (char: string): string =>
  `U+${(char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0")}`;

describe("money glyph coverage", () => {
  test("every character displayPrice emits is inside MONEY_GLYPHS", () => {
    const uncovered = new Set<string>();

    for (const amount of REPRESENTATIVE_AMOUNTS) {
      for (const char of displayPrice(amount)) {
        if (!MONEY_GLYPHS.includes(char)) {
          uncovered.add(`${char} (${toCoveredRange(char)})`);
        }
      }
    }

    expect([...uncovered]).toEqual([]);
  });

  test("the unicode range collapses adjacent code points", () => {
    expect(MONEY_UNICODE_RANGE).toBe(
      "U+0020, U+0024-0025, U+0028-0029, U+002B-0039, U+00A0, U+2013, U+2212"
    );
  });

  test("both committed faces declare the generated range", () => {
    const css = readFileSync(path.resolve("app/fonts/money/money.css"), "utf8");

    // One `unicode-range` per weight (400 and 700). A regenerated subset that
    // grew a glyph without the CSS following it fails here.
    expect(css.split(MONEY_UNICODE_RANGE)).toHaveLength(3);
  });
});
