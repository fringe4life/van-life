import { FilterIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { useVanFilters } from "~/features/vans/hooks/use-van-filters";
import { VanStateFilterSection } from "./van-state-filter-section";
import { VanTypeFilterSection } from "./van-type-filter-section";

const VanFilters = () => {
  const {
    badgeCount,
    baseId,
    optimisticTypes,
    stateFacets,
    toggleType,
    setStateFilter,
  } = useVanFilters();
  const hasFilters = badgeCount > 0;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button className="gap-2" variant="outline">
            <FilterIcon className="size-4" />
            Filters
            {hasFilters && (
              <Badge
                className="ml-1 flex size-5 items-center justify-center rounded-full p-0 text-xs"
                variant="outline"
              >
                {badgeCount}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="w-56 border-neutral-300 bg-white p-0 text-neutral-900 shadow-md"
      >
        <VanTypeFilterSection
          baseId={baseId}
          onToggle={toggleType}
          types={optimisticTypes}
        />
        <Separator className="bg-neutral-300" />
        <VanStateFilterSection
          baseId={baseId}
          facets={stateFacets}
          onCheckedChange={setStateFilter}
        />
      </PopoverContent>
    </Popover>
  );
};

export { VanFilters };
