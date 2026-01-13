'use client';

import { FilterIcon } from 'lucide-react';
import { debounce, useQueryStates } from 'nuqs';
import { startTransition } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
} from '~/features/pagination/pagination-constants';
import { useOptimisticBooleanFilter } from '~/features/vans/hooks/use-optimistic-boolean-filter';
import { useOptimisticTypesFilter } from '~/features/vans/hooks/use-optimistic-types-filter';
import type { LowercaseVanType } from '~/features/vans/types';
import { VAN_TYPE_LOWERCASE } from '~/features/vans/types.server';
import { paginationParsers, vanFiltersParser } from '~/lib/parsers';
import { cn } from '~/utils/utils';

// Constants for debounce timing
const FILTER_DEBOUNCE_DELAY = 250; // milliseconds

const VanFilters = () => {
	const [filters, setFilters] = useQueryStates(vanFiltersParser);
	const [, setSearchParams] = useQueryStates(paginationParsers);

	const { types, excludeInRepair, onlyOnSale } = filters;

	// Filter out empty strings and ensure proper typing
	const validTypes = (types ?? []).filter(
		(t): t is LowercaseVanType =>
			t !== '' && VAN_TYPE_LOWERCASE.includes(t as LowercaseVanType)
	);

	// Use optimistic hooks for immediate UI feedback
	const [optimisticTypes, toggleOptimisticType] =
		useOptimisticTypesFilter(validTypes);
	const [optimisticExcludeInRepair, toggleOptimisticExcludeInRepair] =
		useOptimisticBooleanFilter(excludeInRepair ?? false);
	const [optimisticOnlyOnSale, toggleOptimisticOnlyOnSale] =
		useOptimisticBooleanFilter(onlyOnSale ?? false);

	// Calculate active filter count using optimistic values
	const activeFilterCount =
		(optimisticTypes.length ?? 0) +
		(optimisticExcludeInRepair ? 1 : 0) +
		(optimisticOnlyOnSale ? 1 : 0);

	const handleTypeToggle = (type: string) => {
		// Optimistic update happens immediately

		// Actual URL update with debounce
		startTransition(() => {
			toggleOptimisticType(type as LowercaseVanType);
			// Filter out empty strings and ensure proper typing
			const currentTypes = (types ?? []).filter(
				(t): t is LowercaseVanType =>
					t !== '' && VAN_TYPE_LOWERCASE.includes(t as LowercaseVanType)
			);
			const typedType = type as LowercaseVanType;
			const newTypes = currentTypes.includes(typedType)
				? currentTypes.filter((t) => t !== typedType)
				: [...currentTypes, typedType];
			startTransition(async () => {
				await setFilters(
					{ types: newTypes.length > 0 ? newTypes : [] },
					{
						limitUrlUpdates: debounce(FILTER_DEBOUNCE_DELAY),
					}
				);
			});
			startTransition(async () => {
				await setSearchParams({
					cursor: DEFAULT_CURSOR,
					direction: DEFAULT_DIRECTION,
				});
			});
		});
	};

	const handleExcludeInRepairToggle = (checked: boolean) => {
		// Actual URL update with debounce
		startTransition(async () => {
			// Optimistic update happens immediately
			toggleOptimisticExcludeInRepair({ type: 'toggle' });

			await setFilters(
				{ excludeInRepair: checked },
				{
					limitUrlUpdates: debounce(FILTER_DEBOUNCE_DELAY),
				}
			);

			startTransition(async () => {
				await setSearchParams({
					cursor: DEFAULT_CURSOR,
					direction: DEFAULT_DIRECTION,
				});
			});
		});
	};

	const handleOnlyOnSaleToggle = (checked: boolean) => {
		// Optimistic update happens immediately

		// Actual URL update with debounce
		startTransition(() => {
			toggleOptimisticOnlyOnSale({ type: 'toggle' });
			startTransition(async () => {
				await setFilters(
					{ onlyOnSale: checked },
					{
						limitUrlUpdates: debounce(FILTER_DEBOUNCE_DELAY),
					}
				);
			});
			startTransition(async () => {
				await setSearchParams({
					cursor: DEFAULT_CURSOR,
					direction: DEFAULT_DIRECTION,
				});
			});
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="gap-2" variant="outline">
					<FilterIcon className="size-4" />
					Filters
					{activeFilterCount > 0 && (
						<Badge
							className="ml-1 flex size-5 items-center justify-center rounded-full p-0 text-xs"
							variant="outline"
						>
							{activeFilterCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuLabel>Van Types</DropdownMenuLabel>
				{VAN_TYPE_LOWERCASE.map((type) => {
					const isOptimistic = optimisticTypes.includes(type);
					const isActual = types?.includes(type) ?? false;
					const isPending = isOptimistic !== isActual;

					return (
						<DropdownMenuCheckboxItem
							checked={isOptimistic}
							className={cn(isPending && 'opacity-75')}
							key={type}
							onCheckedChange={() => handleTypeToggle(type)}
							onSelect={(e) => e.preventDefault()}
						>
							{type.charAt(0).toUpperCase() + type.slice(1)}
						</DropdownMenuCheckboxItem>
					);
				})}
				<DropdownMenuSeparator />
				<DropdownMenuLabel>State Filters</DropdownMenuLabel>
				<DropdownMenuCheckboxItem
					checked={optimisticExcludeInRepair}
					className={cn(
						optimisticExcludeInRepair !== excludeInRepair && 'opacity-75'
					)}
					onCheckedChange={handleExcludeInRepairToggle}
					onSelect={(e) => e.preventDefault()}
				>
					Exclude in repair
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={optimisticOnlyOnSale}
					className={cn(optimisticOnlyOnSale !== onlyOnSale && 'opacity-75')}
					onCheckedChange={handleOnlyOnSaleToggle}
					onSelect={(e) => e.preventDefault()}
				>
					Only on sale
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { VanFilters };
