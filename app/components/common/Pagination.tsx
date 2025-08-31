import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { paginationParsers } from '~/lib/parsers';
import { Button } from '../ui/button';

type PaginationProps = {
	itemsCount: number | string;
	limit: number;
	page: number;
	type: string | undefined;
	pathname: string;
};

export type PaginationPropsForVanPages = Pick<
	PaginationProps,
	'itemsCount' | 'pathname'
>;
export default function Pagination({
	itemsCount,
	limit,
	page,
}: PaginationProps) {
	const [, setSearchParams] = useQueryStates(paginationParsers);

	if (typeof itemsCount === 'string') {
		return <p>Something Went wrong try again later</p>;
	}
	const numberOfPages = Math.ceil(itemsCount / limit);
	const listOfLinks = [];

	for (let i = 0; i < numberOfPages; i++) {
		const pageNumber = i + 1;
		const isPage = pageNumber === page;
		listOfLinks.push(
			<Button
				aria-label={`page ${pageNumber}`}
				aria-selected={isPage}
				key={i}
				disabled={isPage}
				variant={isPage ? 'ghost' : 'outline'}
				onClick={() => setSearchParams({ page: pageNumber })}
			>
				{pageNumber}
			</Button>,
		);
	}
	if (listOfLinks.length === 1) {
		return null;
	}

	const hasPreviousPage = page > 1;
	const hasNextPage = page < numberOfPages;

	return (
		<div className="my-6 flex items-center gap-2 place-self-center contain-content">
			{hasPreviousPage ? (
				<Button
					aria-label="Previous page"
					variant="outline"
					size="icon"
					onClick={() => setSearchParams({ page: page - 1 })}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
			) : (
				<Button
					variant="outline"
					size="icon"
					disabled
					aria-label="Previous page"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
			)}

			<div className="flex gap-2">{listOfLinks}</div>

			{hasNextPage ? (
				<Button
					aria-label="Next page"
					variant="outline"
					size="icon"
					onClick={() => setSearchParams({ page: page + 1 })}
				>
					<ChevronRight className="aspect-square w-4" />
				</Button>
			) : (
				<Button variant="outline" size="icon" disabled aria-label="Next page">
					<ChevronRight className="aspect-square w-4" />
				</Button>
			)}
		</div>
	);
}
