import { defineConditions } from "@pandacss/dev/define";

export const conditions = defineConditions({
  extend: {
    // Semantic tokens still compile to `.dark { --vars }` only; first-visit
    // OS theme uses the head bootstrap script. This @slot covers `_dark` utilities.
    collectionTwo: "@container collection (min-width: 39.5rem)",
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
    supportsViewTimeline: "@supports (animation-timeline: view())",
  },
});
