import { defineConditions } from "@pandacss/dev";

export const conditions = defineConditions({
  extend: {
    // outcomeStateLg: "@container unsuccessful-state (min-width: 52rem)",
    // outcomeStateMd: "@container unsuccessful-state (min-width: 28rem)",
    // Semantic tokens still compile to `.dark { --vars }` only; first-visit
    // OS theme uses the head bootstrap script. This @slot covers `_dark` utilities.
    dark: {
      ".dark &": "@slot",
      "@media (prefers-color-scheme: dark)": {
        ":root:not(.light) &": "@slot",
      },
    },
    groupHasOpenHamburger: ".group\\/hamburger:has([open]) &",
    groupOpenMobileNav: ".group\\/mobile-nav[open] &",
    supportsBaseSelect: "@supports (appearance: base-select)",
    supportsScroll: "@supports (animation-timeline: scroll())",
  },
});
