import { prisma } from '~/lib/prisma.server';
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
} from './seedFns';

const main = async () => {
	// clear tables
	await clearTables();

	const data = await prisma.user.findMany();

	const vansWithHosts = vans.map((van) => {
		const state = getVanState();
		return {
			...van,
			hostId: getRandomId(data),
			state,
			discount: state === 'ON_SALE' ? getRandomDiscount() : 0,
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
		const amount = rentedTo
			? getCost(recentRentalDate, rentedTo, selectedVan.price)
			: 0;
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
			amount,
		};
	});
	await prisma.rent.createMany({
		data: rentsWithIds,
	});

	await prisma.van.updateMany({
		where: {
			id: { in: vansRented },
		},
		data: {
			isRented: true,
		},
	});

	const rentIds = await prisma.rent.findMany({
		where: {
			NOT: {
				rentedTo: null,
			},
		},
	});

	const reviewsWithIds = reviews.map((review) => ({
		...review,
		userId: getRandomId(data),
		rentId: getRandomId(rentIds),
	}));

	await prisma.review.createMany({
		data: reviewsWithIds,
	});

	// Create transactions for users
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
