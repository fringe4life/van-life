import { URLSearchParams } from 'node:url';
import {
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from '~/constants/constants';
import { searchParamsSchema } from '~/utils/schema.server';
export function getPaginationParams(url: string) {
	const searchParams = Object.fromEntries(
		new URLSearchParams(url.split('?').at(1) ?? ''),
	);
	const { success, data } = searchParamsSchema.safeParse(searchParams);

	if (!success) {
		return { page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, type: DEFAULT_FILTER };
	}
	const { page, limit, type } = data;

	return { page, limit, type };
}
