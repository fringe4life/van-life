import clsx from 'clsx';
import { data } from 'react-router';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import GenericComponent from '~/components/Container';
import Review from '~/components/Review';
import { getHostReviews } from '~/db/getHostReviews';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import type { Route } from './+types/reviews';
export function meta(_: Route.MetaArgs) {
	return [
		{ title: 'Reviews | Vanlife' },
		{
			name: 'description',
			content: 'The Reviews you have received',
		},
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSessionOrRedirect(request);

	const reviews = await getHostReviews(session.user.id);
	return data(
		{
			reviews,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		},
	);
}

export default function Host({ loaderData }: Route.ComponentProps) {
	const { reviews } = loaderData;

	const { changingPage } = useIsNavigating();
	const result = reviews
		.reduce(
			(acc, cur) => {
				console.log({ acc });
				acc[cur.rating - 1] += 1;
				return acc;
			},
			[0, 0, 0, 0, 0],
		)
		.map((res, index) => ({
			name: `${index + 1}`,
			amount: res,
		}));

	const reviewItems = reviews.map((review) => ({
		name: review.user.user.name,
		text: review.text,
		rating: review.rating,
		timestamp:
			review.updatedAt?.toLocaleDateString() ??
			review.createdAt.toLocaleDateString(),
		id: review.id,
	}));

	return (
		<section
			className={clsx({
				'opacity-75': changingPage,
			})}
		>
			<h3 className="">Reviews</h3>
			<ResponsiveContainer width="100%" height={250}>
				<BarChart data={result}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="amount" fill="oklch(75.27% 0.167 52.58)" />
				</BarChart>
			</ResponsiveContainer>
			<article>
				<h3 className="font-bold text-lg text-text">
					Reviews ({reviews.length})
				</h3>
				<GenericComponent
					className="space-y-6"
					Component={Review}
					items={reviewItems}
					renderProps={(item) => item}
					renderKey={(item) => item.id}
				/>
			</article>
		</section>
	);
}
