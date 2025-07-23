import type { VanType } from '@prisma/client';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getVansCount(typeFilter: VanType | null) {
	return prisma.van.count({
		where: {
			type: typeFilter ? typeFilter : undefined,
		},
		orderBy: {
			id: 'desc',
		},
	});
}
