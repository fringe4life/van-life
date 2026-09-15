import reactCompiler from "@acusti/vite-plugin-react-compiler";
import { reactRouter } from "@react-router/dev/vite";
import { varlockCloudflareVitePlugin } from "@varlock/cloudflare-integration";
import { defineConfig } from "vite";

const shouldAnalyze = process.env.VITE_ANALYZE === "true";

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
  plugins: [
    varlockCloudflareVitePlugin({ viteEnvironment: { name: "ssr" } }),
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
});
