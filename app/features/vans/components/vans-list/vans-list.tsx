import { useQueryStates } from "nuqs";
import { ViewTransition } from "react";
import { useLocation } from "react-router";
import { GenericComponent } from "~/components/generic-component";
import { PendingUI } from "~/components/pending-ui";
import type { VanModel } from "~/db/client.server";
import { Pagination } from "~/features/pagination/components/pagination";
import type { InitialPaginationProps } from "~/features/pagination/types";
import { vansParsers } from "~/features/vans/parsers";
import { gridMax } from "~/styles";
import { css, cx } from "../../../../../styled-system/css";
import { grid } from "../../../../../styled-system/patterns";
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

export type VansListProps = InitialPaginationProps<VanModel>;

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
  const renderVanCardProps = (van: VanModel, index: number) =>
    createVansListCardProps(van, index, {
      cursor,
      excludeInRepair,
      limit,
      onlyOnSale,
      search,
      types,
    });

  return (
    <ViewTransition>
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
        <GenericComponent
          as="ul"
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
      </PendingUI>
    </ViewTransition>
  );
};

export { VansList };
