import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { type IconProps, IconShell } from "./icon";

/*
 * Outcome state: error.
 *
 * Static by decision: the state is already the loudest thing on the page —
 * destructive rail, destructive primary action, assertive announcement — and a
 * shaking mark on top of that is panic rather than information. There is
 * nothing to collapse under reduced motion because nothing moves.
 *
 * The outline keeps the pack's rounded-corner triangle, because that shape is
 * doing real work: it is recognisable at 20px on a saturated field, where a
 * straight-cornered triangle looks like a warning label. The exclamation is
 * filled `glyph.amber` rather than stroked, which is what keeps it legible
 * white-on-red, and it is one unit heavier than the frame so the mark reads
 * before the shape does.
 */

const alertInk = css({
  fill: "glyph.amber",
  stroke: "none",
});

const alertStroke = css({ strokeWidth: "1.7" });

const TriangleAlertIcon = ({
  className,
  size,
  ...rest
}: IconProps): ReactElement => (
  <IconShell className={cx(alertStroke, className)} size={size} {...rest}>
    <path d="m21.73 18.2-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21.2h16a2 2 0 0 0 1.73-3" />
    <rect
      className={alertInk}
      height="5.6"
      rx="1.2"
      width="2.2"
      x="10.9"
      y="9"
    />
    <circle className={alertInk} cx="12" cy="17.4" r="1.2" />
  </IconShell>
);

export { TriangleAlertIcon };
