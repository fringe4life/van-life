import { defineConditions } from "@pandacss/dev/define";

export const conditions = defineConditions({
  extend: {
    collectionTwo: "@container collection (min-width: 39.5rem)",
    // `_dark` utilities: explicit override or OS when no light override.
    dark: {
      "[data-theme=dark] &": "@slot",
      "@media (prefers-color-scheme: dark)": {
        ":root:not([data-theme=light]) &": "@slot",
      },
    },
    groupHasOpenHamburger: ".group\\/hamburger:has([open]) &",
    groupOpenMobileNav: ".group\\/mobile-nav[open] &",
    supportsBaseSelect: "@supports (appearance: base-select)",
    supportsScroll: "@supports (animation-timeline: scroll())",
    supportsViewTimeline: "@supports (animation-timeline: view())",
  },
});
