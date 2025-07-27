import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_FILTER } from '~/constants/constants';
import CustomLink from './CustomLink';
import { Button, buttonVariants } from './ui/button';

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
	type = DEFAULT_FILTER,
	limit,
	page,
	pathname,
}: PaginationProps) {
	if (typeof itemsCount === 'string') {
		return <p>Something Went wrong try again later</p>;
	}
	const numberOfPages = Math.ceil(itemsCount / limit);
	const listOfLinks = [];

	for (let i = 0; i < numberOfPages; i++) {
		const pageNumber = i + 1;
		const isPage = pageNumber === page;
		listOfLinks.push(
			<CustomLink
				aria-label={`page ${pageNumber}`}
				aria-selected={isPage}
				key={i}
				aria-disabled={isPage}
				className={buttonVariants({
					variant: isPage ? 'link' : 'outline',
				})}
				to={{
					pathname,
					search: `?page=${pageNumber}&limit=${limit}&filter=${type}`,
				}}
			>
				{pageNumber}
			</CustomLink>,
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
				<CustomLink
					aria-label="Previous page"
					className={buttonVariants({
						variant: 'outline',
						size: 'icon',
					})}
					to={{
						pathname,
						search: `?page=${page - 1}&limit=${limit}&filter=${type}`,
					}}
				>
					<ChevronLeft className="h-4 w-4" />
				</CustomLink>
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
				<CustomLink
					aria-label="Next page"
					className={buttonVariants({
						variant: 'outline',
						size: 'icon',
					})}
					to={{
						pathname,
						search: `?page=${page + 1}&limit=${limit}&filter=${type}`,
					}}
				>
					<ChevronRight className="h-4 w-4" />
				</CustomLink>
			) : (
				<Button variant="outline" size="icon" disabled aria-label="Next page">
					<ChevronRight className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
}
