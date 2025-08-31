import GenericComponent, {
	type GenericComponentProps,
} from '~/components/common/GenericComponent';
import Pagination, {
	type PaginationPropsForVanPages,
} from '~/components/common/Pagination';
import PendingUI from '~/components/common/PendingUI';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '~/constants/constants';

type VanPagesProps<T, P, U> = {
	title: string;
	optionalElement?: React.ReactElement<U>;
	searchParams?: {
		page?: number;
		limit?: number;
		type?: string;
	};
} & GenericComponentProps<T, P> &
	PaginationPropsForVanPages;

export default function VanPages<P, T, U>(props: VanPagesProps<T, P, U>) {
	const {
		pathname,
		itemsCount,
		title,
		optionalElement = null,
		searchParams = {},
		...rest
	} = props;

	// Provide default values for pagination
	const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, type } = searchParams;

	return (
		<PendingUI as="section" className="grid contain-content">
			<h2 className="mb-6 font-bold text-3xl">{title}</h2>
			{optionalElement}
			<GenericComponent className="grid-max mt-6" {...rest} />
			<Pagination
				pathname={pathname}
				itemsCount={itemsCount}
				page={page}
				limit={limit}
				type={type}
			/>
		</PendingUI>
	);
}
