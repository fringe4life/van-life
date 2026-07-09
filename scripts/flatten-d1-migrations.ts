import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Drizzle Kit 1.0 rc emits nested folders:
 *   drizzle/migrations/<timestamp>_name/migration.sql
 * Wrangler D1 expects flat:
 *   drizzle/migrations/<timestamp>_name.sql
 */
const MIGRATIONS_DIR = path.resolve("drizzle/migrations");

async function flatten() {
  const entries = await readdir(MIGRATIONS_DIR, { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory());

  await Promise.all(
    dirs.map(async (entry) => {
      const dirPath = path.join(MIGRATIONS_DIR, entry.name);
      const sqlPath = path.join(dirPath, "migration.sql");
      try {
        const sql = await readFile(sqlPath, "utf8");
        const outPath = path.join(MIGRATIONS_DIR, `${entry.name}.sql`);
        await writeFile(outPath, sql, "utf8");
        await rm(dirPath, { force: true, recursive: true });
        console.log(
          `Flattened ${entry.name}/migration.sql → ${entry.name}.sql`
        );
      } catch {
        // skip dirs without migration.sql
      }
    })
  );
}

await flatten();
