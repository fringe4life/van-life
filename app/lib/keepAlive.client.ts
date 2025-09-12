/**
 * Client-side utility to keep database connections warm
 * Call this periodically to prevent cold starts
 */
/** biome-ignore-all lint/style/noMagicNumbers: api to prevent cold starts */

const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes
const HEALTH_CHECK_INTERVAL = 30 * 1000; // 30 seconds

let keepAliveInterval: NodeJS.Timeout | null = null;
let healthCheckInterval: NodeJS.Timeout | null = null;

export function startKeepAlive() {
	if (typeof window === 'undefined') {
		return;
	}

	// Stop existing intervals
	stopKeepAlive();

	// Keep database warm with lightweight queries
	keepAliveInterval = setInterval(async () => {
		try {
			await fetch('/api/keep-alive', {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
				},
			});
		} catch {
			// Keep-alive request failed silently
		}
	}, KEEP_ALIVE_INTERVAL);

	// Health check for monitoring
	healthCheckInterval = setInterval(async () => {
		try {
			const response = await fetch('/api/health', {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
				},
			});

			if (!response.ok) {
				// Health check failed silently
			}
		} catch {
			// Health check request failed silently
		}
	}, HEALTH_CHECK_INTERVAL);
}

export function stopKeepAlive() {
	if (keepAliveInterval) {
		clearInterval(keepAliveInterval);
		keepAliveInterval = null;
	}

	if (healthCheckInterval) {
		clearInterval(healthCheckInterval);
		healthCheckInterval = null;
	}
}

// Auto-start in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
	startKeepAlive();
}
