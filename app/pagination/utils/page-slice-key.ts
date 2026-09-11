import type { Direction } from "~/pagination/types";
import type { Id, List } from "~/types";

const pageSliceKey = (items: List<Id> | readonly Id[]): string => {
  if (!items?.length) {
    return "";
  }

  return items.map((item) => item.id).join("\0");
};

const takePageSliceMove = (
  sliceKey: string,
  previousSliceKey: string | null,
  pendingDirection: Direction | null
): { direction: Direction | null; isFirstPaint: boolean } => {
  if (sliceKey === previousSliceKey) {
    return { direction: null, isFirstPaint: false };
  }

  return {
    direction: pendingDirection,
    isFirstPaint: previousSliceKey === null,
  };
};

export { pageSliceKey, takePageSliceMove };
