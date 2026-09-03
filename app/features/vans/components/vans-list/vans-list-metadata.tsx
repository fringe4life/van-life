import { css } from "styled-system/css";
import type { VansListFilterState } from "./vans-list-state";

export type VansListMetadataItem =
  | { kind: "search"; value: string }
  | { kind: "types"; value: string }
  | { kind: "excludeInRepair" }
  | { kind: "onlyOnSale" };

export const getVansListMetadataItems = ({
  excludeInRepair,
  onlyOnSale,
  search,
  types,
}: VansListFilterState): VansListMetadataItem[] => {
  const items: VansListMetadataItem[] = [];

  if (search.trim() !== "") {
    items.push({ kind: "search", value: search });
  }
  if (types.length > 0) {
    items.push({ kind: "types", value: types.join(", ") });
  }
  if (excludeInRepair) {
    items.push({ kind: "excludeInRepair" });
  }
  if (onlyOnSale) {
    items.push({ kind: "onlyOnSale" });
  }

  return items;
};

const renderVansListMetadataItem = (item: VansListMetadataItem) => {
  switch (item.kind) {
    case "search":
      return (
        <span key={item.kind}>
          Search: <bdi dir="auto">{item.value}</bdi>
        </span>
      );
    case "types":
      return <span key={item.kind}>Types: {item.value}</span>;
    case "excludeInRepair":
      return <span key={item.kind}>Excludes repair</span>;
    case "onlyOnSale":
      return <span key={item.kind}>On sale only</span>;
    default:
      return null;
  }
};

export const VansListMetadata = (props: VansListFilterState) => (
  <div
    className={css({
      display: "flex",
      flexWrap: "wrap",
      gap: "2",
    })}
  >
    {getVansListMetadataItems(props).map(renderVansListMetadataItem)}
  </div>
);
