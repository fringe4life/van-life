import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import type { ReviewProps } from '~/features/host/types';
import { RatingStars } from './rating-stars';

const Review = ({ name, rating, text, timestamp }: ReviewProps) => (
	<Card className="max-w-full contain-content">
		<CardHeader>
			<RatingStars rating={rating} />
			<CardTitle className="my-4 flex justify-between">
				{name}
				<span className="text-neutral-600">{timestamp ?? 'unknown'}</span>
			</CardTitle>
		</CardHeader>
		<CardContent>{text}</CardContent>
	</Card>
);

export default Review;
