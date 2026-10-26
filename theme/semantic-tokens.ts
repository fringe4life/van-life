import { defineSemanticTokens } from "@pandacss/dev/define";

/** Single CSS color; `light-dark()` follows used `color-scheme` (OS or `data-theme`). */
const color = (base: string, dark = base) => ({
  value: dark === base ? base : `light-dark(${base}, ${dark})`,
});

export const semanticTokens = defineSemanticTokens({
  colors: {
    accent: {
      DEFAULT: color("{colors.orange.200}", "{colors.umber.800}"),
      foreground: color("{colors.neutral.900}", "{colors.warmGray.50}"),
    },
    border: {
      accent: color("{colors.orange.400/60}"),
      DEFAULT: color("{colors.neutral.900/15}", "{colors.warmGray.600}"),
      strong: color("{colors.neutral.600/45}", "{colors.warmGray.500}"),
      subtle: color("{colors.neutral.900/10}", "{colors.warmGray.700}"),
    },
    card: {
      DEFAULT: color("{colors.white}", "{colors.warmGray.800}"),
      foreground: color("{colors.neutral.900}", "{colors.warmGray.50}"),
    },
    chart: {
      "1": color("{colors.orange.400}"),
      "2": color("oklch(50% 0.14 150)", "{colors.sage.400}"),
      "3": color("oklch(37% 0.08 220)", "{colors.warmSky.400}"),
      "4": color("oklch(52% 0.12 85)", "{colors.warmAmber.400}"),
      "5": color("{colors.orange.600}", "{colors.terracotta.400}"),
    },
    destructive: {
      DEFAULT: color("oklch(50% 0.18 25)", "{colors.warmRose.400}"),
      foreground: color("{colors.white}", "{colors.warmRose.950}"),
    },
    foreground: color("{colors.neutral.900}", "{colors.warmGray.50}"),
    input: {
      background: color("{colors.neutral.200}", "{colors.warmGray.850}"),
      DEFAULT: color("{colors.neutral.600/80}", "{colors.warmGray.500}"),
      foreground: color("{colors.neutral.900}", "{colors.warmGray.50}"),
    },
    muted: {
      foreground: color("{colors.neutral.600}", "{colors.warmGray.300}"),
    },
    "on-image": color("{colors.white}"),
    placeholder: color("{colors.neutral.400}", "{colors.warmGray.400}"),
    popover: {
      DEFAULT: color("{colors.white}", "{colors.warmGray.800}"),
      foreground: color("{colors.neutral.900}", "{colors.warmGray.50}"),
    },
    primary: {
      DEFAULT: color("{colors.orange.400}"),
      foreground: color("{colors.white}", "{colors.umber.950}"),
    },
    rating: color("{colors.orange.400}"),
    ring: color("{colors.orange.400}"),
    secondary: {
      DEFAULT: color("{colors.neutral.900}", "{colors.warmGray.100}"),
      foreground: color("{colors.white}", "{colors.warmGray.825}"),
    },
    skeleton: {
      DEFAULT: color("{colors.gray.300}", "{colors.warmGray.700}"),
      highlight: color("{colors.gray.200}", "{colors.warmGray.600}"),
    },
    status: {
      new: {
        DEFAULT: color("{colors.van.new}", "{colors.warmGray.200}"),
        foreground: color("{colors.white}", "{colors.warmGray.825}"),
      },
      repair: {
        DEFAULT: color("{colors.van.repair}", "{colors.warmAmber.400}"),
        foreground: color("{colors.neutral.900}", "{colors.warmAmber.950}"),
      },
      sale: {
        DEFAULT: color("{colors.van.sale}", "{colors.sage.400}"),
        foreground: color("{colors.white}", "{colors.sage.950}"),
      },
      unavailable: {
        DEFAULT: color("oklch(50% 0.18 25)", "{colors.warmRose.400}"),
        foreground: color("{colors.white}", "{colors.warmRose.950}"),
      },
    },
    success: {
      DEFAULT: color("oklch(50% 0.14 150)", "{colors.sage.400}"),
      foreground: color("{colors.white}", "{colors.sage.950}"),
    },
    surface: {
      accent: color("{colors.orange.200}", "{colors.umber.800}"),
      DEFAULT: color("oklch(97.7% 0.019 74)", "{colors.warmGray.900}"),
      inverse: {
        DEFAULT: color("oklch(27.4% 0 0)", "{colors.warmGray.975}"),
        foreground: color("oklch(82% 0 0)", "{colors.warmGray.300}"),
      },
      muted: color("{colors.orange.100}", "{colors.umber.900}"),
      overlay: {
        DEFAULT: color(
          "rgb(255 255 255 / 0.702)",
          "{colors.warmGray.800/70.2}"
        ),
        muted: color("rgb(255 255 255 / 0.549)", "{colors.warmGray.800/54.9}"),
      },
    },
    type: {
      rugged: {
        DEFAULT: color("{colors.teal.800}", "{colors.seafoam.400}"),
        foreground: color("{colors.white}", "{colors.seafoam.950}"),
      },
      simple: {
        DEFAULT: color("{colors.orange.600}", "{colors.terracotta.400}"),
        foreground: color("{colors.white}", "{colors.terracotta.950}"),
      },
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
});
