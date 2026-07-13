import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { varlockCloudflareVitePlugin } from "@varlock/cloudflare-integration";
import { DevTools } from "@vitejs/devtools";
import { reactCompilerPreset } from "@vitejs/plugin-react";
// import { reactRouterDevTools } from 'react-router-devtools';
import type { RolldownPlugin } from "rolldown";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

const shouldAnalyze = process.env.VITE_ANALYZE === "true";

function bundleVisualizer(filename: string, title: string): RolldownPlugin {
  return visualizer({
    brotliSize: true,
    filename,
    gzipSize: true,
    open: true,
    title,
  }) as RolldownPlugin;
}

function environmentRolldownOptions(
  statsFilename: string,
  statsTitle: string
): { devtools?: Record<string, never>; plugins: RolldownPlugin[] } {
  return {
    ...(shouldAnalyze ? { devtools: {} } : {}),
    plugins: shouldAnalyze ? [bundleVisualizer(statsFilename, statsTitle)] : [],
  };
}

export default defineConfig(async () => {
  const devtoolsPlugins = await DevTools({
    build: {
      outDir: "build/devtools",
      withApp: shouldAnalyze,
    },
  });

  return {
    build: {
      target: "esnext",
    },
    devtools: {
      enabled: true,
      environments: ["client", "ssr"],
    },
    environments: {
      client: {
        build: {
          rolldownOptions: environmentRolldownOptions(
            "build/client/stats.html",
            "Client Bundle"
          ),
        },
      },
      ssr: {
        build: {
          rolldownOptions: environmentRolldownOptions(
            "build/server/stats.html",
            "Server Bundle"
          ),
        },
      },
    },
    plugins: [
      ...devtoolsPlugins,
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
  };
});
