import { prisma } from '~/lib/prisma.server';

export const getVanSlugsForSitemap = () =>
	prisma.van.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		select: {
			createdAt: true,
			slug: true,
		},
	});
