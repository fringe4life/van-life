import type { AppDb } from "~/db/client.server";
import { getVanBySlug } from "~/features/vans/dal/van.server";
import { tryCatch } from "~/utils/try-catch.server";

export function loadVanBySlug(db: AppDb, slug: string) {
  return tryCatch(() => getVanBySlug(db, slug));
}
