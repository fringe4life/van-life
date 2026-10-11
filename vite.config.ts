import reactCompiler from "@acusti/vite-plugin-react-compiler";
import pandacss from "@pandacss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { varlockCloudflareVitePlugin } from "@varlock/cloudflare-integration";
import { defineConfig } from "vite";

const shouldAnalyze = process.env.VITE_ANALYZE === "true";

const optimizeDepsInclude = [
  "valibot",
  "lucide-react",
  "date-fns",
  "@tanstack/charts",
] as const;

export default defineConfig({
  build: {
    target: "esnext",
  },
  devtools: {
    apply: shouldAnalyze ? "all" : "serve",
    build: {
      outDir: "build/devtools",
      withApp: shouldAnalyze,
    },
    environments: ["client", "ssr"],
  },
  optimizeDeps: {
    include: [...optimizeDepsInclude],
  },
  plugins: [
    varlockCloudflareVitePlugin({ viteEnvironment: { name: "ssr" } }),
    pandacss({ transform: true }),
    // React Router owns JSX/HMR — do not add @vitejs/plugin-react's react()
    reactRouter(),
    reactCompiler(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    forwardConsole: true,
  },
  ssr: {
    optimizeDeps: {
      include: [...optimizeDepsInclude],
    },
  },
});
