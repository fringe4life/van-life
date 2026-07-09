/** biome-ignore-all lint/style/useNamingConvention: react router naming convention */
import type { Config } from "@react-router/dev/config";

export default {
  // prerender: ['/', '/about'],
  future: {
    unstable_optimizeDeps: true,
  },
  ssr: true,
} satisfies Config;
