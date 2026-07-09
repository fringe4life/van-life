import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { varlockCloudflareVitePlugin } from "@varlock/cloudflare-integration";
// import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

const JSX_FILE_EXTENSION_RE = /\.[jt]sx$/;

export default defineConfig({
  plugins: [
    varlockCloudflareVitePlugin({ viteEnvironment: { name: "ssr" } }),
    // reactRouterDevTools(),
    tsconfigPaths(),
    tailwindcss(),
    babel({
      babelConfig: {
        compact: false,
        plugins: ["babel-plugin-react-compiler"],
        presets: ["@babel/preset-typescript"],
      },
      exclude: [/node_modules/, /workers\//],
      include: /\.[jt]sx?$/,
      loader: (path) => (JSX_FILE_EXTENSION_RE.test(path) ? "jsx" : "js"),
    }),
    reactRouter(),
  ],
  // Vite 8+ (reenable when migrating back)
  // resolve: {
  // 	tsconfigPaths: true,
  // },
  // server: {
  // 	forwardConsole: true,
  // },
  // build: {
  // 	target: 'esnext',
  // },
});
