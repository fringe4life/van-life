import { prisma } from '~/lib/prisma';
// import prisma from '~/lib/prisma';
export async function payForVan(userId: string, amount: number) {
	return prisma.userInfo.update({
		where: {
			userId,
		},
		data: { moneyAdded: { decrement: amount } },
	});
}
