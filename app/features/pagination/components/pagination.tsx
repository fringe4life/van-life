import ChevronLeftIcon from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRightIcon from 'lucide-react/dist/esm/icons/chevron-right';
import { useQueryStates } from 'nuqs';
import { startTransition } from 'react';
import { Button, buttonVariants } from '~/components/ui/button';
import {
	DEFAULT_LIMIT,
	LIMITS,
} from '~/features/pagination/pagination-constants';
import type { Direction, PaginationProps } from '~/features/pagination/types';
import { validateLimit } from '~/features/pagination/utils/validators';
import { paginationParsers } from '~/lib/parsers';
import type { Id } from '~/types';
import { cn } from '~/utils/utils';

export const Pagination = <T extends Id>({
	items,
	paginationMetadata,
}: PaginationProps<T>) => {
	const [{ limit }, setSearchParams] = useQueryStates(paginationParsers);
	const { hasNextPage, hasPreviousPage } = paginationMetadata;

	// Ensure items is a valid array with items and is not empty
	if (!items || items.length === 0) {
		return (
			<p className="pr-1 text-right text-gray-500 text-sm italic">
				No items found
			</p>
		);
	}

	const handleLimitChange = (newLimit: string) => {
		// Keep cursor unchanged when changing limit - cursor represents position in dataset
		startTransition(async () => {
			await setSearchParams({
				limit: validateLimit(Number(newLimit)),
			});
		});
	};

	const handlePageChange = (direction: Direction) => {
		const item = direction === 'forward' ? items.at(-1) : items.at(0);
		if (item) {
			startTransition(async () => {
				await setSearchParams({
					cursor: item.id,
					direction,
				});
			});
		}
	};

	return (
		<div className="my-6 flex items-center justify-between gap-4">
			<select
				className={cn(
					buttonVariants({ variant: 'outline', size: 'icon' }),
					'w-20'
				)}
				disabled={!(hasNextPage || hasPreviousPage)}
				onChange={(e) => handleLimitChange(e.target.value)}
				value={limit?.toString() ?? DEFAULT_LIMIT.toString()}
			>
				{LIMITS.map((limitOption) => (
					<option key={limitOption} value={limitOption.toString()}>
						{limitOption}
					</option>
				))}
			</select>
			{/* Navigation buttons */}
			<div className="flex items-center gap-2">
				<Button
					aria-label="Previous page"
					disabled={!hasPreviousPage}
					onClick={() => handlePageChange('backward')}
					size="icon"
					variant="outline"
				>
					<ChevronLeftIcon className="aspect-square w-4" />
				</Button>
				<Button
					aria-label="Next page"
					disabled={!hasNextPage}
					onClick={() => handlePageChange('forward')}
					size="icon"
					variant="outline"
				>
					<ChevronRightIcon className="aspect-square w-4" />
				</Button>
			</div>
		</div>
	);
};
