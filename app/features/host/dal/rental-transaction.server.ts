import { TransactionType } from '~/generated/prisma/enums';
import { prisma } from '~/lib/prisma.server';
import type { UUIDv7 } from '~/types/ids.server';

export function createRent(data: {
	vanId: UUIDv7;
	renterId: UUIDv7;
	hostId: UUIDv7;
}) {
	return prisma.rent.create({
		data: {
			hostId: data.hostId,
			renterId: data.renterId,
			vanId: data.vanId,
		},
	});
}

export function executeReturnVanTransaction(
	rentId: UUIDv7,
	userId: UUIDv7,
	amount: number,
	vanId: UUIDv7
) {
	return prisma.$transaction(async (tx) => {
		const updatedRent = await tx.rent.update({
			data: {
				rentedTo: new Date(),
			},
			where: { id: rentId },
		});

		await tx.transaction.create({
			data: {
				amount: -amount,
				description: `Payment for van rental ${vanId}`,
				rentId,
				type: TransactionType.RENTAL_RETURN,
				userId,
			},
		});

		await tx.transaction.create({
			data: {
				amount,
				description: `Received payment for van ${vanId}`,
				rentId,
				type: TransactionType.RENTAL_PAYMENT,
				userId: updatedRent.hostId,
			},
		});

		await tx.van.update({
			data: { isRented: false },
			where: { id: vanId },
		});

		return updatedRent;
	});
}
