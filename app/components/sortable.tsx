import { useQueryStates } from "nuqs";
import { startTransition } from "react";
import { GenericComponent } from "~/components/generic-component";
import { Button } from "~/components/ui/button";
import {
  DEFAULT_CURSOR,
  DEFAULT_DIRECTION,
} from "~/features/pagination/pagination-constants";
import { hostPaginationParsers } from "~/features/pagination/parsers";
import type { SortOption } from "~/features/pagination/types";
import type { Maybe } from "~/types";
import { css, cx, viewTransition } from "../../styled-system/css";
import { flex, grid } from "../../styled-system/patterns";

interface SortableProps {
  /** Optional className for the container */
  className?: string;
  /** Number of items being sorted (for display) */
  itemCount: Maybe<number>;
  /** Title to display above the sort buttons */
  title: string;
}
/** 
 * ::view-transition-old(sortable-title) {
  --fade-to: 0;
  --slide-y-to: 1rem;
  animation-name: --fade, --slide-y;
}

::view-transition-new(sortable-title) {
  --fade-from: 0;
  --slide-y-from: -1rem;
  animation-name: --fade, --slide-y;
}
*/

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
    className: cx(
      css({
        cursor: "pointer",
        inlineSize: { base: "full", sm: "fit" },
        textAlign: { base: "center", sm: "left" },
      }),
      sort === item.value &&
        css({
          backgroundColor: "primary",
          color: "primary.foreground",
          fontWeight: "semibold",
        })
    ),
    onClick: () => handleSortChange(item.value),
    variant: "ghost" as const,
  });

  if (!itemCount) {
    return <div />;
  }

  return (
    <div
      className={cx(
        flex({
          direction: { base: "column", sm: "row" },
          gap: 4,
          sm: {
            alignItems: "center",
            justifyContent: "space-between",
          },
        }),
        css({
          marginBlockEnd: 6,
          maxInlineSize: "100dvw",
        }),
        className
      )}
    >
      <h3
        className={cx(
          viewTransition("sortableTitle"),
          css({
            color: "foreground",
            fontSize: "lg",
            fontWeight: "bold",
            viewTransitionName: "sortable-title",
          })
        )}
      >
        {title} ({itemCount})
      </h3>

      <GenericComponent
        Component={Button}
        className={grid({
          alignItems: "center",
          columns: { base: 2, sm: 4 },
          gap: { base: 2, sm: 4 },
          gridAutoFlow: { sm: "column" },
          overflowX: "auto",
        })}
        emptyState={null}
        errorState={{ title: "Something went wrong" }}
        items={sortOptions}
        noMatchState={null}
        renderProps={renderSortButtonProps}
      />
    </div>
  );
};

export { Sortable };
