import { createContext, use } from "react";
import type { Direction } from "~/pagination/types";

type BumpPaginationPageEpoch = (direction: Direction) => void;

const PaginationPageEpochContext =
  createContext<BumpPaginationPageEpoch | null>(null);

const PaginationPendingDirectionContext = createContext<Direction | null>(null);

const PaginationPagerClearContext = createContext<(() => void) | null>(null);

const PaginationSliceLockContext = createContext(false);

const useBumpPaginationPageEpoch = () => use(PaginationPageEpochContext);

const usePaginationPendingDirection = () =>
  use(PaginationPendingDirectionContext);

const usePaginationPagerClear = () => use(PaginationPagerClearContext);

const usePaginationSliceLock = () => use(PaginationSliceLockContext);

export {
  PaginationPageEpochContext,
  PaginationPagerClearContext,
  PaginationPendingDirectionContext,
  PaginationSliceLockContext,
  useBumpPaginationPageEpoch,
  usePaginationPagerClear,
  usePaginationPendingDirection,
  usePaginationSliceLock,
};
