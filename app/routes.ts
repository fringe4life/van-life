import {
	index,
	layout,
	prefix,
	type RouteConfig,
	route,
} from '@react-router/dev/routes';

export default [
	layout('./routes/layout/layout.tsx', [
		index('./routes/home.tsx'),
		route('about', './routes/about.tsx'),
		route('vans/:vanSlug?', './routes/vans.tsx'),
		route('login', './routes/auth/login.tsx'),
		route('signup', './routes/auth/signUp.tsx'),
		route('signout', './routes/auth/signOut.tsx'),
		layout('./routes/layout/hostLayout.tsx', [
			...prefix('host', [
				index('./routes/host/host.tsx'),
				route('income', './routes/host/income.tsx'),
				route('transfers', './routes/host/transfers.tsx'),
				route('review', './routes/host/reviews.tsx'),
				route('add', './routes/host/addVan.tsx'),
				...prefix('rentals', [
					index('./routes/host/rentals/rentals.tsx'),
					route('rent/:vanSlug', './routes/host/rentals/rentalDetail.tsx'),
					route(
						'returnRental/:rentId',
						'./routes/host/rentals/returnRental.tsx'
					),
				]),
				// ...prefix('vans', [
				// 	index('./routes/host/hostVans.tsx'),
				// 	route(':vanSlug', './routes/host/vanDetail/vanDetailLayout.tsx', [
				// 		index('./routes/host/vanDetail/vanDetail.tsx'),
				// 		route('pricing', './routes/host/vanDetail/vanDetailPricing.tsx'),
				// 		route('photos', './routes/host/vanDetail/vanDetailPhotos.tsx'),
				// 	]),
				// ]),
				route('vans/:vanSlug?/:action?', './routes/host/hostVans.tsx'),
			]),
		]),
	]),
	route('/api/auth/*', './routes/api/auth.ts'),
	route('*', './routes/404.tsx'),
] satisfies RouteConfig;
