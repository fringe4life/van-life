import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { Button, buttonVariants } from '~/components/ui/button';
import {
	DEFAULT_DIRECTION,
	LIMITS,
} from '~/features/pagination/pagination-constants';
import { paginationParsers } from '~/lib/parsers';
import type { Maybe } from '~/types/types';
import { cn } from '~/utils/utils';
import { validateLimit } from '~/utils/validators';

type PaginationProps<T = unknown> = {
	items: Maybe<T[]>;
	limit: number;
	cursor: string | undefined;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	pathname: string;
};

export type PaginationPropsForVanPages<T = unknown> = Pick<
	PaginationProps<T>,
	'items' | 'pathname'
>;

export default function Pagination<T extends { id: string }>({
	items,
	limit,
	hasNextPage,
	hasPreviousPage,
}: PaginationProps<T>) {
	const [, setSearchParams] = useQueryStates(paginationParsers);

	// Ensure items is a valid array

	const handleLimitChange = (newLimit: string) => {
		// Keep cursor unchanged when changing limit - cursor represents position in dataset
		setSearchParams({
			limit: validateLimit(Number(newLimit)),
		});
	};

	if (!items) {
		return null;
	}

	return (
		<div className="my-6 flex items-center justify-between gap-4">
			<select
				className={cn(
					buttonVariants({ variant: 'outline', size: 'icon' }),
					'w-20'
				)}
				onChange={(e) => handleLimitChange(e.target.value)}
				value={limit.toString()}
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
								setSearchParams({
									cursor: firstItem.id,
									direction: 'backward',
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
							const lastItem = items.at(-1);
							if (lastItem) {
								setSearchParams({
									cursor: lastItem.id,
									direction: DEFAULT_DIRECTION,
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
}
