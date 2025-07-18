import { prisma } from '~/lib/prisma';
// import prisma from '~/lib/prisma';

export async function returnVan(
	rentId: string,
	userId: string,
	amount: number,
	hostId: string
) {
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
		// prisma.userInfo.update({
		// 	where: {
		// 		userId: hostId
		// 	},
		// 	data: {
		// 		moneyAdded: {increment: amount}
		// 	}
		// })
	]);
}
