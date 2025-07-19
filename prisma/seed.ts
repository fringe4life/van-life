import { prisma } from '~/lib/prisma';
import {
	clearTables,
	generateUniqueIds,
	getCost,
	getEndDate,
	getRandomId,
	randomTrueOrFalse,
} from './seedFns';
import { rents, reviews, vans } from './seedInfo';

const main = async () => {
	// clear tables
	await clearTables();

	const data = await prisma.user.findMany();
	const userIds = data.map((user) => user.id);
	const lengthOfUserIds = userIds.length;

	const vansWithHosts = vans.map((van) => ({
		...van,
		hostId: userIds[Math.floor(Math.random() * lengthOfUserIds)],
	}));

	await prisma.van.createMany({
		data: vansWithHosts,
	});

	const vanIds = await prisma.van.findMany();

	const rentsWithIds = rents.map((rent) => {
		const { id1, id2 } = generateUniqueIds(data);
		const vanId = getRandomId(vanIds);
		// biome-ignore lint/style/noNonNullAssertion: guaranteed to be found
		const van = vanIds.find((van) => van.id === vanId)!;
		const rentedTo = randomTrueOrFalse() ? getEndDate(rent.rentedAt) : null;
		const amount = rentedTo ? getCost(rent.rentedAt, rentedTo, van.price) : 0;
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

	await prisma.$disconnect();
};

main();
