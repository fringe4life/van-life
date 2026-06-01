import { prisma } from '~/lib/prisma.server';

export const getVanSlugsForSitemap = () =>
	prisma.van.findMany({
		select: {
			slug: true,
			createdAt: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
