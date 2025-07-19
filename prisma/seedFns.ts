function getEndDate(rentedAt: Date) {
	return new Date(
		rentedAt.getFullYear(),
		rentedAt.getMonth(),
		rentedAt.getDate() + getRandomNumber(),
		rentedAt.getHours(),
	);
}

function randomTrueOrFalse() {
	return getRandomNumber(0, 1) > 0.5;
}

function getRandomNumber(min = 3, max = 21) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCost(rentedAt: Date, rentedTo: Date, price: number) {
	const daysDifferent = Math.ceil(
		(rentedTo.getTime() - rentedAt.getTime()) / (1000 * 3600 * 24),
	);
	return price * daysDifferent;
}

function getRandomId<T extends { id: string }>(ids: T[]) {
	if (ids.length === 0) throw new Error('No ids to get');
	return ids[Math.floor(Math.random() * ids.length)].id;
}

function generateUniqueIds<T extends { id: string }>(
	ids: T[],
): { id1: string; id2: string } {
	if (ids.length < 2) {
		throw new Error('length of ids is too short for this function');
	}
	const id1 = getRandomId(ids);
	let id2 = getRandomId(ids);

	while (id1 === id2) {
		id2 = getRandomId(ids);
	}
	return { id1, id2 };
}

import { prisma } from '~/lib/prisma';

async function clearTables() {
	try {
		await prisma.review.deleteMany();
		await prisma.rent.deleteMany();
		await prisma.van.deleteMany();
	} catch (error) {
		console.error(error);
	}
}

export {
	randomTrueOrFalse,
	clearTables,
	getCost,
	getEndDate,
	generateUniqueIds,
	getRandomId,
};
