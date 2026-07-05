import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { type ChangeEvent, startTransition } from 'react';
import { Button } from '~/components/ui/button';
import { buttonVariants } from '~/components/ui/button-variants';
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

	const handleLimitSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		handleLimitChange(event.target.value);
	};

	const handlePreviousPage = () => {
		handlePageChange('backward');
	};

	const handleNextPage = () => {
		handlePageChange('forward');
	};

	return (
		<div className="my-6 flex items-center justify-between gap-4">
			<select
				className={cn(
					buttonVariants({ size: 'icon', variant: 'outline' }),
					'w-20'
				)}
				disabled={!(hasNextPage || hasPreviousPage)}
				onChange={handleLimitSelectChange}
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
					onClick={handlePreviousPage}
					size="icon"
					variant="outline"
				>
					<ChevronLeftIcon className="aspect-square w-4" />
				</Button>
				<Button
					aria-label="Next page"
					disabled={!hasNextPage}
					onClick={handleNextPage}
					size="icon"
					variant="outline"
				>
					<ChevronRightIcon className="aspect-square w-4" />
				</Button>
			</div>
		</div>
	);
};
