import { parseUuidV7 } from '~/dal/parse-uuidv7.server';
import {
	getHostRentedVan,
	getHostRentedVans,
} from '~/features/host/dal/rental.server';
import {
	createRent,
	executeReturnVanTransaction,
} from '~/features/host/dal/rental-transaction.server';
import { getAccountSummary } from '~/features/host/dal/transaction.server';
import type { HostPaginatedPageParams } from '~/features/host/services/income.server';
import type { Direction } from '~/features/pagination/types';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import { getVanBySlug } from '~/features/vans/dal/van.server';
import { getCost } from '~/features/vans/utils/get-cost';
import type { UUIDv7 } from '~/types/ids.server';
import { tryCatch } from '~/utils/try-catch.server';

export type HostRentedVan = NonNullable<
	Exclude<Awaited<ReturnType<typeof getHostRentedVan>>, string>
>;

export async function listActiveRentals(
	hostId: UUIDv7,
	{
		cursor,
		limit,
		direction,
	}: Pick<HostPaginatedPageParams, 'cursor' | 'limit' | 'direction'>
) {
	const { data: vans } = await tryCatch(() =>
		getHostRentedVans(hostId, { cursor, limit, direction })
	);

	return toPagination({
		items: vans,
		limit,
		cursor,
		direction: direction as Direction,
	});
}

export async function rentVan(
	vanSlug: string,
	renterId: UUIDv7,
	hostId: UUIDv7
) {
	const van = await getVanBySlug(vanSlug);

	if (!van) {
		throw new Error('Van not found');
	}

	return createRent({
		vanId: parseUuidV7(van.id),
		renterId,
		hostId,
	});
}

export async function loadReturnRentalContext(rentId: UUIDv7, userId: UUIDv7) {
	const [{ data: rent }, { data: money }] = await Promise.all([
		tryCatch(() => getHostRentedVan(rentId)),
		tryCatch(() => getAccountSummary(userId)),
	]);

	return { rent, money };
}

export async function completeReturnRental({
	rentId,
	userId,
	rent,
	money,
}: {
	rentId: UUIDv7;
	userId: UUIDv7;
	rent: HostRentedVan;
	money: number;
}) {
	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van);

	if (money < amountToPay) {
		return {
			success: false as const,
			errors: 'Cannot afford to return this rental',
		};
	}

	const { data, error } = await tryCatch(() =>
		executeReturnVanTransaction(
			rentId,
			userId,
			amountToPay,
			parseUuidV7(rent.van.id)
		)
	);

	if (error || !data) {
		return {
			success: false as const,
			errors: 'Something went wrong try again later',
		};
	}

	return { success: true as const, data };
}
