import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Add Van. The frame is structure and never reacts — a plate that jumps about
 * when you hover it is decoration, and a plate that takes the hue competes with
 * the accent pill on the current item.
 *
 * The plus is the action, so the plus is what happens: it drops in from above
 * the plate, overshoots to 1.18 and holds at 1.14 while the pointer is there,
 * taking `primary` on the way down. That reads as something being put into the
 * plate, which is what adding a van is.
 *
 * This item points at the van list without owning a route, so it never becomes
 * current and has no held state. Do not invent one.
 */

const plusInk = css({
  _foc: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-plus-add",
    animationTimingFunction: "spring",
    color: "primary",
  },
  _hov: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-plus-add",
    animationTimingFunction: "spring",
    color: "primary",
  },
  color: "inherit",
  transformBox: "fill-box",
  transformOrigin: "center",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const SquarePlusIcon = ({
  className,
  size,
  ...rest
}: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <rect height="17.2" rx="3.2" width="17.2" x="3.4" y="3.4" />
    <path className={plusInk} d="M12 7.8v8.4M7.8 12h8.4" strokeWidth={1.8} />
  </IconShell>
);

export { SquarePlusIcon };
