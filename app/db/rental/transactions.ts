import { INVALID_ID_ERROR } from '~/constants/constants';
import { prisma } from '~/lib/prisma.server';
import { isCUID } from '~/utils/checkIsCUID.server';

export function rentVan(vanId: string, renterId: string, hostId: string) {
	if (!(isCUID(vanId) && isCUID(renterId) && isCUID(hostId))) {
		throw new Error(INVALID_ID_ERROR);
	}
	return prisma.rent.create({
		data: {
			vanId,
			renterId,
			hostId,
		},
	});
}

export function returnVan(
	rentId: string,
	userId: string,
	amount: number,
	vanId: string
) {
	if (!(isCUID(rentId) && isCUID(vanId) && isCUID(userId))) {
		throw new Error(INVALID_ID_ERROR);
	}
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
