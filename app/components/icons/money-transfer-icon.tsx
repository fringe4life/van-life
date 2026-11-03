import type { ReactElement } from "react";
import { type IconProps, IconShell } from "./icon";
import { moneyInflow, moneyOutflow } from "./money-ink";

/*
 * Rental movement: RENTAL_PAYMENT (#440) and RENTAL_RETURN (#441).
 *
 * `RotateCcw` was the wrong mark on the "Sent" row — a circular back-arrow reads
 * as a refund. This replaces it with a direction arrow: one shaft, and only the
 * head moves, so "Received" and "Sent" are the same gesture reversed and cannot
 * disagree about direction.
 *
 * The banknote that the ticket sketched was tried and rejected at real size. At
 * 14px in the badge the note is about six pixels wide, the head lands on its
 * corner, and the two shapes fuse into a rectangle with a slash. The object was
 * carrying no information the pill does not already state ("Rental" in the
 * badge, "Received" / "Sent" in the card heading), while the direction is the
 * one thing the icon has to deliver. Dropping it gives the arrow the full 24
 * grid, which is what makes it legible at a glance.
 *
 * Static by design, like the wallet pair: no link to hang motion on, no state at
 * 14px, and the card already reveals itself on scroll. The whole mark takes the
 * direction tint, because there is nothing else in the glyph to hold in
 * `currentColor`.
 */

const TAIL = { x: 5.4, y: 18.6 } as const;
const TIP = { x: 18.6, y: 5.4 } as const;
/*
 * Both barbs are the same length and sit at 45° to the shaft. They are long on
 * purpose: at 14px in the badge a 4.4 leg leaves the head as a bend rather than
 * a point, and the tip disappears next to the pill's text. 6.4 keeps the head
 * unmistakable at badge size without touching the shared 1.6 stroke.
 */
const HEAD_LEG = 6.4;

const SHAFT = `M${TAIL.x} ${TAIL.y} ${TIP.x} ${TIP.y}`;

/** Head at the far end: barbs fold back toward the tail, so the arrow leaves. */
const OUT_HEAD = `M${TIP.x - HEAD_LEG} ${TIP.y}H${TIP.x}V${TIP.y + HEAD_LEG}`;
/** Head at the tail end: the same barbs, so the arrow arrives. */
const IN_HEAD = `M${TAIL.x + HEAD_LEG} ${TAIL.y}H${TAIL.x}V${TAIL.y - HEAD_LEG}`;

const DirectionArrow = ({
  direction,
}: {
  direction: "in" | "out";
}): ReactElement => (
  <g className={direction === "in" ? moneyInflow : moneyOutflow}>
    <path d={SHAFT} />
    <path d={direction === "in" ? IN_HEAD : OUT_HEAD} />
  </g>
);

const MoneyInIcon = (props: IconProps): ReactElement => (
  <IconShell {...props}>
    <DirectionArrow direction="in" />
  </IconShell>
);

const MoneyOutIcon = (props: IconProps): ReactElement => (
  <IconShell {...props}>
    <DirectionArrow direction="out" />
  </IconShell>
);

export { MoneyInIcon, MoneyOutIcon };
