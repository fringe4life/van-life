import RatingStars from './RatingStars';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type ReviewProps = {
	name: string;
	rating: number;
	text: string;
	timestamp: string;
	id: string;
};

export default function Review({ name, rating, text, timestamp }: ReviewProps) {
	return (
		<Card>
			<CardHeader>
				<RatingStars rating={rating} />
				<CardTitle className="my-4 flex justify-between">
					{name}{' '}
					<span className="text-text-secondary">{timestamp ?? 'unknown'}</span>
				</CardTitle>
			</CardHeader>
			<CardContent>{text}</CardContent>
		</Card>
	);
}
