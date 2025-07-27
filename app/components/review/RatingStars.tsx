import { StarIcon } from 'lucide-react';

type RatingStarsProps = {
	rating: number;
};

export default function RatingStars({ rating }: RatingStarsProps) {
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		if (i <= Math.floor(rating)) {
			// Fully filled star
			stars.push(
				<StarIcon
					key={i}
					className="size-5 fill-orange-400 stroke-orange-400"
				/>,
			);
		} else if (i === Math.floor(rating) + 1 && rating % 1 !== 0) {
			// Partially filled star using SVG gradient
			const percent = Math.round((rating % 1) * 100);
			const gradientId = `star-gradient-${i}`;
			stars.push(
				<svg
					key={i}
					className="size-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#fb923c"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-label="Star"
				>
					<title>{`Star ${i} - ${percent}% filled`}</title>
					<defs>
						<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
							<stop offset={`${percent}%`} stopColor="#fb923c" />
							<stop offset={`${percent}%`} stopColor="transparent" />
						</linearGradient>
					</defs>
					<StarIcon fill={`url(#${gradientId})`} stroke="#fb923c" />
				</svg>,
			);
		} else {
			// Empty star
			stars.push(<StarIcon key={i} className="size-5 stroke-orange-400" />);
		}
	}
	return <div className="flex h-5 w-30 gap-2 contain-strict">{stars}</div>;
}
