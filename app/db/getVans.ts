import type { VanType } from '@prisma/client';
// import prisma from '~/lib/prisma';
import { prisma } from '~/lib/prisma.server';
import getSkipAmount from '~/utils/getSkipAmount.server';
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
		orderBy: typeFilter ? [{ type: 'desc' }, { id: 'desc' }] : { id: 'desc' },
	});
}
