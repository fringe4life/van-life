import { data, href } from "react-router";
import { grid } from "styled-system/patterns";
import { CollectionList } from "~/components/collection-list";
import { CustomLink } from "~/components/links/custom-link";
import { PendingUI } from "~/components/pending-ui";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import type { listActiveRentals as listActiveRentalsQuery } from "~/features/host/services/rental.server";
import { VanCard } from "~/features/vans/components/van-card";
import { VanHeader } from "~/features/vans/components/van-header";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import { Pagination } from "~/pagination/components/pagination";
import { PaginationOffsetTransition } from "~/pagination/components/pagination-offset-transition";
import { pageSliceKey } from "~/pagination/utils/page-slice-key";
import { gridMax } from "~/styles";
import type { Prettify } from "~/types";
import type { Route } from "./+types/rentals";

type ActiveRental = Prettify<
  NonNullable<
    Awaited<ReturnType<typeof listActiveRentalsQuery>>["items"]
  >[number]
>;

const renderRentalVanCardProps = (rental: ActiveRental, index: number) => ({
  action: (
    <CustomLink
      state={{
        van: rental,
      }}
      to={href("/host/rentals/returnRental/:rentId", {
        rentId: rental.id,
      })}
    >
      Return
    </CustomLink>
  ),
  imageIndex: index,
  link: href("/vans/:vanSlug", {
    vanSlug: rental.van.slug,
  }),
  linkCoversCard: false,
  van: rental.van,
});

export const headers = forwardDataHeaders;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  /**
   * Workaround: `.server` modules imported here rather than at module scope, because
   * a static import survives React Router's client export removal and then trips its
   * `.server` resolver, so the route's client bundle never loads.
   *
   * @remarks
   * Still required on `@react-router/dev@8.5.1` with `vite@8.3.5` in `vite serve`.
   * Drop when upstream ships a fix; re-verify this module returns 200 and the page
   * hydrates. Full note: `app/routes/host/rental-activity.tsx`.
   *
   * @see https://github.com/remix-run/react-router/issues/14997 — open
   * @see https://github.com/fringe4life/van-life/issues/402 — tracking
   */
  const [
    { loadHostSearchParams, parsePaginationCursor },
    { listActiveRentals },
  ] = await Promise.all([
    import("~/pagination/loaders.server"),
    import("~/features/host/services/rental.server"),
  ]);

  const user = context.get(authContext);
  const db = context.get(dbContext);

  // Parse search parameters using nuqs loadHostSearchParams
  const { cursor, limit, direction } = loadHostSearchParams(request);
  const pagination = await listActiveRentals(db, user.id, {
    cursor: parsePaginationCursor(cursor),
    direction,
    limit,
  });

  return data(pagination, { headers: PRIVATE_NO_STORE_HEADERS });
};

const Host = ({ loaderData }: Route.ComponentProps) => {
  const { items: vans, paginationMetadata } = loaderData;

  return (
    <PendingUI
      as="section"
      className={grid({
        contain: "content",
        // biome-ignore assist/source/noDuplicateClasses: grid definition
        gridTemplateRows: "min-content min-content 1fr min-content",
        rowGap: "6",
      })}
    >
      <title>Rentals | Van Life</title>
      <meta content="View and manage your van rentals" name="description" />
      <VanHeader>Vans you are renting</VanHeader>

      <PaginationOffsetTransition sliceKey={pageSliceKey(vans)}>
        <CollectionList
          as="div"
          Component={VanCard}
          className={gridMax}
          emptyState={{ title: "You are currently not renting any vans." }}
          errorState={{ title: "Something went wrong" }}
          items={vans}
          noMatchState={null}
          renderProps={renderRentalVanCardProps}
        />
        <Pagination items={vans} paginationMetadata={paginationMetadata} />
      </PaginationOffsetTransition>
    </PendingUI>
  );
};
export default Host;
