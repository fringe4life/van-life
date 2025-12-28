import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { type MouseEventHandler, startTransition } from 'react';
import { Button, buttonVariants } from '~/components/ui/button';
import {
	DEFAULT_DIRECTION,
	DEFAULT_LIMIT,
	LIMITS,
} from '~/features/pagination/pagination-constants';
import type { PaginationProps } from '~/features/pagination/types';
import { validateLimit } from '~/features/pagination/utils/validators';
import { paginationParsers } from '~/lib/parsers';
import type { Id } from '~/types/types';
import { cn } from '~/utils/utils';

export const Pagination = <T extends Id>({
	items,
	paginationMetadata,
}: PaginationProps<T>) => {
	const [{ limit }, setSearchParams] = useQueryStates(paginationParsers);
	const { hasNextPage, hasPreviousPage } = paginationMetadata;

	// Ensure items is a valid array with items and is not empty
	if (!items || items.length === 0) {
		return <div />;
	}

	const handleLimitChange = (newLimit: string) => {
		// Keep cursor unchanged when changing limit - cursor represents position in dataset
		startTransition(async () => {
			await setSearchParams({
				limit: validateLimit(Number(newLimit)),
			});
		});
	};

	const handleNextPage: MouseEventHandler<HTMLButtonElement> = () => {
		const lastItem = items.at(-1);
		if (lastItem) {
			startTransition(async () => {
				await setSearchParams({
					cursor: lastItem.id,
					direction: DEFAULT_DIRECTION,
				});
			});
		}
	};

	const handlePreviousPage: MouseEventHandler<HTMLButtonElement> = () => {
		const firstItem = items.at(0);
		if (firstItem) {
			startTransition(async () => {
				await setSearchParams({
					cursor: firstItem.id,
					direction: 'backward',
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
					onClick={handlePreviousPage}
					size="icon"
					variant="outline"
				>
					<ChevronLeft className="aspect-square w-4" />
				</Button>
				<Button
					aria-label="Next page"
					disabled={!hasNextPage}
					onClick={handleNextPage}
					size="icon"
					variant="outline"
				>
					<ChevronRight className="aspect-square w-4" />
				</Button>
			</div>
		</div>
	);
};
