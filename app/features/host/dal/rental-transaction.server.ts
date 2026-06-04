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
			vanId: data.vanId,
			renterId: data.renterId,
			hostId: data.hostId,
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
			where: { id: rentId },
			data: {
				rentedTo: new Date(),
			},
		});

		await tx.transaction.create({
			data: {
				userId,
				amount: -amount,
				type: TransactionType.RENTAL_RETURN,
				rentId,
				description: `Payment for van rental ${vanId}`,
			},
		});

		await tx.transaction.create({
			data: {
				userId: updatedRent.hostId,
				amount,
				type: TransactionType.RENTAL_PAYMENT,
				rentId,
				description: `Received payment for van ${vanId}`,
			},
		});

		await tx.van.update({
			where: { id: vanId },
			data: { isRented: false },
		});

		return updatedRent;
	});
}
