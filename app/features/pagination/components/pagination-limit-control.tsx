import { useQueryStates } from "nuqs";
import { type ChangeEvent, startTransition } from "react";
import { buttonVariants } from "~/components/ui/button-variants";
import {
  DEFAULT_LIMIT,
  LIMITS,
} from "~/features/pagination/pagination-constants";
import { limitParsers } from "~/features/pagination/parsers";
import { validateLimit } from "~/features/pagination/utils/validators";
import { cn } from "~/utils/utils";

export const PaginationLimitControl = () => {
  const [{ limit }, setSearchParams] = useQueryStates(limitParsers);

  const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    startTransition(async () => {
      await setSearchParams({
        limit: validateLimit(Number(event.target.value)),
      });
    });
  };

  return (
    <select
      aria-label="Pagination amount control"
      className={cn(
        buttonVariants({ size: "icon", variant: "outline" }),
        "w-20"
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
