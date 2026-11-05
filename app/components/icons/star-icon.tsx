import { type ReactElement, useId } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Reviews. The one glyph whose fill *is* its state: the outline stays ink in
 * every state and the fill takes `rating`, because the star already means a
 * score. Nothing here is ever tinted `primary`.
 *
 * Hover bounces the body to 1.08 while a four-point sparkle appears above the
 * upper edge for one beat. The current route holds the fill and runs a 6s
 * glint, clipped to the star so the sweep cannot leak past the outline.
 *
 * `StarGlyph` below is the same drawing without any of that: it is what the
 * rating rail and the tally run render, where up to 48 identical stars would be
 * paint cost without an audience.
 */

const STAR_PATH =
  "M12 2.9 14.35 9.06 20.94 9.4 15.8 13.54 17.53 19.9 12 16.3 6.48 19.9 8.2 13.54 3.06 9.4 9.65 9.06Z";

const SPARKLE_PATH =
  "M19.6 2.6 20.32 3.48 21.2 4.2 20.32 4.92 19.6 5.8 18.88 4.92 18 4.2 18.88 3.48Z";

const starBody = css({
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-overshoot",
    animationTimingFunction: "spring",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-overshoot",
    animationTimingFunction: "spring",
  },
  transformBox: "fill-box",
  transformOrigin: "center",
});

const starFill = css({
  _cur: { fillOpacity: "0.85" },
  _foc: { fillOpacity: "0.85" },
  _hov: { fillOpacity: "0.85" },
  fill: "rating",
  fillOpacity: "0",
  stroke: "none",
  transitionDuration: "normal",
  transitionProperty: "fill-opacity",
  transitionTimingFunction: "air",
});

const starSparkle = css({
  _foc: {
    animationDuration: "slow",
    animationFillMode: "forwards",
    animationName: "icon-sparkle",
    animationTimingFunction: "air",
  },
  _hov: {
    animationDuration: "slow",
    animationFillMode: "forwards",
    animationName: "icon-sparkle",
    animationTimingFunction: "air",
  },
  fill: "rating",
  opacity: "0",
  stroke: "none",
  transformBox: "fill-box",
  transformOrigin: "center",
});

const starGlint = css({
  /*
   * The glint is a sweep, not a mark: with the animation gone there is nothing
   * worth showing, and a static bar across the star reads as a scratch. So the
   * reduced-motion endpoint of this state is absence — stated inside the state
   * that owns it, which keeps the selector at the state's own weight.
   */
  _cur: {
    _red: { opacity: "0" },
    animationDuration: "6s",
    animationIterationCount: "infinite",
    animationName: "icon-glint",
    animationTimingFunction: "linear",
    opacity: "1",
  },
  color: "warmAmber.400",
  opacity: "0",
});

const StarIcon = ({ className, size, ...rest }: IconProps): ReactElement => {
  const clipId = useId();

  return (
    <IconShell className={className} size={size} {...rest}>
      <clipPath id={clipId}>
        <path d={STAR_PATH} />
      </clipPath>
      <g className={starBody}>
        <path d={STAR_PATH} />
        <path className={starFill} d={STAR_PATH} />
        <g clipPath={`url(#${clipId})`}>
          <line
            className={starGlint}
            strokeWidth={1.5}
            x1="9.4"
            x2="14.6"
            y1="17.6"
            y2="12.4"
          />
        </g>
      </g>
      <path className={starSparkle} d={SPARKLE_PATH} />
    </IconShell>
  );
};

/**
 * The same star with none of the state (#423). The rail and the tally run draw
 * this instead of `StarIcon`; both are static by decision — forty-eight
 * identical glyphs cannot each carry a beat, and a glyph bobbing inside a row
 * of measurements reads as noise rather than as life.
 *
 * Only the paths are shared, which is the point: the rail, the tally and the
 * nav must read as the same star. Fill and stroke stay the caller's, so the
 * rail's `--rating` clip keeps working exactly as it did.
 */
const StarGlyph = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <path d={STAR_PATH} />
  </IconShell>
);

export { StarGlyph, StarIcon };
