import { DEFAULT_FILTER } from '~/constants/constants';
import CustomLink from './CustomLink';
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
					search: `?page=${pageNumber}&limit=${limit}&filter=${typeFilter}`,
				}}
			>
				{pageNumber}
			</CustomLink>,
		);
	}
	if (listOfLinks.length === 1) {
		return null;
	}
	return (
		<section className="my-6 flex gap-6 self-center justify-self-end">
			{listOfLinks}
		</section>
	);
}
