import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import RatingStars from './rating-stars';

type ReviewProps = {
	name: string;
	rating: number;
	text: string;
	timestamp: string;
	id: string;
};

export default function Review({ name, rating, text, timestamp }: ReviewProps) {
	return (
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
}
