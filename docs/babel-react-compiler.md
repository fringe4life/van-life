# Babel & React Compiler Setup

Guide for the current Vite 8 + `@rolldown/plugin-babel` configuration and optional performance tuning.

## Current Stack

| Package | Version / role |
|---------|----------------|
| Vite | 8.x (rolldown) |
| React Router | 8.x framework mode (`reactRouter()` plugin) |
| Babel integration | `@rolldown/plugin-babel` |
| Compiler | `reactCompilerPreset()` from `@vitejs/plugin-react` + `babel-plugin-react-compiler` |
| Config | [`vite.config.ts`](../vite.config.ts) |

React Router owns JSX transform and Fast Refresh. Do **not** add `@vitejs/plugin-react`'s `react()` plugin alongside `reactRouter()` — that causes double HMR and `RefreshRuntime already declared` errors. Import only `reactCompilerPreset`.

## Current Configuration

```ts
import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    // ...other plugins (varlock, tailwind)
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
```

**Plugin order:** `reactRouter()` before the babel plugin (differs from plain Vite + `react()` setups where babel comes first).

## Why this stack

- Aligns with Vite 8's rolldown-based pipeline
- `reactCompilerPreset()` bundles the compiler with sane defaults and file filters
- No manual JSX `loader` workaround (required on the old Vite 7 + `vite-plugin-babel` path)
- Official path for `@vitejs/plugin-react` v6+ (Babel removed from that plugin)

## Optional: client-only compiler

If SSR/server modules cause issues, scope Babel to the client environment:

```ts
Object.assign(babel({ presets: [reactCompilerPreset()] }), {
  // Client-only: avoid compiling server/SSR modules (see remix-run/react-router#14885)
  applyToEnvironment: (env) => env.name === "client",
}),
```

## Performance Tuning

### `compilationMode: "annotation"`

Opt-in compiler only on `"use memo"` components:

```ts
babel({
  presets: [reactCompilerPreset({ compilationMode: "annotation" })],
}),
```

### Custom filters

Exclude paths that never benefit from the compiler via `rolldown.filter` options — see [`@vitejs/plugin-react` README](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md).

## Notes

1. **`future.v8_viteEnvironmentApi` is removed in React Router 8.** The Vite Environment API is always enabled; no flag needed on `reactRouter()`.

2. **Official docs lag:** [react.dev React Router section](https://react.dev/learn/react-compiler/installation) may still document `vite-plugin-babel`. The rolldown path is current for Vite 8. See also [react-router#15180](https://github.com/remix-run/react-router/discussions/15180).

3. Verify compiler output in React DevTools (✨ memo badge) on annotated or inferred components.

## References

- [`vite.config.ts`](../vite.config.ts) — live configuration
- [`react-router.config.ts`](../react-router.config.ts) — `unstable_optimizeDeps`
- [React Compiler installation](https://react.dev/learn/react-compiler/installation)
- [@vitejs/plugin-react README — React Compiler](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
- [react-router#14885](https://github.com/remix-run/react-router/issues/14885) — client-only compiler scope for RSC
- [react-router#15180](https://github.com/remix-run/react-router/discussions/15180) — framework mode compiler setup
