import { INVALID_ID_ERROR } from '~/constants/constants';
import { prisma } from '~/lib/prisma.server';
import { isCUID } from '~/utils/check-is-cuid.server';

export async function rentVan(
	vanSlug: string,
	renterId: string,
	hostId: string
) {
	if (!(isCUID(renterId) && isCUID(hostId))) {
		throw new Error(INVALID_ID_ERROR);
	}

	// Look up van by slug to get its ID
	const van = await prisma.van.findUnique({
		where: { slug: vanSlug },
		select: { id: true },
	});

	if (!van) {
		throw new Error('Van not found');
	}

	return prisma.rent.create({
		data: {
			vanId: van.id,
			renterId,
			hostId,
		},
	});
}

// biome-ignore lint/suspicious/useAwait: needed for tryCatch
export async function returnVan(
	rentId: string,
	userId: string,
	amount: number,
	vanId: string
) {
	if (!(isCUID(rentId) && isCUID(vanId) && isCUID(userId))) {
		throw new Error(INVALID_ID_ERROR);
	}

	return prisma.$transaction(async (tx) => {
		// 1. Update rental record (mark as returned)
		const updatedRent = await tx.rent.update({
			where: { id: rentId },
			data: {
				rentedTo: new Date(),
			},
		});

		// 2. Create transaction for renter (debit - negative amount)
		await tx.transaction.create({
			data: {
				userId,
				amount: -amount,
				type: 'RENTAL_RETURN',
				rentId,
				description: `Payment for van rental ${vanId}`,
			},
		});

		// 3. Create transaction for host (credit - positive amount)
		await tx.transaction.create({
			data: {
				userId: updatedRent.hostId,
				amount,
				type: 'RENTAL_PAYMENT',
				rentId,
				description: `Received payment for van ${vanId}`,
			},
		});

		// 4. Update van status
		await tx.van.update({
			where: { id: vanId },
			data: { isRented: false },
		});

		return updatedRent;
	});
}
