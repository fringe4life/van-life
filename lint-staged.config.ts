import { spawnSync } from "node:child_process";
import type { Configuration } from "lint-staged";

/** Keep each fallow invocation under OS argv limits (esp. Windows ~8191). */
const FALLOW_FILE_CHUNK_SIZE = 40;

const runCommand = (command: string, args: readonly string[]): void => {
  const result = spawnSync(command, args, { stdio: "inherit" });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `${command} exited with code ${result.status ?? "unknown"}`
    );
  }
};

const runFallowDeadCode = (files: readonly string[]): void => {
  for (let index = 0; index < files.length; index += FALLOW_FILE_CHUNK_SIZE) {
    const chunk = files.slice(index, index + FALLOW_FILE_CHUNK_SIZE);
    runCommand("bunx", [
      "fallow",
      "dead-code",
      "--fail-on-issues",
      "--quiet",
      ...chunk.flatMap((file) => ["--file", file]),
    ]);
  }
};

export default {
  "*.{js,jsx,ts,tsx,json,jsonc,css,scss,md,mdx}": () => "bun fix",
  "**/*.{js,jsx,ts,tsx}": () =>
    "bunx react-doctor --staged --blocking warning --no-score -y",
  // TaskFunction + spawn argv (no shell) for fallow — safe paths, chunked for argv limits.
  "**/*.{ts,tsx}": {
    // biome-ignore lint/suspicious/useAwait: done for error handling
    task: async (files) => {
      try {
        runCommand("bun", ["typecheck"]);
        runCommand("bun", ["test"]);
        if (files.length > 0) {
          runFallowDeadCode(files);
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    title: "Typecheck, test, and fallow",
  },
} satisfies Configuration;
