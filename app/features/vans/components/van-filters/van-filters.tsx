import { FilterIcon } from "lucide-react";
import { css, cx } from "styled-system/css";
import { flex, grid, hstack } from "styled-system/patterns";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useVanFilters } from "~/features/vans/hooks/use-van-filters";
import { VanStateFilterSection } from "./van-state-filter-section";
import { VanTypeFilterSection } from "./van-type-filter-section";

const VanFilters = () => {
  const {
    badgeCount,
    baseId,
    clearFilters,
    optimisticTypes,
    stateFacets,
    toggleType,
    setStateFilter,
  } = useVanFilters();
  const hasFilters = badgeCount > 0;

  return (
    <aside
      aria-label="Van filters"
      className={cx(
        grid({
          alignSelf: { lg: "start" },
          gap: "4",
        }),
        css({
          backgroundColor: { base: "surface.overlay", lg: "transparent" },
          borderColor: { base: "border", lg: "border.accent" },
          borderLeftWidth: { lg: "2" },
          borderRadius: { base: "xl", lg: "0" },
          borderWidth: { base: "1", lg: "0" },
          insetBlockStart: { lg: "6" },
          maxBlockSize: { lg: "calc(100dvh - 3rem)" },
          minInlineSize: "0",
          overflowY: { lg: "auto" },
          padding: { base: "4", lg: "0" },
          paddingInlineStart: { lg: "5" },
          position: { lg: "sticky" },
          shadow: { base: "xs", lg: "none" },
        })
      )}
    >
      <header className={grid({ gap: "1" })}>
        <div
          className={cx(
            flex({
              alignItems: "center",
              gap: "3",
              justifyContent: "space-between",
            }),
            css({ minInlineSize: "0" })
          )}
        >
          <p
            className={cx(
              hstack({ gap: "2" }),
              css({
                color: "muted.foreground",
                fontSize: "xs",
                fontWeight: "semibold",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              })
            )}
          >
            <FilterIcon
              aria-hidden
              className={css({
                blockSize: "4",
                color: "primary",
                inlineSize: "4",
              })}
            />
            Roadbook
          </p>
          <Badge
            aria-live="polite"
            className={css({
              flexShrink: "0",
              whiteSpace: "nowrap",
            })}
            size="small"
            variant={hasFilters ? "LUXURY" : "outline"}
          >
            {hasFilters ? `${badgeCount} active` : "All vans"}
          </Badge>
        </div>

        <h3
          className={css({
            fontSize: "xl",
            fontWeight: "bold",
            letterSpacing: "tight",
          })}
        >
          Narrow the route
        </h3>

        <p
          className={css({
            color: "muted.foreground",
            fontSize: "xs",
            lineHeight: "5",
          })}
        >
          Pick a van character, then keep the road open.
        </p>
      </header>

      <div
        className={cx(
          flex({
            alignItems: "center",
            gap: "3",
            justifyContent: "space-between",
          }),
          css({
            borderBottomWidth: "thin",
            borderColor: "border.subtle",
            paddingBlockEnd: "3",
          })
        )}
      >
        <span
          className={css({
            color: "muted.foreground",
            fontSize: "xs",
          })}
        >
          All available paths
        </span>
        <Button
          className={css({
            blockSize: "auto",
            color: { _hover: "foreground", base: "primary" },
            fontSize: "xs",
            padding: "0",
            textDecoration: "underline",
            textDecorationColor: "primary/35",
            textUnderlineOffset: "4",
            transitionDuration: "fast",
            transitionProperty: "colors",
          })}
          disabled={!hasFilters}
          onClick={clearFilters}
          size="sm"
          variant="link"
        >
          Clear all
        </Button>
      </div>

      <div
        className={css({
          backgroundColor: { base: "surface.overlay.muted", lg: "transparent" },
          borderColor: "border.subtle",
          borderRadius: "lg",
          borderWidth: { base: "1", lg: "0" },
          padding: { base: "1", lg: "0" },
        })}
      >
        <VanTypeFilterSection
          baseId={baseId}
          onToggle={toggleType}
          types={optimisticTypes}
        />
        <VanStateFilterSection
          baseId={baseId}
          facets={stateFacets}
          onCheckedChange={setStateFilter}
        />
      </div>

      <p
        className={css({
          borderColor: "border.subtle",
          borderTopWidth: "thin",
          color: "muted.foreground",
          display: { base: "none", lg: "block" },
          fontSize: "xs",
          lineHeight: "5",
          paddingBlockStart: "4",
        })}
      >
        Your selected route stays in the URL while the catalog updates.
      </p>
    </aside>
  );
};

export { VanFilters };
