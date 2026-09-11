import { useQueryStates } from "nuqs";
import { useLocation } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { CollectionList } from "~/components/collection-list";
import { PendingUI } from "~/components/pending-ui";
import { vansParsers } from "~/features/vans/schema";
import type { VanWithChrome } from "~/features/vans/types";
import { Pagination } from "~/pagination/components/pagination";
import { PaginationOffsetTransition } from "~/pagination/components/pagination-offset-transition";
import type { InitialPaginationProps } from "~/pagination/types";
import { pageSliceKey } from "~/pagination/utils/page-slice-key";
import { gridMax } from "~/styles";
import { createVansListCardProps, VanListItem } from "./vans-list-card";
import {
  VANS_LIST_EMPTY_STATE,
  VANS_LIST_NO_MATCH_STATE,
} from "./vans-list-constants";
import { VansListMetadata } from "./vans-list-metadata";
import {
  buildVansListErrorState,
  hasActiveVansListFilters,
} from "./vans-list-state";

export type VansListProps = InitialPaginationProps<VanWithChrome>;

const VansList = ({ items: vans, paginationMetadata }: VansListProps) => {
  const [{ cursor, limit, search, types, excludeInRepair, onlyOnSale }] =
    useQueryStates(vansParsers);
  const { pathname, search: locationSearch } = useLocation();

  const filterState = {
    excludeInRepair,
    onlyOnSale,
    search,
    types,
  };
  const hasActiveFilters = hasActiveVansListFilters(filterState);
  const retryTo = `${pathname}${locationSearch}`;
  const noMatchState = {
    ...VANS_LIST_NO_MATCH_STATE,
    metadata: <VansListMetadata {...filterState} />,
  };
  const renderVanCardProps = (van: VanWithChrome, index: number) =>
    createVansListCardProps(van, index, {
      cursor,
      excludeInRepair,
      limit,
      onlyOnSale,
      search,
      types,
    });

  return (
    <PendingUI
      className={cx(
        grid({
          gap: "6",
          gridTemplateRows: "1fr min-content",
        }),
        css({
          blockSize: "full",
          minBlockSize: "0",
        })
      )}
    >
      <PaginationOffsetTransition sliceKey={pageSliceKey(vans)}>
        <CollectionList
          Component={VanListItem}
          className={gridMax}
          emptyState={VANS_LIST_EMPTY_STATE}
          errorState={buildVansListErrorState(retryTo)}
          items={vans}
          noMatchState={noMatchState}
          noMatchWhen={hasActiveFilters}
          renderProps={renderVanCardProps}
        />
        <Pagination items={vans} paginationMetadata={paginationMetadata} />
      </PaginationOffsetTransition>
    </PendingUI>
  );
};

export { VansList };
