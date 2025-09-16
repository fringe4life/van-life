import clsx from 'clsx';
import GenericComponent, {
	type GenericComponentProps,
} from '~/components/generic-component';
import PendingUI from '~/components/pending-ui';
import Pagination, {
	type PaginationPropsForVanPages,
} from '~/features/pagination/components/pagination';
import { DEFAULT_LIMIT } from '~/features/pagination/pagination-constants';

type VanPagesProps<T, P, U> = {
	title: string;
	optionalElement?: React.ReactElement<U>;
	searchParams?: {
		cursor?: string;
		limit?: number;
		type?: string;
	};
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
} & GenericComponentProps<T, P> &
	PaginationPropsForVanPages;

export default function VanPages<P, T extends { id: string }, U>(
	props: VanPagesProps<T, P, U>
) {
	const {
		pathname,
		items,
		title,
		optionalElement = null,
		searchParams = {},
		hasNextPage = false,
		hasPreviousPage = false,
		...rest
	} = props;

	// Provide default values for pagination
	const { cursor, limit = DEFAULT_LIMIT } = searchParams;

	return (
		<PendingUI
			as="section"
			className={clsx(
				'grid contain-content',
				optionalElement &&
					'grid-rows-[min-content_min-content_1fr_min-content]',
				!optionalElement && 'grid-rows-[min-content_1fr_min-content]'
			)}
		>
			<h2 className="mb-6 font-bold text-3xl">{title}</h2>
			{optionalElement}
			<GenericComponent className="grid-max mt-6" items={items} {...rest} />
			<Pagination
				cursor={cursor}
				hasNextPage={hasNextPage}
				hasPreviousPage={hasPreviousPage}
				items={Array.isArray(items) ? (items as T[]) : []}
				limit={limit}
				pathname={pathname}
			/>
		</PendingUI>
	);
}
