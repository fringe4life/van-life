import type { Configuration } from "lint-staged";

export default {
  "*.{js,jsx,ts,tsx,json,jsonc,css,scss,md,mdx}": () => "bun fix",
  "**/*.{js,jsx,ts,tsx}": () =>
    "bunx react-doctor --staged --blocking warning --no-score -y",
  // Callbacks so lint-staged does not append filenames (tsc/bun test need whole project).
  "**/*.{ts,tsx}": [() => "bun typecheck", () => "bun test"],
} satisfies Configuration;
