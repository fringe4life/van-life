import type { VanType } from '@prisma/client';
import { prisma } from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';

export async function getVans(
	page: number,
	limit: number,

	typeFilter: VanType | null,
) {
	const skip = getSkipAmount(page, limit);

	if (!typeFilter) {
		return await prisma.van.findMany({
			take: limit,
			skip,
		});
	}
	return await prisma.van.findMany({
		take: limit,
		skip,
		where: {
			type: typeFilter,
		},
	});
}
