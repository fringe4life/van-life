import { css } from "styled-system/css/css";

/*
 * Direction ink for the money glyphs (#439–#442).
 *
 * `chart.inflow` is money arriving (rental payments, wallet deposits) and
 * `chart.outflow` is money leaving (rental returns, withdrawals) — the palette
 * already reserves those two roles for exactly this. Only the moving part of a
 * glyph wears the tint; the note and the line stay `currentColor`, so a badge
 * keeps its single text colour and the family's colour rule lives here rather
 * than in four one-off style props.
 */

const moneyInflow = css({ color: "chart.inflow" });
const moneyOutflow = css({ color: "chart.outflow" });

export { moneyInflow, moneyOutflow };
