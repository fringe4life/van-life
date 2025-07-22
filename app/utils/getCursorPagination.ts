import {
	DEFAULT_CURSOR,
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
} from '~/constants/constants';
import { getSearchParams } from '~/utils/getSearchParams';
import { cursorPaginationSchema } from './schema';

export function getCursorPagination(url: string) {
	const searchParams = getSearchParams(url);

	const { success, data } = cursorPaginationSchema.safeParse(searchParams);

	if (!success) {
		return {
			limit: DEFAULT_LIMIT,
			cursor: DEFAULT_CURSOR,
			type: DEFAULT_FILTER,
		};
	}

	return data;
}
