import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Your rentals. The key this app already draws on prod (`lucide` key-square,
 * ISC), mirrored so the stepped bit faces the left of the frame and the bow sits
 * at the top left — the prod glyph points the other way, and the bit reads as
 * the near edge of the item when it faces inwards.
 *
 * The mirror is a static attribute on an outer group, so it cannot fight the
 * state transforms: the middle group squishes on hover (about its own centre,
 * `fill-box`) while the inner group holds the turned pose on the current route
 * (about the bow, `view-box`). Two different transform origins, so two groups.
 *
 * Hand-drawing the treads was tried twice and failed both times: a ring on a
 * shaft reads as a stick figure, and the treads only close cleanly against the
 * diagonal if their offsets are solved together, which the existing path
 * already does.
 */

const keyInk = css({
  _groupCurrent: { color: "primary" },
  _groupFocusVisible: {
    animationDuration: "560ms",
    animationName: "icon-squish",
    animationTimingFunction: "spring",
    color: "primary",
  },
  _groupHover: {
    animationDuration: "560ms",
    animationName: "icon-squish",
    animationTimingFunction: "spring",
    color: "primary",
  },
  _motionReduce: { animationName: "none" },
  color: "inherit",
  transformBox: "fill-box",
  transformOrigin: "center",
  transitionDuration: "200ms",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const keyTurn = css({
  _groupCurrent: { rotate: "-8deg" },
  _motionReduce: { rotate: "0deg" },
  transformBox: "view-box",
  transformOrigin: "16.2px 7.7px",
  transitionDuration: "380ms",
  transitionProperty: "rotate",
  transitionTimingFunction: "glide",
});

const KeyIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <g transform="translate(24 0) scale(-1 1)">
      <g className={keyInk} strokeWidth={1.8}>
        <g className={keyTurn}>
          <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z" />
          <path d="m14 7 3 3" />
          <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />
        </g>
      </g>
    </g>
  </IconShell>
);

export { KeyIcon };
