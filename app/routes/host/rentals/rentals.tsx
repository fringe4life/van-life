import { data, href } from "react-router";
import { GenericComponent } from "~/components/generic-component";
import { PendingUI } from "~/components/pending-ui";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { listActiveRentals } from "~/features/host/services/rental.server";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { CustomLink } from "~/features/navigation/components/custom-link";
import { Pagination } from "~/features/pagination/components/pagination";
import { VanCard } from "~/features/vans/components/van-card";
import { VanHeader } from "~/features/vans/components/van-header";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/lib/search-params.server";
import type { Prettify } from "~/types";
import type { Route } from "./+types/rentals";

type ActiveRental = Prettify<
  NonNullable<Awaited<ReturnType<typeof listActiveRentals>>["items"]>[number]
>;

const renderRentalVanCardProps = (rental: ActiveRental) => ({
  action: (
    <div className="justify-self-end text-right">
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
    </div>
  ),
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
      className="grid grid-rows-[min-content_min-content_1fr_min-content] gap-y-6 contain-content"
    >
      <title>Rentals | Van Life</title>
      <meta content="View and manage your van rentals" name="description" />
      <VanHeader>Vans you are renting</VanHeader>

      <GenericComponent
        as="div"
        Component={VanCard}
        className="grid-max"
        emptyStateMessage="You are currently not renting any vans."
        errorStateMessage="Something went wrong"
        items={vans}
        renderProps={renderRentalVanCardProps}
      />
      <Pagination items={vans} paginationMetadata={paginationMetadata} />
    </PendingUI>
  );
};
export default Host;
