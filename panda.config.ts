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
    "--chart-axis-height": "23px",
    "--chart-height": "350px",
    "--chart-legend-height": "52px",
    "--chart-text-first-height": "0.875rem",
    "--duration-dialog": "500ms",
    "--footer-height": "100px",
    "--global-font-body": "Inter, ui-sans-serif, system-ui, sans-serif",
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
  importMap: "styled-system",
  include: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/.client/**/*.{js,jsx,ts,tsx}",
    "./app/**/.server/**/*.{js,jsx,ts,tsx}",
  ],
  optimize: {
    removeUnusedKeyframes: false,
    // ENABLE THESE AGAIN AFTER MIGRATION TO PANDACSS IS COMPLETE
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
        "review",
        "card",
        "card-full",
        "collection",
        "mobile-nav",
        "transaction",
        "form",
        "detail",
        "outcome-state",
        "host-nav",
      ],
      containerSizes: {
        "2xl": "44rem",
        content: "64rem",
        lg: "36rem",
        md: "26rem",
        shell: "80rem",
        sm: "12rem",
      },
      fonts: {
        sans: {
          value: "Inter, ui-sans-serif, system-ui, sans-serif",
        },
      },
      keyframes,
      semanticTokens,
      tokens,
      viewTransitions,
    },
  },
});
