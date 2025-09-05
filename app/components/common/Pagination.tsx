import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { Button, buttonVariants } from '~/components/ui/button';
import { DEFAULT_DIRECTION, LIMITS } from '~/constants/paginationConstants';
import { paginationParsers } from '~/lib/parsers';
import { cn } from '~/utils/utils';

type PaginationProps<T = unknown> = {
	items: T[];
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
	const safeItems = Array.isArray(items) ? items : [];

	const handleLimitChange = (newLimit: string) => {
		// Keep cursor unchanged when changing limit - cursor represents position in dataset
		setSearchParams({
			limit: Number(newLimit) as (typeof LIMITS)[number],
		});
	};

	return (
		<div className="my-6 flex items-center justify-between gap-4">
			<select
				value={limit.toString()}
				onChange={(e) => handleLimitChange(e.target.value)}
				className={cn(
					buttonVariants({ variant: 'outline', size: 'icon' }),
					'w-20',
				)}
			>
				{LIMITS.map((limitOption) => (
					<option key={limitOption} value={limitOption.toString()}>
						{limitOption}
					</option>
				))}
			</select>
			{/* Navigation buttons */}
			<div className="flex items-center gap-2">
				{hasPreviousPage && safeItems.length > 0 ? (
					<Button
						aria-label="Previous page"
						variant="outline"
						size="icon"
						onClick={() => {
							// For backward pagination, use the first item's ID as cursor
							const firstItem = safeItems[0];
							if (firstItem) {
								setSearchParams({
									cursor: firstItem.id,
									direction: 'backward',
								});
							}
						}}
					>
						<ChevronLeft className="aspect-square w-4" />
					</Button>
				) : (
					<Button
						variant="outline"
						size="icon"
						disabled
						aria-label="Previous page"
					>
						<ChevronLeft className="aspect-square w-4" />
					</Button>
				)}

				{hasNextPage && safeItems.length > 0 ? (
					<Button
						aria-label="Next page"
						variant="outline"
						size="icon"
						onClick={() => {
							// Get the last item's ID as the next cursor
							const lastItem = safeItems[safeItems.length - 1];
							if (lastItem) {
								setSearchParams({
									cursor: lastItem.id,
									direction: DEFAULT_DIRECTION,
								});
							}
						}}
					>
						<ChevronRight className="aspect-square w-4" />
					</Button>
				) : (
					<Button variant="outline" size="icon" disabled aria-label="Next page">
						<ChevronRight className="aspect-square w-4" />
					</Button>
				)}
			</div>
		</div>
	);
}
