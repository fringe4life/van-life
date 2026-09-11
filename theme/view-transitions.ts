import { defineViewTransitions } from "@pandacss/dev";

/**
 * Named bags for viewTransition('authFooter') etc.
 * Panda owns view-transition-class; unique names live on React `<ViewTransition name>`.
 */
export const viewTransitions = defineViewTransitions({
  authFooter: {
    new: {
      "--slide-distance-y": "-1rem",
      animationName: "fade-in, slide-in-y",
    },
    old: {
      "--slide-distance-y": "1rem",
      animationName: "fade-out, slide-out-y",
    },
  },
  authTitle: {
    new: {
      "--slide-distance": "-1rem",
      animationName: "fade-in, slide-in",
    },
    old: {
      "--slide-distance": "1rem",
      animationName: "fade-out, slide-out",
    },
  },
  deferred: {
    new: {
      "--slide-distance-y": "4px",
      animationName: "fade-in, slide-in-y",
    },
    old: {
      "--slide-distance-y": "4px",
      animationName: "fade-out, slide-out-y",
    },
  },
  sortableTitle: {
    new: {
      "--slide-distance-y": "-1rem",
      animationName: "fade-in, slide-in-y",
    },
    old: {
      "--slide-distance-y": "1rem",
      animationName: "fade-out, slide-out-y",
    },
  },
  vanDescription: {
    new: {
      "--slide-distance-y": "1rem",
      animationName: "fade-in, slide-in-y",
    },
    old: {
      "--slide-distance-y": "1rem",
      animationName: "fade-out, slide-out-y",
    },
  },
});
