import { DEFAULT_FILTER } from '~/constants/constants';
import CustomLink from './CustomLink';
import { buttonVariants } from './ui/button';

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
	return (
		<section className="my-6 flex gap-6 place-self-center ">
			{listOfLinks}
		</section>
	);
}
