import { StarIcon } from 'lucide-react';
import type { JSX } from 'react';
import {
	MAX_RATING,
	PERCENTAGE_MULTIPLIER,
} from '~/features/host/constants/constants';
import type { RatingStarsProps } from '~/features/host/types';

/**
 * Individual star component that handles partial filling using clip-path.
 * @param fillPercent - The percentage (0-100) to fill the star.
 */
interface StarProps {
	fillPercent: number;
}

const Star = ({ fillPercent }: StarProps): JSX.Element => {
	return (
		<div aria-hidden="true" className="relative size-(--star-size)">
			{/* Background star (empty state) */}
			<StarIcon className="size-(--star-size) stroke-orange-400" />
			{/* Overlay star (filled state) clipped to the fill percentage */}
			{fillPercent > 0 && (
				<div
					className="absolute inset-0 overflow-hidden text-orange-400"
					style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
				>
					<StarIcon className="size-(--star-size) fill-current stroke-current" />
				</div>
			)}
		</div>
	);
};

const RatingStars = ({ rating }: RatingStarsProps): JSX.Element => {
	const stars = Array.from({ length: MAX_RATING }, (_, i) => {
		const starIndex = i + 1;
		// Calculate fill percentage for each star:
		// Clamps (rating - i) * 100 between 0 and 100.
		const fillPercent = Math.max(
			0,
			Math.min(100, (rating - i) * PERCENTAGE_MULTIPLIER)
		);

		return <Star fillPercent={fillPercent} key={`star-${starIndex}`} />;
	});

	return (
		<div
			aria-label={`Rating: ${rating} out of ${MAX_RATING} stars`}
			className="flex h-(--star-size) w-(--rating-stars-width) gap-(--star-gap) contain-strict"
			role="img"
		>
			{stars}
		</div>
	);
};

export { RatingStars };
