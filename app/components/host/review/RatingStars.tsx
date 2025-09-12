import { StarIcon } from 'lucide-react';
import type { JSX } from 'react';

type RatingStarsProps = {
	rating: number;
};

export default function RatingStars({ rating }: RatingStarsProps) {
	const MAX_RATING = 5;
	const PERCENTAGE_MULTIPLIER = 100;
	const stars: JSX.Element[] = [];

	for (let i = 1; i <= MAX_RATING; i++) {
		if (i <= Math.floor(rating)) {
			// Fully filled star
			stars.push(
				<StarIcon
					className="size-5 fill-orange-400 stroke-orange-400"
					key={i}
				/>
			);
		} else if (i === Math.floor(rating) + 1 && rating % 1 !== 0) {
			// Partially filled star using SVG gradient
			const percent = Math.round((rating % 1) * PERCENTAGE_MULTIPLIER);
			const gradientId = `star-gradient-${i}`;
			stars.push(
				<svg
					aria-label="Star"
					className="size-5"
					fill="none"
					key={i}
					stroke="#fb923c"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					viewBox="0 0 24 24"
				>
					<title>{`Star ${i} - ${percent}% filled`}</title>
					<defs>
						<linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
							<stop offset={`${percent}%`} stopColor="#fb923c" />
							<stop offset={`${percent}%`} stopColor="transparent" />
						</linearGradient>
					</defs>
					<StarIcon fill={`url(#${gradientId})`} stroke="#fb923c" />
				</svg>
			);
		} else {
			// Empty star
			stars.push(<StarIcon className="size-5 stroke-orange-400" key={i} />);
		}
	}
	return <div className="flex h-5 w-30 gap-2 contain-strict">{stars}</div>;
}
