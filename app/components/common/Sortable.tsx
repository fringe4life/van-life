import { clsx } from 'clsx';
import { useQueryStates } from 'nuqs';
import { Button } from '~/components/ui/button';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_SORT,
	SORT_OPTIONS,
} from '~/constants/paginationConstants';
import { hostPaginationParsers } from '~/lib/parsers';
import type { SortOption } from '~/types/types';
import { cn } from '~/utils/utils';

interface SortableProps {
	/** Title to display above the sort buttons */
	title: string;
	/** Number of items being sorted (for display) */
	itemCount: number;
	/** Optional className for the container */
	className?: string;
}

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
export default function Sortable({
	title,
	itemCount,
	className,
}: SortableProps) {
	// Use nuqs for client-side state management
	const [{ sort }, setSearchParams] = useQueryStates(hostPaginationParsers);

	// Derive state to check if sort filter is active (not default)
	const hasActiveSortFilter = sort !== DEFAULT_SORT;

	const handleSortChange = (sortOption: SortOption) => {
		setSearchParams({
			sort: sortOption,
			cursor: DEFAULT_CURSOR,
			direction: DEFAULT_DIRECTION,
		});
	};

	const handleClearFilters = () => {
		setSearchParams({
			sort: DEFAULT_SORT,
			cursor: DEFAULT_CURSOR,
			direction: DEFAULT_DIRECTION,
		});
	};

	return (
		<div
			className={cn(
				'mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
				className,
			)}
		>
			<h3 className="font-bold text-lg text-neutral-900">
				{title} ({itemCount})
			</h3>

			<div className="flex flex-wrap items-center gap-2">
				{SORT_OPTIONS.map((sortOption) => (
					<Button
						key={sortOption}
						variant="ghost"
						className={cn(
							'w-full text-center sm:w-fit sm:text-left',
							sort === sortOption && 'bg-green-500 font-semibold text-white',
						)}
						onClick={() => handleSortChange(sortOption)}
					>
						{sortOption === 'newest' && 'Newest to Oldest'}
						{sortOption === 'oldest' && 'Oldest to Newest'}
						{sortOption === 'highest' && 'Highest to Lowest'}
						{sortOption === 'lowest' && 'Lowest to Highest'}
					</Button>
				))}

				<Button
					variant="ghost"
					className={clsx(
						'w-full text-center sm:w-fit sm:text-left',
						hasActiveSortFilter && 'underline',
					)}
					onClick={handleClearFilters}
				>
					Clear filters
				</Button>
			</div>
		</div>
	);
}
