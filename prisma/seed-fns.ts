function getEndDate(rentedAt: Date) {
	return new Date(
		rentedAt.getFullYear(),
		rentedAt.getMonth(),
		rentedAt.getDate() + getRandomNumber(),
		rentedAt.getHours()
	);
}

function randomTrueOrFalse() {
	const HalfProbability = 0.5;
	return getRandomNumber(0, 1) > HalfProbability;
}

function getRandomNumber(min = 3, max = 21) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCost(rentedAt: Date, rentedTo: Date, price: number) {
	const MillisecondsPerSecond = 1000;
	const SecondsPerMinute = 60;
	const MinutesPerHour = 60;
	const HoursPerDay = 24;
	const MillisecondsPerDay =
		MillisecondsPerSecond * SecondsPerMinute * MinutesPerHour * HoursPerDay;

	const daysDifferent = Math.ceil(
		(rentedTo.getTime() - rentedAt.getTime()) / MillisecondsPerDay
	);
	return price * daysDifferent;
}

function getRandomId<T extends Id>(ids: T[]): string {
	if (ids.length === 0) {
		throw new Error('No ids to get');
	}
	const randomIndex = Math.floor(Math.random() * ids.length);
	return ids[randomIndex].id;
}

function findRentableVan(vanIds: VanModel[], excludedIds: string[]): string {
	const MaxAttempts = 100;
	let candidateId = getRandomId(vanIds);
	let attempts = 0;

	while (
		(vanIds.find((v) => v.id === candidateId)?.state === VanState.IN_REPAIR ||
			excludedIds.includes(candidateId)) &&
		attempts < MaxAttempts
	) {
		candidateId = getRandomId(vanIds);
		attempts += 1;
	}

	return candidateId;
}

function getRandomIdWithConstraint(id: string, constraints: string[]) {
	return constraints.includes(id);
}

function generateUniqueIds<T extends Id>(
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

import { VanState } from '~/generated/prisma/enums';
import type { VanModel } from '~/generated/prisma/models';
import { prisma } from '~/lib/prisma.server';
import type { Id, Maybe } from '~/types/types';

function getRandomTransactionType(): 'DEPOSIT' | 'WITHDRAW' {
	const HalfProbability = 0.5;
	return Math.random() > HalfProbability ? 'DEPOSIT' : 'WITHDRAW';
}

function getRandomAmount(min = 100, max = 5000): number {
	const CentsMultiplier = 100;
	return (
		Math.round((Math.random() * (max - min) + min) * CentsMultiplier) /
		CentsMultiplier
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
	const states: VanState[] = [
		VanState.IN_REPAIR,
		VanState.ON_SALE,
		VanState.AVAILABLE,
	];
	return states[Math.floor(Math.random() * states.length)];
}

function isVanRentable(state: Maybe<VanState>): boolean {
	return state !== VanState.IN_REPAIR;
}

function getRandomDiscount(min = 5, max = 100): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns a random Date within the last 6 weeks for rented vans
function getRecentRentalDate(): Date {
	const DaysInSixWeeks = 42;
	const now = new Date();
	const sixWeeksAgo = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() - DaysInSixWeeks
	);
	const startMs = sixWeeksAgo.getTime();
	const endMs = now.getTime();
	const randomTime = startMs + Math.random() * (endMs - startMs);
	return new Date(randomTime);
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
	getRecentRentalDate,
};
