# Native React Compiler Setup

Guide for the current Vite 8 + `@acusti/vite-plugin-react-compiler` configuration (Rust `oxc-transform-react`, not Babel).

## Current Stack

| Package | Version / role |
|---------|----------------|
| Vite | 8.x (rolldown) |
| React Router | 8.x framework mode (`reactRouter()` plugin) |
| Compiler plugin | `@acusti/vite-plugin-react-compiler` |
| Compiler runtime | `oxc-transform-react` (pinned by the plugin) |
| Config | [`vite.config.ts`](../vite.config.ts) |

React Router owns JSX transform and Fast Refresh. Do **not** add `@vitejs/plugin-react`'s `react()` plugin alongside `reactRouter()` — that causes double HMR and `RefreshRuntime already declared` errors.

Cannot use `react({ compiler: true })` from `@vitejs/plugin-react` for the same reason. The acusti plugin is the framework-mode path: compiler pass only, JSX left to Vite/oxc (`jsx: 'preserve'`).

## Current Configuration

```ts
import reactCompiler from "@acusti/vite-plugin-react-compiler";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    // ...other plugins (varlock, devtools)
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
```

**Plugin order:** `reactRouter()` then `reactCompiler()`. The compiler plugin uses `enforce: 'pre'` and default `memoize: true`, so client + SSR environment transforms of the same file only compile once.

## Why this stack

- Completes the Vite 8 all-native oxc/rolldown pipeline (no Babel parse/print on every source file)
- Tracks React Compiler main via `oxc-transform-react` rather than `babel-plugin-react-compiler@1.0.0`
- Default `target: '19'` and `panicThreshold: 'none'` match this app's React 19 canary
- Official `@vitejs/plugin-react` `compiler: true` path requires `react()`, which fights `reactRouter()`

## Performance Tuning

### `compilationMode: "annotation"`

Opt-in compiler only on `"use memo"` components:

```ts
reactCompiler({
  compiler: { compilationMode: "annotation" },
}),
```

### Custom filters

```ts
reactCompiler({
  exclude: [/node_modules/, /\.stories\./],
}),
```

Defaults: `include: /\.[jt]sx?$/`, `exclude: /[/\\]node_modules[/\\]/`.

## Notes

1. **`future.v8_viteEnvironmentApi` is removed in React Router 8.** The Vite Environment API is always enabled; no flag needed on `reactRouter()`.

2. **`@acusti/vite-plugin-react-compiler@0.5.0` exists** but is blocked here by `bunfig.toml` `minimumReleaseAge` (3 days). Stay on `0.4.0` until the age gate passes, then bump.

3. Verify compiler output in React DevTools (✨ memo badge) or by looking for `__COMPILER_RUNTIME.c` in transformed modules.

## References

- [`vite.config.ts`](../vite.config.ts) — live configuration
- [`react-router.config.ts`](../react-router.config.ts) — `unstable_optimizeDeps`
- [React Compiler installation](https://react.dev/learn/react-compiler/installation)
- [@acusti/vite-plugin-react-compiler](https://www.npmjs.com/package/@acusti/vite-plugin-react-compiler)
- [React Now Rusted All The Way Out](https://blog.master.dev/react-now-rusted-all-the-way-out/)
- [react-router#14885](https://github.com/remix-run/react-router/issues/14885) — client-only compiler scope for RSC
- [react-router#15180](https://github.com/remix-run/react-router/discussions/15180) — framework mode compiler setup
