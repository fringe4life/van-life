import { defineConditions } from "@pandacss/dev/define";

/**
 * Short keys (#466 B): Panda embeds the condition name in every atom class.
 * Keep the selector strings; only the keys (and `_key` props) are abbreviated.
 */
export const conditions = defineConditions({
  extend: {
    collectionTwo: "@container collection (min-width: 39.5rem)",
    /** `aria-current="page"` on `.group` */
    cur: ".group[aria-current='page'] &",
    // `_dark` utilities: explicit override or OS when no light override.
    dark: {
      "[data-theme=dark] &": "@slot",
      "@media (prefers-color-scheme: dark)": {
        ":root:not([data-theme=light]) &": "@slot",
      },
    },
    /**
     * Compact filter disclosure expanded. Summary chevron/count read `open`
     * from the owning `<details>`.
     */
    dis: ".group\\/filter-disclosure[open] &",
    /**
     * Keyboard focus on the owning control. Segmented controls put focus on
     * the radio inside `<label class="group">`, so `:has()` matches those.
     */
    foc: ".group:focus-visible &, .group:has(:focus-visible) &",
    /** Theme / segmented control holding this value (`data-held`). */
    held: ".group[data-held='true'] &",
    /** Hamburger `<details>` open inside `.group/hamburger`. */
    hmb: ".group\\/hamburger:has([open]) &",
    hov: ".group:hover &",
    /** Mobile nav `<details>` open. */
    nmv: ".group\\/mobile-nav[open] &",
    /**
     * Press still in flight (`data-pulse`). Held for a minimum time and while
     * the next slice loads so glyph speed lines match the gesture.
     */
    pul: ".group[data-pulse='true'] &",
    /** `prefers-reduced-motion: reduce` */
    red: "@media (prefers-reduced-motion: reduce)",
    supportsBaseSelect: "@supports (appearance: base-select)",
    supportsScroll: "@supports (animation-timeline: scroll())",
    supportsViewTimeline: "@supports (animation-timeline: view())",
    /**
     * Transaction header row can hold its badge word beside the title.
     * Measured on the row, not the card.
     */
    transactionHeadWide: "@container transaction-head (min-width: 12rem)",
  },
});
