import type { VanType } from '@prisma/client';
// import { prisma } from '~/lib/prisma';
import prisma from '~/lib/prisma';
export async function getVansCount(typeFilter: VanType | null) {
	if (!typeFilter) {
		return prisma.van.count();
	}
	return prisma.van.count({
		where: {
			type: typeFilter,
		},
	});
}
