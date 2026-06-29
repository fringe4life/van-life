# Babel & React Compiler Setup

Guide for the current Vite 7 + `vite-plugin-babel` configuration, performance tuning options, and the planned Vite 8+ migration path.

## Current Stack

| Package | Version / role |
|---------|----------------|
| Vite | 7.x |
| React Router | 8.x framework mode (`reactRouter()` plugin) |
| Babel integration | `vite-plugin-babel` |
| Compiler | `babel-plugin-react-compiler` |
| Config | [`vite.config.ts`](../vite.config.ts) |

React Router owns JSX transform and Fast Refresh. Do **not** add `@vitejs/plugin-react`'s `react()` plugin alongside `reactRouter()` — that causes double HMR and `RefreshRuntime already declared` errors.

## Current Configuration

```ts
import babel from "vite-plugin-babel";

const JSX_FILE_EXTENSION_RE = /\.[jt]sx$/;

babel({
  include: /\.[jt]sx?$/,
  exclude: /node_modules/,
  loader: (path) => (JSX_FILE_EXTENSION_RE.test(path) ? "jsx" : "js"),
  babelConfig: {
    presets: ["@babel/preset-typescript"],
    plugins: ["babel-plugin-react-compiler"],
    compact: false,
  },
}),
```

Plugin order in `vite.config.ts`: other plugins → `babel()` → `reactRouter()`. The babel plugin uses `enforce: "pre"` by default, so it runs before downstream transforms regardless of array position.

## JSX Loader Fix (Required on Vite 7)

### Problem

`babel-plugin-react-compiler` optimizes components but does **not** strip JSX. With only `@babel/preset-typescript`, Babel removes types and leaves JSX in the output (e.g. `return <div />` becomes `t3 = <div />`).

After Babel, esbuild (used during `optimizeDeps` pre-bundling) defaults to the `js` loader and fails:

```
The esbuild loader for this file is currently set to "js" but it must be set to "jsx"
```

### Fix

Tell `vite-plugin-babel` which esbuild loader to use after Babel runs. The callback must always return a valid `Loader` — not `undefined`:

```ts
loader: (path) => (JSX_FILE_EXTENSION_RE.test(path) ? "jsx" : "js"),
```

Hoist the regex to module scope to satisfy lint rules about regex literals inside frequently called functions.

This fix applies to the **optimizeDeps esbuild path** on Vite 7. It is a correctness requirement, not a performance optimization.

## Performance Tuning (Current Setup)

Every file that passes through Babel is slower than Vite's default esbuild/oxc-only path. The main levers are **run Babel on fewer files** and **run it less often**.

### `include` / `exclude` — biggest win

Current `include: /\.[jt]sx?$/` matches `.ts`, `.js`, `.tsx`, and `.jsx`. React Compiler only benefits React code (components, hooks).

Rough split under `app/`:

- ~104 `.ts` files — DAL, schemas, loaders, server utils (no compiler benefit)
- ~70 `.tsx` files — components and route UI

**Recommended tightening:**

```ts
include: [
  /app\/.*\.tsx$/,
  // Optional: hook-only .ts files that use React APIs
  // /app\/.*\/hooks\/.*\.ts$/,
],
exclude: [/node_modules/, /\.server\.ts$/],
```

Or simplest: `include: /app\/.*\.tsx$/` — skips roughly half of unnecessary Babel work.

### `apply` — faster dev

Default runs Babel during both `serve` and `build`. Restrict to production builds for faster cold start and HMR:

```ts
apply: "build",
// or
apply: (_, { command }) => command === "build",
```

Tradeoff: no compiler memoization during local dev (usually acceptable).

### `babelConfig` options

| Setting | Current | Recommendation |
|---------|---------|----------------|
| `compact` | `false` | Use `true` in production for slightly faster/smaller output |
| `configFile` | implicit `false` | Keep disabled to avoid extra config file lookups |
| `sourceMaps` | default | Set `false` in production to reduce transform work |
| React Compiler `compilationMode` | default (`infer`) | Use `'annotation'` + `"use memo"` on hot components for large build-time savings |

Example compiler opt-in mode:

```ts
plugins: [
  ["babel-plugin-react-compiler", { compilationMode: "annotation" }],
],
```

Mark components that should be compiled:

```tsx
"use memo";

export function ExpensiveList() {
  // ...
}
```

### `optimizeOnSSR`

Default is `false`. With `@varlock/cloudflare-integration` and SSR, setting `optimizeOnSSR: true` pre-bundles SSR dependencies similarly to the client.

- **Benefit:** faster SSR dependency resolution on Workers
- **Cost:** longer dev startup

Enable only if SSR cold-start or dep loading is a measured bottleneck.

### Options with little or no perf impact

