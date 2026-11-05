import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Fails the build when the full Panda `cva`/`sva` recipe runtime lands in the
 * client or server bundle again (#471 / #269).
 *
 * Run after `VARLOCK_ENV=test bun run build`.
 */
const CLIENT_ASSETS = path.resolve("build/client/assets");
const BUILD_ROOT = path.resolve("build");

const CVA_CHUNK = /^cva-.*\.js$/u;
const JS_FILE = /\.js$/u;
/** Runtime compound-variant helpers — not a JSDoc mention of the string. */
const COMPOUND_VARIANT_RUNTIME =
  /\b(?:compoundVariants|getCompoundVariant\w*)\s*[(:]/u;

async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath ?? dir, entry.name));
}

async function main() {
  const clientAssets = await readdir(CLIENT_ASSETS);
  const cvaChunks = clientAssets.filter((name) => CVA_CHUNK.test(name));
  if (cvaChunks.length > 0) {
    throw new Error(
      `Panda cva runtime chunk(s) present: ${cvaChunks.join(", ")}. Convert holdout cva/sva call sites to top-level css() maps (#471).`
    );
  }

  const buildFiles = await listFiles(BUILD_ROOT);
  const jsFiles = buildFiles.filter((file) => JS_FILE.test(file));
  const sources = await Promise.all(
    jsFiles.map(async (file) => ({
      file,
      source: await readFile(file, "utf8"),
    }))
  );
  const hits = sources
    .filter(({ source }) => COMPOUND_VARIANT_RUNTIME.test(source))
    .map(({ file }) => path.relative(process.cwd(), file));

  if (hits.length > 0) {
    throw new Error(
      `compoundVariants runtime still in build output:\n${hits.map((hit) => `  - ${hit}`).join("\n")}`
    );
  }

  console.log(
    "assert-no-panda-cva-runtime: ok (no cva-*.js, no compoundVariants runtime)"
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
