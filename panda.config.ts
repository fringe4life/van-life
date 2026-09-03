import { defineConfig, defineViewTransitions } from "@pandacss/dev";
import presetBase from "@pandacss/preset-base";
import presetPanda from "@pandacss/preset-panda";

/**
 * Named bags for viewTransition('authFooter') etc.
 * Panda owns view-transition-class; unique view-transition-name stays on the element.
 */
const viewTransitions = defineViewTransitions({
  authFooter: {
    new: {
      "--fade-from": "0",
      "--slide-y-from": "-1rem",
      animationName: "fade, slide-y",
    },
    old: {
      "--fade-to": "0",
      "--slide-y-to": "1rem",
      animationName: "fade, slide-y",
    },
  },
  authTitle: {
    new: {
      "--fade-from": "0",
      "--slide-x-from": "-1rem",
      animationName: "fade, slide-x",
    },
    old: {
      "--fade-to": "0",
      "--slide-x-to": "1rem",
      animationName: "fade, slide-x",
    },
  },
  sortableTitle: {
    new: {
      "--fade-from": "0",
      "--slide-y-from": "-1rem",
      animationName: "fade, slide-y",
    },
    old: {
      "--fade-to": "0",
      "--slide-y-to": "1rem",
      animationName: "fade, slide-y",
    },
  },
});

