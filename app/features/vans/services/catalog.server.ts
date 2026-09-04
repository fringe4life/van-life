import type { AppDb } from "~/db/client.server";
import { parsePaginationCursor } from "~/features/pagination/loaders.server";
import { toPagination } from "~/features/pagination/utils/to-pagination.server";
import { buildVansPageSeo } from "~/features/seo/build-page-seo.server";
import { getVans } from "~/features/vans/dal/van.server";
import { loadVansSearchParams } from "~/features/vans/loaders.server";
import { tryCatch } from "~/utils/errors/try-catch.server";

export async function loadVanCatalog(db: AppDb, request: Request) {
  const {
    cursor,
    limit,
    direction,
    search,
    types,
    excludeInRepair,
    onlyOnSale,
  } = loadVansSearchParams(request);

  const brandedCursor = parsePaginationCursor(cursor);

  const { data: vans } = await tryCatch(() =>
    getVans(db, {
      cursor: brandedCursor,
      direction,
      excludeInRepair,
      limit,
      onlyOnSale,
      search,
      types,
    })
  );

  const pagination = toPagination({
    cursor: brandedCursor,
    direction,
    items: vans,
    limit,
  });

  return {
    seo: buildVansPageSeo(request),
    ...pagination,
  };
}
