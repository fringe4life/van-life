import type { VanType } from '@prisma/client';

import { prisma } from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';
export async function vansPagination(
	page: number,
	limit: number,

	typeFilter: VanType | null,
) {
	const skip = getSkipAmount(page, limit);
	if (typeFilter) {
		return prisma.$queryRaw`
			SELECT *, COUNT(*) OVER() AS full_count
			FROM "Van"
			WHERE type = ${typeFilter}::"VanType")
			LIMIT ${limit}
			OFFSET ${skip}
		`;
	}
	return prisma.$queryRaw`
			SELECT *, COUNT(*) OVER() AS full_count
			FROM "Van"
			LIMIT ${limit}
			OFFSET ${skip}
		`;
}

// return prisma.$transaction([
// 	prisma.van.findMany({
// 		take: limit,
// 		skip,
// 		where: {
// 			...(typeFilter
// 				? {
// 						AND: {
// 							type: typeFilter,
// 						},
// 					}
// 				: {}),
// 		},
// 	}),
// 	prisma.van.count({
// 		where: {
// 			...(typeFilter
// 				? {
// 						AND: {
// 							type: typeFilter,
// 						},
// 					}
// 				: {}),
// 		},
// 	}),
// ]);
