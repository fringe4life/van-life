import type { CSSProperties, ReactNode } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { flex } from "styled-system/patterns";
import { money } from "~/components/ui/figures";
import { displayPrice } from "~/features/vans/utils/display-price";

interface RentalSplitBarProps {
  earnedAsHost: number;
  paidAsRenter: number;
}

/** Each side gets at most half the bar, scaled against the larger of the two. */
const HALF = 50;

const bar = css({
  blockSize: "1.5",
  marginBlockStart: "4",
  position: "relative",
});

const track = css({
  backgroundColor: "border.subtle",
  inset: "0",
  position: "absolute",
  rounded: "xs",
});

const segment = css({
  insetBlock: "0",
  position: "absolute",
  rounded: "xs",
});

const inflow = css({ backgroundColor: "chart.inflow", right: "50%" });

const outflow = css({ backgroundColor: "chart.outflow", left: "50%" });

const spine = css({
  backgroundColor: "border.strong",
  inlineSize: "1px",
  insetBlock: "-3px",
  left: "50%",
  position: "absolute",
});

const captions = flex({ gap: "4", marginBlockStart: "2" });

const caption = css({
  color: "muted.foreground",
  fontSize: "xs",
  fontWeight: "medium",
  inlineSize: "1/2",
  lineHeight: "4",
  margin: "0",
});

/**
 * The figure is the subject of the caption, so it takes the money face; the
 * words that follow stay in the body stack (#408). `normal` weight keeps the
 * CSS honest: system monos typically ship 400 and 700, so an inherited 500
 * would round anyway.
 */
const captionAmount = cx(money, css({ fontWeight: "normal" }));

const earnedCaption = css({ paddingInlineEnd: "3", textAlign: "end" });

const paidCaption = css({ paddingInlineStart: "3" });

/** Computed share of the bar width — a real layout constraint, not a token. */
type SegmentStyle = CSSProperties & { inlineSize: string };

/**
 * `+` only when the figure is an inflow. A sign-flipped total keeps its own
 * minus rather than printing a `+−` that reads as a typo.
 */
const toSignedAmount = (value: number): string =>
  value >= 0 ? `+${displayPrice(value)}` : displayPrice(value);

/**
 * The two-sided split behind "Rentals, both sides" (#411, #453).
 *
 * Plain CSS on purpose: a 6px proportional bar is two positioned segments and a
 * track, so it stays arithmetic and percentages rather than pulling in a chart
 * library for one bar. Lengths are comparable because both sides are divided by
 * the larger value, which is what makes the negative net legible as the shorter
 * side rather than a separate claim.
 */
const RentalSplitBar = ({
  earnedAsHost,
  paidAsRenter,
}: RentalSplitBarProps): ReactNode => {
  /*
   * Stored signs are kept, so `earnedAsHost` goes negative when host-issued
   * returns outweigh payments. A side whose sign has flipped draws nothing
   * rather than a full-length bar in the wrong direction.
   */
  const inflowValue = Math.max(earnedAsHost, 0);
  const outflowValue = Math.max(paidAsRenter, 0);
  const scale = Math.max(inflowValue, outflowValue) || 1;

  const inflowStyle: SegmentStyle = {
    inlineSize: `${(inflowValue / scale) * HALF}%`,
  };
  const outflowStyle: SegmentStyle = {
    inlineSize: `${(outflowValue / scale) * HALF}%`,
  };

  return (
    <div>
      <div aria-hidden="true" className={bar}>
        <div className={track} />
        <div className={cx(segment, inflow)} style={inflowStyle} />
        <div className={cx(segment, outflow)} style={outflowStyle} />
        <div className={spine} />
      </div>
      <div className={captions}>
        <p className={cx(caption, earnedCaption)}>
          <span className={captionAmount}>{toSignedAmount(earnedAsHost)}</span>{" "}
          <span>earned as owner</span>
        </p>
        <p className={cx(caption, paidCaption)}>
          <span className={captionAmount}>{displayPrice(paidAsRenter)}</span>{" "}
          <span>paid as a renter</span>
        </p>
      </div>
    </div>
  );
};

export { RentalSplitBar };
