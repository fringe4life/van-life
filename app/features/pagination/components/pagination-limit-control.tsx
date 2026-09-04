import { useQueryStates } from "nuqs";
import { type ChangeEvent, startTransition } from "react";
import { css, cx } from "styled-system/css";
import { buttonVariants } from "~/components/ui/button-variants";
import {
  DEFAULT_LIMIT,
  LIMITS,
} from "~/features/pagination/pagination-constants";
import { limitParsers, parseLimit } from "~/features/pagination/schema";

export const PaginationLimitControl = () => {
  const [{ limit }, setSearchParams] = useQueryStates(limitParsers);

  const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    startTransition(async () => {
      await setSearchParams({
        limit: parseLimit(Number(event.target.value)),
      });
    });
  };

  return (
    <select
      aria-label="Pagination amount control"
      className={cx(
        buttonVariants({ size: "icon", variant: "outline" }),
        css({ width: "20" })
      )}
      onChange={handleLimitChange}
      value={limit?.toString() ?? DEFAULT_LIMIT.toString()}
    >
      {LIMITS.map((limitOption) => (
        <option key={limitOption} value={limitOption.toString()}>
          {limitOption}
        </option>
      ))}
    </select>
  );
};
