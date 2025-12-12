import clsx from 'clsx';
import GenericComponent, {
	type GenericComponentProps,
} from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import Pagination from '~/features/pagination/components/pagination';
import type { PaginationProps } from '~/features/pagination/types';
import type { Id } from '~/types/types';
import VanHeader from './van-header';

type PaginationPropsForVanPages<T = unknown> = Pick<
	PaginationProps<T>,
	'items'
>;

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

export default function VanPages<P, T extends Id, U>(
	props: VanPagesProps<T, P, U>
) {
	const {
		items,
		title,
		optionalElement = null,
		hasNextPage = false,
		hasPreviousPage = false,
		...rest
	} = props;

	return (
		<PendingUi
			as="section"
			className={clsx(
				'grid contain-content',
				!!optionalElement &&
					'grid-rows-[min-content_min-content_1fr_min-content]',
				!optionalElement && 'grid-rows-[min-content_1fr_min-content]'
			)}
		>
			<VanHeader>{title}</VanHeader>
			{optionalElement}
			<GenericComponent className="grid-max mt-6" items={items} {...rest} />
			<Pagination
				hasNextPage={hasNextPage}
				hasPreviousPage={hasPreviousPage}
				items={items}
			/>
		</PendingUi>
	);
}
