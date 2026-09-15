import { defineViewTransitions } from "@pandacss/dev";

/**
 * Shared vertical fade/slide recipes. Consumers choose the ViewTransition
 * trigger (`enter`, `exit`, `share`, or `update`) for their use case.
 */
export const viewTransitions = defineViewTransitions({
  fadeSlide: {
    new: {
      "--slide-distance-y": "-1rem",
      animationName: "fade-in, slide-in-y",
    },
    old: {
      "--slide-distance-y": "1rem",
      animationName: "fade-out, slide-out-y",
    },
  },
  fadeSlideSubtle: {
    new: {
      "--slide-distance-y": "-0.5rem",
      animationName: "fade-in, slide-in-y",
    },
    old: {
      "--slide-distance-y": "0.5rem",
      animationName: "fade-out, slide-out-y",
    },
  },
  hero: {
    new: {
      "--scale-from": "0.5",
      "--slide-distance": "-100vh",
      animationName: "fade-in, scale, slide-in",
    },
    old: {
      "--scale-to": "0.5",
      "--slide-distance": "100vh",
      animationName: "fade-out, scale, slide-out",
    },
  },
});
