import type { LoaderFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { prisma } from '~/lib/prisma.server';

export const config = {
	runtime: 'nodejs',
};

export async function loader({ request: _request }: LoaderFunctionArgs) {
	const startTime = performance.now();

	try {
		// Lightweight query to keep connection warm
		await prisma.$queryRaw`SELECT NOW() as current_time`;

		const endTime = performance.now();
		const responseTime = Math.round(endTime - startTime);

		return data(
			{
				status: 'warm',
				timestamp: new Date().toISOString(),
				responseTime: `${responseTime}ms`,
				message: 'Connection kept alive',
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
				status: 'error',
				timestamp: new Date().toISOString(),
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{
				status: 500,
			}
		);
	}
}
