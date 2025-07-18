type RatingStarsProps = {
	rating: number;
};

import { StarIcon } from 'lucide-react';
export default function RatingStars({ rating }: RatingStarsProps) {
	const stars = [];
	for (let i = 1; i < 6; i++) {
		i <= rating
			? stars.push(<StarIcon key={i} className="size-5 fill-orange-400" />)
			: stars.push(<StarIcon key={i} className="size-5" />);
	}
	return <p className="flex h-5 w-30 gap-2 contain-strict">{stars}</p>;
}
