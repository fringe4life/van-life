import { useQueryStates } from 'nuqs';
import {
	Activity,
	type SubmitEventHandler,
	useOptimistic,
	useTransition,
} from 'react';
import {
	data,
	href,
	type ShouldRevalidateFunctionArgs,
	useFetcher,
} from 'react-router';
import { GenericComponent } from '~/components/generic-component';
import { PendingUI } from '~/components/pending-ui';
import { VanForm } from '~/features/host/components/van-form';
import { authContext } from '~/features/middleware/contexts/auth';
import { CustomLink } from '~/features/navigation/components/custom-link';
import { Pagination } from '~/features/pagination/components/pagination';
import { VanCard } from '~/features/vans/components/van-card';
import { VanHeader } from '~/features/vans/components/van-header';
import {
	type HostVansListAction,
	hostVansListReducer,
} from '~/features/vans/hooks/host-vans-list-reducer';
import { useDisplayHostVans } from '~/features/vans/hooks/use-display-host-vans';
import { addVanSchema } from '~/features/vans/schemas.server';
import {
	createHostVan,
	loadHostVansPage,
} from '~/features/vans/services/host-vans.server';
import type { HostVanListItem, VanCardProps } from '~/features/vans/types';
import { isPendingVan } from '~/features/vans/types';
import { pendingVanFromFormData } from '~/features/vans/utils/pending-van-from-form-data';
import { toVanCardModel } from '~/features/vans/utils/to-van-card-model';
import { hostPaginationParsers } from '~/lib/parsers';
import { validateArkType } from '~/utils/parse-arktype.server';
import type { Route } from './+types/host-vans';

export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const user = context.get(authContext);

	const pagination = await loadHostVansPage(user.id, request);

	return data(pagination, {
		headers: {
			'Cache-Control': 'max-age=259200',
		},
	});
};

export const action = async ({ request, context }: Route.ActionArgs) => {
	const user = context.get(authContext);

	const rawFormData = await request.formData();
	const onFirstPage = rawFormData.get('onFirstPage') === 'true';
	const clientKey = String(rawFormData.get('clientKey') ?? '');
	rawFormData.delete('onFirstPage');
	rawFormData.delete('clientKey');

	const formData = Object.fromEntries(rawFormData);

	const validation = validateArkType(addVanSchema, formData);

	if (!validation.success) {
		return {
			errors: validation.errors.summary,
			formData,
		};
	}

	const result2 = await createHostVan(user.id, validation.data);

	if (result2.error || !result2.data) {
		return {
			errors: 'Something went wrong please try again later',
			formData,
		};
	}

	return {
		van: result2.data,
		clientKey: clientKey || undefined,
		skipListRevalidation: onFirstPage,
	};
};

export function shouldRevalidate({
	actionResult,
	defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
	if (
		actionResult &&
		typeof actionResult === 'object' &&
		'skipListRevalidation' in actionResult &&
		actionResult.skipListRevalidation
	) {
		return false;
	}
	return defaultShouldRevalidate;
}

const HostVans = ({ loaderData }: Route.ComponentProps) => {
	const { items: vans, paginationMetadata } = loaderData;
	const onFirstPage = !paginationMetadata.hasPreviousPage;

	const [{ limit }] = useQueryStates(hostPaginationParsers);
	const fetcher = useFetcher<Awaited<ReturnType<typeof action>>>();
	const [isPending, startTransition] = useTransition();

	const [optimisticItems, addOptimisticItem] = useOptimistic(
		(vans ?? []) as HostVanListItem[],
		hostVansListReducer
	);

	const displayItems = useDisplayHostVans({
		optimisticItems,
		fetcherData: fetcher.data,
		fetcherState: fetcher.state,
		limit,
	});

	const formDataDefaults = fetcher.data?.formData;

	const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const clientKey = crypto.randomUUID();
		const pending = pendingVanFromFormData(formData, clientKey);

		formData.set('clientKey', clientKey);
		formData.set('onFirstPage', 'true');

		const optimisticAction: HostVansListAction = { type: 'add', item: pending };

		startTransition(() => {
			addOptimisticItem(optimisticAction);
			fetcher.submit(formData, {
				method: 'POST',
				action: href('/host/vans'),
			});
		});
	};

	return (
		<>
			<title>Your Vans | Van Life</title>
			<meta
				content="View and manage your listed vans on Van Life"
				name="description"
			/>
			<section>
				<h2 className="font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
					Add Van
				</h2>
				<Activity mode={onFirstPage ? 'visible' : 'hidden'}>
					<VanForm
						errors={fetcher.data?.errors}
						formDataDefaults={formDataDefaults}
						handleSubmit={handleSubmit}
						isPending={isPending}
					/>
				</Activity>
				{onFirstPage ? null : (
					<p className="mt-6 text-neutral-600">
						New vans appear at the top of your list.{' '}
						<CustomLink to={href('/host/vans')}>
							Go to first page to add a van
						</CustomLink>
					</p>
				)}
			</section>
			<PendingUI
				as="section"
				className="grid grid-rows-[min-content_1fr_min-content] contain-content"
			>
				<VanHeader>Your listed vans</VanHeader>
				<GenericComponent<HostVanListItem, VanCardProps>
					as="div"
					Component={VanCard}
					className="grid-max mt-6"
					emptyStateMessage="You are currently not renting any vans."
					errorStateMessage="Something went wrong"
					items={displayItems}
					renderProps={(item) => {
						const van = toVanCardModel(item);
						const pending = isPendingVan(item);

						return {
							link: pending
								? '#'
								: href('/host/vans/:vanSlug/:action?', {
										vanSlug: van.slug,
									}),
							van,
							linkCoversCard: !pending,
							action: pending ? (
								<p className="text-right text-neutral-500 text-sm italic">
									Saving…
								</p>
							) : (
								<p className="text-right">
									<CustomLink
										to={href('/host/vans/:vanSlug/:action?', {
											vanSlug: van.slug,
											action: 'edit',
										})}
									>
										Edit
									</CustomLink>
								</p>
							),
						};
					}}
				/>
				<Pagination items={vans} paginationMetadata={paginationMetadata} />
			</PendingUI>
		</>
	);
};
export default HostVans;
