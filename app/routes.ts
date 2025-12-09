import {
	index,
	layout,
	prefix,
	type RouteConfig,
	route,
} from '@react-router/dev/routes';

export default [
	layout('./routes/layout/layout.tsx', [
		index('./routes/public/home.tsx'),
		route('about', './routes/public/about.tsx'),
		route('vans', './routes/public/vans.tsx'),
		route('vans/:vanSlug', './routes/public/van-detail.tsx'),
		layout('./routes/layout/auth-layout.tsx', [
			route('login', './routes/auth/login.tsx'),
			route('signup', './routes/auth/sign-up.tsx'),
			route('signout', './routes/auth/sign-out.tsx'),
		]),
		layout('./routes/layout/host-layout.tsx', [
			...prefix('host', [
				index('./routes/host/host.tsx'),
				route('income', './routes/host/income.tsx'),
				route('transfers', './routes/host/transfers.tsx'),
				route('review', './routes/host/reviews.tsx'),
				route('add', './routes/host/add-van.tsx'),
				...prefix('rentals', [
					index('./routes/host/rentals/rentals.tsx'),
					route('rent/:vanSlug', './routes/host/rentals/rental-detail.tsx'),
					route(
						'returnRental/:rentId',
						'./routes/host/rentals/return-rental.tsx'
					),
				]),
				route('vans/:vanSlug?/:action?', './routes/host/host-vans.tsx'),
			]),
		]),
	]),
	route('/api/auth/*', './routes/api/auth.ts'),
	route('*', './routes/public/404.tsx'),
] satisfies RouteConfig;
