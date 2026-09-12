import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { addTransitionType, startTransition } from "react";
import { hstack } from "styled-system/patterns";
import { arrowRecipe } from "~/components/arrow-recipe";
import { Button } from "~/components/ui/button";
import { useBumpPaginationPageEpoch } from "~/pagination/components/pagination-page-epoch";
import { cursorPaginationParsers } from "~/pagination/parsers";
import type { Direction, PaginationProps } from "~/pagination/types";
import type { Id } from "~/types";

const previousArrowClassName = arrowRecipe({
  direction: "left",
  distance: "compact",
});
const nextArrowClassName = arrowRecipe({
  direction: "right",
  distance: "compact",
});

export const PaginationControl = <T extends Id>({
  items,
  paginationMetadata,
}: PaginationProps<T>) => {
  const [, setSearchParams] = useQueryStates(cursorPaginationParsers);
  const bumpPageEpoch = useBumpPaginationPageEpoch();
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
        disabled={!hasPreviousPage}
        onClick={handlePreviousPage}
        size="icon"
        variant="outline"
      >
        <ChevronLeftIcon className={previousArrowClassName} />
      </Button>
      <Button
        aria-label="Next page"
        className="group"
        disabled={!hasNextPage}
        onClick={handleNextPage}
        size="icon"
        variant="outline"
      >
        <ChevronRightIcon className={nextArrowClassName} />
      </Button>
    </div>
  );
};
