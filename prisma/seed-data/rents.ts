import type { RentCreateInput } from '~/generated/prisma/models/Rent';

export const rents: Omit<
	RentCreateInput,
	'host' | 'renter' | 'van' | 'transactions'
>[] = [
	{
		rentedAt: new Date('2024-12-16T00:00:00Z'),
	},
	{
		rentedAt: new Date('2022-06-16T00:00:00Z'),
	},
	{
		rentedAt: new Date('2021-02-16T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-02-19T00:00:00Z'),
	},
	{
		rentedAt: new Date('2020-08-16T00:00:00Z'),
	},
	{
		rentedAt: new Date('2022-01-12T00:00:00Z'),
	},
	{
		rentedAt: new Date('2025-04-16T00:00:00Z'),
	},
	{
		rentedAt: new Date('2022-09-02T00:00:00Z'),
	},
	{
		rentedAt: new Date('2025-01-09T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-02-12T00:00:00Z'),
	},
	{
		rentedAt: new Date('2019-07-16T00:00:00Z'),
	},
	{
		rentedAt: new Date('2018-01-12T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-04-04T00:00:00Z'),
	},
	{
		rentedAt: new Date('2021-03-21T00:00:00Z'),
	},
	{
		rentedAt: new Date('2025-01-12T00:00:00Z'),
	},
	{
		rentedAt: new Date('2023-05-15T00:00:00Z'),
	},
	{
		rentedAt: new Date('2023-08-22T00:00:00Z'),
	},
	{
		rentedAt: new Date('2022-11-08T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-07-03T00:00:00Z'),
	},
	{
		rentedAt: new Date('2023-12-10T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-01-25T00:00:00Z'),
	},
	{
		rentedAt: new Date('2022-03-14T00:00:00Z'),
	},
	{
		rentedAt: new Date('2023-09-30T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-03-08T00:00:00Z'),
	},
	{
		rentedAt: new Date('2023-06-19T00:00:00Z'),
	},
	{
		rentedAt: new Date('2022-12-05T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-08-12T00:00:00Z'),
	},
	{
		rentedAt: new Date('2023-02-28T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-05-20T00:00:00Z'),
	},
	{
		rentedAt: new Date('2023-10-15T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-09-03T00:00:00Z'),
	},
	{
		rentedAt: new Date('2022-07-25T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-06-14T00:00:00Z'),
	},
	{
		rentedAt: new Date('2023-04-11T00:00:00Z'),
	},
	{
		rentedAt: new Date('2022-09-18T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-10-07T00:00:00Z'),
	},
	{
		rentedAt: new Date('2023-11-22T00:00:00Z'),
	},
	{
		rentedAt: new Date('2024-11-30T00:00:00Z'),
	},
];
