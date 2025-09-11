import { prisma } from '~/lib/prisma.server';
import {
	clearTables,
	generateUniqueIds,
	getCost,
	getEndDate,
	getRandomId,
	randomTrueOrFalse,
	getVanState,
	isVanRentable,
} from './seedFns';
import { rents, reviews, vans, transactions } from './seed-data';

const main = async () => {
	// clear tables
	await clearTables();

	const data = await prisma.user.findMany();

	const vansWithHosts = vans.map((van) => ({
		...van,
		hostId: getRandomId(data),
		state: getVanState(van.createdAt as Date),
	}));

	await prisma.van.createMany({
		data: vansWithHosts,
	});

	const vanIds = await prisma.van.findMany();

	const vansRented: string[] = [];
	const vansReturned: string[] = [];

	const rentsWithIds = rents.map((rent) => {
		const { id1, id2 } = generateUniqueIds(data);
		let vanId = getRandomId(vanIds);
		while (vansRented.includes(vanId)) {
			vanId = getRandomId(vanIds);
		}
		// biome-ignore lint/style/noNonNullAssertion: guaranteed to be found
		let van = vanIds.find((van) => van.id === vanId)!;
		if (!isVanRentable(van.state as unknown as 'NEW' | 'IN_REPAIR' | 'ON_SALE' | 'AVAILABLE')) {
			let candidateId = getRandomId(vanIds);
			let safety = 0;
			while (
				((vanIds.find((v) => v.id === candidateId)!
					.state as unknown as 'NEW' | 'IN_REPAIR' | 'ON_SALE' | 'AVAILABLE') === 'IN_REPAIR' ||
					vansRented.includes(candidateId)) &&
				safety < 100
			) {
				candidateId = getRandomId(vanIds);
				safety++;
			}
			vanId = candidateId;
			// biome-ignore lint/style/noNonNullAssertion: guaranteed to be found
			van = vanIds.find((v) => v.id === vanId)!;
		}
		const rentedTo = randomTrueOrFalse() ? getEndDate(rent.rentedAt as Date) : null;
		const amount = rentedTo ? getCost(rent.rentedAt as Date, rentedTo, van.price) : 0;
		if (!rentedTo) {
			vansRented.push(vanId);
		} else {
			vansReturned.push(vanId);
		}
		return {
			...rent,
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
