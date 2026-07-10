import type { AppDb } from "~/db/client.server";
import { toPagination } from "~/features/pagination/utils/to-pagination.server";
import { buildVansPageSeo } from "~/features/seo/build-page-seo.server";
import { VAN_TYPE_LOWERCASE } from "~/features/vans/constants/van-types";
import { getVans } from "~/features/vans/dal/van.server";
import { validateVanType } from "~/features/vans/utils/validators";
import {
  loadPaginationParams,
  loadSearchParams,
  loadVanFiltersParams,
  parsePaginationCursor,
} from "~/lib/search-params.server";
import { tryCatch } from "~/utils/try-catch.server";

export async function loadVanCatalog(db: AppDb, request: Request) {
  const badges = VAN_TYPE_LOWERCASE;

  const { cursor, limit, type, direction } = loadPaginationParams(request);
  const { search } = loadSearchParams(request);
  const { types, excludeInRepair, onlyOnSale } = loadVanFiltersParams(request);

  const typeFilter =
    type === "" ? undefined : validateVanType(type?.toUpperCase());

  const brandedCursor = parsePaginationCursor(cursor);

  const { data: vans } = await tryCatch(() =>
    getVans(db, {
      cursor: brandedCursor,
      direction,
      excludeInRepair,
      limit,
      onlyOnSale,
      search,
      typeFilter,
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
    badges,
    seo: buildVansPageSeo(request),
    ...pagination,
  };
}
