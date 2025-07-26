import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from "~/lib/prisma";
export async function addMoney(userId: string, amount: number) {
	if (!isCUID(userId)) return 'Something went wrong, please try again later';
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
