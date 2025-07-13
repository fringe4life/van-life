import { Link } from 'react-router';
import { DEFAULT_FILTER } from '~/constants/constants';
import { buttonVariants } from './ui/button';

type PaginationProps = {
	itemsCount: number;
	limit: number;
	page: number;
	typeFilter: string | undefined;
	pathname: string;
};

export default function Pagination({
	itemsCount,
	typeFilter = DEFAULT_FILTER,
	limit,
	page,
	pathname,
}: PaginationProps) {
	const numberOfPages = Math.ceil(itemsCount / limit);
	const listOfLinks = [];

	for (let i = 0; i < numberOfPages; i++) {
		const pageNumber = i + 1;
		const isPage = pageNumber === page;
		listOfLinks.push(
			<Link
      inert
				aria-label={`page ${pageNumber}`}
				aria-selected={isPage}
				key={i}
				aria-disabled={isPage}
				className={buttonVariants({
					variant: isPage ? 'link' : 'outline',
				})}
				viewTransition
				prefetch="viewport"
				to={{
					pathname,
					search: `?page=${pageNumber}&limit=${limit}&filter=${typeFilter}`,
				}}
			>
				{pageNumber}
			</Link>,
		);
	}
	return (
		<section className="my-6 flex justify-center gap-6">{listOfLinks}</section>
	);
}
