import { FilterIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
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
      className="grid min-w-0 gap-4 rounded-xl border border-neutral-900/15 bg-white/70 p-4 shadow-xs lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:self-start lg:overflow-y-auto lg:rounded-none lg:border-0 lg:border-orange-400/60 lg:border-l-2 lg:bg-transparent lg:p-0 lg:pl-5 lg:shadow-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <p className="flex items-center gap-2 font-semibold text-neutral-600 text-xs uppercase tracking-[0.14em]">
            <FilterIcon aria-hidden className="size-4 text-orange-600" />
            Roadbook
          </p>
          <h3 className="font-bold text-xl tracking-tight">Narrow the route</h3>
          <p className="max-w-[18ch] text-neutral-600 text-xs leading-5">
            Pick a van character, then keep the road open.
          </p>
        </div>
        <Badge
          aria-live="polite"
          className="shrink-0 whitespace-nowrap"
          size="small"
          variant={hasFilters ? "luxury" : "outline"}
        >
          {hasFilters ? `${badgeCount} active` : "All vans"}
        </Badge>
      </div>
      <div className="flex items-center justify-between gap-3 border-neutral-900/10 border-b pb-3">
        <span className="text-neutral-600 text-xs">All available paths</span>
        <button
          className="rounded-sm text-orange-600 text-xs underline decoration-orange-600/35 underline-offset-4 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40"
          disabled={!hasFilters}
          onClick={clearFilters}
          type="button"
        >
          Clear all
        </button>
      </div>
      <div className="rounded-lg border border-neutral-900/10 bg-white/55 p-1 lg:border-0 lg:bg-transparent lg:p-0">
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
      <p className="hidden border-neutral-900/10 border-t pt-4 text-neutral-600 text-xs leading-5 lg:block">
        Your selected route stays in the URL while the catalog updates.
      </p>
    </aside>
  );
};

export { VanFilters };
