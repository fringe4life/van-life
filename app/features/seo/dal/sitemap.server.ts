import { desc } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { van } from "~/db/schema/van";

export function getVanSlugsForSitemap(db: AppDb) {
  return db
    .select({ createdAt: van.createdAt, slug: van.slug })
    .from(van)
    .orderBy(desc(van.createdAt));
}
