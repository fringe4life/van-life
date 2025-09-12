import type { LoaderFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { prisma } from '~/lib/prisma.server';

export const config = {
	runtime: 'nodejs',
};

export async function loader({ request: _request }: LoaderFunctionArgs) {
	const startTime = performance.now();

	try {
		// Get database connection info and basic stats
		const [dbInfo, userCount, vanCount, rentalCount] = await Promise.all([
			prisma.$queryRaw`SELECT version() as version, current_database() as database_name`,
			prisma.user.count(),
			prisma.van.count(),
			prisma.rent.count(),
		]);

		const endTime = performance.now();
		const responseTime = Math.round(endTime - startTime);

		return data(
			{
				status: 'connected',
				timestamp: new Date().toISOString(),
				responseTime: `${responseTime}ms`,
				database: dbInfo,
				stats: {
					users: userCount,
					vans: vanCount,
					rentals: rentalCount,
				},
			},
			{
				headers: {
					'Cache-Control': 'public, max-age=60', // Cache for 1 minute
				},
			}
		);
	} catch (error) {
		// Error logging removed for production

		return data(
			{
				status: 'error',
				timestamp: new Date().toISOString(),
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{
				status: 500,
				headers: {
					'Cache-Control': 'no-cache',
				},
			}
		);
	}
}
