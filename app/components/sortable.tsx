import { useQueryStates } from "nuqs";
import { startTransition } from "react";
import { GenericComponent } from "~/components/generic-component";
import { Button } from "~/components/ui/button";
import {
  DEFAULT_CURSOR,
  DEFAULT_DIRECTION,
} from "~/features/pagination/pagination-constants";
import type { SortOption } from "~/features/pagination/types";
import { hostPaginationParsers } from "~/lib/parsers";
import type { Maybe } from "~/types";
import { cn } from "~/utils/utils";

interface SortableProps {
  /** Optional className for the container */
  className?: string;
  /** Number of items being sorted (for display) */
  itemCount: Maybe<number>;
  /** Title to display above the sort buttons */
  title: string;
}

/**
 * Reusable sorting component that provides sort buttons and clear filters functionality
 * Uses nuqs for URL state management and integrates with the existing pagination system
 *
 * @example
 * ```tsx
 * <Sortable
 *   title="Reviews"
 *   itemCount={reviews.length}
 * />
 * ```
 */
const sortOptions = [
  { id: "Newest", value: "newest" as const },
  { id: "Oldest", value: "oldest" as const },
  { id: "Highest", value: "highest" as const },
  { id: "Lowest", value: "lowest" as const },
];

type SortOptionItem = (typeof sortOptions)[number];

const Sortable = ({ title, itemCount, className }: SortableProps) => {
  // Use nuqs for client-side state management
  const [{ sort }, setSearchParams] = useQueryStates(hostPaginationParsers);

  // Derive state to check if sort filter is active (not default)
  // const hasActiveSortFilter = sort !== DEFAULT_SORT;

  const handleSortChange = (sortOption: SortOption) => {
    startTransition(async () => {
      await setSearchParams({
        cursor: DEFAULT_CURSOR,
        direction: DEFAULT_DIRECTION,
        sort: sortOption,
      });
    });
  };

  const renderSortButtonProps = (item: SortOptionItem) => ({
    children: item.id,
    className: cn(
      "w-full cursor-pointer text-center sm:w-fit sm:text-left",
      sort === item.value && "bg-orange-400 font-semibold text-white"
    ),
    onClick: () => handleSortChange(item.value),
    variant: "ghost" as const,
  });

  if (!itemCount) {
    return <div />;
  }

  return (
    <div
      className={cn(
        "mb-6 flex max-w-dvw flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <h3 className="font-bold text-lg text-neutral-900">
        {title} ({itemCount})
      </h3>

      <GenericComponent
        Component={Button}
        className="grid grid-cols-2 items-center gap-2 overflow-x-auto sm:grid-flow-col sm:grid-cols-4 sm:gap-4"
        emptyStateMessage=""
        errorStateMessage="Something went wrong"
        items={sortOptions}
        renderProps={renderSortButtonProps}
      />
    </div>
  );
};

export { Sortable };
