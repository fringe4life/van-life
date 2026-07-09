import type { HostVanListItem, PendingVan } from "~/features/vans/types";

export interface HostVansListAction {
  item: PendingVan;
  type: "add";
}

export function hostVansListReducer(
  state: HostVanListItem[],
  action: HostVansListAction
): HostVanListItem[] {
  if (action.type === "add") {
    return [...state, action.item];
  }
  return state;
}
