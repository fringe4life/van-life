import { href } from "react-router";
import { DeferredItems } from "~/components/deferred-items";
import type { VanModel } from "~/db/client.server";
import { HOST_VANS_EMPTY_MESSAGE } from "~/features/host/constants/constants";
import { PaginatedItemsSkeleton } from "~/features/pagination/components/paginated-items-skeleton";
import { VanCard } from "~/features/vans/components/van-card";
import { VanCardSkeleton } from "~/features/vans/components/van-card-skeleton";

const renderHostVanCardProps = (item: VanModel) => ({
  action: <p className="justify-self-end text-right">Edit</p>,
  link: href("/host/vans/:vanSlug/:action?", {
    action: "edit",
    vanSlug: item.slug,
  }),
  van: item,
});

const vansFallback = (
  <PaginatedItemsSkeleton
    Component={VanCardSkeleton}
    className="grid-max mt-11"
    count={3}
  />
);

interface HostVansSectionProps {
  vansPromise: Promise<VanModel[]>;
}

const HostVansSection = ({ vansPromise }: HostVansSectionProps) => (
  <DeferredItems
    Component={VanCard}
    className="grid-max mt-11"
    emptyStateMessage={HOST_VANS_EMPTY_MESSAGE}
    errorStateMessage="Something went wrong"
    fallback={vansFallback}
    renderProps={renderHostVanCardProps}
    resolve={vansPromise}
  />
);

export { HostVansSection };
