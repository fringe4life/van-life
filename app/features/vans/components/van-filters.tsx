import { FilterIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { startTransition, useId } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover';
import { Separator } from '~/components/ui/separator';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
} from '~/features/pagination/pagination-constants';
import {
	type LowercaseVanType,
	VAN_TYPE_LOWERCASE,
} from '~/features/vans/constants/van-types';
import { useOptimisticBooleanFilter } from '~/features/vans/hooks/use-optimistic-boolean-filter';
import { useOptimisticTypesFilter } from '~/features/vans/hooks/use-optimistic-types-filter';
import {
	activeFilterCount,
	getLimitUrlUpdates,
	isRemovingFilter,
	type VanFilterUrlState,
} from '~/features/vans/utils/van-filter-url';
import { vansFilterUrlParsers } from '~/lib/parsers';
import { cn } from '~/utils/utils';

const toValidTypes = (types: string[] | null | undefined): LowercaseVanType[] =>
	(types ?? []).filter((t): t is LowercaseVanType =>
		VAN_TYPE_LOWERCASE.includes(t as LowercaseVanType)
	);

const VanFilters = () => {
	const [urlState, setUrlState] = useQueryStates(vansFilterUrlParsers);
	const baseId = useId();

	const { types, excludeInRepair, onlyOnSale } = urlState;

	const validTypes = toValidTypes(types);

	const [optimisticTypes, toggleOptimisticType] =
		useOptimisticTypesFilter(validTypes);
	const [optimisticExcludeInRepair, toggleOptimisticExcludeInRepair] =
		useOptimisticBooleanFilter(excludeInRepair ?? false);
	const [optimisticOnlyOnSale, toggleOptimisticOnlyOnSale] =
		useOptimisticBooleanFilter(onlyOnSale ?? false);

	const currentFilterState = (): VanFilterUrlState => ({
		types: validTypes,
		excludeInRepair: excludeInRepair ?? false,
		onlyOnSale: onlyOnSale ?? false,
	});

	const commitFilterUpdate = (
		partial: Partial<
			Pick<VanFilterUrlState, 'types' | 'excludeInRepair' | 'onlyOnSale'>
		>,
		optimisticUpdate: () => void,
		isRemoving: boolean
	) => {
		startTransition(async () => {
			optimisticUpdate();
			await setUrlState(
				{
					...partial,
					cursor: DEFAULT_CURSOR,
					direction: DEFAULT_DIRECTION,
				},
				{ limitUrlUpdates: getLimitUrlUpdates(isRemoving) }
			);
		});
	};

	const badgeCount = activeFilterCount({
		types: optimisticTypes,
		excludeInRepair: optimisticExcludeInRepair,
		onlyOnSale: optimisticOnlyOnSale,
	});

	const handleTypeToggle = (type: LowercaseVanType) => {
		const current = currentFilterState();
		const newTypes = current.types.includes(type)
			? current.types.filter((t) => t !== type)
			: [...current.types, type];
		const next: VanFilterUrlState = {
			...current,
			types: newTypes,
		};
		const removing = isRemovingFilter(current, next);

		commitFilterUpdate(
			{ types: next.types },
			() => toggleOptimisticType(type),
			removing
		);
	};

	const handleExcludeInRepairToggle = (checked: boolean) => {
		const current = currentFilterState();
		const next: VanFilterUrlState = { ...current, excludeInRepair: checked };
		const removing = isRemovingFilter(current, next);

		commitFilterUpdate(
			{ excludeInRepair: checked },
			() => toggleOptimisticExcludeInRepair({ type: 'toggle' }),
			removing
		);
	};

	const handleOnlyOnSaleToggle = (checked: boolean) => {
		const current = currentFilterState();
		const next: VanFilterUrlState = { ...current, onlyOnSale: checked };
		const removing = isRemovingFilter(current, next);

		commitFilterUpdate(
			{ onlyOnSale: checked },
			() => toggleOptimisticOnlyOnSale({ type: 'toggle' }),
			removing
		);
	};

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button className="gap-2" variant="outline">
						<FilterIcon className="size-4" />
						Filters
						{badgeCount > 0 && (
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
				<div className="p-1">
					<p className="px-2 py-1.5 font-medium text-sm">Van Types</p>
					{VAN_TYPE_LOWERCASE.map((type) => {
						const isOptimistic = optimisticTypes.includes(type);
						const id = `${baseId}-van-filter-type-${type}`;

						return (
							<div
								className={'flex items-center gap-2 rounded-sm px-2 py-1.5'}
								key={type}
							>
								<Checkbox
									checked={isOptimistic}
									id={id}
									onCheckedChange={() => handleTypeToggle(type)}
								/>
								<Label className="cursor-pointer font-normal" htmlFor={id}>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</Label>
							</div>
						);
					})}
				</div>
				<Separator className="bg-neutral-300" />
				<div className="p-1">
					<p className="px-2 py-1.5 font-medium text-sm">State Filters</p>
					<div className={'flex items-center gap-2 rounded-sm px-2 py-1.5'}>
						<Checkbox
							checked={optimisticExcludeInRepair}
							id={`${baseId}-van-filter-exclude-in-repair`}
							onCheckedChange={(checked) =>
								handleExcludeInRepairToggle(checked === true)
							}
						/>
						<Label
							className="cursor-pointer font-normal"
							htmlFor={`${baseId}-van-filter-exclude-in-repair`}
						>
							Exclude in repair
						</Label>
					</div>
					<div
						className={cn(
							'flex items-center gap-2 rounded-sm px-2 py-1.5',
							optimisticOnlyOnSale !== onlyOnSale && 'opacity-75'
						)}
					>
						<Checkbox
							checked={optimisticOnlyOnSale}
							id={`${baseId}-van-filter-only-on-sale`}
							onCheckedChange={(checked) =>
								handleOnlyOnSaleToggle(checked === true)
							}
						/>
						<Label
							className="cursor-pointer font-normal"
							htmlFor={`${baseId}-van-filter-only-on-sale`}
						>
							Only on sale
						</Label>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export { VanFilters };
