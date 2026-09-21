import { defineGlobalStyles } from "@pandacss/dev/define";

export const globalCss = defineGlobalStyles({
  ".rating-rail": {
    "--_rating-fill": "var(--rating-band-color, {colors.rating})",
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
  "h1,h2,h3,h4,h5,h6": {
    textWrap: "balance",
  },
  html: {
    fontFamily: "sans",
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
