import { defineKeyframes } from "@pandacss/dev/define";

export const keyframes = defineKeyframes({
  "fade-in": {
    from: {
      filter: "blur(2px)",
      opacity: "0",
    },
    to: {
      filter: "blur(0px)",
      opacity: "1",
    },
  },
  "fade-out": {
    from: {
      filter: "blur(2px)",
      opacity: "1",
    },
    to: {
      filter: "blur(0px)",
      opacity: "0",
    },
  },
  scale: {
    from: {
      scale: "var(--scale-from, 0)",
    },
    to: {
      scale: "var(--scale-to, 1)",
    },
  },
  shimmer: {
    from: {
      backgroundPosition: "-200% 0",
    },
    to: {
      backgroundPosition: "200% 0",
    },
  },
  "slide-in": {
    from: {
      translate: "var(--slide-distance)",
    },
    to: {
      translate: "0 0",
    },
  },
  "slide-in-y": {
    from: {
      translate: "0 var(--slide-distance-y)",
    },
    to: {
      translate: "0 0",
    },
  },
  "slide-out": {
    from: {
      translate: "0 0",
    },
    to: {
      translate: "var(--slide-distance)",
    },
  },
  "slide-out-y": {
    from: {
      translate: "0 0",
    },
    to: {
      translate: "0 var(--slide-distance-y)",
    },
  },
});
