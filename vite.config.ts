import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import babel from "vite-plugin-babel";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    babel({
      filter: /\.tsx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      external: ['@prisma/client'],
    }
  },
   resolve: {
    alias: {
      '@prisma/client': resolve(__dirname, 'app/generated/'),
    },
  }
});