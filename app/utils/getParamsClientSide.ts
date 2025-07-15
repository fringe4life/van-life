import { useSearchParams } from 'react-router';
import {
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from '~/constants/constants';

export function getParamsClientSide(
	defaultPage?: number,
	defaultLimit?: number,
) {
	const [searchParams] = useSearchParams();
	if (!defaultPage) defaultPage = DEFAULT_PAGE;
	if (!defaultLimit) defaultLimit = DEFAULT_LIMIT;
	const page = Number.parseInt(
		searchParams.get('page') ?? defaultPage.toString(),
	);
	const limit = Number.parseInt(
		searchParams.get('limit') ?? defaultLimit.toString(),
	);

	const type = searchParams.get('type')?.toUpperCase() ?? DEFAULT_FILTER;

	return { page, limit, type };
}