export default defineConfig({
  conditions: {
    extend: {
      groupHasOpenHamburger: ".group\\/hamburger:has([open]) &",
      groupOpenMobileNav: ".group\\/mobile-nav[open] &",
      // outcomeStateLg: "@container unsuccessful-state (min-width: 52rem)",
      // outcomeStateMd: "@container unsuccessful-state (min-width: 28rem)",
      supportsScroll: "@supports (animation-timeline: scroll())",
    },
  },
  exclude: [],
  globalCss: {
    ".rating-rail": {
      "--_rating-percent":
        "clamp(0%, calc(var(--rating) / var(--star-count) * 100%), 100%)",
      background:
        "linear-gradient(to top, {colors.rating} 0%, {colors.rating} var(--_rating-percent), {colors.surface.muted} var(--_rating-percent), {colors.surface.muted} 100%)",
    },
    ".rating-star-fill": {
      inlineSize:
        "clamp(0%, calc((var(--rating) - var(--star-index) + 1) * 100%), 100%)",
      insetBlock: "0",
      insetInlineStart: "0",
      overflow: "hidden",
      position: "absolute",
    },
    "h1,h2,h3,h4,h5,h6": {
      textWrap: "balance",
    },
    html: {
      fontFamily: "sans",
      scrollbarGutter: "stable",
      scrollbarWidth: "thin",
    },
    p: {
      textWrap: "pretty",
    },
    "p,h1,h2,h3,h4,h5,h6": {
      overflowWrap: "break-word",
    },
  },
  globalVars: {
    "--chart-content-height":
      "calc(var(--chart-height) - var(--chart-text-height))",
    "--chart-height": "350px",
    "--chart-text-first-height": "1rem",
    "--chart-text-gap": "0.5rem",
    "--chart-text-height":
      "calc(var(--chart-text-top-margin) + var(--chart-text-first-height) + var(--chart-text-gap) + var(--chart-text-second-height))",
    "--chart-text-second-height": "0.75rem",
    "--chart-text-top-margin": "1rem",
    "--duration-dialog": "500ms",
    "--footer-height": "100px",
    "--global-font-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--header-height": "104px",
    "--mobile-menu-width": "min(100vw, 25rem)",
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
    treeshakeDesignSystem: false,
  },
  outdir: "styled-system",
  preflight: true,
  presets: [presetBase, presetPanda],
  theme: {
    extend: {
      breakpoints: {
        xs: "26rem",
      },
      containerNames: [
        "wallet",
        "review",
        "card",
        "card-full",
        "mobile-nav",
        "transaction",
        "form",
        "detail",
        "outcome-state",
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
      keyframes: {
        "bg-opacity": {
          from: {
            backgroundColor: "var(--bg-from, transparent)",
          },
          to: {
            backgroundColor: "var(--bg-to, rgb(0 0 0 / 0.6))",
          },
        },
        fade: {
          from: {
            opacity: "var(--fade-from, 0)",
          },
          to: {
            opacity: "var(--fade-to, 1)",
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
        "scroll-mask": {
          "0%": {
            maskImage:
              "linear-gradient(to right, black 0%, black 5%, black 95%, transparent 100%)",
          },
          "5%,95%": {
            maskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          },
          "100%": {
            maskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, black 100%)",
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
        "slide-x": {
          from: {
            translate: "var(--slide-x-from, 0) 0",
          },
          to: {
            translate: "var(--slide-x-to, 0) 0",
          },
        },
        "slide-y": {
          from: {
            translate: "0 var(--slide-y-from, 0)",
          },
          to: {
            translate: "0 var(--slide-y-to, 0)",
          },
        },
      },
      semanticTokens: {
        colors: {
          accent: {
            DEFAULT: { value: "oklch(91.55% 0.067 73.33)" },
            foreground: { value: "oklch(20.02% 0 0)" },
          },
          background: { value: "oklch(98% 0.012 75)" },
          border: {
            accent: { value: "oklch(75.76% 0.159 55.93 / 0.6)" },
            DEFAULT: { value: "oklch(20.02% 0 0 / 0.15)" },
            strong: { value: "oklch(42.02% 0 0 / 0.45)" },
            subtle: { value: "oklch(20.02% 0 0 / 0.1)" },
          },
          "brand-decorative": { value: "oklch(75.76% 0.159 55.93)" },
          card: {
            DEFAULT: { value: "oklch(100% 0 0)" },
            foreground: { value: "oklch(20.02% 0 0)" },
          },
          chart: {
            "1": { value: "oklch(75.76% 0.159 55.93)" },
            "2": { value: "oklch(50% 0.14 150)" },
            "3": { value: "oklch(37% 0.08 220)" },
            "4": { value: "oklch(52% 0.12 85)" },
            "5": { value: "oklch(68.11% 0.142 38.3)" },
          },
          destructive: {
            DEFAULT: { value: "oklch(50% 0.18 25)" },
            foreground: { value: "oklch(100% 0 0)" },
          },
          foreground: { value: "oklch(20.02% 0 0)" },
          heroGradient: {
            end: { value: "oklch(94.5% 0.129 101.54)" },
            start: { value: "oklch(78.5% 0.115 274.713)" },
            via: { value: "oklch(87.1% 0.15 154.449)" },
          },
          input: {
            background: { value: "oklch(92.2% 0 0)" },
            DEFAULT: { value: "oklch(42.02% 0 0 / 0.8)" },
            foreground: { value: "oklch(20.02% 0 0)" },
          },
          muted: {
            DEFAULT: { value: "oklch(94.72% 0.041 73.17)" },
            foreground: { value: "oklch(42.02% 0 0)" },
          },
          "on-image": { value: "oklch(100% 0 0)" },
          placeholder: { value: "oklch(70.8% 0 0)" },
          popover: {
            DEFAULT: { value: "oklch(100% 0 0)" },
            foreground: { value: "oklch(20.02% 0 0)" },
          },
          primary: {
            DEFAULT: { value: "oklch(75.76% 0.159 55.93)" },
            foreground: { value: "oklch(100% 0 0)" },
          },
          rating: { value: "oklch(75.76% 0.159 55.93)" },
          ring: { value: "oklch(75.76% 0.159 55.93)" },
          secondary: {
            DEFAULT: { value: "oklch(20.02% 0 0)" },
            foreground: { value: "oklch(100% 0 0)" },
          },
          skeleton: {
            DEFAULT: { value: "oklch(87.2% 0.01 258.338)" },
            highlight: { value: "oklch(92.8% 0.006 264.531)" },
          },
          status: {
            new: {
              DEFAULT: { value: "oklch(30% 0 0)" },
              foreground: { value: "oklch(100% 0 0)" },
            },
            repair: {
              DEFAULT: { value: "oklch(60% 0.3 85)" },
              foreground: { value: "oklch(20.02% 0 0)" },
            },
            sale: {
              DEFAULT: { value: "oklch(40% 0.3 142)" },
              foreground: { value: "oklch(100% 0 0)" },
            },
            unavailable: {
              DEFAULT: { value: "oklch(50% 0.18 25)" },
              foreground: { value: "oklch(100% 0 0)" },
            },
          },
          success: {
            DEFAULT: { value: "oklch(50% 0.14 150)" },
            foreground: { value: "oklch(100% 0 0)" },
          },
          surface: {
            accent: { value: "oklch(91.55% 0.067 73.33)" },
            DEFAULT: { value: "oklch(97.7% 0.019 74)" },
            inverse: {
              DEFAULT: { value: "oklch(27.4% 0 0)" },
              foreground: { value: "oklch(82% 0 0)" },
            },
            muted: { value: "oklch(94.72% 0.041 73.17)" },
            overlay: {
              DEFAULT: { value: "rgb(255 255 255 / 0.702)" },
              muted: { value: "rgb(255 255 255 / 0.549)" },
            },
          },
          type: {
            rugged: {
              DEFAULT: { value: "oklch(43.7% 0.078 188.216)" },
              foreground: { value: "oklch(100% 0 0)" },
            },
            simple: {
              DEFAULT: { value: "oklch(68.11% 0.142 38.3)" },
              foreground: { value: "oklch(100% 0 0)" },
            },
          },
          warning: {
            DEFAULT: { value: "oklch(52% 0.12 85)" },
            foreground: { value: "oklch(100% 0 0)" },
          },
        },
        radii: {
          control: { value: "4px" },
          lg: { value: "0.625rem" },
          md: { value: "0.5rem" },
          sm: { value: "0.375rem" },
          xl: { value: "0.75rem" },
        },
        spacing: {
          "padding-inline": {
            value: {
              base: "0.75rem",
              md: "3rem",
            },
          },
        },
      },
      tokens: {
        colors: {
          gray: {
            200: { value: "oklch(92.8% 0.006 264.531)" },
            300: { value: "oklch(87.2% 0.01 258.338)" },
          },
          green: {
            300: { value: "oklch(87.1% 0.15 154.449)" },
          },
          indigo: {
            300: { value: "oklch(78.5% 0.115 274.713)" },
          },
          neutral: {
            400: { value: "oklch(70.8% 0 0)" },
            600: { value: "oklch(42.02% 0 0)" },
            900: { value: "oklch(20.02% 0 0)" },
          },
          orange: {
            100: { value: "oklch(94.72% 0.041 73.17)" },
            200: { value: "oklch(91.55% 0.067 73.33)" },
            400: { value: "oklch(75.76% 0.159 55.93)" },
            600: { value: "oklch(68.11% 0.142 38.3)" },
          },
          teal: {
            800: { value: "oklch(43.7% 0.078 188.216)" },
          },
          van: {
            new: { value: "oklch(30% 0 0)" },
            repair: { value: "oklch(60% 0.3 85)" },
            sale: { value: "oklch(40% 0.3 142)" },
          },
          yellow: {
            200: { value: "oklch(94.5% 0.129 101.54)" },
          },
        },
        easings: {
          glide: {
            value:
              "linear(0,0.013 1%,0.051 2.2%,0.404 9.8%,0.51 12.6%,0.602 15.5%,0.683 18.7%,0.754 22.2%,0.813 26%,0.861 30.2%,0.9 34.8%,0.931 40%,0.972 52.7%,0.992 70.2%,1 100%)",
          },
          spring: {
            value:
              "linear(0,0.009,0.035 2.1%,0.141 4.4%,0.281 6.7%,0.723 12.9%,0.938 16.7%,1.017,1.077,1.121,1.149 24.3%,1.159,1.163,1.161,1.154 29.9%,1.129 32.8%,1.051 39.6%,1.017 43.1%,0.991,0.977 51%,0.974 53.8%,0.975 57.1%,0.997 69.8%,1.003 76.9%,1.004 83.8%,1 100%)",
          },
          springSoft: {
            value:
              "linear(0,0.006,0.025 2.8%,0.101 6.1%,0.539 18.9%,0.721 25.3%,0.849 31.5%,0.937 38.1%,0.968 41.8%,0.991 45.7%,1.006 50.1%,1.015 55%,1.017 63.9%,1.001 100%)",
          },
        },
        fontSizes: {
          "2xs": { value: "0.5rem" },
        },
        fonts: {
          sans: {
            value: "Inter, ui-sans-serif, system-ui, sans-serif",
          },
        },
        lineHeights: {
          "4": { value: "1rem" },
          "5": { value: "1.25rem" },
          "6": { value: "1.5rem" },
          "7": { value: "1.75rem" },
          "8": { value: "2rem" },
          "9": { value: "2.25rem" },
          "10": { value: "2.5rem" },
        },
        sizes: {
          "1/2": { value: "50%" },
          "1/8": { value: "12.5%" },
          "3/4": { value: "75%" },
          "3xs": { value: "16rem" },
          content: { value: "64rem" },
          shell: { value: "80rem" },
        },
      },
      viewTransitions,
    },
  },
});
