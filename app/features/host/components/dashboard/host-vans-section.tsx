import { href } from "react-router";
import { css, cx } from "styled-system/css";
import { DeferredItems } from "~/components/deferred/items";
import { HOST_VANS_EMPTY_MESSAGE } from "~/features/host/constants/constants";
import { VanCard } from "~/features/vans/components/van-card";
import { VanCardSkeleton } from "~/features/vans/components/van-card-skeleton";
import type { VanWithChrome } from "~/features/vans/types";
import { PaginatedItemsSkeleton } from "~/pagination/components/paginated-items-skeleton";
import { gridMax } from "~/styles";

const renderHostVanCardProps = (item: VanWithChrome, index: number) => ({
  action: <span />,
  imageIndex: index,
  link: href("/host/vans/:vanSlug", { vanSlug: item.slug }),
  van: item,
});

const vansFallback = (
  <PaginatedItemsSkeleton
    Component={VanCardSkeleton}
    className={cx(gridMax, css({ marginBlockStart: "11" }))}
    count={3}
  />
);

interface HostVansSectionProps {
  vansPromise: Promise<VanWithChrome[]>;
}

const HostVansSection = ({ vansPromise }: HostVansSectionProps) => (
  <DeferredItems
    Component={VanCard}
    className={cx(gridMax, css({ marginBlockStart: "11" }))}
    emptyState={{ title: HOST_VANS_EMPTY_MESSAGE }}
    errorState={{ title: "Something went wrong" }}
    fallback={vansFallback}
    noMatchState={null}
    renderProps={renderHostVanCardProps}
    resolve={vansPromise}
  />
);

export { HostVansSection };
