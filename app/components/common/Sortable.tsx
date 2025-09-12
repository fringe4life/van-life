import { useQueryStates } from 'nuqs';
import GenericComponent from '~/components/common/GenericComponent';
import { Button } from '~/components/ui/button';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
} from '~/constants/paginationConstants';
import { hostPaginationParsers } from '~/lib/parsers';
import type { SortOption } from '~/types/types';
import { cn } from '~/utils/utils';

type SortableProps = {
	/** Title to display above the sort buttons */
	title: string;
	/** Number of items being sorted (for display) */
	itemCount: number;
	/** Optional className for the container */
	className?: string;
};

/**
 * Reusable sorting component that provides sort buttons and clear filters functionality
 * Uses nuqs for URL state management and integrates with the existing pagination system
 *
 * @example
 * ```tsx
 * <Sortable
 *   title="Reviews"
 *   itemCount={reviews.length}
 * />
 * ```
 */
const sortOptions = [
	{ value: 'newest' as SortOption, label: 'Newest' },
	{ value: 'oldest' as SortOption, label: 'Oldest' },
	{ value: 'highest' as SortOption, label: 'Highest' },
	{ value: 'lowest' as SortOption, label: 'Lowest' },
];

export default function Sortable({
	title,
	itemCount,
	className,
}: SortableProps) {
	// Use nuqs for client-side state management
	const [{ sort }, setSearchParams] = useQueryStates(hostPaginationParsers);

	// Derive state to check if sort filter is active (not default)
	// const hasActiveSortFilter = sort !== DEFAULT_SORT;

	const handleSortChange = (sortOption: SortOption) => {
		setSearchParams({
			sort: sortOption,
			cursor: DEFAULT_CURSOR,
			direction: DEFAULT_DIRECTION,
		});
	};

	// const handleClearFilters = () => {
	// 	setSearchParams({
	// 		sort: DEFAULT_SORT,
	// 		cursor: DEFAULT_CURSOR,
	// 		direction: DEFAULT_DIRECTION,
	// 	});
	// };

	return (
		<div
			className={cn(
				'mb-6 flex max-w-dvw flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
				className
			)}
		>
			<h3 className="font-bold text-lg text-neutral-900">
				{title} ({itemCount})
			</h3>

			<GenericComponent
				Component={Button}
				className="grid grid-cols-2 items-center gap-2 overflow-x-auto sm:grid-flow-col sm:grid-cols-4 sm:gap-4"
				emptyStateMessage=""
				items={sortOptions}
				renderKey={(item) => item.value}
				renderProps={(item) => ({
					variant: 'ghost' as const,
					className: cn(
						'w-full cursor-pointer text-center sm:w-fit sm:text-left',
						sort === item.value && 'bg-green-500 font-semibold text-white'
					),
					onClick: () => handleSortChange(item.value),
					children: item.label,
				})}
			/>
			{/* 
				<Button
					variant="ghost"
					className={clsx(
						'w-full text-center sm:w-fit sm:text-left',
						hasActiveSortFilter && 'underline',
					)}
					onClick={handleClearFilters}
				>
					Clear filters
				</Button> */}
		</div>
	);
}
