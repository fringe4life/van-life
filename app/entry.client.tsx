import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

// Function to set CSS variables from loader data
function setCSSVariablesFromLoaderData() {
	// Access loader data from the window object (React Router makes it available)
	const loaderData = (
		window as { __REACT_ROUTER_DATA__?: { vansCount?: number } }
	).__REACT_ROUTER_DATA__;

	if (loaderData) {
		const html = document.documentElement;

		// Set van count from vans page loader
		if (loaderData.vansCount !== undefined) {
			html.style.setProperty('--van-count', loaderData.vansCount.toString());
		}

		// You can add more CSS variables here as needed
		// Example: html.style.setProperty('--some-other-count', loaderData.someOtherCount?.toString() || '0');
	}
}

startTransition(() => {
	// Set CSS variables before hydration
	setCSSVariablesFromLoaderData();

	hydrateRoot(
		document,
		<StrictMode>
			<HydratedRouter />
		</StrictMode>,
	);
});
