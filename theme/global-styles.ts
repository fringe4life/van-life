import { defineGlobalStyles } from "@pandacss/dev/define";

export const globalCss = defineGlobalStyles({
  ".rating-rail": {
    "--_rating-fill": "{colors.rating}",
    "--_rating-percent":
      "clamp(0%, calc(var(--rating) / var(--star-count) * 100%), 100%)",
    background:
      "linear-gradient(to top, var(--_rating-fill) 0%, var(--_rating-fill) var(--_rating-percent), {colors.surface.muted} var(--_rating-percent), {colors.surface.muted} 100%)",
  },
  ".rating-star-fill": {
    inlineSize:
      "clamp(0%, calc((var(--rating) - var(--star-index) + 1) * 100%), 100%)",
    insetBlock: "0",
    insetInlineStart: "0",
    overflow: "hidden",
    position: "absolute",
  },
  /**
   * React `<ViewTransition>` does not honour `prefers-reduced-motion`. Kill
   * the CSS VT animations so named morphs still swap content without motion.
   * @see https://react.dev/reference/react/ViewTransition#always-check-prefers-reduced-motion
   */
  "@media (prefers-reduced-motion: reduce)": {
    "::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)":
      {
        animation: "none !important",
      },
    /**
     * Glyph motion (#412). A glyph part animates from `.group:hover`,
     * `.group:focus-visible` or an ancestor attribute selector, so a reset at a
     * single class loses the cascade and the part keeps moving. This is the
     * whole set's guard, one media query rather than a branch per glyph, and it
     * is scoped to SVG descendants so no ordinary surface loses its transition.
     * Colour still lands: it snaps instead of easing.
     */
    "svg :is(g, path, line, polyline, polygon, circle, rect, ellipse)": {
      animation: "none !important",
      transitionDuration: "0.01ms !important",
    },
  },
  /**
   * The body face comes from the token, not from a copied stack (#451). Panda's
   * preset declares `body { font-family: var(--global-font-body, ...) }`, so the
   * override has to be a real declaration here — this rule wins on source order.
   */
  body: {
    fontFamily: "sans",
  },
  /**
   * Compression from the token scale (#476). The geometric-humanist stack sets
   * wider than Inter at display size, so the tracking goes negative where the
   * glyph is large and nearly neutral where it is not. The value also has to
   * survive Avenir, Montserrat, Corbel and URW Gothic, which are not the same
   * width as each other: −0.022em is the one number that leaves all four
   * legible at 40px. Call sites that set their own `letterSpacing` (eyebrows,
   * host nav) still win — utilities beat this rule.
   */
  "h1,h2,h3": {
    letterSpacing: "display",
    textWrap: "balance",
  },
  "h4,h5,h6": {
    letterSpacing: "title",
    textWrap: "balance",
  },
  html: {
    // Attribute on `:root`, or `:has` if `data-theme` is on a descendant.
    "&[data-theme=dark], &:has([data-theme=dark])": {
      colorScheme: "dark",
    },
    "&[data-theme=light], &:has([data-theme=light])": {
      colorScheme: "light",
    },
    colorScheme: "light dark",
    fontFamily: "sans",
    /**
     * Weight comes from the cut the face ships (#476). Off, `medium` and `bold`
     * resolve to the nearest real cut instead of a smeared fake one, so a
     * heading reads the same weight on Corbel as on Montserrat. `medium` is the
     * heaviest accent the stack all honours — no call site asks for 600. The cost is
     * stated in `docs/typography.md`: on URW Gothic a 400 request has nowhere
     * to go but 300, and on Avenir 600 and 700 both land on 800.
     */
    fontSynthesis: "none",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
  },
  p: {
    textWrap: "pretty",
  },
  "p,h1,h2,h3,h4,h5,h6": {
    overflowWrap: "break-word",
  },
});
