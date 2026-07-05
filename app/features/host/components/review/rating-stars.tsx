import { StarIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
	MAX_RATING,
	PERCENTAGE_MULTIPLIER,
} from '~/features/host/constants/constants';
import type { ReviewModel } from '~/generated/prisma/models';
import type { Prettify } from '~/types';

type RatingStarsProps = Prettify<Pick<ReviewModel, 'rating'>>;

const TRANSPARENT_PIXEL =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";

/**
 * Individual star component that handles partial filling using clip-path.
 * @param fillPercent - The percentage (0-100) to fill the star.
 */
interface StarProps {
	fillPercent: number;
}

const Star = ({ fillPercent }: StarProps): ReactNode => {
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

const RatingStars = ({ rating }: RatingStarsProps): ReactNode => {
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
		<span className="relative inline-flex h-(--star-size) w-(--rating-stars-width) contain-strict">
			<img
				alt={`Rating: ${rating} out of ${MAX_RATING} stars`}
				className="sr-only"
				height={1}
				src={TRANSPARENT_PIXEL}
				width={1}
			/>
			<span
				aria-hidden="true"
				className="absolute inset-0 flex gap-(--star-gap)"
			>
				{stars}
			</span>
		</span>
	);
};

export { RatingStars };
