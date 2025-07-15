import clsx from 'clsx';
import CustomNavLink from '~/components/CustomNavLink';
import GenericComponent, {
	type GenericComponentProps,
} from '~/components/GenericComponent';
import type { ListItemProps } from '~/components/ListItems';
import ListItems from '~/components/ListItems';
import Pagination from '~/components/Pagination';
import useIsNavigating from '~/hooks/useIsNavigating';
import { useParamsClientSide } from '~/hooks/useParamsClientSide';

type HostVanPages = {
	variant: 'host';
};

type VansPages<U> = {
	variant: 'vans';
	listItem: ListItemProps<U>;
};

type VanPagesProps<T, P, U> = (HostVanPages | VansPages<U>) & {
	title: string;
	path: string;
	itemsCount: number;
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
		variant,
		emptyStateMessage,
	} = props;

	const { page, limit, type: typeFilter } = useParamsClientSide();

	const { changingPage } = useIsNavigating();

	return (
		<section className="flex flex-col ">
			<h2 className="mb-6 text-balance font-bold text-3xl">{title}</h2>
			{variant === 'vans' && (
				<p className="mb-6 flex justify-between md:justify-start md:gap-6">
					{
						<ListItems
							items={props.listItem.items}
							getKey={props.listItem.getKey}
							getRow={props.listItem.getRow}
						/>
					}
					<CustomNavLink
						to={path}
						className={(isActive) => isActive && 'underline'}
					>
						Clear filters
					</CustomNavLink>
				</p>
			)}
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
