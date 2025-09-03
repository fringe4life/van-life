import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { useId } from 'react';
import { Button } from '~/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
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
	const limitSelectId = useId();

	// Don't show pagination if there are no items or only one page worth
	if (
		items.length === 0 ||
		(items.length <= limit && !hasNextPage && !hasPreviousPage)
	) {
		return null;
	}

	const handleLimitChange = (newLimit: string) => {
		// Reset cursor when changing limit
		setSearchParams({
			limit: Number(newLimit) as (typeof LIMITS)[number],
			cursor: DEFAULT_CURSOR,
		});
	};

	return (
		<div className="my-6 flex items-center justify-between gap-4 place-self-center">
			{/* Limit selector */}

			<Select value={String(limit)} onValueChange={handleLimitChange}>
				<SelectTrigger id={limitSelectId} className="w-20">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{LIMITS.map((limitOption) => (
						<SelectItem key={limitOption} value={String(limitOption)}>
							{limitOption}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

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
