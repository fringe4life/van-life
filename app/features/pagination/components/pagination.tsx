import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { startTransition } from 'react';
import { Button, buttonVariants } from '~/components/ui/button';
import {
	DEFAULT_DIRECTION,
	DEFAULT_LIMIT,
	LIMITS,
} from '~/features/pagination/pagination-constants';
import type { PaginationProps } from '~/features/pagination/types';
import { validateLimit } from '~/features/pagination/utils/validators';
import { paginationParsers } from '~/lib/parsers';
import type { Id, Maybe } from '~/types/types';
import { cn } from '~/utils/utils';

export const Pagination = <T extends Id>({
	items,
	paginationMetadata,
}: PaginationProps<T>) => {
	const [{ limit }, setSearchParams] = useQueryStates(paginationParsers);
	const { hasNextPage, hasPreviousPage } = paginationMetadata;

	// Ensure items is a valid array

	const handleLimitChange = (newLimit: string) => {
		// Keep cursor unchanged when changing limit - cursor represents position in dataset
		startTransition(async () => {
			await setSearchParams({
				limit: validateLimit(Number(newLimit)),
			});
		});
	};

	if (!items) {
		return <div />;
	}

	return (
		<div className="my-6 flex items-center justify-between gap-4">
			<select
				className={cn(
					buttonVariants({ variant: 'outline', size: 'icon' }),
					'w-20'
				)}
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
				{!!hasPreviousPage && items.length > 0 ? (
					<Button
						aria-label="Previous page"
						onClick={() => {
							// For backward pagination, use the first item's ID as cursor
							const firstItem = items[0];
							if (firstItem) {
								startTransition(async () => {
									await setSearchParams({
										cursor: firstItem.id,
										direction: 'backward',
									});
								});
							}
						}}
						size="icon"
						variant="outline"
					>
						<ChevronLeft className="aspect-square w-4" />
					</Button>
				) : (
					<Button
						aria-label="Previous page"
						disabled
						size="icon"
						variant="outline"
					>
						<ChevronLeft className="aspect-square w-4" />
					</Button>
				)}

				{!!hasNextPage && items.length > 0 ? (
					<Button
						aria-label="Next page"
						onClick={() => {
							// Get the last item's ID as the next cursor
							const lastItem: Maybe<T> = items.at(-1);
							if (lastItem) {
								startTransition(async () => {
									await setSearchParams({
										cursor: lastItem.id,
										direction: DEFAULT_DIRECTION,
									});
								});
							}
						}}
						size="icon"
						variant="outline"
					>
						<ChevronRight className="aspect-square w-4" />
					</Button>
				) : (
					<Button aria-label="Next page" disabled size="icon" variant="outline">
						<ChevronRight className="aspect-square w-4" />
					</Button>
				)}
			</div>
		</div>
	);
};
