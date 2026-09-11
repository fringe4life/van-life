import {
  AlignJustifyIcon,
  type LucideIcon,
  Rows2Icon,
  Rows3Icon,
  Rows4Icon,
} from "lucide-react";
import { useQueryStates } from "nuqs";
import { type ChangeEvent, startTransition } from "react";
import { css, cx } from "styled-system/css";
import { square } from "styled-system/patterns";
import { Select } from "~/components/ui/select";
import { useSupportsBaseSelect } from "~/hooks/use-supports-base-select";
import { DEFAULT_LIMIT, LIMITS } from "~/pagination/pagination-constants";
import { limitParsers, parseLimit } from "~/pagination/schema";
import type { Limits } from "~/pagination/types";

const LIMIT_ICONS = {
  5: Rows2Icon,
  10: Rows3Icon,
  20: Rows4Icon,
  50: AlignJustifyIcon,
} as const satisfies Record<Limits, LucideIcon>;

const limitIconClassName = cx(
  square({ size: "4" }),
  css({ color: "muted.foreground", fill: "none", flexShrink: "0" })
);

const limitSelectClassName = css({
  _supportsBaseSelect: { aspectRatio: "auto" },
  aspectRatio: "2/1",
  maxInlineSize: "fit-content",
});

export const PaginationLimitControl = () => {
  const [{ limit }, setSearchParams] = useQueryStates(limitParsers);
  const supportsBaseSelect = useSupportsBaseSelect();
  const currentLimit = limit ?? DEFAULT_LIMIT;

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
