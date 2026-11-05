import { css } from "styled-system/css";
import { buttonVariants } from "~/components/ui/button-variants";

/**
 * The footer spans all three shell columns, so it has to rebuild the shell's
 * inline inset itself: the band carries the grid gutter and the track carries
 * the same padding the nav uses. Both are `padding-inline`, which is what keeps
 * the footer's content edge flush with the header's at every width.
 */
const footerBandClassName = css({
  backgroundColor: "surface.inverse",
  color: "surface.inverse.foreground",
  gridArea: "footer",
  paddingInline: "padding-inline",
});

const footerTrackClassName = css({
  inlineSize: "100%",
  marginInline: "auto",
  maxInlineSize: "shell",
  paddingBlock: { base: "4", md: "5" },
  paddingInline: "padding-inline",
});

/**
 * Below `lg` the row fits as many columns as the width allows instead of
 * switching layout at a breakpoint. A fixed two-column base stacked 745px into
 * a 553px footer, and 300px columns did not fit the 566px a 768px viewport
 * leaves once both insets are paid — 260 is the width the artwork and the link
 * pair genuinely need. `auto-fit` collapses the empty track, so the two blocks
 * share whatever is left.
 */
const footerGridClassName = css({
  columnGap: { base: "6", lg: "10", md: "8" },
  display: "grid",
  gridTemplateColumns: {
    base: "repeat(auto-fit, minmax(260px, 1fr))",
    lg: "400px minmax(0, 1fr)",
    xl: "400px minmax(0, 1fr) auto",
  },
  rowGap: { base: "6", md: "0" },
});

/**
 * The artwork is a 1200-square whose content is `x 50 → 1150`, `y 306 → 893`
 * (from `getBBox()`), so a square source in a wider frame with `cover` only
 * crops vertically: the window is `1200 × frameHeight / frameWidth`, and the van
 * needs 587 of those units. Any fixed height therefore breaks the moment the
 * frame gets wider — a full-width 649px block at 745px showed 333 units of a
 * 587-unit van, cutting it in half. Locking the frame to the artwork's own
 * aspect holds the window at 720 units (587 of van, ~66 of air) at every width,
 * and `5 / 3` also reads in the layout: the block stops growing at 400px.
 */
const brandFrameClassName = css({
  aspectRatio: "5 / 3",
  maxInlineSize: "400px",
  overflow: "hidden",
  position: "relative",
});

const vanArtClassName = css({
  blockSize: "100%",
  filter: "grayscale(1)",
  inlineSize: "100%",
  inset: "0",
  objectFit: "cover",
  objectPosition: "center",
  pointerEvents: "none",
  position: "absolute",
  userSelect: "none",
});

/* The hero's answer to copy over imagery: a blurred plate rather than a shadow. */
const glassPanelClassName = css({
  alignItems: "flex-start",
  backdropBlur: "sm",
  backdropFilter: "auto",
  backgroundColor: "surface/75",
  borderColor: "on-image/30",
  borderRadius: "lg",
  borderStyle: "solid",
  borderWidth: "1px",
  bottom: "3",
  display: "flex",
  flexDirection: "column",
  gap: "2",
  left: "3",
  padding: "3",
  position: "absolute",
});

const wordmarkClassName = css({
  color: "foreground",
  fontSize: { base: "2xl", lg: "3xl" },
  fontWeight: "bold",
  letterSpacing: "0.01em",
  lineHeight: "none",
  textTransform: "uppercase",
});

const ctaClassName = buttonVariants({ size: "lg" });

const blurbClassName = css({
  alignSelf: { xl: "center" },
  color: "surface.inverse.foreground/80",
  display: { base: "none", xl: "block" },
  fontSize: "sm",
  lineHeight: "relaxed",
  maxInlineSize: "42ch",
});

const groupClassName = css({
  alignContent: "start",
  display: "grid",
  gap: "3",
});

/**
 * Explore and Account travel as one unit so the pair can hug the right edge,
 * the same edge the copyright and the theme toggle sit on. Left to separate
 * tracks they each took an equal share of the row and left a dead column after
 * the longest link. The pair only goes flush once the row is wide enough to
 * carry it; on a phone the two groups start at the text edge.
 */
const linkClusterClassName = css({
  columnGap: { base: "8", md: "10" },
  display: "flex",
  flexWrap: "wrap",
  justifyContent: { base: "start", md: "end", sm: "end" },
  rowGap: "6",
});

const groupLabelClassName = css({
  backgroundColor: "surface.inverse.foreground/10",
  clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)",
  color: "surface.inverse.foreground",
  fontSize: "xs",
  fontWeight: "medium",
  inlineSize: "fit-content",
  letterSpacing: "0.14em",
  paddingBlock: "1",
  paddingInline: "2",
  textTransform: "uppercase",
});

const listClassName = css({
  display: "flex",
  flexDirection: "column",
  listStyleType: "none",
  margin: "0",
  padding: "0",
});

const footerLinkClassName = css({
  _focusVisible: {
    outlineColor: "ring",
    outlineOffset: "3px",
    outlineStyle: "solid",
    outlineWidth: "3px",
  },
  _hover: { color: "surface.inverse.foreground" },
  alignItems: "center",
  blockSize: "7",
  color: "surface.inverse.foreground/85",
  display: "inline-flex",
  fontSize: "sm",
  textUnderlineOffset: "4px",
  transitionDuration: "fast",
  transitionProperty: "color",
});

const imprintRowClassName = css({
  alignItems: "center",
  borderBlockStartColor: "surface.inverse.foreground/15",
  borderBlockStartStyle: "solid",
  borderBlockStartWidth: "1px",
  columnGap: "3",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBlockStart: { base: "4", md: "5" },
  paddingBlockStart: "3",
  rowGap: "3",
});

const copyrightClassName = css({
  color: "surface.inverse.foreground/70",
  fontSize: "xs",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
});

export {
  blurbClassName,
  brandFrameClassName,
  copyrightClassName,
  ctaClassName,
  footerBandClassName,
  footerGridClassName,
  footerLinkClassName,
  footerTrackClassName,
  glassPanelClassName,
  groupClassName,
  groupLabelClassName,
  imprintRowClassName,
  linkClusterClassName,
  listClassName,
  vanArtClassName,
  wordmarkClassName,
};
