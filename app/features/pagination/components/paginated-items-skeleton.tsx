import type React from "react";
import type { AsProps } from "~/components/types";
import { DEFAULT_LIMIT } from "~/features/pagination/pagination-constants";
import type { Prettify } from "~/types";

type PaginatedItemsSkeletonProps<E extends React.ElementType = "div"> =
  Prettify<
    AsProps<E> & {
      Component: React.ComponentType;
      className?: string;
      count?: number;
      wrapperProps?: React.ComponentPropsWithoutRef<E>;
    }
  >;

const PaginatedItemsSkeleton = <E extends React.ElementType = "div">({
  Component,
  className = "",
  count = DEFAULT_LIMIT,
  as,
  wrapperProps,
}: PaginatedItemsSkeletonProps<E>) => {
  const Wrapper = as || "div";

  return (
    <Wrapper className={className} {...wrapperProps}>
      {Array.from({ length: count }, (_, i) => (
        <Component
          key={`skeleton-${
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            i
          }`}
        />
      ))}
    </Wrapper>
  );
};

export { PaginatedItemsSkeleton };
