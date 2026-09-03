import { data, href } from "react-router";
import { grid } from "styled-system/patterns";
import { GenericComponent } from "~/components/generic-component";
import { CustomLink } from "~/components/links/custom-link";
import { PendingUI } from "~/components/pending-ui";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { listActiveRentals } from "~/features/host/services/rental.server";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { Pagination } from "~/features/pagination/components/pagination";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/features/pagination/loaders.server";
import { VanCard } from "~/features/vans/components/van-card";
import { VanHeader } from "~/features/vans/components/van-header";
import { gridMax } from "~/styles";
import type { Prettify } from "~/types";
import type { Route } from "./+types/rentals";

type ActiveRental = Prettify<
  NonNullable<Awaited<ReturnType<typeof listActiveRentals>>["items"]>[number]
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
  link: href("/host/vans/:vanSlug/:action?", {
    vanSlug: rental.van.slug,
  }),
  linkCoversCard: false,
  van: rental.van,
});

export const headers = forwardDataHeaders;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
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

      <GenericComponent
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
    </PendingUI>
  );
};
export default Host;
