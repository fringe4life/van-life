import { type } from 'arktype';
import {
	type FormEventHandler,
	useId,
	useOptimistic,
	useTransition,
} from 'react';
import { data, Form, href, useFetcher } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { validateCUIDS } from '~/dal/validate-cuids';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import { Pagination } from '~/features/pagination/components/pagination';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import VanCard from '~/features/vans/components/van-card';
import VanHeader from '~/features/vans/components/van-header';
import { createVan } from '~/features/vans/queries/crud';
import { getHostVans } from '~/features/vans/queries/host';
import type { VanModel } from '~/generated/prisma/models/Van';
import { addVanSchema } from '~/lib/schemas';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { getSlug } from '~/utils/get-slug';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/host-vans';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authContext);

	// Parse search parameters using nuqs loadHostSearchParams
	const { cursor, limit, direction } = loadHostSearchParams(request);

	const { data: vans } = await tryCatch(() =>
		validateCUIDS(getHostVans, [0])(user.id, cursor, limit, direction)
	);

	// Process pagination logic
	const pagination = toPagination(vans, limit, cursor, direction);

	return data(
		{
			...pagination,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
}

export async function action({ request, context }: Route.ActionArgs) {
	const user = context.get(authContext);

	const formData = Object.fromEntries(await request.formData());

	const result = addVanSchema(formData);

	if (result instanceof type.errors) {
		return {
			errors: result.summary,
			formData,
		};
	}

	const resultWithHostId = {
		...result,
		slug: getSlug(result.name),
		discount: result.discount ?? 0,
		hostId: user.id,
		state: result.state ?? null,
	};

	const result2 = await tryCatch(() =>
		validateCUIDS(createVan, [0])(resultWithHostId)
	);

	if (result2.error || !result2.data) {
		return {
			errors: 'Something went wrong please try again later',
			formData,
		};
	}
}

export default function Host({ loaderData, actionData }: Route.ComponentProps) {
	const { items: vans, hasNextPage, hasPreviousPage } = loaderData;

	const nameId = useId();
	const priceId = useId();
	const descriptionId = useId();
	const imageUrlId = useId();
	const typeId = useId();
	const discountId = useId();

	const fetcher = useFetcher();
	const [, startTransition] = useTransition();

	const [optimisticVans, addOptimisticVan] = useOptimistic(
		vans ?? [],
		(state: VanModel[], newVan: VanModel) => [...state, newVan]
	);

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const result = addVanSchema(formData);

		if (result instanceof type.errors) {
			return {
				errors: result.summary,
				formData,
			};
		}
		const date = new Date();
		const newVan = {
			...result,
			id: crypto.randomUUID(),
			createdAt: date,
			hostId: crypto.randomUUID(),
			isRented: false,
			slug: getSlug(result.name),
			state: null,
			discount: result.discount ?? 0,
		};
		startTransition(() => {
			addOptimisticVan(newVan);
			startTransition(async () => {
				await fetcher.submit(formData, {
					method: 'POST',
					action: href('/host/vans'),
				});
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
				<Form
					className="mt-6 grid max-w-102 gap-4"
					method="POST"
					onSubmit={handleSubmit}
				>
					<Input
						defaultValue={
							(actionData?.formData?.name as string | undefined) ?? ''
						}
						id={nameId}
						name="name"
						placeholder="Silver Bullet"
						type="text"
					/>
					<Input
						defaultValue={
							(actionData?.formData?.price as string | undefined) ?? ''
						}
						id={priceId}
						name="price"
						placeholder="100"
						type="number"
					/>
					<Textarea
						defaultValue={
							(actionData?.formData?.description as string | undefined) ?? ''
						}
						id={descriptionId}
						name="description"
						placeholder="The silver bullet can take you on an amazing adventure..."
					/>
					<Input
						defaultValue={
							(actionData?.formData?.imageUrl as string | undefined) ?? ''
						}
						id={imageUrlId}
						name="imageUrl"
						placeholder="https://images.unsplash.com/"
						type="url"
					/>
					<Input
						defaultValue={
							(actionData?.formData?.type as string | undefined) ?? ''
						}
						id={typeId}
						list={typeId}
						name="type"
						placeholder="simple or luxury or rugged"
						type="text"
					/>
					<datalist id={typeId}>
						<option value="luxury" />
						<option value="simple" />
						<option value="rugged" />
					</datalist>
					<Input
						defaultValue={
							(actionData?.formData?.discount as string | undefined) ?? '0'
						}
						id={discountId}
						max={50}
						min={0}
						name="discount"
						placeholder="0"
						type="number"
					/>
					{actionData?.errors ? <p>{actionData.errors}</p> : null}
					<Button type="submit">Add your van</Button>
				</Form>
			</section>
			<PendingUi
				as="section"
				className="grid grid-rows-[min-content_1fr_min-content] contain-content"
			>
				<VanHeader>Your listed vans</VanHeader>
				<GenericComponent
					as="div"
					Component={VanCard}
					className="grid-max mt-6"
					emptyStateMessage="You are currently not renting any vans."
					errorStateMessage="Something went wrong"
					items={optimisticVans}
					renderKey={(van) => van.id}
					renderProps={(van) => ({
						link: href('/host/vans/:vanSlug/:action?', {
							vanSlug: van.slug,
						}),
						van,
						action: (
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
					})}
				/>
				<Pagination
					hasNextPage={hasNextPage}
					hasPreviousPage={hasPreviousPage}
					items={vans}
				/>
			</PendingUi>
		</>
	);
}
