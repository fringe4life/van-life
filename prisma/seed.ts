import type { VanCreateManyInput } from '~/generated/prisma/models/Van';
import { prisma } from '~/lib/prisma.server';
import { getSlug } from '~/utils/get-slug';
import { rents } from './seed-data/rents';
import { reviews } from './seed-data/reviews';
import { transactions } from './seed-data/transactions';
import { vans } from './seed-data/vans';
import {
	clearTables,
	findRentableVan,
	generateUniqueIds,
	getCost,
	getEndDate,
	getRandomDiscount,
	getRandomId,
	getRecentRentalDate,
	getVanState,
	isVanRentable,
	randomTrueOrFalse,
} from './seed-fns';

const main = async () => {
	// clear tables
	await clearTables();

	const data = await prisma.user.findMany();

	const vansWithHosts: VanCreateManyInput[] = vans.map((van) => {
		const state = getVanState();
		const hostId = getRandomId(data);
		return {
			...van,
			slug: getSlug(van.name),
			state,
			discount: state === 'on_sale' ? getRandomDiscount() : 0,
			hostId,
		};
	});

	await prisma.van.createMany({
		data: vansWithHosts,
	});

	const vanIds = await prisma.van.findMany();

	const vansRented: string[] = [];
	const vansReturned: string[] = [];

	const rentsWithIds = rents.map((rent) => {
		const { id1, id2 } = generateUniqueIds(data);
		let vanId = getRandomId(vanIds);

		// Find a van that's not already rented
		while (vansRented.includes(vanId)) {
			vanId = getRandomId(vanIds);
		}

		// biome-ignore lint/style/noNonNullAssertion: guaranteed to be found
		let selectedVan = vanIds.find((vanItem) => vanItem.id === vanId)!;
		if (!isVanRentable(selectedVan.state)) {
			vanId = findRentableVan(vanIds, vansRented);
			// biome-ignore lint/style/noNonNullAssertion: guaranteed to be found
			selectedVan = vanIds.find((v) => v.id === vanId)!;
		}

		// Generate a recent rental date within the last 6 weeks
		const recentRentalDate = getRecentRentalDate();
		const rentedTo = randomTrueOrFalse() ? getEndDate(recentRentalDate) : null;
		if (rentedTo) {
			vansReturned.push(vanId);
		} else {
			vansRented.push(vanId);
		}
		return {
			...rent,
			rentedAt: recentRentalDate,
			hostId: id1,
			renterId: id2,
			vanId,
			rentedTo,
		};
	});

	// Create rents individually to get their IDs for transactions
	const createdRents = await Promise.all(
		rentsWithIds.map((rent) => prisma.rent.create({ data: rent }))
	);

	await prisma.van.updateMany({
		where: {
			id: { in: vansRented },
		},
		data: {
			isRented: true,
		},
	});

	// Create rental transactions for returned vans
	const rentalTransactions = createdRents
		.filter((rent) => rent.rentedTo !== null)
		.flatMap((rent) => {
			// biome-ignore lint/style/noNonNullAssertion: filtered out null values
			const van = vanIds.find((v) => v.id === rent.vanId)!;
			const rentedTo = rent.rentedTo as Date;
			const amount = getCost(rent.rentedAt, rentedTo, van.price);

			return [
				// Renter payment (debit - negative amount)
				{
					userId: rent.renterId,
					amount: -amount,
					type: 'rental_return' as const,
					rentId: rent.id,
					description: `Payment for van rental ${rent.vanId}`,
					createdAt: rentedTo,
				},
				// Host receiving payment (credit - positive amount)
				{
					userId: rent.hostId,
					amount,
					type: 'rental_payment' as const,
					rentId: rent.id,
					description: `Received payment for van ${rent.vanId}`,
					createdAt: rentedTo,
				},
			];
		});

	await prisma.transaction.createMany({
		data: rentalTransactions,
	});

	const reviewsWithIds = reviews.map((review) => ({
		...review,
		userId: getRandomId(data),
		rentId: getRandomId(createdRents.filter((r) => r.rentedTo !== null)),
	}));

	await prisma.review.createMany({
		data: reviewsWithIds,
	});

	// Create user transactions (deposits/withdrawals)
	const transactionsWithIds = transactions.map((transaction) => ({
		...transaction,
		userId: getRandomId(data),
	}));

	await prisma.transaction.createMany({
		data: transactionsWithIds,
	});

	await prisma.$disconnect();
};

main();
