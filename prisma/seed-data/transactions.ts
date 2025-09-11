
import type { TransactionCreateInput } from '~/generated/prisma/models/Transaction';

export const transactions: Omit<TransactionCreateInput, 'userInfo'>[] = [
	{
		type: 'DEPOSIT',
		amount: 2500.00,
		createdAt: new Date('2024-01-15T10:30:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 500.00,
		createdAt: new Date('2024-01-20T14:15:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 1800.00,
		createdAt: new Date('2024-02-03T09:45:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 1200.00,
		createdAt: new Date('2024-02-10T16:20:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 3200.00,
		createdAt: new Date('2024-02-18T11:10:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 800.00,
		createdAt: new Date('2024-03-01T13:30:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 1500.00,
		createdAt: new Date('2024-03-12T08:45:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 2000.00,
		createdAt: new Date('2024-03-25T15:00:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 2800.00,
		createdAt: new Date('2024-04-05T12:15:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 600.00,
		createdAt: new Date('2024-04-15T10:30:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 4200.00,
		createdAt: new Date('2024-04-28T14:45:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 1500.00,
		createdAt: new Date('2024-05-08T09:20:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 1900.00,
		createdAt: new Date('2024-05-20T11:30:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 900.00,
		createdAt: new Date('2024-06-02T16:45:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 3600.00,
		createdAt: new Date('2024-06-15T13:10:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 1100.00,
		createdAt: new Date('2024-06-28T08:30:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 2400.00,
		createdAt: new Date('2024-07-10T15:20:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 1700.00,
		createdAt: new Date('2024-07-22T12:00:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 3100.00,
		createdAt: new Date('2024-08-05T10:15:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 750.00,
		createdAt: new Date('2024-08-18T14:30:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 2200.00,
		createdAt: new Date('2024-08-30T09:45:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 1300.00,
		createdAt: new Date('2024-09-12T11:20:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 3800.00,
		createdAt: new Date('2024-09-25T16:10:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 950.00,
		createdAt: new Date('2024-10-08T13:45:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 2600.00,
		createdAt: new Date('2024-10-20T08:30:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 1400.00,
		createdAt: new Date('2024-11-02T15:15:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 3300.00,
		createdAt: new Date('2024-11-15T12:00:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 850.00,
		createdAt: new Date('2024-11-28T10:30:00Z'),
	},
	{
		type: 'DEPOSIT',
		amount: 2900.00,
		createdAt: new Date('2024-12-10T14:20:00Z'),
	},
	{
		type: 'WITHDRAW',
		amount: 1600.00,
		createdAt: new Date('2024-12-22T09:45:00Z'),
	},
];
