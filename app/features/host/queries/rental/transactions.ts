import { TransactionType } from '~/generated/prisma/enums';
import { prisma } from '~/lib/prisma.server';

export const rentVan = async (
	vanSlug: string,
	renterId: string,
	hostId: string
) => {
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
};

// biome-ignore lint/suspicious/useAwait: needed for tryCatch
export const returnVan = async (
	rentId: string,
	userId: string,
	amount: number,
	vanId: string
) => {
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
				type: TransactionType.RENTAL_RETURN,
				rentId,
				description: `Payment for van rental ${vanId}`,
			},
		});

		// 3. Create transaction for host (credit - positive amount)
		await tx.transaction.create({
			data: {
				userId: updatedRent.hostId,
				amount,
				type: TransactionType.RENTAL_PAYMENT,
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
};
