import { defineConfig } from "@pandacss/dev/define";
import presetBase from "@pandacss/preset-base";
import presetPanda from "@pandacss/preset-panda";
import { conditions } from "./theme/conditions";
import { globalCss } from "./theme/global-styles";
import { keyframes } from "./theme/keyframes";
import { semanticTokens } from "./theme/semantic-tokens";
import { tokens } from "./theme/tokens";
import { viewTransitions } from "./theme/view-transitions";

export default defineConfig({
  conditions,
  exclude: [],
  globalCss,
  globalVars: {
    "--chart-text-first-height": "0.875rem",
    "--duration-dialog": "500ms",
    "--footer-height": "100px",
    "--header-height": "104px",
    "--mobile-menu-width": "min(100vw, 25rem)",
    "--nav-control-inset-block":
      "calc((var(--header-height) - var(--nav-control-size)) / 2 + 1px)",
    "--nav-control-size": "3rem",
    "--nav-shell-compact-height": "66px",
    "--nav-shell-scroll-offset": "1.125rem",
    "--nav-shell-scroll-range": "5rem",
    "--rating-stars-width":
      "calc(var(--star-size) * var(--star-count) + var(--star-gap) * (var(--star-count) - 1))",
    "--star-count": "5",
    "--star-gap": "0.5rem",
    "--star-size": "1.25rem",
  },
  /*
   * Hash class names, keep token variable names. Hashing the variables too
   * would break every literal `var(--colors-chart-inflow)` the chart and the
   * skeleton hand to `@tanstack/charts`, and buys nothing over the class-name
   * win (docs/research/svg-optimisation.md §3.1).
   */
  hash: { className: true, cssVar: false },
  importMap: "styled-system",
  include: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/.client/**/*.{js,jsx,ts,tsx}",
    "./app/**/.server/**/*.{js,jsx,ts,tsx}",
  ],
  optimize: {
    removeUnusedKeyframes: true,
    removeUnusedStyles: true,
    removeUnusedTokens: true,
    smartCompoundVariants: true,
    treeshakeDesignSystem: true,
  },
  outdir: "styled-system",
  preflight: true,
  presets: [presetBase, presetPanda],
  theme: {
    extend: {
      breakpoints: {
        nav: "68rem",
        xs: "26rem",
      },
      containerNames: [
        "wallet",
        "activity",
        "review",
        "rating-mix",
        "card",
        "card-full",
        "collection",
        "mobile-nav",
        "transaction",
        "form",
        "detail",
        "outcome-state",
        "host-nav",
        "summary",
      ],
      containerSizes: {
        "2xl": "44rem",
        content: "64rem",
        lg: "36rem",
        md: "26rem",
        shell: "80rem",
        sm: "12rem",
      },
      keyframes,
      semanticTokens,
      tokens,
      viewTransitions,
    },
  },
});
