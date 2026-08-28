import { useQueryStates } from "nuqs";
import { ViewTransition } from "react";
import { data, href } from "react-router";
import { GenericComponent } from "~/components/generic-component";
import { PendingUI } from "~/components/pending-ui";
import { SearchInput } from "~/components/search-input";
import { UnsuccesfulState } from "~/components/unsuccesful-state";
import {
  forwardDataHeaders,
  PUBLIC_SHORT_CACHE_HEADERS,
} from "~/constants/cache-headers";
import type { VanModel } from "~/db/client.server";
import { dbContext } from "~/features/middleware/contexts/db";
import { Pagination } from "~/features/pagination/components/pagination";
import { buildVanUrl } from "~/features/pagination/utils/build-search-params";
import { SeoHead } from "~/features/seo/seo-head";
import { VanCard } from "~/features/vans/components/van-card";
import { VanFilters } from "~/features/vans/components/van-filters";
import { VanHeader } from "~/features/vans/components/van-header";
import { VanPrice } from "~/features/vans/components/van-price";
import { loadVanCatalog } from "~/features/vans/services/catalog.server";
import {
  paginationParsers,
  searchParser,
  vanFiltersParser,
} from "~/lib/parsers";
import { getRouteErrorMessage } from "~/utils/errors/get-route-error-message";
import type { Route } from "./+types/vans";

export const headers = forwardDataHeaders;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const db = context.get(dbContext);
  const loaderData = await loadVanCatalog(db, request);

  return data(loaderData, { headers: PUBLIC_SHORT_CACHE_HEADERS });
};

const Vans = ({ loaderData }: Route.ComponentProps) => {
  const { items: vans, paginationMetadata, seo } = loaderData;
  const [{ cursor, limit }] = useQueryStates(paginationParsers);
  const [{ search }] = useQueryStates(searchParser);
  const [{ types, excludeInRepair, onlyOnSale }] =
    useQueryStates(vanFiltersParser);

  const hasActiveSearch = search && search.trim() !== "";
  const hasActiveFilters =
    hasActiveSearch ||
    (types && types.length > 0) ||
    excludeInRepair ||
    onlyOnSale;

  const emptyMessage = hasActiveFilters
    ? "No vans found matching your filters."
    : "There are no vans on our site.";

  const renderVanCardProps = (van: VanModel) => ({
    action: (
      <div className="grid justify-end">
        <VanPrice van={van} />
      </div>
    ),
    link: buildVanUrl({
      baseUrl: href("/vans/:vanSlug", {
        vanSlug: van.slug,
      }),
      cursor,
      excludeInRepair,
      limit,
      onlyOnSale,
      search,
      types,
    }),
    van,
  });

  return (
    <section className="grid h-full w-full! contain-content">
      <div className="grid min-h-0 min-w-0 grid-rows-[min-content_1fr] gap-y-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-x-8">
        <div className="grid min-w-0 gap-y-6 lg:col-start-2 lg:row-start-1">
          <VanHeader>Explore our van options</VanHeader>
          <SearchInput />
        </div>
        <div className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-stretch">
          <VanFilters />
        </div>
        <div className="h-full min-h-0 min-w-0 lg:col-start-2 lg:row-start-2">
          <SeoHead {...seo} />
          <ViewTransition>
            <PendingUI className="grid h-full min-h-0 grid-rows-[1fr_min-content] gap-y-6">
              <GenericComponent
                Component={VanCard}
                className="grid-max"
                emptyStateMessage={emptyMessage}
                errorStateMessage="Something went wrong"
                items={vans}
                renderProps={renderVanCardProps}
              />
              <Pagination
                items={vans}
                paginationMetadata={paginationMetadata}
              />
            </PendingUI>
          </ViewTransition>
        </div>
      </div>
    </section>
  );
};
export default Vans;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <UnsuccesfulState isError message={getRouteErrorMessage(error)} />
);
