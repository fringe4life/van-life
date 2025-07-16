import clsx from 'clsx';
import GenericComponent, {
	type GenericComponentProps,
} from '~/components/GenericComponent';
import Pagination from '~/components/Pagination';
import useIsNavigating from '~/hooks/useIsNavigating';
import { useParamsClientSide } from '~/hooks/useParamsClientSide';

// type HostVanPages = {
// 	variant: 'host';
// };

// type VansPages<U> = {
// 	variant: 'vans';
// 	listItem: ListItemProps<U>;
// };

type VanPagesProps<T, P, U> = {
	title: string;
	path: string;
	itemsCount: number;
	optionalElement?: React.ReactElement<U>;
} & GenericComponentProps<T, P>;

export default function VanPages<P, T, U>(props: VanPagesProps<T, P, U>) {
	const {
		path,
		items,
		itemsCount,
		title,
		Component,
		renderKey,
		renderProps,
		optionalElement = null,
		emptyStateMessage,
	} = props;

	const { page, limit, type: typeFilter } = useParamsClientSide();

	const { changingPage } = useIsNavigating();

	return (
		<section className="flex flex-col ">
			<h2 className="mb-6 text-balance font-bold text-3xl">{title}</h2>
			{optionalElement}
			<GenericComponent
				emptyStateMessage={emptyStateMessage}
				className={clsx({
					'grid-max grid-max-medium mt-6': true,
					'opacity-75': changingPage,
				})}
				Component={Component}
				items={items}
				renderKey={renderKey}
				renderProps={renderProps}
			/>
			<Pagination
				pathname={path}
				itemsCount={itemsCount}
				limit={limit}
				page={page}
				typeFilter={typeFilter}
			/>
		</section>
	);
}
