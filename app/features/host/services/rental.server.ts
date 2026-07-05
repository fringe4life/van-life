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
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import { getVanBySlug } from '~/features/vans/dal/van.server';
import { getCost } from '~/features/vans/utils/get-cost';
import type { Prettify } from '~/types';
import type { UUIDv7 } from '~/types/ids.server';
import { tryCatch } from '~/utils/try-catch.server';

export type HostRentedVan = Prettify<
	NonNullable<Exclude<Awaited<ReturnType<typeof getHostRentedVan>>, string>>
>;

export async function listActiveRentals(
	renterId: UUIDv7,
	{
		cursor,
		limit,
		direction,
	}: Prettify<Pick<HostPaginatedPageParams, 'cursor' | 'limit' | 'direction'>>
) {
	const { data: vans } = await tryCatch(() =>
		getHostRentedVans(renterId, { cursor, direction, limit })
	);

	return toPagination({
		cursor,
		direction,
		items: vans,
		limit,
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
		hostId,
		renterId,
		vanId: parseUuidV7(van.id),
	});
}

export async function loadReturnRentalContext(rentId: UUIDv7, userId: UUIDv7) {
	const [{ data: rent }, { data: money }] = await Promise.all([
		tryCatch(() => getHostRentedVan(rentId, userId)),
		tryCatch(() => getAccountSummary(userId)),
	]);

	return { money, rent };
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
			errors: 'Cannot afford to return this rental',
			success: false as const,
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
			errors: 'Something went wrong try again later',
			success: false as const,
		};
	}

	return { data, success: true as const };
}
