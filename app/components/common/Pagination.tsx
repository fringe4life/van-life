import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { Button } from '~/components/ui/button';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	LIMITS,
} from '~/constants/paginationConstants';
import { paginationParsers } from '~/lib/parsers';

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

	const handleLimitChange = (newLimit: string) => {
		// Reset cursor when changing limit
		setSearchParams({
			limit: Number(newLimit) as (typeof LIMITS)[number],
			cursor: DEFAULT_CURSOR,
		});
	};

	return (
		<div className="my-6 flex items-center justify-between gap-4">
			<select
				value={limit.toString()}
				onChange={(e) => handleLimitChange(e.target.value)}
				className="w-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{LIMITS.map((limitOption) => (
					<option key={limitOption} value={limitOption.toString()}>
						{limitOption}
					</option>
				))}
			</select>
			{/* Navigation buttons */}
			<div className="flex items-center gap-2">
				{hasPreviousPage ? (
					<Button
						aria-label="Previous page"
						variant="outline"
						size="icon"
						onClick={() => {
							// For backward pagination, use the first item's ID as cursor
							const firstItem = items[0];
							setSearchParams({ cursor: firstItem.id, direction: 'backward' });
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

				{hasNextPage ? (
					<Button
						aria-label="Next page"
						variant="outline"
						size="icon"
						onClick={() => {
							// Get the last item's ID as the next cursor
							const lastItem = items[items.length - 1];
							setSearchParams({
								cursor: lastItem.id,
								direction: DEFAULT_DIRECTION,
							});
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
