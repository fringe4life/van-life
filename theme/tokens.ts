import { defineTokens } from "@pandacss/dev/define";

export const tokens = defineTokens({
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
    sage: {
      400: { value: "#83b997" },
      950: { value: "#14251b" },
    },
    seafoam: {
      400: { value: "#7bc0b8" },
      950: { value: "#142724" },
    },
    teal: {
      800: { value: "oklch(43.7% 0.078 188.216)" },
    },
    terracotta: {
      400: { value: "#efa17d" },
      950: { value: "#2e1b12" },
    },
    umber: {
      800: { value: "#3e2f21" },
      900: { value: "#302a22" },
      950: { value: "#24170c" },
    },
    van: {
      new: { value: "oklch(30% 0 0)" },
      repair: { value: "oklch(60% 0.3 85)" },
      sale: { value: "oklch(40% 0.3 142)" },
    },
    warmAmber: {
      400: { value: "#e5b96d" },
      950: { value: "#291e10" },
    },
    warmGray: {
      50: { value: "#f6f0e7" },
      100: { value: "#ded5c8" },
      200: { value: "#c2b7aa" },
      300: { value: "#bcb3a7" },
      400: { value: "#a69b8d" },
      500: { value: "#766c5e" },
      600: { value: "#494238" },
      700: { value: "#39352e" },
      800: { value: "#26241f" },
      825: { value: "#24211d" },
      850: { value: "#201e1a" },
      900: { value: "#1d1c19" },
      950: { value: "#171614" },
      975: { value: "#131210" },
    },
    warmRose: {
      400: { value: "#ef9690" },
      950: { value: "#321511" },
    },
    warmSky: {
      400: { value: "#82b7cd" },
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
});
