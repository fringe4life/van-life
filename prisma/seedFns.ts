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

function getRandomIdWithConstraint(id: string, constraints: string[]) {
	return constraints.includes(id);
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

import { prisma } from '~/lib/prisma.server';
import type { VanState } from '~/generated/prisma/enums';

function getRandomTransactionType(): 'DEPOSIT' | 'WITHDRAW' {
	return Math.random() > 0.5 ? 'DEPOSIT' : 'WITHDRAW';
}

function getRandomAmount(min = 100, max = 5000): number {
	return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function getRandomTransactionDate(startDate = new Date('2024-01-01'), endDate = new Date()): Date {
	const start = startDate.getTime();
	const end = endDate.getTime();
	const randomTime = start + Math.random() * (end - start);
	return new Date(randomTime);
}

// Returns a random Date between now - `monthsBack` and now (defaults to 1 month)
function getRecentDate(monthsBack = 1): Date {
	const now = new Date();
	const start = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate());
	const startMs = start.getTime();
	const endMs = now.getTime();
	const randomTime = startMs + Math.random() * (endMs - startMs);
	return new Date(randomTime);
}

async function clearTables() {
	try {
		await prisma.transaction.deleteMany();
		await prisma.review.deleteMany();
		await prisma.rent.deleteMany();
		await prisma.van.deleteMany();
	} catch (error) {
		console.error(error);
	}
}

// Determine VanState based on createdAt; NEW if < 6 months from now, else random of other states
function getVanState(createdAt: Date): VanState {
	const now = new Date();
	const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
	if (createdAt > sixMonthsAgo) return 'NEW' as VanState;
	const otherStates: VanState[] = ['IN_REPAIR', 'ON_SALE', 'AVAILABLE'];
	return otherStates[Math.floor(Math.random() * otherStates.length)];
}

// Rental guard: vans in IN_REPAIR cannot be rented
function isVanRentable(state: VanState): boolean {
	return state !== 'IN_REPAIR';
}

export {
	randomTrueOrFalse,
	clearTables,
	getCost,
	getEndDate,
	generateUniqueIds,
	getRandomId,
	getRandomIdWithConstraint,
	getRandomTransactionType,
	getRandomAmount,
	getRandomTransactionDate,
	getVanState,
	isVanRentable,
	getRecentDate,
};
