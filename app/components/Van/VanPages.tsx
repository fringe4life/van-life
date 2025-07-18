import clsx from 'clsx';
import GenericComponent, {
	type GenericComponentProps,
} from '~/components/GenericComponent';
import Pagination, {
	type PaginationPropsForVanPages,
} from '~/components/Pagination';
import useIsNavigating from '~/hooks/useIsNavigating';
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

	const { changingPage } = useIsNavigating();

	return (
		<section
			className={clsx({
				'grid contain-content': true,
				'opacity-75': changingPage,
			})}
		>
			<h2 className="mb-6 font-bold text-3xl">{title}</h2>
			{optionalElement}
			<GenericComponent className="grid-max mt-6" {...rest} />
			<Pagination pathname={pathname} itemsCount={itemsCount} {...params} />
		</section>
	);
}
