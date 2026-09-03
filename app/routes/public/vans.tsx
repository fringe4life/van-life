import { data } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { RouteErrorBoundary } from "~/components/route-error-boundary";
import { SearchInput } from "~/components/search-input";
import {
  forwardDataHeaders,
  PUBLIC_SHORT_CACHE_HEADERS,
} from "~/constants/cache-headers";
import { dbContext } from "~/features/middleware/contexts/db";
import { SeoHead } from "~/features/seo/seo-head";
import { VanFilters } from "~/features/vans/components/van-filters";
import { VanHeader } from "~/features/vans/components/van-header";
import { VansList } from "~/features/vans/components/vans-list/vans-list";
import { loadVanCatalog } from "~/features/vans/services/catalog.server";
import type { Route } from "./+types/vans";

export const headers = forwardDataHeaders;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const db = context.get(dbContext);
  const loaderData = await loadVanCatalog(db, request);

  return data(loaderData, { headers: PUBLIC_SHORT_CACHE_HEADERS });
};

const Vans = ({
  loaderData: { items: vans, paginationMetadata, seo },
}: Route.ComponentProps) => (
  <section
    className={cx(
      grid({
        gap: "0",
      }),
      css({
        blockSize: "full",
        contain: "content",
        inlineSize: "full",
      })
    )}
  >
    <div
      className={cx(
        grid({
          gap: "6",
          gridTemplateAreas: {
            base: '"header" "filters" "results"',
            // biome-ignore assist/source/noDuplicateClasses: repeated filter area intentionally spans catalog rows
            lg: '"filters header" "filters results"',
          },
          gridTemplateRows: "min-content 1fr",
          lg: {
            alignItems: "start",
            gap: "8",
            gridTemplateColumns: "15rem minmax(0,1fr)",
          },
        }),
        css({
          minBlockSize: "0",
          minInlineSize: "0",
        })
      )}
    >
      <header
        className={cx(
          grid({
            gap: "6",
            lg: {
              gridArea: "header",
            },
          }),
          css({
            minInlineSize: "0",
          })
        )}
      >
        <VanHeader>Explore our van options</VanHeader>
        <SearchInput />
      </header>

      <div
        className={cx(
          grid({
            gridArea: "filters",
            lg: {
              justifySelf: "stretch",
            },
          }),
          css({
            minInlineSize: "0",
          })
        )}
      >
        <VanFilters />
      </div>

      <div
        className={cx(
          grid({
            gridArea: "results",
          }),
          css({
            blockSize: "full",
            minBlockSize: "0",
            minInlineSize: "0",
          })
        )}
      >
        <SeoHead {...seo} />
        <VansList items={vans} paginationMetadata={paginationMetadata} />
      </div>
    </div>
  </section>
);
export default Vans;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RouteErrorBoundary error={error} />
);
