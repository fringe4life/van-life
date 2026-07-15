import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Drizzle Kit 1.0 rc emits nested folders:
 *   app/db/migrations/<timestamp>_name/migration.sql
 *   app/db/migrations/<timestamp>_name/snapshot.json
 * Wrangler D1 expects flat:
 *   app/db/migrations/<timestamp>_name.sql
 * Snapshots stay nested so the next `drizzle-kit generate` can diff.
 */
const MIGRATIONS_DIR = path.resolve("app/db/migrations");

async function flatten() {
  const entries = await readdir(MIGRATIONS_DIR, { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory());

  await Promise.all(
    dirs.map(async (entry) => {
      const dirPath = path.join(MIGRATIONS_DIR, entry.name);
      const sqlPath = path.join(dirPath, "migration.sql");
      const snapshotPath = path.join(dirPath, "snapshot.json");

      try {
        const sql = await readFile(sqlPath, "utf8");
        const outPath = path.join(MIGRATIONS_DIR, `${entry.name}.sql`);
        await writeFile(outPath, sql, "utf8");
        await rm(sqlPath, { force: true });
        console.log(
          `Flattened ${entry.name}/migration.sql → ${entry.name}.sql`
        );
      } catch {
        // skip dirs without migration.sql
      }

      try {
        await readFile(snapshotPath, "utf8");
        console.log(`Kept ${entry.name}/snapshot.json for drizzle-kit`);
      } catch {
        // no snapshot — remove empty dir if nothing left
        const remaining = await readdir(dirPath);
        if (remaining.length === 0) {
          await rm(dirPath, { force: true, recursive: true });
        }
      }
    })
  );
}

await flatten();
