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
    groupCurrent: ".group[aria-current='page'] &",
    groupFocusVisible: ".group:focus-visible &",
    groupHasOpenHamburger: ".group\\/hamburger:has([open]) &",
    /*
     * "This control is holding this value." The theme glyphs light on this
     * marker rather than on a checked radio: the compact header trigger owns the
     * value without containing the input that set it — it is a button, and a
     * radio inside a button would be invalid markup.
     */
    groupHeld: ".group[data-held='true'] &",
    groupHover: ".group:hover &",
    groupOpenMobileNav: ".group\\/mobile-nav[open] &",
    /*
     * "This control was pressed and is still in flight." Held by React for a
     * minimum time (the pager is faster than the eye), and kept on while the
     * next slice is loading, so the glyph's speed lines run for as long as the
     * gesture is still real.
     */
    groupPulse: ".group[data-pulse='true'] &",
    motionReduce: "@media (prefers-reduced-motion: reduce)",
    supportsBaseSelect: "@supports (appearance: base-select)",
    supportsScroll: "@supports (animation-timeline: scroll())",
    supportsViewTimeline: "@supports (animation-timeline: view())",
  },
});
