import type { ReactElement } from "react";
import { css, cx } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * The three glyphs a button wears while it works, when it lands, and when it
 * does not (#429 – #431).
 *
 * One file and one optical box on purpose: StatusButton swaps them inside an
 * absolutely centred overlay, so any difference in size or weight between them
 * reads as the button jumping mid-action. All three draw on the 24 grid at
 * stroke 2, one step up from the 1.6 the static set uses, because these are the
 * only glyphs that replace a button's entire label — they have to hold the slot
 * that was carrying text.
 *
 * The spinning mark replaces `Loader2`. Two versions were rejected on sight:
 * an open arc, because a lone arc says "unfinished" rather than "working", and
 * a rim with a hub and four treads, which at 20px reads as a dartboard — a
 * closed ring with radial marks is the target you throw at, not something in
 * motion.
 *
 * What is here is a Catherine wheel: a firework named after the wheel it spins
 * on, which is also the travel note the set wanted. Six rays leave a central
 * spark, alternating long and short, so the burst has a three-fold rhythm that
 * moves when it turns. No ring to be a target, no continuous circle to look
 * static: the alternation is what makes one turn visible, and the gap between
 * the spark and the rays is what stops the whole thing blurring into a dot at
 * 20px.
 *
 * The check and the cross answer a press. That is the one case this set allows a
 * beat on an informational surface: the press happened, so the glyph may answer.
 * The check draws on once and holds; the cross snaps in with its second stroke
 * 20ms behind and shakes 2px once. Neither loops — a repeating shake reads as
 * broken rather than as an error. Under `prefers-reduced-motion` every one of
 * them is still complete: the burst stands still, the strokes are already
 * finished, and colour plus `aria-busy` carry the state. That is why no stroke
 * is left dashed in its resting markup.
 */

const STROKE = 2;
const GRID_CENTER = 12;

/*
 * The burst. Rays are placed rather than hand-written so the alternation cannot
 * drift: every other ray is long, which gives the mark its three-fold rhythm
 * and, with it, a readable turn.
 */
const RAY_ANGLES = [15, 75, 135, 195, 255, 315] as const;
const RAY_INNER = 3.4;
const RAY_LONG = 9.4;
const RAY_SHORT = 6.6;
/** The spark sits well inside the rays so the centre never fills in at 20px. */
const SPARK_RADIUS = 1.2;

const round = (value: number): number => Math.round(value * 100) / 100;

const pointAt = (degrees: number, radius: number) => {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: round(GRID_CENTER + radius * Math.cos(radians)),
    y: round(GRID_CENTER + radius * Math.sin(radians)),
  };
};

const buildRays = (): string =>
  RAY_ANGLES.map((angle, index) => {
    const inner = pointAt(angle, RAY_INNER);
    const outer = pointAt(angle, index % 2 === 0 ? RAY_LONG : RAY_SHORT);
    return `M${inner.x} ${inner.y} ${outer.x} ${outer.y}`;
  }).join("");

const RAY_PATH = buildRays();

const CHECK_PATH = "M4.9 12.6 9.7 17.4 19.1 7.2";

/*
 * Two strokes meeting in the middle, each drawn as its own dash. The cross
 * spans 12.8 units rather than the 11.2 it started at: beside the check it was
 * the smaller mark, so on the same 20px slot it also read as the weaker one.
 */
const CROSS_STROKES = ["M5.6 5.6 18.4 18.4", "M18.4 5.6 5.6 18.4"] as const;

/*
 * `pathLength={1}` on every drawn stroke plus `strokeDasharray={1}` in the
 * markup means "one dash covers the path", and `strokeDashoffset={0}` means
 * "the whole dash is showing". Both are presentation attributes, so the running
 * animation overrides them and the finished glyph is what is left when no
 * animation runs at all — the reduced-motion case needs no second rule.
 */
const strokeDefaults = {
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 0,
} as const;

const burst = css({
  _motionReduce: { animationName: "none" },
  animationDuration: "1.05s",
  animationIterationCount: "infinite",
  animationName: "icon-spin",
  animationTimingFunction: "linear",
  transformBox: "view-box",
  transformOrigin: "center",
});

/** The spark is solid: an outlined dot at r 1.2 is a smudge either way. */
const sparkInk = css({ fill: "currentColor", stroke: "none" });

const checkDraw = css({
  _motionReduce: { animationName: "none" },
  animationDelay: "40ms",
  animationDuration: "320ms",
  animationFillMode: "both",
  animationName: "status-stroke-in",
  animationTimingFunction: "springSoft",
});

const crossDraw = css({
  _motionReduce: { animationName: "none" },
  animationDelay: "0ms",
  animationDuration: "160ms",
  animationFillMode: "both",
  animationName: "status-stroke-in",
  animationTimingFunction: "springSoft",
});

/** The second stroke follows the first; the stagger is what reads as a snap. */
const crossTrailing = css({ animationDelay: "20ms" });

const crossShake = css({
  _motionReduce: { animationName: "none" },
  animationDuration: "300ms",
  animationName: "status-cross-shake",
  animationTimingFunction: "air",
  transformBox: "view-box",
  transformOrigin: "center",
});

const SpinnerIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} strokeWidth={STROKE} {...rest}>
    <g className={burst}>
      <path d={RAY_PATH} />
      <circle
        className={sparkInk}
        cx={GRID_CENTER}
        cy={GRID_CENTER}
        r={SPARK_RADIUS}
      />
    </g>
  </IconShell>
);

const CheckIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} strokeWidth={STROKE} {...rest}>
    <path className={checkDraw} d={CHECK_PATH} {...strokeDefaults} />
  </IconShell>
);

const CrossIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} strokeWidth={STROKE} {...rest}>
    <g className={crossShake}>
      <path
        className={cx(crossDraw, crossTrailing)}
        d={CROSS_STROKES[1]}
        {...strokeDefaults}
      />
      <path className={crossDraw} d={CROSS_STROKES[0]} {...strokeDefaults} />
    </g>
  </IconShell>
);

export { CheckIcon, CrossIcon, SpinnerIcon };
