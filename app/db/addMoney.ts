import { prisma } from '~/lib/prisma';

export async function addMoney(userId: string, amount: number) {
	console.log({ userId, amount });
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
