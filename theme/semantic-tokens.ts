import { defineSemanticTokens } from "@pandacss/dev";

export const semanticTokens = defineSemanticTokens({
  colors: {
    accent: {
      DEFAULT: {
        value: { _dark: "{colors.umber.800}", base: "{colors.orange.200}" },
      },
      foreground: {
        value: { _dark: "{colors.warmGray.50}", base: "{colors.neutral.900}" },
      },
    },
    background: {
      value: { _dark: "{colors.warmGray.950}", base: "oklch(98% 0.012 75)" },
    },
    border: {
      accent: { value: "{colors.orange.400/60}" },
      DEFAULT: {
        value: {
          _dark: "{colors.warmGray.600}",
          base: "{colors.neutral.900/15}",
        },
      },
      strong: {
        value: {
          _dark: "{colors.warmGray.500}",
          base: "{colors.neutral.600/45}",
        },
      },
      subtle: {
        value: {
          _dark: "{colors.warmGray.700}",
          base: "{colors.neutral.900/10}",
        },
      },
    },
    "brand-decorative": { value: "{colors.orange.400}" },
    card: {
      DEFAULT: {
        value: { _dark: "{colors.warmGray.800}", base: "{colors.white}" },
      },
      foreground: {
        value: { _dark: "{colors.warmGray.50}", base: "{colors.neutral.900}" },
      },
    },
    chart: {
      "1": { value: "{colors.orange.400}" },
      "2": {
        value: { _dark: "{colors.sage.400}", base: "oklch(50% 0.14 150)" },
      },
      "3": {
        value: { _dark: "{colors.warmSky.400}", base: "oklch(37% 0.08 220)" },
      },
      "4": {
        value: { _dark: "{colors.warmAmber.400}", base: "oklch(52% 0.12 85)" },
      },
      "5": {
        value: {
          _dark: "{colors.terracotta.400}",
          base: "{colors.orange.600}",
        },
      },
    },
    destructive: {
      DEFAULT: {
        value: { _dark: "{colors.warmRose.400}", base: "oklch(50% 0.18 25)" },
      },
      foreground: {
        value: { _dark: "{colors.warmRose.950}", base: "{colors.white}" },
      },
    },
    foreground: {
      value: { _dark: "{colors.warmGray.50}", base: "{colors.neutral.900}" },
    },
    heroGradient: {
      end: { value: "{colors.yellow.200}" },
      start: { value: "{colors.indigo.300}" },
      via: { value: "{colors.green.300}" },
    },
    input: {
      background: {
        value: { _dark: "{colors.warmGray.850}", base: "{colors.neutral.200}" },
      },
      DEFAULT: {
        value: {
          _dark: "{colors.warmGray.500}",
          base: "{colors.neutral.600/80}",
        },
      },
      foreground: {
        value: { _dark: "{colors.warmGray.50}", base: "{colors.neutral.900}" },
      },
    },
    muted: {
      DEFAULT: {
        value: { _dark: "{colors.umber.900}", base: "{colors.orange.100}" },
      },
      foreground: {
        value: { _dark: "{colors.warmGray.300}", base: "{colors.neutral.600}" },
      },
    },
    "on-image": { value: "{colors.white}" },
    placeholder: {
      value: { _dark: "{colors.warmGray.400}", base: "{colors.neutral.400}" },
    },
    popover: {
      DEFAULT: {
        value: { _dark: "{colors.warmGray.800}", base: "{colors.white}" },
      },
      foreground: {
        value: { _dark: "{colors.warmGray.50}", base: "{colors.neutral.900}" },
      },
    },
    primary: {
      DEFAULT: { value: "{colors.orange.400}" },
      foreground: {
        value: { _dark: "{colors.umber.950}", base: "{colors.white}" },
      },
    },
    rating: { value: "{colors.orange.400}" },
    ring: { value: "{colors.orange.400}" },
    secondary: {
      DEFAULT: {
        value: { _dark: "{colors.warmGray.100}", base: "{colors.neutral.900}" },
      },
      foreground: {
        value: { _dark: "{colors.warmGray.825}", base: "{colors.white}" },
      },
    },
    skeleton: {
      DEFAULT: {
        value: { _dark: "{colors.warmGray.700}", base: "{colors.gray.300}" },
      },
      highlight: {
        value: { _dark: "{colors.warmGray.600}", base: "{colors.gray.200}" },
      },
    },
    status: {
      new: {
        DEFAULT: {
          value: { _dark: "{colors.warmGray.200}", base: "{colors.van.new}" },
        },
        foreground: {
          value: { _dark: "{colors.warmGray.825}", base: "{colors.white}" },
        },
      },
      repair: {
        DEFAULT: {
          value: {
            _dark: "{colors.warmAmber.400}",
            base: "{colors.van.repair}",
          },
        },
        foreground: {
          value: {
            _dark: "{colors.warmAmber.950}",
            base: "{colors.neutral.900}",
          },
        },
      },
      sale: {
        DEFAULT: {
          value: { _dark: "{colors.sage.400}", base: "{colors.van.sale}" },
        },
        foreground: {
          value: { _dark: "{colors.sage.950}", base: "{colors.white}" },
        },
      },
      unavailable: {
        DEFAULT: {
          value: { _dark: "{colors.warmRose.400}", base: "oklch(50% 0.18 25)" },
        },
        foreground: {
          value: { _dark: "{colors.warmRose.950}", base: "{colors.white}" },
        },
      },
    },
    success: {
      DEFAULT: {
        value: { _dark: "{colors.sage.400}", base: "oklch(50% 0.14 150)" },
      },
      foreground: {
        value: { _dark: "{colors.sage.950}", base: "{colors.white}" },
      },
    },
    surface: {
      accent: {
        value: { _dark: "{colors.umber.800}", base: "{colors.orange.200}" },
      },
      DEFAULT: {
        value: {
          _dark: "{colors.warmGray.900}",
          base: "oklch(97.7% 0.019 74)",
        },
      },
      inverse: {
        DEFAULT: {
          value: { _dark: "{colors.warmGray.975}", base: "oklch(27.4% 0 0)" },
        },
        foreground: {
          value: { _dark: "{colors.warmGray.300}", base: "oklch(82% 0 0)" },
        },
      },
      muted: {
        value: { _dark: "{colors.umber.900}", base: "{colors.orange.100}" },
      },
      overlay: {
        DEFAULT: {
          value: {
            _dark: "{colors.warmGray.800/70.2}",
            base: "rgb(255 255 255 / 0.702)",
          },
        },
        muted: {
          value: {
            _dark: "{colors.warmGray.800/54.9}",
            base: "rgb(255 255 255 / 0.549)",
          },
        },
      },
    },
    type: {
      rugged: {
        DEFAULT: {
          value: { _dark: "{colors.seafoam.400}", base: "{colors.teal.800}" },
        },
        foreground: {
          value: { _dark: "{colors.seafoam.950}", base: "{colors.white}" },
        },
      },
      simple: {
        DEFAULT: {
          value: {
            _dark: "{colors.terracotta.400}",
            base: "{colors.orange.600}",
          },
        },
        foreground: {
          value: { _dark: "{colors.terracotta.950}", base: "{colors.white}" },
        },
      },
    },
    warning: {
      DEFAULT: {
        value: { _dark: "{colors.warmAmber.400}", base: "oklch(52% 0.12 85)" },
      },
      foreground: {
        value: { _dark: "{colors.warmAmber.950}", base: "{colors.white}" },
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
