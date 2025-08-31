import { VanType } from '@prisma/client';
import { parseAsInteger, parseAsStringEnum } from 'nuqs';
import {
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from '~/constants/constants';

export const PaginationParams = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	limit: parseAsInteger.withDefault(DEFAULT_LIMIT),
	type: parseAsStringEnum([
		...Object.values(VanType),
		DEFAULT_FILTER,
	]).withDefault(DEFAULT_FILTER),
};
