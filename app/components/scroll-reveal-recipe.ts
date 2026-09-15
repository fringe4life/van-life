import { cva, keyframes } from "styled-system/css";

/**
 * Scroll-linked keyframes deliberately include a visible middle plateau. The
 * card is fully readable while it crosses the viewport, then animates back out
 * as the view timeline reaches its exit range.
 */
const scrollLift = keyframes({
  "0%": {
    opacity: 0,
    scale: "var(--scroll-reveal-from-scale)",
    translate: "var(--scroll-reveal-from-x) var(--scroll-reveal-from-y)",
  },
  "18%": {
    opacity: 1,
    scale: 1,
    translate: "0 0",
  },
  "82%": {
    opacity: 1,
    scale: 1,
    translate: "0 0",
  },
  "100%": {
    opacity: 0,
    scale: "var(--scroll-reveal-exit-scale)",
    translate: "var(--scroll-reveal-exit-x) var(--scroll-reveal-exit-y)",
  },
});

const scrollSweep = keyframes({
  "0%": {
    filter: "blur(var(--scroll-reveal-from-blur))",
    opacity: 0,
    translate: "var(--scroll-reveal-from-x) var(--scroll-reveal-from-y)",
  },
  "24%": {
    filter: "blur(0)",
    opacity: 1,
    translate: "0 0",
  },
  "76%": {
    filter: "blur(0)",
    opacity: 1,
    translate: "0 0",
  },
  "100%": {
    filter: "blur(var(--scroll-reveal-exit-blur))",
    opacity: 0,
    translate: "var(--scroll-reveal-exit-x) var(--scroll-reveal-exit-y)",
  },
});

const scrollTilt = keyframes({
  "0%": {
    opacity: 0,
    rotate: "var(--scroll-reveal-from-rotate)",
    scale: "var(--scroll-reveal-from-scale)",
    translate: "var(--scroll-reveal-from-x) var(--scroll-reveal-from-y)",
  },
  "20%": {
    opacity: 1,
    rotate: "0deg",
    scale: 1,
    translate: "0 0",
  },
  "80%": {
    opacity: 1,
    rotate: "0deg",
    scale: 1,
    translate: "0 0",
  },
  "100%": {
    opacity: 0,
    rotate: "var(--scroll-reveal-exit-rotate)",
    scale: "var(--scroll-reveal-exit-scale)",
    translate: "var(--scroll-reveal-exit-x) var(--scroll-reveal-exit-y)",
  },
});

const scrollReveal = cva({
  base: {
    _collectionTwo: {
      _even: {
        "--scroll-reveal-exit-rotate": "-2deg",
        "--scroll-reveal-exit-x": "-2rem",
        "--scroll-reveal-exit-y": "-1.5rem",
        "--scroll-reveal-from-rotate": "2deg",
        "--scroll-reveal-from-x": "2rem",
        "--scroll-reveal-from-y": "1.5rem",
      },
      _odd: {
        "--scroll-reveal-exit-rotate": "2deg",
        "--scroll-reveal-exit-x": "2rem",
        "--scroll-reveal-exit-y": "-1.5rem",
        "--scroll-reveal-from-rotate": "-2deg",
        "--scroll-reveal-from-x": "-2rem",
        "--scroll-reveal-from-y": "1.5rem",
      },
    },
    _even: {
      "--scroll-reveal-exit-blur": "0.5rem",
      "--scroll-reveal-exit-rotate": "-1deg",
      "--scroll-reveal-exit-scale": "0.965",
      "--scroll-reveal-exit-y": "-3.25rem",
      "--scroll-reveal-from-blur": "0.5rem",
      "--scroll-reveal-from-rotate": "1deg",
      "--scroll-reveal-from-scale": "0.965",
      "--scroll-reveal-from-y": "3.25rem",
    },
    _odd: {
      "--scroll-reveal-exit-blur": "0.35rem",
      "--scroll-reveal-exit-rotate": "1deg",
      "--scroll-reveal-exit-scale": "0.97",
      "--scroll-reveal-from-blur": "0.35rem",
      "--scroll-reveal-from-rotate": "-1deg",
      "--scroll-reveal-from-scale": "0.97",
    },
    _supportsViewTimeline: {
      animationDuration: "1ms",
      animationFillMode: "both",
      animationRange: "entry 0% exit 100%",
      animationTimeline: "view()",
    },
    // Keep the progressive-enhancement fallback visible and untransformed.
    "--scroll-reveal-exit-blur": "0px",
    "--scroll-reveal-exit-rotate": "0deg",
    "--scroll-reveal-exit-scale": "0.96",
    "--scroll-reveal-exit-x": "0px",
    "--scroll-reveal-exit-y": "-2.5rem",
    "--scroll-reveal-from-blur": "0px",
    "--scroll-reveal-from-rotate": "0deg",
    "--scroll-reveal-from-scale": "0.96",
    "--scroll-reveal-from-x": "0px",
    "--scroll-reveal-from-y": "2.5rem",
  },
  defaultVariants: {
    variant: "lift",
  },
  variants: {
    variant: {
      lift: {
        _supportsViewTimeline: {
          animationName: scrollLift,
          animationTimingFunction: "springSoft",
        },
      },
      sweep: {
        _supportsViewTimeline: {
          animationName: scrollSweep,
          animationTimingFunction: "glide",
        },
      },
      tilt: {
        _supportsViewTimeline: {
          animationName: scrollTilt,
          animationTimingFunction: "spring",
        },
      },
    },
  },
});

export { scrollReveal };
