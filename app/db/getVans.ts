import type { VanType } from '@prisma/client';
// import prisma from '~/lib/prisma';
import { prisma } from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';
export async function getVans(
	page: number,
	limit: number,

	typeFilter: VanType | null,
) {
	const skip = getSkipAmount(page, limit);
	return prisma.van.findMany({
		take: limit,
		skip,
		where: {
			type: typeFilter ? typeFilter : undefined,
		},
		orderBy: {
			id: 'desc',
		},
	});
}
