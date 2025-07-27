import GenericComponent, {
	type GenericComponentProps,
} from '~/components/GenericComponent';
import Pagination, {
	type PaginationPropsForVanPages,
} from '~/components/Pagination';
import PendingUI from '~/components/PendingUI';
import { useParamsClientSide } from '~/hooks/useParamsClientSide';

type VanPagesProps<T, P, U> = {
	title: string;
	optionalElement?: React.ReactElement<U>;
} & GenericComponentProps<T, P> &
	PaginationPropsForVanPages;

export default function VanPages<P, T, U>(props: VanPagesProps<T, P, U>) {
	const {
		pathname,
		itemsCount,
		title,
		optionalElement = null,
		...rest
	} = props;

	const params = useParamsClientSide();

	return (
		<PendingUI as="section" className="grid contain-content">
			<h2 className="mb-6 font-bold text-3xl">{title}</h2>
			{optionalElement}
			<GenericComponent className="grid-max mt-6" {...rest} />
			<Pagination pathname={pathname} itemsCount={itemsCount} {...params} />
		</PendingUI>
	);
}
