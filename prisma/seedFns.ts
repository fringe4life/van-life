function getEndDate(rentedAt: Date) {
	return new Date(
		rentedAt.getFullYear(),
		rentedAt.getMonth(),
		rentedAt.getDate() + getRandomNumber(),
		rentedAt.getHours()
	);
}

function randomTrueOrFalse() {
	const HALF_PROBABILITY = 0.5;
	return getRandomNumber(0, 1) > HALF_PROBABILITY;
}

function getRandomNumber(min = 3, max = 21) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCost(rentedAt: Date, rentedTo: Date, price: number) {
	const MILLISECONDS_PER_SECOND = 1000;
	const SECONDS_PER_MINUTE = 60;
	const MINUTES_PER_HOUR = 60;
	const HOURS_PER_DAY = 24;
	const MILLISECONDS_PER_DAY =
		MILLISECONDS_PER_SECOND *
		SECONDS_PER_MINUTE *
		MINUTES_PER_HOUR *
		HOURS_PER_DAY;

	const daysDifferent = Math.ceil(
		(rentedTo.getTime() - rentedAt.getTime()) / MILLISECONDS_PER_DAY
	);
	return price * daysDifferent;
}

function getRandomId<T extends { id: string }>(ids: T[]) {
	if (ids.length === 0) {
		throw new Error('No ids to get');
	}
	return ids[Math.floor(Math.random() * ids.length)].id;
}

function findRentableVan(vanIds: VanModel[], excludedIds: string[]): string {
	const MAX_ATTEMPTS = 100;
	let candidateId = getRandomId(vanIds);
	let attempts = 0;

	while (
		(vanIds.find((v) => v.id === candidateId)?.state === 'IN_REPAIR' ||
			excludedIds.includes(candidateId)) &&
		attempts < MAX_ATTEMPTS
	) {
		candidateId = getRandomId(vanIds);
		attempts++;
	}

	return candidateId;
}

function getRandomIdWithConstraint(id: string, constraints: string[]) {
	return constraints.includes(id);
}

function generateUniqueIds<T extends { id: string }>(
	ids: T[]
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

import type { VanState } from '~/generated/prisma/enums';
import type { VanModel } from '~/generated/prisma/models';
import { prisma } from '~/lib/prisma.server';

function getRandomTransactionType(): 'DEPOSIT' | 'WITHDRAW' {
	const HALF_PROBABILITY = 0.5;
	return Math.random() > HALF_PROBABILITY ? 'DEPOSIT' : 'WITHDRAW';
}

function getRandomAmount(min = 100, max = 5000): number {
	const CENTS_MULTIPLIER = 100;
	return (
		Math.round((Math.random() * (max - min) + min) * CENTS_MULTIPLIER) /
		CENTS_MULTIPLIER
	);
}

function getRandomTransactionDate(
	startDate = new Date('2024-01-01'),
	endDate = new Date()
): Date {
	const start = startDate.getTime();
	const end = endDate.getTime();
	const randomTime = start + Math.random() * (end - start);
	return new Date(randomTime);
}

// Returns a random Date between now - `monthsBack` and now (defaults to 1 month)
function getRecentDate(monthsBack = 1): Date {
	const now = new Date();
	const start = new Date(
		now.getFullYear(),
		now.getMonth() - monthsBack,
		now.getDate()
	);
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
	} catch (_error) {
		// Ignore errors during cleanup - this is intentional
	}
}

// Baseline VanState (do not derive NEW here)
function getVanState(): VanState {
	const states: VanState[] = ['IN_REPAIR', 'ON_SALE', 'AVAILABLE'];
	return states[Math.floor(Math.random() * states.length)];
}

function isVanRentable(state: VanState | null): boolean {
	return state !== 'IN_REPAIR';
}

function getRandomDiscount(min = 5, max = 100): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
	randomTrueOrFalse,
	clearTables,
	findRentableVan,
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
	getRandomDiscount,
};
