import type { OutcomeStateConfig } from "~/components/outcome-state/types";
import {
  VANS_LIST_ERROR_STATE,
  VANS_LIST_RETRY_LABEL,
} from "./vans-list-constants";

export interface VansListFilterState {
  excludeInRepair: boolean;
  onlyOnSale: boolean;
  search: string;
  types: readonly string[];
}

export const hasActiveVansListFilters = ({
  excludeInRepair,
  onlyOnSale,
  search,
  types,
}: VansListFilterState): boolean =>
  [search.trim() !== "", types.length > 0, excludeInRepair, onlyOnSale].some(
    Boolean
  );

export const buildVansListErrorState = (
  retryTo: string
): OutcomeStateConfig => ({
  ...VANS_LIST_ERROR_STATE,
  primaryAction: {
    kind: "reload",
    label: VANS_LIST_RETRY_LABEL,
    to: retryTo,
  },
});
