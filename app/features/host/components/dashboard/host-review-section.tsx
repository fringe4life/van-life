import { href } from 'react-router';
import { RatingStars } from '~/features/host/components/review/rating-stars';
import { CustomLink } from '~/features/navigation/components/custom-link';

interface HostReviewSectionProps {
	avgRating: number;
}

const HostReviewSection = ({ avgRating }: HostReviewSectionProps) => (
	<div className="full-layout flex items-center justify-between bg-orange-200 py-6 sm:py-9">
		<div className="font-bold text-lg text-shadow-text sm:text-2xl">
			Your Avg Review <RatingStars rating={avgRating} />
		</div>
		<CustomLink
			className="font-medium text-base text-shadow-text"
			to={href('/host/review')}
		>
			Details
		</CustomLink>
	</div>
);

export { HostReviewSection };
