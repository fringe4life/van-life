import type { VanType } from '@prisma/client';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';

export function getVans(
	page: number,
	limit: number,
	typeFilter: VanType | null,
) {
	const skip = (page - 1) * limit;
	return prisma.van.findMany({
		where: {
			type: typeFilter ? typeFilter : undefined,
		},
		orderBy: typeFilter ? [{ type: 'desc' }, { id: 'desc' }] : { id: 'desc' },
		skip,
		take: limit,
	});
}

export function getVansCount(typeFilter: VanType | null) {
	return prisma.van.count({
		where: {
			type: typeFilter ? typeFilter : undefined,
		},
		orderBy: typeFilter ? [{ type: 'desc' }, { id: 'desc' }] : { id: 'desc' },
	});
}
