import reactCompiler from "@acusti/vite-plugin-react-compiler";
import { reactRouter } from "@react-router/dev/vite";
import { varlockCloudflareVitePlugin } from "@varlock/cloudflare-integration";
import { DevTools } from "@vitejs/devtools";
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
  }) satisfies RolldownPlugin;
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
    // Vite 8.2 / 8.3-beta.0 auto-load DevToolsIntegration({ config }).
    // @vitejs/devtools 0.7.1 expects { command, devtools } — crashes build.
    // Re-enable when https://github.com/vitejs/vite/pull/23333 is merged.
    // devtools: {
    //   enabled: true,
    //   environments: ["client", "ssr"],
    // },
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
  };
});
