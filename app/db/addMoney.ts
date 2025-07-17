import { prisma } from '~/lib/prisma';
// import prisma from "~/lib/prisma";
export async function addMoney(userId: string, amount: number) {
	const updatedRecord = await prisma.userInfo.update({
		where: {
			userId,
		},
		data: {
			moneyAdded: {
				increment: amount,
			},
		},
	});
	return updatedRecord.moneyAdded;
}
