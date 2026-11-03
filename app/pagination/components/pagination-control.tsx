import { useQueryStates } from "nuqs";
import {
  addTransitionType,
  startTransition as startReactTransition,
  type TransitionStartFunction,
} from "react";
import { hstack } from "styled-system/patterns";
import { arrowRecipe } from "~/components/arrow-recipe";
import { ChevronIcon } from "~/components/icons/chevron-icon";
import { Button } from "~/components/ui/button";
import {
  useBumpPaginationPageEpoch,
  usePaginationPendingDirection,
} from "~/pagination/components/pagination-page-epoch";
import { cursorPaginationParsers } from "~/pagination/parsers";
import type { Direction, PaginationProps } from "~/pagination/types";
import type { Id, Prettify } from "~/types";

const previousArrowClassName = arrowRecipe({
  direction: "left",
  distance: "compact",
});
const nextArrowClassName = arrowRecipe({
  direction: "right",
  distance: "compact",
});

type PaginationControlProps<T> = Prettify<
  PaginationProps<T> & {
    startTransition?: TransitionStartFunction;
  }
>;

export const PaginationControl = <T extends Id>({
  items,
  paginationMetadata,
  startTransition = startReactTransition,
}: PaginationControlProps<T>) => {
  const [, setSearchParams] = useQueryStates(cursorPaginationParsers, {
    startTransition,
  });
  const bumpPageEpoch = useBumpPaginationPageEpoch();
  /*
   * The pulse rides the pending direction that already exists (#432 / #433) —
   * no timer, no extra state. It lasts exactly as long as the gesture is real:
   * one burst on a fast page, repeated streaks while a slice is still loading.
   * These buttons are inside the keyed slice, so a pulse of their own would be
   * replaced mid-gesture anyway.
   */
  const pulseDirection = usePaginationPendingDirection();
  const { hasNextPage, hasPreviousPage } = paginationMetadata;

  const handlePageChange = (direction: Direction) => {
    const cursorItem = direction === "forward" ? items.at(-1) : items.at(0);
    if (!cursorItem) {
      return;
    }
    startTransition(async () => {
      addTransitionType(direction);
      bumpPageEpoch?.(direction);
      await setSearchParams({
        cursor: cursorItem.id,
        direction,
      });
    });
  };

  const handlePreviousPage = () => {
    handlePageChange("backward");
  };

  const handleNextPage = () => {
    handlePageChange("forward");
  };

  return (
    <div className={hstack({ gap: "2" })}>
      <Button
        aria-label="Previous page"
        className="group"
        data-pulse={pulseDirection === "backward" ? "true" : undefined}
        disabled={!hasPreviousPage}
        onClick={handlePreviousPage}
        size="icon"
        variant="outline"
      >
        <ChevronIcon
          className={previousArrowClassName}
          direction="left"
          morph="arrow"
        />
      </Button>
      <Button
        aria-label="Next page"
        className="group"
        data-pulse={pulseDirection === "forward" ? "true" : undefined}
        disabled={!hasNextPage}
        onClick={handleNextPage}
        size="icon"
        variant="outline"
      >
        <ChevronIcon
          className={nextArrowClassName}
          direction="right"
          morph="arrow"
        />
      </Button>
    </div>
  );
};
