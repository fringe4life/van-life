import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { startTransition } from "react";
import { Button } from "~/components/ui/button";
import { cursorPaginationParsers } from "~/features/pagination/parsers";
import type { Direction, PaginationProps } from "~/features/pagination/types";
import type { Id } from "~/types";

export const PaginationControl = <T extends Id>({
  items,
  paginationMetadata,
}: PaginationProps<T>) => {
  const [, setSearchParams] = useQueryStates(cursorPaginationParsers);
  const { hasNextPage, hasPreviousPage } = paginationMetadata;

  const handlePageChange = (direction: Direction) => {
    const cursorItem = direction === "forward" ? items.at(-1) : items.at(0);
    if (!cursorItem) {
      return;
    }
    startTransition(async () => {
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
    <div className="flex items-center gap-2">
      <Button
        aria-label="Previous page"
        disabled={!hasPreviousPage}
        onClick={handlePreviousPage}
        size="icon"
        variant="outline"
      >
        <ChevronLeftIcon className="aspect-square w-4" />
      </Button>
      <Button
        aria-label="Next page"
        disabled={!hasNextPage}
        onClick={handleNextPage}
        size="icon"
        variant="outline"
      >
        <ChevronRightIcon className="aspect-square w-4" />
      </Button>
    </div>
  );
};
