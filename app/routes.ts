import {
	index,
	layout,
	prefix,
	type RouteConfig,
	route,
} from '@react-router/dev/routes';

export default [
	layout('layout/layout.tsx', [
		index('./routes/home.tsx'),
		route('about', './routes/about.tsx'),
		...prefix('vans', [
			index('./routes/vans/vans.tsx'),
			route(':vanId', './routes/vans/van.tsx'),
		]),
		route('login', './routes/auth/login.tsx'),
		route('signup', './routes/auth/signUp.tsx'),
		route('signout', './routes/auth/signOut.tsx'),
		layout('layout/hostLayout.tsx', [
			...prefix('host', [
				index('./routes/host/host.tsx'),
				route('income', './routes/host/income.tsx'),
				route('review', './routes/host/reviews.tsx'),
				route('add', './routes/host/addVan.tsx'),
				route('money', './routes/host/money.tsx'),
				...prefix('rentals', [
					index('./routes/host/rentals/rentals.tsx'),
					route('rent/:vanId', './routes/host/rentals/rentalDetail.tsx'),
					route(
						'returnRental/:rentId',
						'./routes/host/rentals/returnRental.tsx',
					),
				]),
				...prefix('vans', [
					index('./routes/host/hostVans.tsx'),
					route(':vanId', './routes/host/vanDetail/vanDetailLayout.tsx', [
						index('./routes/host/vanDetail/vanDetail.tsx'),
						route('pricing', './routes/host/vanDetail/vanDetailPricing.tsx'),
						route('photos', './routes/host/vanDetail/vanDetailPhotos.tsx'),
					]),
				]),
			]),
		]),
	]),
	route('/api/auth/*', 'routes/api/auth.ts'),
	route('*', './routes/404.tsx'),
] satisfies RouteConfig;
