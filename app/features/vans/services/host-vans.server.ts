import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import { getHostVans } from '~/features/vans/dal/host-van.server';
import { createVan } from '~/features/vans/dal/van.server';
import type { addVanSchema } from '~/features/vans/schemas.server';
import {
	loadHostSearchParams,
	parsePaginationCursor,
} from '~/lib/search-params.server';
import type { UUIDv7 } from '~/types/ids.server';
import { getSlug } from '~/utils/get-slug';
import { tryCatch } from '~/utils/try-catch.server';

type AddVanInput = typeof addVanSchema.infer;

export async function loadHostVansPage(userId: UUIDv7, request: Request) {
	const { cursor, limit, direction } = loadHostSearchParams(request);
	const brandedCursor = parsePaginationCursor(cursor);

	const { data: vans } = await tryCatch(() =>
		getHostVans(userId, {
			cursor: brandedCursor,
			limit,
			direction,
		})
	);

	return toPagination({
		items: vans,
		limit,
		cursor: brandedCursor,
		direction,
	});
}

export function createHostVan(userId: UUIDv7, validated: AddVanInput) {
	const resultWithHostId = {
		...validated,
		slug: getSlug(validated.name),
		discount: validated.discount ?? 0,
		hostId: userId,
		state: validated.state ?? null,
	};

	return tryCatch(() => createVan(resultWithHostId));
}
