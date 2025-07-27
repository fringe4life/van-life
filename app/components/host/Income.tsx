import { Card, CardContent } from '~/components/ui/card';
import { displayPrice } from '~/utils/displayPrice';

type IncomeProps = {
	id: string;
	amount: number;
	rentedAt: Date;
};

export default function Income({ amount, rentedAt }: IncomeProps) {
	return (
		<Card className="contain-content">
			<CardContent>
				<p className="flex justify-between">
					<span>{displayPrice(amount)} </span>
					<span>
						{rentedAt && !Number.isNaN(rentedAt)
							? rentedAt.toDateString()
							: 'unknown'}
					</span>
				</p>
			</CardContent>
		</Card>
	);
}
