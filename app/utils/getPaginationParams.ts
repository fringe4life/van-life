import {
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from '~/constants/constants';
import { getSearchParams } from '~/utils/getSearchParams';
import { searchParamsSchema } from '~/utils/schema';

/**
 * @abstract gets the url search params
 * @param url from the request object
 * @returns either the defaults or the values if successful
 */
export function getPaginationParams(url: string) {
	const searchParams = getSearchParams(url);
	const { success, data } = searchParamsSchema.safeParse(searchParams);

	if (!success) {
		return { page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, type: DEFAULT_FILTER };
	}
	return data;
}
