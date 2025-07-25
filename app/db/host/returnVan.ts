import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';

export async function returnVan(
	rentId: string,
	userId: string,
	amount: number,
	vanId: string,
) {
	if (!isCUID(rentId) || !isCUID(vanId) || !isCUID(userId))
		return 'Something went wrong, please try again later';
	return prisma.$transaction([
		prisma.rent.update({
			where: {
				id: rentId,
			},
			data: {
				rentedTo: new Date(),
				amount,
			},
		}),
		prisma.userInfo.update({
			where: {
				userId,
			},
			data: { moneyAdded: { decrement: amount } },
		}),
		prisma.van.update({
			where: {
				id: vanId,
			},
			data: {
				isRented: false,
			},
		}),
	]);
}
