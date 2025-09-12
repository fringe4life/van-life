import type { LoaderFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { prisma } from '~/lib/prisma.server';

export const config = {
	runtime: 'nodejs', // Use Node.js runtime for better Prisma compatibility
};

export async function loader({ request: _request }: LoaderFunctionArgs) {
	const startTime = performance.now();

	try {
		// Simple health check query
		await prisma.$queryRaw`SELECT 1 as health_check`;

		const endTime = performance.now();
		const responseTime = Math.round(endTime - startTime);

		return data(
			{
				status: 'healthy',
				timestamp: new Date().toISOString(),
				responseTime: `${responseTime}ms`,
				database: 'connected',
			},
			{
				headers: {
					'Cache-Control': 'no-cache, no-store, must-revalidate',
					Pragma: 'no-cache',
					Expires: '0',
				},
			}
		);
	} catch (error) {
		// Error logging removed for production

		return data(
			{
				status: 'unhealthy',
				timestamp: new Date().toISOString(),
				error: error instanceof Error ? error.message : 'Unknown error',
				database: 'disconnected',
			},
			{
				status: 503,
				headers: {
					'Cache-Control': 'no-cache, no-store, must-revalidate',
				},
			}
		);
	}
}