| Option | Notes |
|--------|-------|
| `loader` | Correctness fix only |
| `enforce` | Keep `'pre'` for compiler correctness |
| `filter` | Deprecated; use `include` / `exclude` instead |

### Related config outside `vite-plugin-babel`

- **`unstable_optimizeDeps: true`** in [`react-router.config.ts`](../react-router.config.ts) — faster client navigation, slower initial dep scan. Already enabled.
- **`reactRouterDevTools()`** — ensure it only runs in development (the plugin uses `apply` internally based on mode).
- **Narrow Babel scope** matters more than any single plugin flag.

## Suggested Optimized Config (Vite 7)

Example combining the above — adjust to taste:

```ts
const JSX_FILE_EXTENSION_RE = /\.[jt]sx$/;

babel({
  include: /app\/.*\.tsx$/,
  exclude: [/node_modules/, /\.server\.ts$/],
  apply: (_, { command }) => command === "build",
  loader: (path) => (JSX_FILE_EXTENSION_RE.test(path) ? "jsx" : "js"),
  babelConfig: {
    presets: ["@babel/preset-typescript"],
    plugins: [
      ["babel-plugin-react-compiler", { compilationMode: "annotation" }],
    ],
    compact: true,
    sourceMaps: false,
  },
}),
```

Start with narrowed `include` before enabling `apply: "build"` or `compilationMode: "annotation"`, so you can verify compiler output incrementally.

---

## Future: Vite 8+ Migration

When upgrading to Vite 8, replace `vite-plugin-babel` with `@rolldown/plugin-babel` and use `reactCompilerPreset()` from `@vitejs/plugin-react`.

### Why migrate

- Aligns with Vite 8's rolldown-based pipeline
- `reactCompilerPreset()` bundles the compiler with sane defaults and file filters
- No manual `loader: jsx/js` workaround
- Official path for `@vitejs/plugin-react` v6+ (Babel removed from that plugin)

### Requirements

```bash
bun add -d @rolldown/plugin-babel @vitejs/plugin-react @babel/core
# Remove vite-plugin-babel after migration
```

`@rolldown/plugin-babel` requires `vite: ^8.0.0`.

### Target configuration

```ts
import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // ...other plugins (cloudflare, tailwind, tsconfigPaths, devtools)
    reactRouter(),
    Object.assign(babel({ presets: [reactCompilerPreset()] }), {
      // Client-only: avoid compiling server/SSR modules (see remix-run/react-router#14885)
      applyToEnvironment: (env) => env.name === "client",
    }),
  ],
});
```

### Important migration notes

1. **Do not add `react()` from `@vitejs/plugin-react`.** Import only `reactCompilerPreset`. React Router owns JSX and HMR.

2. **Plugin order:** `reactRouter()` before the babel plugin (differs from plain Vite + `react()` setups where babel comes first).

3. **`future.v8_viteEnvironmentApi` is removed in React Router 8.** The Vite Environment API is always enabled; no flag needed on `reactRouter()`.

4. **Optional perf:** `reactCompilerPreset({ compilationMode: "annotation" })` and custom `rolldown.filter` exclusions for paths that never benefit from the compiler (see `@vitejs/plugin-react` README).

5. **Official docs lag:** [react.dev React Router section](https://react.dev/learn/react-compiler/installation) still documents `vite-plugin-babel`. The rolldown path is the forward-looking approach once on Vite 8. See also [react-router#15180](https://github.com/remix-run/react-router/discussions/15180).

### Migration checklist

- [ ] Upgrade Vite to 8.x
- [ ] Install `@rolldown/plugin-babel`, `@vitejs/plugin-react`, `@babel/core`
- [ ] Replace `vite-plugin-babel` config with rolldown + `reactCompilerPreset()`
- [ ] Remove `JSX_FILE_EXTENSION_RE` and manual `loader` callback
- [ ] Set `applyToEnvironment` to client-only if SSR/server issues appear
- [ ] Remove `vite-plugin-babel` from devDependencies
- [ ] Re-enable commented Vite 8 options in `vite.config.ts` if desired (`resolve.tsconfigPaths`, `server.forwardConsole`)
- [ ] Verify compiler output in React DevTools (✨ memo badge) on annotated or inferred components

## References

- [`vite.config.ts`](../vite.config.ts) — live configuration
- [`react-router.config.ts`](../react-router.config.ts) — `unstable_optimizeDeps`
- [vite-plugin-babel README](https://github.com/owlsdepartment/vite-plugin-babel) — JSX loader troubleshooting
- [React Compiler installation](https://react.dev/learn/react-compiler/installation)
- [@vitejs/plugin-react README — React Compiler](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
- [react-router#14885](https://github.com/remix-run/react-router/issues/14885) — client-only compiler scope for RSC
- [react-router#15180](https://github.com/remix-run/react-router/discussions/15180) — framework mode compiler setup
