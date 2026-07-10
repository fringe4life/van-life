import { configure } from "arktype/config";

/**
 * Workers ban `new Function` / eval. ArkType JIT uses DynamicFunction → EvalError.
 *
 * Vite 8/rolldown often merges schemas into the same server chunk as arktype, so
 * `configure()` in `workers/app.ts` alone runs *after* that chunk finishes —
 * too late for module-scope `type(...)` calls. Import this module first in every
 * file that uses `arktype` so `jitless` is set before schemas compile.
 *
 * `nodejs_compat` can also make ArkType's `envHasCsp()` probe return false even
 * though larger JIT bodies still throw — do not rely on auto-detect alone.
 */
configure({ jitless: true });
