import { useQueryStates } from "nuqs";
import {
  type ChangeEvent,
  startTransition as startReactTransition,
  type TransitionStartFunction,
} from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { square } from "styled-system/patterns";
import type { IconComponent } from "~/components/icons/icon";
import {
  RowsFourIcon,
  RowsManyIcon,
  RowsThreeIcon,
  RowsTwoIcon,
} from "~/components/icons/rows-icon";
import { Select } from "~/components/ui/select";
import { useSupportsBaseSelect } from "~/hooks/use-supports-base-select";
import { DEFAULT_LIMIT, LIMITS } from "~/pagination/pagination-constants";
import { limitParsers } from "~/pagination/parsers";
import { parseLimit } from "~/pagination/schema";
import type { Limits } from "~/pagination/types";

const LIMIT_ICONS = {
  5: RowsTwoIcon,
  10: RowsThreeIcon,
  20: RowsFourIcon,
  50: RowsManyIcon,
} as const satisfies Record<Limits, IconComponent>;

const limitIconClassName = cx(
  square({ size: "4" }),
  css({ color: "muted.foreground", fill: "none", flexShrink: "0" })
);

const limitSelectClassName = css({
  _supportsBaseSelect: { aspectRatio: "auto" },
  aspectRatio: "2/1",
  maxInlineSize: "fit-content",
});

export const PaginationLimitControl = ({
  startTransition = startReactTransition,
}: {
  startTransition?: TransitionStartFunction;
} = {}) => {
  const [{ limit }, setSearchParams] = useQueryStates(limitParsers, {
    startTransition,
  });
  const supportsBaseSelect = useSupportsBaseSelect();
  const currentLimit = limit ?? DEFAULT_LIMIT;
  const CurrentLimitIcon = LIMIT_ICONS[currentLimit];

  const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLimit = parseLimit(Number(event.currentTarget.value));
    if (nextLimit === currentLimit) {
      return;
    }
    startTransition(async () => {
      await setSearchParams({
        limit: nextLimit,
      });
    });
  };

  return (
    <Select
      aria-label="Pagination amount control"
      className={limitSelectClassName}
      name="limit"
      onChange={handleLimitChange}
      selectedIcon={
        <CurrentLimitIcon aria-hidden="true" className={limitIconClassName} />
      }
      value={currentLimit.toString()}
    >
      {LIMITS.map((limitOption) => {
        const LimitIcon = LIMIT_ICONS[limitOption];
        return (
          <option key={limitOption} value={limitOption.toString()}>
            {supportsBaseSelect ? (
              <LimitIcon aria-hidden="true" className={limitIconClassName} />
            ) : null}
            {limitOption}
          </option>
        );
      })}
    </Select>
  );
};
