import type { VanType } from '@prisma/client';
// import prisma from '~/lib/prisma';
import { prisma } from '~/lib/prisma.server';
export async function getVansCursor(
	cursor: string | undefined,
	limit: number,

	typeFilter: VanType | null,
) {
	if (!typeFilter || !cursor) {
		return prisma.van.findMany({
			take: limit,
			orderBy: {
				id: 'desc',
			},
		});
	}
	if (!typeFilter && cursor) {
		return prisma.van.findMany({
			take: limit,
			orderBy: {
				id: 'desc',
			},
			cursor: { id: cursor },
		});
	}
	if (!cursor && typeFilter) {
		return prisma.van.findMany({
			take: limit,
			orderBy: {
				id: 'desc',
			},
			where: {
				type: typeFilter,
			},
		});
	}
	return prisma.van.findMany({
		take: limit,
		cursor: { id: cursor },
		where: {
			type: typeFilter,
		},
		orderBy: {
			id: 'desc',
		},
	});
}
