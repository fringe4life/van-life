import { href } from "react-router";
import type { VanModel } from "~/db/client.server";
import { VanCard } from "~/features/vans/components/van-card";
import { VanPrice } from "~/features/vans/components/van-price";
import { vanViewTransitionName } from "~/features/vans/components/van-view-transitions";
import type { VanCardProps } from "~/features/vans/types";
import { buildVanUrl } from "~/pagination/utils/build-search-params";
export interface VansListQueryState {
  cursor: string;
  excludeInRepair: boolean;
  limit: number;
  onlyOnSale: boolean;
  search: string;
  types: string[];
}

export const createVansListCardProps = (
  van: VanModel,
  index: number,
  queryState: VansListQueryState
): VanCardProps => ({
  action: <VanPrice van={van} />,
  imageIndex: index,
  link: buildVanUrl({
    baseUrl: href("/vans/:vanSlug", {
      vanSlug: van.slug,
    }),
    cursor: queryState.cursor,
    excludeInRepair: queryState.excludeInRepair,
    limit: queryState.limit,
    onlyOnSale: queryState.onlyOnSale,
    search: queryState.search,
    types: queryState.types,
  }),
  priceTransitionName: vanViewTransitionName.price(van.id),
  van,
});

export const VanListItem = (props: VanCardProps) => <VanCard {...props} />;
