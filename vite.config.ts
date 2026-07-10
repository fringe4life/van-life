import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { varlockCloudflareVitePlugin } from "@varlock/cloudflare-integration";
import { reactCompilerPreset } from "@vitejs/plugin-react";
// import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    varlockCloudflareVitePlugin({ viteEnvironment: { name: "ssr" } }),
    // reactRouterDevTools(),
    tailwindcss(),
    // React Router owns JSX/HMR — import only reactCompilerPreset, not react()
    reactRouter(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    forwardConsole: true,
  },
});
