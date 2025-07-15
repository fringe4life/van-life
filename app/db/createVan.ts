import type { Van } from '@prisma/client';
// import { prisma } from "~/lib/prisma";
import prisma from '~/lib/prisma';

export async function createVan(newVan: Omit<Van, 'id'>) {
	const result = await prisma.van.create({
		data: newVan,
	});

	console.log({ result });

	return result;
}
