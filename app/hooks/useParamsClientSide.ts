import { useSearchParams } from 'react-router';
import {
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from '~/constants/constants';

export function useParamsClientSide(
	defaultPage: number = DEFAULT_PAGE,
	defaultLimit: number = DEFAULT_LIMIT,
) {
	const [searchParams] = useSearchParams();
	const page = Number.parseInt(
		searchParams.get('page') ?? defaultPage.toString(),
	);
	const limit = Number.parseInt(
		searchParams.get('limit') ?? defaultLimit.toString(),
	);

	const type = searchParams.get('type')?.toUpperCase() ?? DEFAULT_FILTER;

	return { page, limit, type };
}
