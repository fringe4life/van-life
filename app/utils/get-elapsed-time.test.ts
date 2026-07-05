import { beforeAll, describe, expect, it, mock } from 'bun:test';

const differenceInDays = mock((later: Date, earlier: Date) =>
	Math.floor((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24))
);
const formatDistanceToNow = mock(() => '3 days ago');

mock.module('date-fns', () => ({
	differenceInDays,
	formatDistanceToNow,
}));

const { getElapsedTime } = await import('./get-elapsed-time');

describe('getElapsedTime', () => {
	beforeAll(() => {
		differenceInDays.mockClear();
		formatDistanceToNow.mockClear();
	});

	it('returns empty state for null, undefined, or empty input', () => {
		const empty = { description: 'No data yet', elapsedDays: 0 };

		expect(getElapsedTime(null)).toEqual(empty);
		expect(getElapsedTime(undefined)).toEqual(empty);
		expect(getElapsedTime([])).toEqual(empty);
	});

	it('returns empty state when no items have a date', () => {
		expect(
			getElapsedTime([{ rentedAt: null }, { createdAt: undefined }])
		).toEqual({
			description: 'No data yet',
			elapsedDays: 0,
		});
	});

	it('prefers rentedAt over createdAt', () => {
		const rentedAt = new Date('2024-03-10T00:00:00Z');
		const createdAt = new Date('2024-01-01T00:00:00Z');

		const result = getElapsedTime([{ createdAt, rentedAt }]);

		expect(result.elapsedDays).toBe(1);
		expect(formatDistanceToNow).toHaveBeenCalledWith(rentedAt, {
			addSuffix: true,
		});
	});

	it('falls back to createdAt when rentedAt is missing', () => {
		const createdAt = new Date('2024-02-01T00:00:00Z');

		const result = getElapsedTime([{ createdAt }]);

		expect(result.elapsedDays).toBe(1);
		expect(formatDistanceToNow).toHaveBeenCalledWith(createdAt, {
			addSuffix: true,
		});
	});

	it('uses earliest and latest dates across items', () => {
		const first = new Date('2024-01-01T00:00:00Z');
		const middle = new Date('2024-01-15T00:00:00Z');
		const last = new Date('2024-02-01T00:00:00Z');

		const result = getElapsedTime([
			{ rentedAt: middle },
			{ rentedAt: last },
			{ rentedAt: first },
		]);

		expect(result.elapsedDays).toBe(32);
		expect(formatDistanceToNow).toHaveBeenCalledWith(first, {
			addSuffix: true,
		});
	});

	it('ignores items without dates when others are valid', () => {
		const onlyDate = new Date('2024-05-01T00:00:00Z');

		const result = getElapsedTime([
			{ rentedAt: null },
			{ rentedAt: onlyDate },
			{},
		]);

		expect(result.elapsedDays).toBe(1);
		expect(result.description).toBe('3 days ago');
	});
});
