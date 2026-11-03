/**
 * Glyphs kept in the Space Mono money subset (`bun run fonts:subset-money`).
 *
 * Covers everything `displayPrice()` can emit — digits, `$`, grouping and
 * decimal separators, the negative sign — plus the characters a currency value
 * picks up when it is passed through `Intl.NumberFormat` in other styles
 * (`%`, parentheses) and the two dashes the app uses for negatives and ranges
 * (U+2212, U+2013).
 *
 * Letters are deliberately absent. `/day`, labels and range text stay in Inter:
 * a money span that contained prose would render that prose in the next face of
 * the `mono` stack. Subsetting a face that lands inside an editable control is
 * the same trap — `type="number"` accepts `1e3`, and no glyph list that omits
 * `e` covers it. No money input uses this face.
 *
 * @see https://github.com/fringe4life/van-life/issues/408
 */
export const MONEY_GLYPHS = "$%()+,-./0123456789 \u00A0\u2013\u2212";

const hexCodePoint = (codePoint: number): string =>
  codePoint.toString(16).toUpperCase().padStart(4, "0");

const formatRange = (start: number, end: number): string =>
  start === end
    ? `U+${hexCodePoint(start)}`
    : `U+${hexCodePoint(start)}-${hexCodePoint(end)}`;

/**
 * Compact `unicode-range` descriptor for an `@font-face`.
 *
 * Adjacent code points collapse into one range, so the generated CSS stays
 * short enough to read and diff.
 */
const toUnicodeRange = (glyphs: string): string => {
  const codePoints = new Set<number>();
  for (const glyph of glyphs) {
    const codePoint = glyph.codePointAt(0);
    if (codePoint === undefined) {
      throw new Error("MONEY_GLYPHS contains an empty code point");
    }
    codePoints.add(codePoint);
  }

  const points = [...codePoints].toSorted((left, right) => left - right);
  const [first] = points;
  if (first === undefined) {
    throw new Error("MONEY_GLYPHS must not be empty");
  }

  const ranges: string[] = [];
  let start = first;
  let previous = first;

  for (const point of points.slice(1)) {
    if (point === previous + 1) {
      previous = point;
      continue;
    }
    ranges.push(formatRange(start, previous));
    start = point;
    previous = point;
  }

  ranges.push(formatRange(start, previous));
  return ranges.join(", ");
};

export const MONEY_UNICODE_RANGE = toUnicodeRange(MONEY_GLYPHS);
