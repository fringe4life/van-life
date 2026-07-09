import type { AppDb, VanModel } from "~/db/client.server";
import type { D1HttpDb } from "~/db/d1-http.server";
import { VanState } from "~/db/enums";
import { rent, review, transaction, van } from "~/db/schema/van";
import type { Maybe } from "~/types";
import type { UUIDv7 } from "~/types/ids.server";

type SeedDb = AppDb | D1HttpDb;

/** D1 allows ~100 bound params per statement; chunk so multi-row inserts stay under that. */
const D1_MAX_BOUND_PARAMS = 100;

function chunkSizeForColumns(columnsPerRow: number) {
  return Math.max(1, Math.floor(D1_MAX_BOUND_PARAMS / columnsPerRow));
}

function* chunksOf<T>(rows: T[], columnsPerRow: number): Generator<T[]> {
  const size = chunkSizeForColumns(columnsPerRow);
  for (let i = 0; i < rows.length; i += size) {
    yield rows.slice(i, i + size);
  }
}

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

function getRandomId<T extends { id: UUIDv7 }>(ids: T[]): UUIDv7 {
  if (ids.length === 0) {
    throw new Error("No ids to get");
  }
  const randomIndex = Math.floor(Math.random() * ids.length);
  return ids[randomIndex].id;
}

function findRentableVan(vanIds: VanModel[], excludedIds: UUIDv7[]): UUIDv7 {
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

async function clearTables(db: SeedDb) {
  await db.delete(transaction);
  await db.delete(review);
  await db.delete(rent);
  await db.delete(van);
}

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
  chunksOf,
  clearTables,
  findRentableVan,
  getCost,
  getEndDate,
  getRandomDiscount,
  getRandomId,
  getRecentDate,
  getRecentRentalDate,
  getVanState,
  isVanRentable,
  randomTrueOrFalse,
};
