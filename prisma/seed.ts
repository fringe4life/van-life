import { TransactionType, VanState } from '~/generated/prisma/enums';
import type { VanCreateManyInput } from '~/generated/prisma/models/Van';
import { getSlug } from '~/utils/get-slug';
import { prisma } from './seed-client';
import { rents } from './seed-data/rents';
import { reviews } from './seed-data/reviews';
import { transactions } from './seed-data/transactions';
import { vans } from './seed-data/vans';
import {
	clearTables,
	findRentableVan,
	getCost,
	getEndDate,
	getRandomDiscount,
	getRandomId,
	getRecentRentalDate,
	getVanState,
	isVanRentable,
	randomTrueOrFalse,
} from './seed-fns';

const HOST_COUNT = 3;

const main = async () => {
	await clearTables();

	const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });

	if (users.length < HOST_COUNT) {
		throw new Error(
			`Seed needs at least ${HOST_COUNT} users in the database. Create them in the app first.`
		);
	}

	const hosts = users.slice(0, HOST_COUNT);

	const vansWithHosts: VanCreateManyInput[] = vans.map((van, index) => {
		const state = getVanState();
		return {
			...van,
			slug: getSlug(van.name),
			state,
			discount: state === VanState.ON_SALE ? getRandomDiscount() : 0,
			hostId: hosts[index % hosts.length].id,
		};
	});

	await prisma.van.createMany({
		data: vansWithHosts,
	});

	const vanRecords = await prisma.van.findMany();

	const vansRented: string[] = [];
	const vansReturned: string[] = [];

	const rentsWithIds = rents.map((rent) => {
		let vanId = getRandomId(vanRecords);

		while (vansRented.includes(vanId)) {
			vanId = getRandomId(vanRecords);
		}

		let selectedVan = vanRecords.find((vanItem) => vanItem.id === vanId);
		if (!selectedVan) {
			throw new Error(`Van ${vanId} not found`);
		}

		if (!isVanRentable(selectedVan.state)) {
			vanId = findRentableVan(vanRecords, vansRented);
			selectedVan = vanRecords.find((v) => v.id === vanId);
			if (!selectedVan) {
				throw new Error(`Rentable van ${vanId} not found`);
			}
		}

		const hostId = selectedVan.hostId;
		const renterPool = users.filter((user) => user.id !== hostId);
		if (renterPool.length === 0) {
			throw new Error('Need at least one renter who is not the van host');
		}
		const renterId = getRandomId(renterPool);

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
			hostId,
			renterId,
			vanId,
			rentedTo,
		};
	});

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

	const rentalTransactions = createdRents
		.filter((rent) => rent.rentedTo !== null)
		.flatMap((rent) => {
			const van = vanRecords.find((v) => v.id === rent.vanId);
			if (!van) {
				throw new Error(`Van ${rent.vanId} not found for rental transaction`);
			}
			const rentedTo = rent.rentedTo as Date;
			const amount = getCost(rent.rentedAt, rentedTo, van.price);

			return [
				{
					userId: rent.renterId,
					amount: -amount,
					type: TransactionType.RENTAL_RETURN,
					rentId: rent.id,
					description: `Payment for van rental ${rent.vanId}`,
					createdAt: rentedTo,
				},
				{
					userId: rent.hostId,
					amount,
					type: TransactionType.RENTAL_PAYMENT,
					rentId: rent.id,
					description: `Received payment for van ${rent.vanId}`,
					createdAt: rentedTo,
				},
			];
		});

	await prisma.transaction.createMany({
		data: rentalTransactions,
	});

	const completedRents = createdRents.filter((rent) => rent.rentedTo !== null);

	const reviewsWithIds = reviews.map((review) => ({
		...review,
		userId: getRandomId(users),
		rentId: getRandomId(completedRents),
	}));

	await prisma.review.createMany({
		data: reviewsWithIds,
	});

	const transactionsWithIds = transactions.map((transaction) => ({
		...transaction,
		userId: getRandomId(users),
	}));

	await prisma.transaction.createMany({
		data: transactionsWithIds,
	});

	const vansPerHost = hosts.map(
		(host) => vansWithHosts.filter((van) => van.hostId === host.id).length
	);

	console.info(
		`Seed complete. ${vans.length} vans (${vansPerHost.join('/')} per host), ${createdRents.length} rents, ${rentalTransactions.length} rental txs, ${reviewsWithIds.length} reviews, ${transactionsWithIds.length} user txs.`
	);

	await prisma.$disconnect();
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
