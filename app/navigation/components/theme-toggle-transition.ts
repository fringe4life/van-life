import { keyframes, viewTransition } from "styled-system/css";

/**
 *  "theme-circle-reveal": {
    from: {
      clipPath: "circle(0 at 100% 0)",
    },
    to: {
      clipPath: "circle(150vmax at 100% 0)",
    },
  },
 */

const themeToggleKeyframes = keyframes({
  from: {
    clipPath: "circle(0 at 100% 0)",
  },
  to: {
    clipPath: "circle(150vmax at 100% 0)",
  },
});

const themeTransition = viewTransition({
  group: {
    animationFillMode: "both",
    animationTimingFunction: "glide",
  },
  imagePair: {
    isolation: "auto",
  },
  new: {
    animationDuration: "slow",
    animationFillMode: "both",
    animationName: themeToggleKeyframes,
    animationTimingFunction: "glide",
    display: "block",
    mixBlendMode: "normal",
  },
  old: {
    animationDuration: "slow",
    animationName: "none",
    display: "block",
    mixBlendMode: "normal",
  },
});

export { themeTransition };
